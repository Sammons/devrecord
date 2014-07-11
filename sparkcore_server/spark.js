var net = require('net');
var express = require('express');
var EventEmitter = require('events').EventEmitter;
var sparkapp = express();

var sparkgatherer = net.createServer();
var sparkmanager = new EventEmitter();
sparkmanager.sockets = [];

sparkgatherer.on('error',
	function(e) {
		console.log('spark server error',e);
	})

sparkgatherer.on('close', 
	function() {
		console.log('spark server closed');
	})

sparkgatherer.on('connection', 
	function(socket) {
		console.log('spark server recieved connection',JSON.stringify(socket.address()));
		sparkmanager.emit('connection', socket);
	})


/* spark command logic here */

var socket_recieved_data = function( data ) {
	console.log('socket recieved data',data);
}

sparkmanager.on('connection', 
	function(socket) {
		sparkmanager.sockets.push(socket);
		socket.on('data',function(data) {
			socket_recieved_data.call(socket, data);
		})
	})

/* spark commands end */

sparkapp.get('/',
	function(req,res) {
		res.json({
			'message':'you have reached the sparkcore server aspect of devrecord',
			'resource':'nothing at this url but a helpful note'
		});
		res.end();
	})

sparkapp.get('/:sparks',
	function(req,res){
		res.json({'message':'this is the list of all available sparks','resource':'unsupported endpoint'});
		res.end();
	})

sparkapp.get('/:spark/:command',function(req,res){
	res.json({
		'message':'this is the post / get endpoint to issue commands to sparks',
		'resource':'unsupported'
	});
	res.end();
})

module.exports = sparkapp;




