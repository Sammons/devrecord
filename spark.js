var net = require('net');

var sparkLord = {
	 port : 6000 // default port, completely arbitrary
	,socks: {}
	,messageQs: {}
}

var socket_counter = 0;
sparkLord.server = net.createServer(function(socket) {
	
	socket.identifier = socket_counter++; 
	socks[socket.identifier] = socket;
	sparkLord.messageQs[socket.identifier] = [];

	socket.on('error',function(bulll) {//by virtue of having this, the server will not crash on socket error
		console.log(bulll);
	})

	socket.on('data',function(chunk) {
		sparkLord.messageQs[socket.identifier].push(chunk);
	})

	socket.on('close',function() { 
		console.log('socket left: '+socket.address().address);
		delete socks[socket.identifier];
	});
});


sparkLord.broadcast = function(sshtuff) {
	for (var i in sparkLord.socks) {
		try {
			sparkLord.socks[i].write(sshtuff,'utf8')
		} catch(e) {
			console.log('issue writing to socket', e)
		}
	}
}

/* if this function had a name it would be
   add_spark_endpoints_to(app) */

function issue_color_command(r, g, b) {

	sparkLord.broadcast('C'+r+''+g+''+b);

}

module.exports = function(app) {

	// rgb = red green blue = 255;235;233 for example
	app.post('/spark/color/:rgb',function( req, res ) {
		var matches = req.params.rgb.trim().match(/([0-9]{3})\;([0-9]{3})\;([0-9]{3})/);
		if (!  (matches[0] == req.params.rgb.trim())
			&& (matches[1]/1 =< 255 && matches[2]/1 =< 255 && matches[3]/1 =< 255)
			&& (matches[1]/1 >= 0 && matches[2]/1 >= 0 && matches[3]/1 >= 0)
			&&  ) return res.redirect('/fuckoff'); // coincidentally, this will give a 404

	issue_color_command(matches[1], matches[2], matches[3]);

	res.end();

	})

	app.get('/spark/:sparkcore',function(i,o) {
	     
	})
}