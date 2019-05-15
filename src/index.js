
var unified = require('unified')
var stream = require('unified-stream')
var markdown = require('remark-parse')
var toc = require('remark-toc')
var remark2rehype = require('remark-rehype')
var raw = require('rehype-raw')
var doc = require('rehype-document')
var html = require('rehype-stringify')
var fs = require('fs')
var applyStyle = require('./applyStyle.js')

 var processor = unified()
  	.use(markdown)
  	.use(toc)
  	.use(remark2rehype, {allowDangerousHTML:true})
	.use(raw)
  	.use(doc, {title: 'Contents'})
  	.use(html)
  	.use(applyStyle)

var fstream = fs.createReadStream(process.argv[2]);

fstream.pipe(stream(processor)).pipe(process.stdout)
