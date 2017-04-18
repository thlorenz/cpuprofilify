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
  var parts = line.split(/\s+/);

  if (!isStart) { 
    this._endTime = (parts[2] && parts[2].slice(0, -1)) || '0';
    return;
  }
  if (this._startTime && this._process && this._pid && this._type) return;

  this._startTime = (parts[2] && parts[2].slice(0, -1)) || '0.0'; 

  this._process = parts[0];
  this._pid     = parts[1];
  this._type    = parts[3] || '';
}

proto._normalizeFrame = function _normalizeFrame(frame) {
  return this.removeOptimizationInfo(
    frame 
      .trim()
      .replace(this._frameAddressRegex, '')
      .replace(this._frameProcessRegex, '')
      .replace(this._frameJSAddressRegex, '')
  )
}

proto._adjustTime = function _adjustTime(t) {
  var s = t.toString();
  // 0 is a special case
  if (s.length < 5) return s;
  return s.slice(0, -3) + '.' + s.slice(4);
}

// Custom properties
proto._frameAddressRegex   = /\+0x[0-9a-fA-F]+$/
proto._frameJSAddressRegex = /0x[0-9a-fA-F]+( LazyCompile:| Function:| Script:){0,1}/
proto.type  = 'dtrace';

exports       = module.exports   = DTraceConverter;
exports.ctor  = DTraceConverter;
exports.proto = proto;
