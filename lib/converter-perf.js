'use strict';

var inherits  = require('inherits')
  , Converter = require('./converter')
  , DTraceConverter = require('./converter-dtrace').proto

function PerfConverter(trace, traceStart, opts) {
  if (!(this instanceof PerfConverter)) return new PerfConverter(trace, traceStart, opts);
  Converter.call(this, trace, traceStart, opts);
}

inherits(PerfConverter, Converter);
var proto = PerfConverter.prototype;

proto._frameRegex = /^\w+\s+(?:LazyCompile:|Function:){0,1}(.+?)\W\(\S+\)$/;
proto._framePartsRegex = /^(.+?)([\S\.]+):(\d+)$/;

// Overrides
proto._parseFrame = function _parseFrame(frame) {
  return DTraceConverter._parseFrame.call(this, frame);
}

proto._parseTraceInfo = function _parseTraceInfo(line, isStart) {
  DTraceConverter._parseTraceInfo.call(this, line, isStart);
}

proto._normalizeFrame = function _normalizeFrame(frame) {
  return frame 
    .trim()
    .replace(this._frameRegex, '$1')
}

proto._adjustTime = function _adjustTime(t) {
  return parseInt(t.toString().slice(0, -4))
}

// Custom properties
module.exports = function convertPerf(trace, traceStart, opts) {
  return new PerfConverter(trace, traceStart, opts).convert();
}


// Test
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

if (!module.parent && typeof window === 'undefined') {
  var fs = require('fs')
    , filterInternals = require('./filter-internals')
    , traceUtil = require('./trace-util')

  var trace = fs.readFileSync(__dirname + '/../test/fixtures/perf-script.txt', 'utf8').split('\n');
  var traceStart = traceUtil.traceStart(trace);
  trace = filterInternals(trace, { v8gc: true });

  // fs.writeFileSync(__dirname + '/../stack.filtered.txt', trace.join('\n'), 'utf8');
  var result = module.exports(trace, traceStart);
  fs.writeFileSync('/tmp/cpu-perf.cpuprofile', JSON.stringify(result, null, 2));
}
