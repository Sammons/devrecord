var express = require('express');
var app = express();
app.use(express.static('hosting_server/public'));

module.exports = app;

if (!module.parent) {
	app.listen(3000);
}