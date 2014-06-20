//for pinging other apis
var request = require('request');
var fs  	= require('fs');

function get_renderer(file, cache) {
	if (cache == true)
		var renderer = (function() {
			var data = fs.readFileSync(file);
			return function() {
				return data;
			}
		})()
	else
		var renderer = (function() {
			return function() {
				return fs.readFileSync(file);
			}
		})()
	return renderer;
}

var add_html_routes = function(app) { // routes that serve html
	
	var pages = {};//object for storing pages

	pages['home'] = get_renderer(__dirname+'/public/default.html', true);// ok to be synchronous here since its only on startup
	pages['404']   = function() {return '404, sorry'};

	app.get('/',function(req,res) {
		res.redirect('./pages/home');
	})

	app.get('/pages/:url', function(req,res) {
		res.end((pages[req.params.url]||pages['404'])());//cheers
	});



}

var add_json_routes = function(app) {
	
	app.get('/onmumble',function(req,res){
	    //this gets the json object of the mumble server's stuff
	    request(
	    	'https://www.mymumble.com/srv/status/json/?ip=206.217.198.148&port=6132'
	        , function(e, res, bod) {
	            res.end(bod);
	        })
	})

}

module.exports.add_html_routes = add_html_routes;
module.exports.add_json_routes = add_json_routes;

