# ux language core module
ux-lang is a powerful tool for fast web app ui prototyping.

```
npm install ux-lang
```

At the moment there is only one parser available. 

```
const {parserJSFunction} = require('ux-lang')

const uxContent = 
`
div root
    h1 'Hello World
`

const functionCode = parserJSFunction('functionName', uxContent)

// functionCode contains the javascript code which execution gives the html representend by uxContent.
```

So *functionCode* contains:  
```
function functionName(){
    var root = document.createElement('div')
    var varName_01 = document.createElement('h1')
    varName_01.textContent = 'Hello World'
    root.appendChild(varName_01)
    return root
}
```

# TODO

- Create a reusable bundle from application (so I can use app as it would be a component). DONE - see bundler-js command in ux-cli
- ux-ui-dev-tools
- save components on heroku+mongo
- download styled dom
- dev server (to save styled dom)
- Components hierarchy (folderization)
- Distinct between comp.js(add functionalities) and comp.wire.js
- add ux-comp-name attribute to parsers
- riconsiderare document.register per determinati casi d'uso con uso dello store as centralized controller
- mustache template engine like
- implementare ux.config.json
- style tag support in ux file