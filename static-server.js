var fs = require('fs')
var express = require('express');
var app = express();

app.use(express.static('public'));
var views = fs.readdirSync('views');

var view_cache = {};

for (var i in views) view_cache[ views[i].replace('.html','') ] = fs.readFileSync( 'views/'+views[ i ] , 'utf8');

for (var i in view_cache) {
	var route = (function(){return i; })();
	app.get(
	'/'+route,
	function( req, res ) { 
		res.end( view_cache[route] );
		}
	);
}
module.exports = app;

