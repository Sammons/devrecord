
var net = require('net');
var middleware = require('./middleware.js')
var routes     = require('./routes.js')

var app = middleware.setup_express_app();

routes.add_html_routes(app);

app.set('port', process.env.DEVRECORD_PORT || 80);

app.listen(3000);
var index = require('fs').readFileSync('./public/default.html');



//https://www.mymumble.com/srv/status/json/?ip=206.217.198.148&port=6132

// var socks = []
// var sparkStatement = 'none yet!';
// var command = function(ch) {
//     for (var i in socks) socks[i].write(ch);
// }

// app.get('/spark',function(i,o) {
//     o.end(sparkStatement);
// })

// app.get('/red',function(i,o) {
//     command('R');
//     o.end()
// })
// app.get('/blue',function(i,o){
//     command('B');
//     o.end()
// })
// app.get('/green',function(i,o){
//     command('G');
//     o.end()
// })
// /// catch 404 and forwarding to error handler
// app.use(function(req, res) {
//     res.status(404);
//     res.end('-- 404 -- _____ -- 404 --');
// });



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
