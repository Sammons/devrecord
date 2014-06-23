
// used to simulate sparkcore activity
var net = require('net');

var id = Math.round(Math.random()*1000000)
console.log('I am: '+id)

var socket = net.createConnection(6000,'localhost')

socket.on("connect",function() {

})

socket.on("data",function(data) {
	if (data[0] == 'C') {
		data = data.splice(0);
		data = data.split(',');
		console.log('turning color'+data.join(':'));
	}
})

socket.on("error",function(){console.log('error')})

socket.on("close",function() { socket = net.createConnection(6000,'localhost')})