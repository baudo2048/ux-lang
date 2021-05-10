/*! ux-lang 1.2.1 https://github.com/baudo2048/ux-lang.git @license MIT */
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
  global.ux = factory());
})(this, (function() {
  "use strict";
  /*
        RESTITUISCE UN MODULO NODE.JS
    */  function getTokenType$1(t) {
    // t = string
    const sentinel = t.substr(0, 1);
    if (sentinel == ".") return "attr";
    if (sentinel == "-") return "style";
    if (sentinel == "'") return "text";
    if (sentinel == "\\") return "include";
    if (sentinel == "<") return "html";
    return "elem";
  }
  function isImport$2(t) {
    const sentinel = t.substr(0, 1);
    if (sentinel == "*") return true; else return false;
  }
  function countTabs$1(l) {
    const count = Math.floor(l.search(/\S|$/) / 4);
    return count;
  }
  function writeAttribute$1(tokens, arrOut, currentVarName, namespace) {
    var value = tokens[1];
    tokens.slice(2).forEach((v => {
      value = value + " " + v;
    }));
    if (tokens[0].substr(1, 2) == "on") {
      arrOut.push(`${currentVarName}${tokens[0]} = ${value}`);
    } else {
      if (namespace == 0 || namespace === undefined) {
        arrOut.push(`${currentVarName}${tokens[0]}= '${value}'`);
      } else {
        arrOut.push(`${currentVarName}.setAttribute('${tokens[0].slice(1)}', '${value}')`);
      }
    }
  }
  function writeText$1(tokens, arrOut, currentVarName, n) {
    //# t = tokens    f = fileOut   c = currentVarName    n = count
    // TRASFORMARE QUESTO CASO IN NODE ELEMENT!!!
    var value = tokens[0].slice(1);
 // considero la stringa senza '
        tokens.slice(1).forEach((v => {
      value = value + " " + v;
    }));
    arrOut.push(`var textNode_${n} = document.createTextNode('${value}')`);
    arrOut.push(`${currentVarName}.append(textNode_${n})`);
  }
  function writeStyle$1(tokens, arrOut, currentVarName) {
    var value = tokens[1];
    tokens.slice(2).forEach((v => {
      value = value + " " + v;
    }));
    arrOut.push(`${currentVarName}.style${tokens[0].replace("-", ".")}='${value}'`);
  }
  var parserForHtml = function parse(fileName, textCode, scriptCode = "", cssCode = "") {
    const ns = {
      div: 0,
      svg: 1,
      circle: 1,
      rect: 1,
      polyline: 1,
      text: 1
    };
    const nsName = {
      0: "",
      1: "http://www.w3.org/2000/svg"
    };
    var importArr = [];
    var codeArr = [];
    var Lines = textCode.split("\n");
    var count = 0;
    var currentVarName = "";
    var varName = "";
    var currentNS = "0";
    var appends = [];
    var currTabNum = 0;
    var prevTabNum = 0;
    var isFirstElement = true;
    var firstElement = "";
    Lines.forEach(((v, i, a) => {
      var tokens = v.trim().split(" ");
      if (tokens.length == 0 || tokens[0] == "") {
        return;
      }
      var leadToken = tokens[0];
      var tokenType = getTokenType$1(leadToken);
      currTabNum = countTabs$1(v);
      if (tokenType == "elem") {
        if (tokens.length == 1) {
          if (isImport$2(leadToken)) {
            varName = leadToken.slice(1) + "_" + count;
          } else {
            varName = leadToken + "_" + count;
          }
        } else if (tokens.length == 2 && getTokenType$1(tokens[1]) == "elem") {
          varName = tokens[1];
        } else if (tokens.length == 2 && getTokenType$1(tokens[1]) == "text") {
          if (isImport$2(leadToken)) {
            varName = leadToken.slice(1) + "_" + count;
          } else {
            varName = leadToken + "_" + count;
          }
        } else if (tokens.length >= 3 && getTokenType$1(tokens[1]) == "elem") {
          varName = tokens[1];
        } else if (tokens.length >= 3 && getTokenType$1(tokens[1]) == "text") {
          if (isImport$2(leadToken)) {
            varName = leadToken.slice(1) + "_" + count;
          } else {
            varName = leadToken + "_" + count;
          }
        }
        /*             } else if (tokens.length>=3 && getTokenType(tokens[1]=='text')) {
                    if(isImport(leadToken)){
                        varName = leadToken.slice(1) + "_" + count
                    } else {
                        varName = leadToken + "_" + count
                    }
                } else if (tokens.length==2 && getTokenType(tokens[1]!='text')) {
                    varName = tokens[1]
                } else {
                    varName = tokens[2]
                } */        if (isFirstElement) {
          isFirstElement = false;
          firstElement = varName;
          // SCRIVO LE COSE DI APERTURA
                    codeArr.push("const jsdom = require('jsdom')");
          codeArr.push("const { JSDOM } = jsdom");
          codeArr.push("const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>')");
          codeArr.push("document = dom.window.document");
          codeArr.push(`module.exports = function ${fileName}() `);
 //export default function
                    codeArr.push("{");
        }
        currentVarName = varName;
        currentNS = ns[tokens[0]];
        if (isImport$2(leadToken)) {
          //importArr.push(`import ${varName}_ from './${leadToken.slice(1)}.js'`)
          importArr.push(`const ${leadToken.slice(1)} = require('./${leadToken.slice(1)}')`);
          //codeArr.push(`var ${varName} = ${varName}_()`)
                    codeArr.push(`var ${varName} = ${leadToken.slice(1)}()`);
        } else {
          if (currentNS == 0 || currentNS === undefined) {
            codeArr.push(`var ${varName} = document.createElement('${tokens[0]}')`);
            if (tokens.length == 2 && getTokenType$1(tokens[1]) == "text") {
              var valueString = "";
              tokens.slice(1).forEach((v => {
                valueString = valueString + " " + v;
              }));
              codeArr.push(`${varName}.append(document.createTextNode(${valueString}'))`);
            } else if (tokens.length > 2 && getTokenType$1(tokens[1]) == "text") {
              var valueString = "";
              tokens.slice(1).forEach((v => {
                valueString = valueString + " " + v;
              }));
              codeArr.push(`${varName}.append(document.createTextNode(${valueString}'))`);
            } else if (tokens.length > 2 && getTokenType$1(tokens[2]) == "text") {
              var valueString = "";
              tokens.slice(2).forEach((v => {
                valueString = valueString + " " + v;
              }));
              codeArr.push(`${varName}.append(document.createTextNode(${valueString}'))`);
            }
          } else {
            codeArr.push(`var ${varName} = document.createElementNS('${nsName[currentNS]}','${tokens[0]}')`);
            if (tokens.length == 2 && getTokenType$1(tokens[1]) == "text" || tokens.length == 3) {
              codeArr.push(`${varName}.append(document.createTextNode(${tokens[1]}))`);
            }
          }
        }
        // APPENDS
                if (prevTabNum > currTabNum) {
          // SVUOTO LIVELLO
          const diff = prevTabNum - currTabNum;
          for (var i = 0; i < diff; i++) {
            appends[appends.length - 1].forEach(((v, i, a) => {
              const prevLiv = appends[appends.length - 2];
              var varEl = prevLiv[prevLiv.length - 1];
              codeArr.push("");
              codeArr.push(`${varEl}.appendChild(${v})`);
              codeArr.push("");
            }));
            appends.splice(appends.length - 1, 1);
          }
        }
        if (currTabNum > appends.length - 1) appends.push([]);
        appends[currTabNum].push(`${varName}`);
      }
      if (tokenType == "attr") writeAttribute$1(tokens, codeArr, currentVarName, currentNS);
      if (tokenType == "text") writeText$1(tokens, codeArr, currentVarName, count);
      if (tokenType == "style") writeStyle$1(tokens, codeArr, currentVarName);
      if (tokenType == "html") codeArr.push(v);
      prevTabNum = currTabNum;
      count = count + 1;
    }));
    // SVUOTO FINAL
        while (appends.length > 1) {
      appends[appends.length - 1].forEach(((v, i, a) => {
        const prevLiv = appends[appends.length - 2];
        var varEl = prevLiv[prevLiv.length - 1];
        codeArr.push("");
        codeArr.push(`${varEl}.appendChild(${v})`);
        codeArr.push("");
      }));
      appends.splice(appends.length - 1, 1);
    }
    // AGGIUNGO FILE(S) ESTERNI
    //codeArr.push('\n')
        var scriptLines = scriptCode.split("\n");
    scriptLines.forEach((v => {
      var temp = v.trim();
      temp = temp.split(" ");
      if (temp[0] == "import") {
        importArr.push(v);
      } else {
        codeArr.push(v);
      }
    }));
    // AGGIUNGO IL CSS CODE
        var cssLines = cssCode.split("\n");
    cssLines.forEach((v => {
      var temp = v.trim();
      temp = temp.split(" ");
      if (temp[0] == "import") {
        importArr.push(v);
      } else {
        codeArr.push(v);
      }
    }));
    // SCRIVO LE COSE DI CHIUSURA
        codeArr.push(`return ${firstElement}`);
    codeArr.push("}");
    // SALVO STAMPA... FINITO
        var outCode = "";
    importArr.forEach((v => {
      outCode += v + "\n";
    }));
    codeArr.forEach((v => {
      outCode += v + "\n";
    }));
    return outCode;
  };
  /*
        RESTITUISCE UNA FUNZIONE JS
    */  function getTokenType(t) {
    // t = string
    const sentinel = t.substr(0, 1);
    if (sentinel == ".") return "attr";
    if (sentinel == "-") return "style";
    if (sentinel == "'") return "text";
    if (sentinel == "\\") return "include";
    if (sentinel == "<") return "html";
    return "elem";
  }
  function isImport$1(t) {
    const sentinel = t.substr(0, 1);
    if (sentinel == "*") return true; else return false;
  }
  function countTabs(l) {
    const count = Math.floor(l.search(/\S|$/) / 4);
    return count;
  }
  function writeAttribute(tokens, arrOut, currentVarName, namespace) {
    var value = tokens[1];
    tokens.slice(2).forEach((v => {
      value = value + " " + v;
    }));
    if (tokens[0].substr(1, 2) == "on") {
      arrOut.push(`${currentVarName}${tokens[0]} = ${value}`);
    } else {
      arrOut.push(`${currentVarName}.setAttribute('${tokens[0].slice(1)}', '${value}')`);
    }
  }
  function writeText(tokens, arrOut, currentVarName, n) {
    //# t = tokens    f = fileOut   c = currentVarName    n = count
    // TRASFORMARE QUESTO CASO IN NODE ELEMENT!!!
    var value = tokens[0].slice(1);
 // considero la stringa senza '
        tokens.slice(1).forEach((v => {
      value = value + " " + v;
    }));
    arrOut.push(`var textNode_${n} = document.createTextNode('${value}')`);
    arrOut.push(`${currentVarName}.append(textNode_${n})`);
  }
  function writeStyle(tokens, arrOut, currentVarName) {
    var value = tokens[1];
    tokens.slice(2).forEach((v => {
      value = value + " " + v;
    }));
    arrOut.push(`${currentVarName}.style${tokens[0].replace("-", ".")}='${value}'`);
  }
  var parserJSFunction = function parse(fileName, textCode, scriptCode = "", cssCode = "") {
    const ns = {
      div: 0,
      svg: 1,
      circle: 1,
      rect: 1,
      path: 1,
      polygon: 1,
      polyline: 1,
      text: 1,
      g: 1
    };
    const nsName = {
      0: "",
      1: "http://www.w3.org/2000/svg"
    };
    var importArr = [];
    var codeArr = [];
    var Lines = textCode.split("\n");
    var count = 0;
    var currentVarName = "";
    var varName = "";
    var currentNS = "0";
    var appends = [];
    var currTabNum = 0;
    var prevTabNum = 0;
    var isFirstElement = true;
    var firstElement = "";
    Lines.forEach(((v, i, a) => {
      var tokens = v.trim().split(" ");
      if (tokens.length == 0 || tokens[0] == "") {
        return;
      }
      var leadToken = tokens[0];
      var tokenType = getTokenType(leadToken);
      currTabNum = countTabs(v);
      if (tokenType == "elem") {
        if (tokens.length == 1) {
          if (isImport$1(leadToken)) {
            varName = leadToken.slice(1) + "_" + count;
          } else {
            varName = leadToken + "_" + count;
          }
        } else if (tokens.length == 2 && getTokenType(tokens[1]) == "elem") {
          varName = tokens[1];
        } else if (tokens.length == 2 && getTokenType(tokens[1]) == "text") {
          if (isImport$1(leadToken)) {
            varName = leadToken.slice(1) + "_" + count;
          } else {
            varName = leadToken + "_" + count;
          }
        } else if (tokens.length >= 3 && getTokenType(tokens[1]) == "elem") {
          varName = tokens[1];
        } else if (tokens.length >= 3 && getTokenType(tokens[1]) == "text") {
          if (isImport$1(leadToken)) {
            varName = leadToken.slice(1) + "_" + count;
          } else {
            varName = leadToken + "_" + count;
          }
        }
        /*             } else if (tokens.length>=3 && getTokenType(tokens[1]=='text')) {
                    if(isImport(leadToken)){
                        varName = leadToken.slice(1) + "_" + count
                    } else {
                        varName = leadToken + "_" + count
                    }
                } else if (tokens.length==2 && getTokenType(tokens[1]!='text')) {
                    varName = tokens[1]
                } else {
                    varName = tokens[2]
                } */        if (isFirstElement) {
          isFirstElement = false;
          firstElement = varName;
          // SCRIVO LE COSE DI APERTURA
                    codeArr.push(`function ${fileName}() `);
 //export default function
                    codeArr.push("{");
        }
        currentVarName = varName;
        currentNS = ns[tokens[0]];
        if (isImport$1(leadToken)) {
          //importArr.push(`import ${varName}_ from './${leadToken.slice(1)}.js'`)
          //codeArr.push(`var ${varName} = ${varName}_()`)  
          codeArr.push(`var ${varName} = ${leadToken.slice(1)}()`);
        } else {
          if (currentNS == 0 || currentNS === undefined) {
            codeArr.push(`var ${varName} = document.createElement('${tokens[0]}')`);
            if (tokens.length == 2 && getTokenType(tokens[1]) == "text") {
              var valueString = "";
              tokens.slice(1).forEach((v => {
                valueString = valueString + " " + v;
              }));
              codeArr.push(`${varName}.append(document.createTextNode(${valueString}'))`);
            } else if (tokens.length > 2 && getTokenType(tokens[1]) == "text") {
              var valueString = "";
              tokens.slice(1).forEach((v => {
                valueString = valueString + " " + v;
              }));
              codeArr.push(`${varName}.append(document.createTextNode(${valueString}'))`);
            } else if (tokens.length > 2 && getTokenType(tokens[2]) == "text") {
              var valueString = "";
              tokens.slice(2).forEach((v => {
                valueString = valueString + " " + v;
              }));
              codeArr.push(`${varName}.append(document.createTextNode(${valueString}'))`);
            }
          } else {
            codeArr.push(`var ${varName} = document.createElementNS('${nsName[currentNS]}','${tokens[0]}')`);
            if (tokens.length == 2 && getTokenType(tokens[1]) == "text" || tokens.length == 3) {
              codeArr.push(`${varName}.append(document.createTextNode(${tokens[1]}'))`);
            }
          }
        }
        // APPENDS
                if (prevTabNum > currTabNum) {
          // SVUOTO LIVELLO
          const diff = prevTabNum - currTabNum;
          for (var i = 0; i < diff; i++) {
            appends[appends.length - 1].forEach(((v, i, a) => {
              const prevLiv = appends[appends.length - 2];
              var varEl = prevLiv[prevLiv.length - 1];
              codeArr.push("");
              codeArr.push(`${varEl}.appendChild(${v})`);
              codeArr.push("");
            }));
            appends.splice(appends.length - 1, 1);
          }
        }
        if (currTabNum > appends.length - 1) appends.push([]);
        appends[currTabNum].push(`${varName}`);
      }
      if (tokenType == "attr") writeAttribute(tokens, codeArr, currentVarName);
      if (tokenType == "text") writeText(tokens, codeArr, currentVarName, count);
      if (tokenType == "style") writeStyle(tokens, codeArr, currentVarName);
      if (tokenType == "html") codeArr.push(v);
      prevTabNum = currTabNum;
      count = count + 1;
    }));
    // SVUOTO FINAL
        while (appends.length > 1) {
      appends[appends.length - 1].forEach(((v, i, a) => {
        const prevLiv = appends[appends.length - 2];
        var varEl = prevLiv[prevLiv.length - 1];
        codeArr.push("");
        codeArr.push(`${varEl}.appendChild(${v})`);
        codeArr.push("");
      }));
      appends.splice(appends.length - 1, 1);
    }
    // AGGIUNGO FILE(S) ESTERNI
    //codeArr.push('\n')
        var scriptLines = scriptCode.split("\n");
    scriptLines.forEach((v => {
      var temp = v.trim();
      temp = temp.split(" ");
      if (temp[0] == "import") {
        importArr.push(v);
      } else {
        codeArr.push(v);
      }
    }));
    // AGGIUNGO IL CSS CODE
        var cssLines = cssCode.split("\n");
    cssLines.forEach((v => {
      var temp = v.trim();
      temp = temp.split(" ");
      if (temp[0] == "import") {
        importArr.push(v);
      } else {
        codeArr.push(v);
      }
    }));
    // SCRIVO LE COSE DI CHIUSURA
        codeArr.push(`return ${firstElement}`);
    codeArr.push("}");
    // SALVO STAMPA... FINITO
        var outCode = "";
    importArr.forEach((v => {
      outCode += v + "\n";
    }));
    codeArr.forEach((v => {
      outCode += v + "\n";
    }));
    return outCode;
  };
  /*
        RESTITUISCE una array di dependencies
    */  function isImport(t) {
    const sentinel = t.substr(0, 1);
    if (sentinel == "*") return true; else return false;
  }
  var getDependencies = function getDependencies(textCode) {
    var Lines = textCode.split("\n");
    var dependencies = [];
    Lines.forEach(((v, i, a) => {
      var tokens = v.trim().split(" ");
      if (tokens.length == 0 || tokens[0] == "") {
        return;
      }
      var leadToken = tokens[0];
      if (isImport(leadToken)) {
        dependencies.push(leadToken.slice(1));
      }
    }));
    return dependencies;
  };
  var uxLang = {
    parserForHtml: parserForHtml,
    parserJSFunction: parserJSFunction,
    getDependencies: getDependencies
  };
  return uxLang;
}));
