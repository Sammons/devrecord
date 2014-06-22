var net = require('net');

// for fun, right?
function initpush(obj, key, elem) {
	if (!obj[key]) obj[key] = [];
	obj[key].push(elem);
}

var manager = function() {
	var options = {
		 port : 6000 // default port, completely arbitrary
		,socks: {}
		,messageQs: {}
		,socketCount: 0
	}

	var server = this.server = net.createServer( function( connection ) {

		/* set up custom listener system */
			var triggers = connection.triggers = {};
			var oncetriggers = connection.oncetriggers = {};
			var conditionally_once_triggers = connection.conditionally_once_triggers = {};
			var trigger = connection.trigger = function(what, args) {
				for (var i in triggers[what]) 
					triggers[what][i].apply(connection,
						Array.prototype.slice.call(arguments, 1));
				for (var i in oncetriggers[what])
					oncetriggers[what][i].apply(connection,
						Array.prototype.slice.call(arguments, 1));
				for (var i in conditionally_once_triggers[what]){
					var bool = conditionally_once_triggers[what][i].apply(connection,
						Array.prototype.slice.call(arguments, 1));
					if (bool) conditionally_once_triggers[what].splice(i);
				}
				oncetriggers[what] = [];
			}
			var on = connection.on = function(what, callback) {
				initpush(triggers, what, callback);
			}
			var once = connection.once = function(what, callback) {
				initpush(oncetriggers, what, callback);
			}
			var conditionally_once = connection.conditionally_once = function(what, callback) {
				initpush(conditionally_once_triggers, what, callback)
			}
			var unbind = connection.unbind = function(what, func) {
				triggers[what] = removeFromArray(triggers[what], func);
			}


		connection.addr = connection.address();
		
		// I heartbeat will be necessary
		// connection.setTimeout(2000);

		// I'll take it fast please
		// connection.setNoDelay(true);

		// And make it clear
		connection.setEncoding('utf8');

		console.log( 'connection added: ' + connection.addr.family + ' ' + connection.addr.address + ' ' + connection.addr.port );
		
		// welcome
		connection.write('300','utf8');

		connection.on("connect",function() { 

			trigger("connected",connection.addr);

		})

		connection.on( "data",function( data ) { 
			//trim to be sure nothing strange catches us
			data = data.trim();

			console.log( "data recieved", data );


			var first_and_rest = data.split( /\:/ )[ 0 ];
			
			if ( first_and_rest != null && first_and_rest.length == 2 ) 
			{ trigger( first_and_rest[ 0 ], first_and_rest[ 1 ] ); }
			
		} );

		connection.on( "drain", function() { /* nothing here */

			console.log( 'connection drained: ' + connection.addr.family + ' ' + connection.addr.address + ' ' + connection.addr.port );

		} );

		connection.on( "close", function() { /* when there is an error or it just closes */

			console.log( 'connection closed: ' + connection.addr.family + ' ' + connection.addr.address + ' ' + connection.addr.port );

		} );

		connection.on( "timeout", function() { /* when the connection has timed out */

			console.log( 'connection timed out: ' + connection.addr.family + ' ' + connection.addr.address + ' ' + connection.addr.port );

		} );

		connection.on( "end", function() { /* other end of connection sent a FIN */

			console.log( 'connection ended: ' + connection.addr.family + ' ' + connection.addr.address + ' ' + connection.addr.port );

		} );

	
	} ).listen(options.port);
}

var sparkLord = new manager();
console.log(sparkLord);
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