var fs = require('fs')
var express = require('express');
var post_gatherer = require('./post-gatherer.js');
var app = express();
app.use(express.static('public'));
var view_cache = {};
var index = '';
function refresh_views( most_recent_post_filename ) {
	var views = fs.readdirSync('views');
	for (var i in views) {
		view_cache[ views[i].replace('.html','') ] = fs.readFileSync( 'views/'+views[ i ] , 'utf8');
	}
	for (var i in view_cache) {
		var route = (function(){return i; })();
		app.get(
		'/'+route,
		function( req, res ) { 
			res.end( view_cache[route] );
			}
		);
	}
	if (most_recent_post_filename) index = view_cache[most_recent_post_filename];
	app.get('/',function(req,res){
		res.end( index );
	})
}
app.get('/pushed',function(req,res){
	res.end();
	console.log('refreshing posts and views');
	post_gatherer.refresh_posts(refresh_views);
})

post_gatherer.refresh_posts(refresh_views);

module.exports = app;
module.exports.refresh_views = refresh_views;
