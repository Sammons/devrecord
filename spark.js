var net = require('net');


var initSparkLord = function() {
	var sparkLord = {
		 port : 6000 // default port, completely arbitrary
		,socks: {}
		,messageQs: {}
		,socketCount: 0
	}

	sparkLord.server = net.createServer(function(socket) {
		socket.setKeepAlive(true,150);
		if (sparkLord.socketCount > 15) {
			sparkLord.server.close();
			for (var i in sparkLord.socks) sparkLord[i].destroy();// no need to delete, they are gone on the next line
			sparkLord = initSparkLord();
		}
		socket.name = 'james' //for now
		socket.identifier = sparkLord.socketCount; 
		console.log('socket opened from '+socket.address().address)
		sparkLord.socks[socket.identifier] = socket;
		sparkLord.messageQs[socket.identifier] = [];

		sparkLord.socketCount++;

		socket.on('error',function(bulll) {//by virtue of having this, the server will not crash on socket error
			console.log(bull)
			socket.close();
		})

		socket.on('data',function(chunk) {
			sparkLord.messageQs[socket.identifier].push(chunk);
		})

		socket.on('close',function(args) { 
			sparklord.socketCount--;
			console.log('socket closed '+socket.identifier);
			delete sparkLord.socks[socket.identifier];
		});
		socket.on('end',function(args) {
			console.log('ended')
			socket.close();
		})
		socket.setTimeout(5000,function() {socket.destroy()});
	
	});
	sparkLord.server.listen(sparkLord.port);


	return sparkLord;
}

var sparklord = initSparkLord();


var broadcast = function(sshtuff) {
	for (var i in sparklord.socks) {
		try {
			sparklord.socks[i].write(sshtuff,'utf8')
		} catch(e) {
			console.log('issue writing to socket', e)
		}
	}
}

/* if this function had a name it would be
   add_spark_endpoints_to(app) */

function issue_color_command(sparknum, r, g, b) {
	sparklord.socks[sparknum].write('C'+r+''+g+''+b, 'utf8');
}

module.exports = function(app) {

	// rgb = red green blue = 255,235,233 for example
	app.post('/spark/:sparkcore/:rgb',function( req, res ) {
		if (!req.params.rgb) { res.status(404); return res.end(); }
		var matches = req.params.rgb.trim().match(/([0-9]{3})\,([0-9]{3})\,([0-9]{3})/);
		
		if (matches === null) { res.status(404); return res.end(); }

		if (!(  (matches[0] == req.params.rgb.trim())
			&& (matches[1]/1 <= 255 && matches[2]/1 <= 255 && matches[3]/1 <= 255)
			&& (matches[1]/1 >= 0 && matches[2]/1 >= 0 && matches[3]/1 >= 0)
			&& !!sparklord.socks[req.params.sparkcore])) { res.status(404); return res.end(); } // coincidentally, this will give a 404

	issue_color_command(req.params.sparkcore, matches[1], matches[2], matches[3]);

	res.end();

	})

	app.get('/spark/:sparkcore',function( req, res) {
	     if (!!sparklord.socks[req.params.sparkcore]) { return res.end(sparklord.messageQs[req.params.sparkcore].pop()) }
	     else { res.status(404); return res.end() }
	})

	app.get('/spark',function(req,res) {
		var sparks = [];
		for (var i in sparklord.socks) {
			sparks.push({key: sparklord.socks[i].identifier, name: sparklord.socks[i].name});

		}
		res.end(JSON.stringify(sparks));
	})
}