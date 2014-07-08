var ejs = require('ejs');
var fs = require('fs');
var request = require('request');
var md_renderer = require('./md_renderer');

var old_files = fs.readdirSync('gh-pages');

for (var i in old_files) fs.unlinkSync('gh-pages/'+old_files[i]);

var pages_json = request('http://api.github.com/repos/sammons/devrecord/contents/?ref=posts');

