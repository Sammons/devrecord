var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.all('*',function(req,res,next){
    console.log(req.url); next();
})

var debug = process.env.DEBUG;

var rendernow = function() {
    return require('fs').readFileSync('./public/index.html');
}

var index = require('fs').readFileSync('./public/index.html');

var renderatstart = function() {
    return index;
}

var renderer = renderatstart;
if (debug) {
    renderer = rendernow;
}
app.use(favicon(__dirname+'/public/images/logo.ico'));
app.use(express.static('./public'));

app.get('/', function(inc,out) {
    out.end(renderer(),200);
});

//https://www.mymumble.com/srv/status/json/?ip=206.217.198.148&port=6132
var creq = require('request');
app.get('/onmumble',function(inc,out){
    creq('https://www.mymumble.com/srv/status/json/?ip=206.217.198.148&port=6132'
        , function(e, res, bod) {
            out.end(bod);
        })
})

app.get('/onfloo',function(inc,out) {
    creq('https://floobits.com/Sammons/CatalysticCode'
        ,function(e, res, bod) {
            out.end(bod);
        })
})

/// catch 404 and forwarding to error handler
app.use(function(req, res) {
    res.status(404);
    res.end('-- 404 -- _____ -- 404 --');
});


app.set('port', process.env.DEVRECORD_PORT || 3001);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


module.exports = app;
