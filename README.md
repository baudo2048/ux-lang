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

