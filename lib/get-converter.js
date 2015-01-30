'use strict';

var dtraceConverter = require('./converter-dtrace')
  , perfConverter = require('./converter-perf')

var go = module.exports = function getConverter(trace, traceStart) {
  // TODO: match regex on first line
  return dtraceConverter; 
}
