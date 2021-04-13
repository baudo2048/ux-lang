const parserForHtml = require('./parsers/parserForHtml')
const parserJSFunction = require('./parsers/parserJSFunction')
const getDependencies = require('./parsers/getDependencies')

module.exports = {
    "parserForHtml": parserForHtml,
    "parserJSFunction": parserJSFunction,
    "getDependencies": getDependencies
}