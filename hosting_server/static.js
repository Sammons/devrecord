var express = require('express');
var app = express();
var request = require('request')
app.use(express.static('hosting_server/public'));

module.exports = app;

var mumble_url = 'https://www.mymumble.com/srv/status/json/?ip=206.217.198.148&port=6132'
var mumble_json = {}
var mumble_json_age = Date.now()
function refresh_mumble( callback ) {
	if ( ( Date.now() - mumble_json_age ) < 2000) { 
		console.log('skipping mumble refresh, data too young')
		callback()
		return;
	}
	console.log('mumble data being refreshed')
	request({
		  url : mumble_url
		, method : 'GET'
	}, function( err, res, body ) {
		if (!err && res.statusCode == 200) {
			mumble_json_age = Date.now();
			mumble_json = body
		}
		callback()
	})
}

app.get('/mumble',function( req, response ) {
	refresh_mumble( function() {
		response.json( mumble_json )
	})
})

if (!module.parent) {
	app.listen(3000);
}