const parserForHtml = require('./parsers/parserForHtml')
const parserHtmlToUx = require('./parsers/parserHtmlToUx')
const parserJSFunction = require('./parsers/parserJSFunction')
const getDependencies = require('./parsers/getDependencies')

module.exports = {
    "parserForHtml": parserForHtml,
    "parserHtmlToUx": parserHtmlToUx,
    "parserJSFunction": parserJSFunction,
    "getDependencies": getDependencies
}