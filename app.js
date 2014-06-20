
var net = require('net');
var middleware = require('./middleware.js')
var routes     = require('./routes.js')

var app = middleware.setup_express_app();

routes.add_html_routes(app);

plugins = ['spark.js'];

//plergins
for (var p in plugins) {
    try {
        require(__dirname+'/'+plugins[p])(app);
    } catch(e) {
        console.log('module failed to load '+plugins[p], e);
    }
}

app.set('port', process.env.DEVRECORD_PORT || 80);

app.listen();

// var socks = []
// var sparkStatement = 'none yet!';
// var command = function(ch) {
//     for (var i in socks) socks[i].write(ch);
// }

// var server = app.listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + server.address().port);
// });
// var sparkLogListener = net.createServer(function(socket){
//     socks.push(socket);
//     socket.on('data',function(d) {
//         sparkStatement = d+'';
//         console.log(sparkStatement);
//         setTimeout(function() {
//             sparkStatement = 'press my buttons!';
//         },2000)
//     });
// });
// sparkLogListener.listen(6000);

// module.exports = app;
