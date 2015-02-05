'use strict';

var dtraceConverterCtr      = require('./converter-dtrace')
  , perfConverterCtr        = require('./converter-perf')
  , instrumentsConverterCtr = require('./converter-instruments')

var dtraceRegex = /^\S+ \d+ \d+: \S+:\s*$/
  , perfRegex = /^\S+ \d+ \d+\.\d+: \S+:\s*$/
  , instrumentsRegex = /^Running Time, *Self,.*, *Symbol Name/

var go = module.exports = function getConverter(trace, traceStart, type) {
  if (type) {
    switch(type) {
      case 'perf'        : return perfConverterCtr;
      case 'dtrace'      : return dtraceConverterCtr;
      case 'instruments' : return instrumentsConverterCtr;
      default            : throw new Error('Unknown input type : ' + type);
    }
  }

  var line = trace[traceStart];

  if (dtraceRegex.test(line)) return dtraceConverterCtr;
  if (perfRegex.test(line)) return perfConverterCtr; 
  if (instrumentsRegex.test(line)) return instrumentsConverterCtr; 

  throw new Error('Unable to detect input type for \n"' + line + '"');
}
