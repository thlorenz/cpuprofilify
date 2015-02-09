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

proto._frameRegex = /^\w+\s+(?:LazyCompile:|Function:|Script:){0,1}(.+?)\W\(\S+\)$/;
proto._framePartsRegex = /^(.+?)([\S\.]+):(\d+)$/;

// Overrides
proto._parseFrame = function _parseFrame(frame) {
  return DTraceConverter._parseFrame.call(this, frame);
}

proto._parseTraceInfo = function _parseTraceInfo(line, isStart) {
  DTraceConverter._parseTraceInfo.call(this, line, isStart);
}

proto._normalizeFrame = function _normalizeFrame(frame) {
  return this.removeOptimizationInfo(
    frame 
      .trim()
      .replace(this._frameRegex, '$1')
    )
}

proto._adjustTime = function _adjustTime(t) {
  return parseInt(t.toString().slice(0, -4))
}

proto.type  = 'perf';

exports = module.exports = PerfConverter;
exports.ctor  = PerfConverter;
exports.proto = proto;
