var express = require('express');
var favicon = require('serve-favicon');
var net = require('net');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(function(req,res,next){
    var ua = req.headers['user-agent'].toLowerCase();
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4))) {
        req.is_mobile = true;
    } else {
        req.is_mobile = false;
    }
    next(null,req, res);
})

var debug = process.env.DEBUG;

var index = require('fs').readFileSync('./public/default.html');

var renderatstart = function() {
    return index;
}

var renderer = renderatstart;

app.use(favicon(__dirname+'/public/images/logo.ico'));
app.use(express.static('./public'));

app.get('/', function(inc,out) {
    if (inc.is_mobile && ! /mobile/.test(inc.url)) {
      return out.redirect('/?mobile=true');
    }
    else return out.end(renderer());

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

var socks = []
var sparkStatement = 'none yet!';
var command = function(ch) {
    for (var i in socks) socks[i].write(ch);
}

app.get('/spark',function(i,o) {
    o.end(sparkStatement);
})

app.get('/red',function(i,o) {
    command('R');
    o.end()
})
app.get('/blue',function(i,o){
    command('B');
    o.end()
})
app.get('/green',function(i,o){
    command('G');
    o.end()
})
/// catch 404 and forwarding to error handler
app.use(function(req, res) {
    res.status(404);
    res.end('-- 404 -- _____ -- 404 --');
});


app.set('port', process.env.DEVRECORD_PORT || 80);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
var sparkLogListener = net.createServer(function(socket){
    socks.push(socket);
    socket.on('data',function(d) {
        sparkStatement = d+'';
        console.log(sparkStatement);
        setTimeout(function() {
            sparkStatement = 'press my buttons!';
        },2000)
    });
});
sparkLogListener.listen(6000);

module.exports = app;
