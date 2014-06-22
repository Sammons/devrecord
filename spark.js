var net = require('net');


var manager = function() {
	var options = {
		 port : 6000 // default port, completely arbitrary
		,socks: {}
		,messageQs: {}
		,socketCount: 0
	}

	var server = net.createServer( function( connection ) {

		var address = connection.address()
		
		console.log('connection started: '+address.family+' '+address.address+' '+address.port);

		connection.on("data",function(data){ console.log("data recieved",data) });

	} )

}




var broadcast = function(sshtuff) {
}
/* if this function had a name it would be
   add_spark_endpoints_to(app) */

function issue_color_command(sparknum, r, g, b) {
}

module.exports = function(app) {

	// rgb = red green blue = 255,235,233 for example
	app.post('/spark/:sparkcore/:rgb',function( req, res ) {
	})

	app.get('/spark/:sparkcore',function( req, res) {
	})

	app.get('/spark',function(req,res) {
	})
}