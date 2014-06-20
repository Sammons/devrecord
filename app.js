
var middleware = require('./middleware.js')
var routes     = require('./routes.js')

var app = middleware.setup_express_app();

routes.add_html_routes(app);
routes.add_json_routes(app);

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

app.listen(app.get('port'));