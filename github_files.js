var ejs = require('ejs');
var fs = require('fs');
var request = require('request');
var md_renderer = require('./md_renderer');

var old_files = fs.readdirSync('gh-pages');

for (var i in old_files) fs.unlinkSync('gh-pages/'old_files[i]);

