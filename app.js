var fs = require('fs');
var vhost = require('vhost');
var morgan = require('morgan')
var express = require('express');
var app = express();
var tldapp = express();
var server = require('http').Server(app);
var server_s = require('https').Server({
	key:   fs.readFileSync(process.env.DEVRECORD_KEY_PATH)+'',
	ca:    fs.readFileSync(process.env.DEVRECORD_CERT_ROOT_PATH),
	cert:  fs.readFileSync(process.env.DEVRECORD_CERT_CHILD_PATH)
	      +fs.readFileSync(process.env.DEVRECORD_CERT_PATH)
},app);
var post_server = require('./post_server/static-server.js');
var spark_server = require('./sparkcore_server/spark.js');
var camera_server = require('./camera_server/camera-server.js');
var hosting_server = require('./hosting_server/static.js');

var TLD 		= 'devrecord.com';
var myurl 		= 'ben.devrecord.com';
var posturl 	= 'posts.devrecord.com';
var camurl 		= 'stream.devrecord.com';
var hostingurl 	= 'hosting.devrecord.com';
var me = 'ben';

tldapp.get('/',function(i,o){o.redirect( 'http://'+posturl );});
tldapp.get('/'+me,function(i,o){o.redirect( 'http://'+myurl );});

app.use(morgan('default'));
app.use(vhost( posturl, 	post_server     ));
app.use(vhost( camurl, 		camera_server   ));
app.use(vhost( hostingurl, 	hosting_server  ));
app.use(vhost( TLD,         tldapp          ));
app.use(vhost( 'www.'+TLD,  tldapp          ));
server.listen( process.env.PORT || 3000 );

server_s.listen( process.env.SSL_PORT || 3443 );