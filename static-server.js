var fs = require('fs')
var express = require('express');
var post_gatherer = require('./post-gatherer.js');
var app = express();
app.use(express.static('public'));
var view_cache = {};

function refresh_views() {
	var views = fs.readdirSync('views');
	for (var i in views) {
		if (!view_cache[ views[i].replace('.html','') ])
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
}
app.get('/pushed',function(req,res){
	res.end();
	console.log('refreshing posts and views');
	post_gatherer.refresh_posts();
	refresh_views();
})

refresh_views();

module.exports = app;
module.exports.refresh_views = refresh_views;
