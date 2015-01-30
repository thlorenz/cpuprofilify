'use strict';

var inherits  = require('inherits')
  , Converter = require('./converter')

function DTraceConverter(trace, traceStart, opts) {
  if (!(this instanceof DTraceConverter)) return new DTraceConverter(trace, traceStart, opts);
  Converter.call(this, trace, traceStart, opts);

  this._frameProcessRegex = new RegExp('^(' + this._process + '|node)`')
}

inherits(DTraceConverter, Converter);
var proto = DTraceConverter.prototype;

proto._framePartsRegex = /(.+?) (.+?):(\d+)$/;

// Overrides
proto._parseFrame = function _parseFrame(frame) {
  var m = frame.match(this._framePartsRegex);
  if (!m) return { 
        functionName  : frame
      , url           : ''
      , lineNumber    : 0
      , scriptId      : 0
    }

  var functionName = m[1]
    , script       = m[2]
    , lineNumber   = m[3]
  
  var scriptId = this._scriptIds[script];
  if (!scriptId) { 
    scriptId = this._scriptId++;
    this._scriptIds[script] = scriptId;
  }

  if (/^[~*]\s*$/.test(functionName)) functionName += ' <anonymous>';
  return {
      functionName : functionName
    , lineNumber   : lineNumber
    , url          : script
    , scriptId     : scriptId
  }
}

proto._parseTraceInfo = function _parseTraceInfo(line, isStart) {
  var parts = line.split(' ');

  if (!isStart) { 
    this._endTime = parts[2] || 0;
    return;
  }

  this._startTime = parts[2] || 0; 

  this._process = parts[0];
  this._pid     = parts[1];
  this._type    = parts[3] || '';
}

proto._normalizeFrame = function _normalizeFrame(frame) {
  return frame 
    .trim()
    .replace(this._frameAddressRegex, '')
    .replace(this._frameProcessRegex, '')
    .replace(this._frameJSAddressRegex, '')
}

proto._adjustTime = function _adjustTime(t) {
  return parseInt(t.toString().slice(0, -4))
}

// Custom properties
proto._frameAddressRegex   = /\+0x[0-9a-fA-F]+$/
proto._frameJSAddressRegex = /0x[0-9a-fA-F]+( LazyCompile:| Function:){0,1}/

exports = module.exports = function convert(trace, traceStart, opts) {
  return new DTraceConverter(trace, traceStart, opts).convert();
}
exports.ctor  = DTraceConverter;
exports.proto = proto;

// Test
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

if (!module.parent && typeof window === 'undefined') {
  var fs              = require('fs')
    , filterInternals = require('./filter-internals')
    , traceUtil       = require('./trace-util')

  var trace = fs.readFileSync(__dirname + '/../test/fixtures/dtrace.resolved.stack', 'utf8').split('\n');
  var traceStart = traceUtil.traceStart(trace);
  trace = filterInternals(trace, { v8gc: true });
  // fs.writeFileSync(__dirname + '/../stack.filtered.txt', trace.join('\n'), 'utf8');
  var result = module.exports(trace, traceStart);
  fs.writeFileSync('/tmp/cpu-dtrace.cpuprofile', JSON.stringify(result, null, 2));
}
