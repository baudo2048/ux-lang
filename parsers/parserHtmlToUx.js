const jsdom = require('jsdom')

module.exports = function(xml, rootElement) {

    const { JSDOM } = jsdom;
    const dom = new JSDOM(xml);

    var uxCodeArr = []
    var stack = []


    function camelCase(input) { 
        return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    }

    function spaceTab(nTab){
        var st = ''
        for(var i=0;i<nTab;i++){
            st+='    '
        }
        return st
    }

    function scrivi(stackElement){
        const tabIndex = stackElement.tabIndex
        const el = stackElement.element

        //const textNode = el.textContent==undefined?'':" '"+el.textContent
        var textNode = ''
        // CERCO SE CONTIENE IL TEXTNODE
        const childNodesArr = Array.from(el.childNodes)
        childNodesArr.forEach(
            v=>{
                    if(v.nodeType===3){
                        textNode += v.nodeValue
                    }
                    
            })
        textNode = textNode.trim()

        // 1. SCRIVO TAG NAME + TEXTNODE
        if (textNode==''){
            uxCodeArr.push(spaceTab(tabIndex)+el.tagName)
        } else {
            uxCodeArr.push(spaceTab(tabIndex)+el.tagName + " '" + textNode)
        }

        // 1.bis SCRIVO GLI STYLES
        Array.from(el.style).map( (x,y) => {
            uxCodeArr.push(spaceTab(tabIndex+1)+'-'+ camelCase(x) +' '+el.style[camelCase(x)]);
        })
        
        // 2. SCRIVO GLI ATTRIBUTI
        el.getAttributeNames().forEach(attr =>{
            if(attr!=='style'){
                uxCodeArr.push(spaceTab(tabIndex+1)+'.'+ attr +' '+el.getAttribute(attr))      
            } 
        })
        
        return
    }


    function pushChildren(stackElement){
        var children = Array.from(stackElement.element.children)
        const cl = children.length
        for (var i=cl-1;i>=0;i--){
            stack.push({tabIndex: stackElement.tabIndex+1, element:children[i]})
        }
    }

    const svgBlock = dom.window.document.getElementsByTagName(rootElement)[0]

    stack.push({tabIndex:0,element:svgBlock})

    while(stack.length!=0){
        const stackEl = stack.pop()
        scrivi(stackEl)
        pushChildren(stackEl)
    }

    var outContent = '';

    uxCodeArr.forEach(el => {
        outContent += el+'\n'
    })

    return outContent;

}