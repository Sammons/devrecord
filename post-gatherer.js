var githubapi = require('github');
var ejs = require('ejs');
var fs = require('fs');


var template = fs.readFileSync('templates/post.ejs')+'';
var user = "Sammons"

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

function render_post( body, title ) {
	fs.writeFile('views/'+title.toLowerCase().replace(' ','-')+'.html',ejs.render(template, {body: body, title: title}));
}

function getFile( path, branch, renderer ) {
	github.repos.getContent({user:user,repo:"devrecord",path: path,ref:branch}, function( err, file ) {
		if (err) renderer(err, null);
		else renderer(null, new Buffer(file.content,'Base64').toString('utf8'),
			function( err, response ) {
				render_post(response.data, file.name.replace('.md',''));
			});
	});
}

function render_markdown( err, text, callback ) {
	if (err) return console.log(err);
	else github.markdown.render({
		text: text,
		mode: "gfm",
		context: "github"+user
	},
	callback);
}

module.exports.refresh_posts = function() {
	github.misc.rateLimit({},function(err, res) {
		var now = Date.now()/1000;
		var reset = res.rate.reset - now;
		console.log('github remaining requests',res.rate.remaining,'reset in', Math.floor(reset/60), 'minutes and ',Math.round((reset/60-Math.floor(reset/60))*60), 'seconds')
	})
	github.repos.getContent({user:user,repo:"devrecord",path:"",ref:"posts"}, function( err, files) { 
		if (err) return console.log(err);
		for (var i in files) {
			if (files[i].type === 'file' && files[i].name.indexOf('.md') >= 0)
			getFile( files[i].path, 'posts', render_markdown ); 
		}
	})
}

if (!module.parent) {
	module.exports.refresh_posts()
}