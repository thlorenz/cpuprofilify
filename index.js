'use strict';

var filterInternals = require('./lib/filter-internals')
  , traceUtil       = require('./lib/trace-util')
  , getConverter    = require('./lib/get-converter')
  , xtend           = require('xtend')

module.exports = function cpuprofilify(trace, opts) {
  opts = opts || {};
  opts = xtend({ v8gc: true }, opts);

  var filtered = filterInternals(trace, opts);
  var traceStart = traceUtil.traceStart(filtered);
  var convert = getConverter(filtered, traceStart);

  return convert(filtered, traceStart);
}
