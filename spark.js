var net = require('net');

var sockets = [];

// for fun, right?
function initpush(obj, key, elem) {
	if (!obj[key]) obj[key] = [];
	obj[key].push(elem);
}

var connectedHandler = function() { }

var ignoreHandler = function( evt ) { 
	return function() { console.log('event ignored '+evt) } 
};

var destroyHandler = function() {
	for (var i in sockets) {
		if (sockets[i] == this) {
			sockets.splice(i);
			console.log('socket closed')
			try{ this.destroy(); } catch(e) {}
		}
	}
}

var dataHandler = function( data ) { 
	data = (data+'').trim();
	/* console.log( this.address(), "sent us", data ); */

	var valid_message_format = /^[A-Z]\:.*?$|^1$/gi
	
	if (!(valid_message_format.test(data))) ; /*console.log('invalid message format');*/
	else {
		var command_format = /(^.*?):(.*$)/g
		var tokens = data.split(command_format);
		if (tokens == null || tokens.length != 4) {
			this.last_recieved = Date.now(); /*console.log('not a message',tokens);*/
		} else {
			if (!(this.emit(tokens[1],tokens[2]))) ; /*console.log('message ignored');*/
		}
	}
}

function initSocket() {
	this.write('Z','utf8');
	this.setTimeout('1000');
	this.last_recieved = Date.now();
	this.on( "connect", ignoreHandler( "connect") );
	this.on( "data",    dataHandler               );
	this.on( "timeout", destroyHandler            );
	this.on( "close",   destroyHandler            );
	this.on( "end",     destroyHandler            );
	this.on( "error",   destroyHandler            );

	this.dogtags = {};

}

var options = {
	 port : 6000 // default port, completely arbitrary
	,socks: {}
	,messageQs: {}
	,socketCount: 0
}


var server = net.createServer( function( socket ) {
	console.log('socket opened:',socket.address());
	sockets.push(socket);
	initSocket.call(socket);
	setInterval(function(){ 
		try{
			socket.write('Z','utf8')
			if ((Date.now() - socket.last_recieved) > 2000) socket.emit("close");
		} catch (e) {
			socket.emit("close");
		}
	},800);
} ).listen(options.port);



var broadcast = function(sshtuff) {
}
/* if this function had a name it would be
   add_spark_endpoints_to(app) */

function issue_color_command(sparknum, r, g, b) {
}

module.exports = function(app) {

	// rgb = red green blue = 255,235,233 for example
	app.post('/spark/:sparkcore/:rgb',function( req, res ) {
		console.log('recieved')
		try {
			var sparkid = req.params.sparkcore;
			var colors = req.params.rgb.replace('?mobile=true','').split(',');
			var matches = true;
			for (i in colors) {
				if (!/^[0-9][0-9]?[0-9]?$/.test(colors[i]) && colors[i]/1 < 256) 
					matches = false;
			}
			if (matches) {
				if (!!sockets[sparkid]) {
					console.log('C'+colors.join(','))
					sockets[sparkid].write('C'+colors.join(','));
				}
			} else {
				res.status(404);
			}

		} catch (e) {
			console.log('msgerr',e);
		}
		res.end();
	})

	app.get('/spark/:sparkcore',function( req, res) {
		try {
			res.end(JSON.stringify(sockets[req.params.sparkcore.replace('?mobile=true','')].name));
		} catch (e) {

		}
	})

	app.get('/spark',function(req,res) {
		var socketDetails = [];
		for (var i in sockets) {
			socketDetails.push({ name: 'spark-'+i+'  ' });
		}
		res.end(JSON.stringify(socketDetails));
	})
}