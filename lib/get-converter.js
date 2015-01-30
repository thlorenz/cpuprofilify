'use strict';

var dtraceConverter = require('./converter-dtrace')
  , perfConverter = require('./converter-perf')

var dtraceRegex = /^\S+ \d+ \d+: \S+:\s*$/
  , perfRegex = /^\S+ \d+ \d+\.\d+: \S+:\s*$/

var go = module.exports = function getConverter(trace, traceStart, type) {
  if (type) {
    switch(type) {
      case 'perf'   : return perfConverter;
      case 'dtrace' : return dtraceConverter;
      default       : throw new Error('Unknown input type : ' + type);
    }
  }

  var line = trace[traceStart];

  if (dtraceRegex.test(line)) return dtraceConverter; 
  if (perfRegex.test(line)) return perfConverter; 

  throw new Error('Unable to detect input type for \n"' + line + '"');
}
