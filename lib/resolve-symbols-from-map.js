'use strict';

var resolveJITSymbols = require('resolve-jit-symbols');

module.exports = function resolveSymbolsFromMap(map, trace) {
  var resolver = resolveJITSymbols(map)
    , resolved = resolver.resolveMulti(trace);
  
  return { resolved: resolved };
}
