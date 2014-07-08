var ejs = require('ejs');
var fs = require('fs');
var request = require('request');
var md_renderer = require('./md_renderer');

var old_files = fs.readdirSync('gh-pages');

// for (var i in old_files) fs.unlinkSync('gh-pages/'+old_files[i]);

var options = function (url) {
	return {
		url : url,
		headers: {
			'User-Agent': 'Sammons'
		}
		// oauth: {
		// 	callback: 'http://localhost:3000/callback',
		// 	consumer_key: process.env.GH_ID,
		// 	consumer_secret: process.env.GH_SECRET
		// }
	}
}

var posts_in_progress = 0;
function render_ejs( str, file ) {

	fs.writeFileSync('views/'+file.replace('.md','.html'),
		ejs.render(fs.readFileSync('templates/post.ejs')+'', {
			title: file.replace('.md',''),
			body: str
		})
	)
}

function render_posts( ) {
	if (posts_in_progress != 0) return;
	else {
		var files = fs.readdirSync('gh-pages');
		for (var i in files) {
			md_renderer.renderfile('gh-pages/'+files[i], function(err, res, data) {
				if (!err) render_ejs( data+'', files[i] )
			})
		}
	}
}
function get_post_contents( url, file ) {
	request(options(url), function(err, res, data) {
		data = JSON.parse(data);
		if (!err) {
			fs.writeFileSync('gh-pages/'+file, new Buffer(data.content,'base64').toString('utf8'))
			posts_in_progress--;
			render_posts();

		} else {
			console.log(err)
		}
	})
}
request(
	options('https://api.github.com/repos/sammons/devrecord/contents/?ref=posts'),
	function(err, res, data) {
	if (err) return console.log(err);
	else {
		var files = JSON.parse(data);
		for (var i in files) {
			if (files[i].name.indexOf('.md') > -1) {
				posts_in_progress++;
				get_post_contents(files[i].url, files[i].name)
			}
		}
	}
});

