var request = require('request');

var user = 'Sammons';

var markdown_request = function(text) {
	this.text = text;
	this.mode = 'gfm';
	this.context = 'github/' + user;
	return this;
}

var options = function (data) {
	return {
		url: 'https://api.github.com/markdown',
		method:  'POST',
		json: data,
		headers: {
			'User-Agent':user,
		}

	}
}

var request_render = function( text, callback ) {
	request(
		options(
			new markdown_request(text)
			),
		callback
		);
}

var fs = require('fs');
module.exports.renderfile = function( file, cb ) {
	request_render(fs.readFile(file, function(err,data){
		request_render(data, cb);
	}))
}

module.exports.render = request_render;

