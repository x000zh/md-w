
const visit = require('unist-util-visit')
const parseSelector = require('hast-util-parse-selector')
const fromString = require('hast-util-from-string')
const ClassList = require('hast-util-class-list')
const fs = require('fs')
const path = require('path')

let styleAppend=`
.markdown-body {
	box-sizing: border-box;
	min-width: 200px;
	max-width: 980px;
	margin: 0 auto;
	padding: 45px;
}
@media (max-width: 767px) {
	.markdown-body {
		padding: 15px;
	}
}
@media print {
	margin: 0 auto;
	padding: 45px;
}
`
let js = `
    var config = {
        startOnLoad:true,
        flowchart:{
            useMaxWidth:false,
            htmlLabels:true
        }
    };
    mermaid.initialize(config);
`

function attacher(){
    let style
    let transformer = function(tree, file){
        visit(tree, 'element', function(node){
            if('head' == node.tagName){
                let style = parseSelector('style')
                let styleText = fs.readFileSync(path.join(__dirname, '../node_modules/github-markdown-css/github-markdown.css'))
                styleText += styleAppend
                fromString(style, styleText)
				let scriptText = fs.readFileSync(path.join(__dirname, '../node_modules/mermaid/dist/mermaid.min.js'))
				scriptText += js
				let script = parseSelector('script')
				fromString(script, scriptText)
                node.children.push(style)
				node.children.push(script)
            }
            if('body' == node.tagName){
                let classList = ClassList(node)
                classList.add('markdown-body')
            }
        })
    }
    return transformer
}

module.exports = attacher
