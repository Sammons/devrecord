var vhost = require('vhost');
var morgan = require('morgan')
var app = require('express')();
var server = require('http').Server(app);
var post_server = require('./post_server/static-server.js');

var TLD = 'devrecord.com'

app.use(morgan('default'))
app.use(vhost(TLD, post_server));

server.listen(process.env.PORT || 3000);
