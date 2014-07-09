var githubapi = require('github');
var ejs = require('ejs');
var fs = require('fs');

var template = fs.readFileSync('templates/post.ejs')+'';
var options = {
	user: "Sammons",
	repo: "devrecord",
	branch: "posts"
}	

var completed_callback = null;

var github = new githubapi({
	version: "3.0.0",
    // debug: true,
	protocol: "https",
	host: "api.github.com",
	timeout: 2000
})

github.authenticate({
	type: "oauth",
	key: process.env.GH_ID,
	secret: process.env.GH_SECRET
})

var posts_in_process = 0;
var file_list = [];
var latest_file = {when: 0, name: ''};
function render_post( body, file) {
	posts_in_process++;
	fs.writeFile('views/'+file.name.toLowerCase().replace('.md','.html').replace(' ','-')
		,ejs.render(template
		,{ body: body, title: file.name.replace('md',''), posts: file_list})
		,function() {
			posts_in_process--;
			if (posts_in_process === 0 && completed_callback !== null) {
				console.log( 'completed with updating posts')
				completed_callback( latest_file.name ); 
			}
		});
}

function render_markdown(text, callback ) {
	console.log(text)
	github.markdown.render({
		headers: {
			'User-Agent':'Sammons'
		},
		text: "sup",
		mode: "gfm",
		context: "github/"+options.user
	},
	callback);
}

// function render

function  render_files_from_markdown( files ) {
		render_markdown (files[0].content
			,function(err, res) {
				if (err) return console.log(err);
				console.log(res)
				files[i].html = res;
				requests_sent--;
			})
	var requests_sent = 0;
	for (var i in files) {
		requests_sent++;
	}
}

function getFile( path, cb ) {
	github.repos.getContent({
		user: options.user
		,repo: options.repo
		,path: path
		,ref: options.branch}, function( err, file ) {
		if (Date.parse(file.meta['last-modified']) > latest_file.when) {
			latest_file = { when: Date.parse(file.meta['last-modified']), name: file.name.replace('.md','').replace(' ','-').toLowerCase() };
		}
		if (err) renderer(err, null);
		else {
			file.content = new Buffer(file.content,file.encoding).toString('utf8');
			file.encoding = "utf8";
			cb( file );
		}
	});
}

function gather_files(err, files ) {
	if (err) return console.log(err);
	var post_files = []
	var requests_sent = 0;
	for (var i in files) {
		if (files[i].type === 'file' && files[i].name.indexOf('.md') >= 0) {
			requests_sent++;
			getFile( files[i].path, function( new_file_details ) {
				post_files.push(new_file_details);
				requests_sent--;
				if (requests_sent === 0) render_files_from_markdown( post_files );
			}); 
		}
	}
}

function get_post_filenames( cb ) {
	github.repos.getContent({
				user: options.user
				,repo: options.repo
				,path:""
				,ref: options.branch
			}
			, gather_files);
}

function check_rate_limit( cb ) {
	github.misc.rateLimit({},function(err, res) {
		var now = Date.now()/1000;
		var reset = res.rate.reset - now;
		console.log('github remaining requests'
			,res.rate.remaining
			,'reset in'
			,Math.floor(reset/60)
			,'minutes and '
			,Math.round((reset/60-Math.floor(reset/60))*60)
			,'seconds')
		if (cb) cb( remaining );
	});
}
module.exports.refresh_posts = function( cb ) {
	completed_callback = cb;
	check_rate_limit();
	get_post_filenames( gather_files )
}

if (!module.parent) {
	module.exports.refresh_posts( function(){} )
}