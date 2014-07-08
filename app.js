var vhost = require('vhost');
var morgan = require('morgan')
var app = require('express')();
var server = require('http').Server(app);
var static_app = require('./static-server.js');

var TLD = 'localhost'

app.use(vhost(TLD, static_app));

server.listen(process.env.PORT || 3000);
