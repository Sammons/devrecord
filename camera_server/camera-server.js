var stream_server = require('camera_server/stream-server.js');
var express = require('express');

var app = express();
app.use(express.static('camera_server/public'))
app.get('/widget',function(req, res) {
	var widget_html = '<canvas id="videoCanvas" width="320" height="240">
		<p>
			Please use a browser that supports the Canvas Element, like
			<a href="http://www.google.com/chrome">Chrome</a>,
			<a href="http://www.mozilla.com/firefox/">Firefox</a>,
			<a href="http://www.apple.com/safari/">Safari</a> or Internet Explorer 10
		</p>
	</canvas>
	<script type="text/javascript" src="stream.devrecord.com/jsmpg.js"></script>';
	res.json({
		 data: widget_html
	});
	res.end();
})

module.exports = app;