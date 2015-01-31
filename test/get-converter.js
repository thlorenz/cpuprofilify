'use strict';

var test = require('tape')
  , getConverter = require('../lib/get-converter')

test('\ngiven a perf stack info line', function (t) {
  var fn = getConverter([ 'node 22610 13108.211038: cpu-clock:u: '], 0);
  t.equal(fn.name, 'PerfConverter', 'returns perf converter')
  t.equal(fn.proto.type, 'perf', 'type is perf')
  t.end()
})

test('\ngiven a dtrace stack info line', function (t) {
  var fn = getConverter([ 'iojs 86454 181016967: profile-1ms:'], 0);
  t.equal(fn.name, 'DTraceConverter', 'returns dtrace converter')
  t.equal(fn.proto.type, 'dtrace', 'type is dtrace')
  t.end()
})

test('\ngiven any string and overriding type to be perf', function (t) {
  var fn = getConverter([ 'not even valid' ], 0, 'perf');
  t.equal(fn.name, 'PerfConverter', 'returns perf converter')
  t.equal(fn.proto.type, 'perf', 'type is perf')
  t.end()
})
