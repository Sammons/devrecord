var githubapi = require('github');
var ejs = require('ejs');
var fs = require('fs');


var template = fs.readFileSync('post_server/templates/post.ejs')+'';
var user = "Sammons"
var completed_callback = null;
var latest_file = {when:0}
var github = new githubapi({
	version: "3.0.0",
	//debug: true,
	protocol: "https",
	host: "api.github.com",
	timeout: 2000
})

github.authenticate({
	type: "oauth",
	key: process.env.GH_ID,
	secret: process.env.GH_SECRET
})

function render_post( file, files, callback ) {
	if (Date.parse(file.meta['last-modified'])/1000 > latest_file.when) 
		latest_file = { 
			name: file.name.toLowerCase().replace(' ','-').replace('.md',''),
		 	when: Date.parse(file.meta['last-modified'])/1000
		 }
	fs.writeFile('post_server/views/'+file.name.toLowerCase().replace(' ','-').replace('.md','.html')
		, ejs.render(template
			, {
				body: file.content
				, title: file.name.replace('.md','')
				, posts: files })
		, callback);
}

function render_posts_from_ejs( files ) {
	var processes_sent = files.length;
	for (var i in files) {
		console.log(files[i].content)
		render_post(files[i], files
			, function() {
				processes_sent--;
				if (processes_sent === 0) {
					if (completed_callback)	completed_callback( latest_file.name );
					console.log("completed refreshing post from github")
				}
			})
	}
}
function render_posts_from_md( files ) {
	var processes_sent = files.length;
	for (var i in files) {
		var curfile = files[i];
		render_markdown(files[i].content
			, function( err, res ) {
				if (res.statusCode !== 200) return console.log('error with md request');
				curfile.content = res.data;
				processes_sent--;
				if (processes_sent === 0) {
					render_posts_from_ejs( files );
				}
			})
	}
}

function getFile( path, branch, callback) {
	github.repos.getContent({user:user,repo:"devrecord",path: path,ref:branch}, callback);
}

function render_markdown(text, callback ) {
	github.markdown.render({
		text: text,
		mode: "gfm",
		context: "github"+user
	},
	callback);
}

module.exports.refresh_posts = function( callback ) {
	console.log('beginning refreshing github posts')
	completed_callback = callback;
	github.misc.rateLimit({},function(err, res) {
		var now = Date.now()/1000;
		var reset = res.rate.reset - now;
		console.log('github remaining requests',res.rate.remaining,'reset in', Math.floor(reset/60), 'minutes and ',Math.round((reset/60-Math.floor(reset/60))*60), 'seconds')
	})
	github.repos.getContent({user:user,repo:"devrecord",path:"",ref:"posts"}, function( err, files) { 
		if (err) return console.log(err);
		var requests_sent = 0;
		var post_files = [];
		for (var i in files) {
			if (files[i].type === 'file' && files[i].name.indexOf('.md') >= 0) {
				requests_sent++
				getFile( files[i].path, 'posts', function( err, res ) {
					files[i] = res;
					files[i].content = new Buffer(res.content, res.encoding).toString('utf8');
					requests_sent--;
					post_files.push(files[i]);
					if (requests_sent === 0) render_posts_from_md(post_files);
				}); 
			}
		}
	})
}

if (!module.parent) {
	module.exports.refresh_posts()
}