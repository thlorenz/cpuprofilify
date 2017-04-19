'use strict';

var dtraceConverterCtr      = require('./converter-dtrace')
  , perfConverterCtr        = require('./converter-perf')

var dtraceRegex = /^\S+ \d+ \d+: \S+:\s*$/
  , perfRegex = /^\S+\s+\d+(\s+\[\d+\])?\s+\d+\.\d+:(\s+\d+)? \S+:\s*$/

var go = module.exports = function getConverter(trace, traceStart, type) {
  if (type) {
    switch(type) {
      case 'perf'        : return perfConverterCtr;
      case 'dtrace'      : return dtraceConverterCtr;
      default            : throw new Error('Unknown input type : ' + type);
    }
  }

  var line = trace[traceStart];

  if (dtraceRegex.test(line)) return dtraceConverterCtr;
  if (perfRegex.test(line)) return perfConverterCtr;

  throw new Error('Unable to detect input type for \n"' + line + '"');
}
