var githubapi = require('github');
var ejs = require('ejs');
var fs = require('fs');

var options = {
	 repo: "devrecord"
	,user: "Sammons"
	,branch: "posts"
}

var template = fs.readFileSync('post_server/templates/post.ejs')+'';
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

function render_files_from_ejs( files, callback ) {
	var processes_sent = files.length;
	for (var i in files) {
		render_post(files[i], files
			, function() {
				processes_sent--;
				if (processes_sent === 0) {
					callback( files );
				}
			})
	}
}


function render_file_markdown(file, callback ) {
	github.markdown.render({
		text: file.content,
		mode: "gfm",
		context: "github"+options.user
	},
	function( err, res ) {
		if (res.statusCode !== 200) return console.log('error with rendering markdown');
		file.content = res.data;
		callback( file )
	});
}

function render_files_from_markdown( files, callback ) {
	var processes_sent = files.length;
	var rendered_files = [];
	for (var i in files) {
		render_file_markdown(files[i]
			, function( file ) {
				rendered_files.push(file)
				processes_sent--;
				if (processes_sent === 0) {
					callback( rendered_files );
				}
			})
	}
}

function getFile( path, callback) {
	github.repos.getContent({
		 user: options.user
		,repo: options.repo
		,path: path
		,ref:  options.branch
	}
	, callback);
}

function get_file_contents( callback ) {
	github.repos.getContent({
			 user: options.user
			,repo: options.repo
			,path:""
			,ref: options.branch
		}
		, function( err, files) { 
			if (err) return console.log(err);
			var requests_sent = 0;
			var md_files = [];
			for (var i in files) {
				if ( files[i].type === 'file' && files[i].name.indexOf('.md') >= 0 ) 
					requests_sent++;
			}
			for (var i in files) {
				if ( files[i].type === 'file' && files[i].name.indexOf('.md') >= 0 ) {
					getFile( files[i].path, function( err, res ) {
						if (err) return console.log(err);
						files[i] = res;
						files[i].content = new Buffer(res.content, res.encoding).toString('utf8');
						files[i].encoding = 'utf8';
						md_files.push(files[i]);
						
						requests_sent--;
						if (requests_sent === 0) render_files_from_markdown(md_files);
					}); 
				}
			}
		})
}

module.exports.refresh_posts = function( onfinished ) {
	console.log('beginning refreshing github posts');
	var completed_handler = function(files) {
		console.log('completed refreshing posts');
		onfinished( latest_file, files );
	}

	var sequence = [ // each one passes the files argument to the next
		 get_file_contents
		,render_files_from_markdown
		,render_files_from_ejs
		,completed_handler
	];
	var sequence_position = 0;
	var next = function( files ) {
		sequence_position++;
		if ( sequence[ i ] ) sequence[ i ] (files
			, function( files ) {
				next( files );
		})
		else return sequence_position = 0;
	}

	//begin the sequence
	sequence[0]( next );


	// completed_callback = callback;
	// github.misc.rateLimit({},function(err, res) {
	// 	var now = Date.now()/1000;
	// 	var reset = res.rate.reset - now;
	// 	console.log('github remaining requests',res.rate.remaining,'reset in', Math.floor(reset/60), 'minutes and ',Math.round((reset/60-Math.floor(reset/60))*60), 'seconds')
	// })
	
}

if (!module.parent) {
	module.exports.refresh_posts()
}