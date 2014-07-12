var vhost = require('vhost');
var morgan = require('morgan')
var express = require('express');
var app = express();
var tldapp = express();
var server = require('http').Server(app);
var post_server = require('./post_server/static-server.js');
var spark_server = require('./sparkcore_server/spark.js');
var camera_server = require('./camera_server/stream-server.js');

var TLD = 'devrecord.com'

tldapp.get('/',function(i,o){o.redirect('http://posts.devrecord.com');});
tldapp.get('/ben',function(i,o){o.redirect('http://ben.devrecord.com');});

app.use(morgan('default'));
app.use(vhost(TLD,tldapp));
app.use(vhost("posts.devrecord.com", post_server));

server.listen(process.env.PORT || 3000);
