'use strict';

var cpuprofile = require('./cpuprofile')
  , traceUtil  = require('./trace-util')

function Converter(trace, traceStart, opts) {
  if (!(this instanceof Converter)) return new Converter(trace, traceStart, opts);
  opts = opts || {};

  this._trace = traceUtil.normalizeEmptyLines(trace);
  this._traceStart = traceStart;

  this._id = 0;
  this._scriptId = 0;
  this._scriptIds = {};

  this._process   = undefined;
  this._pid       = undefined;
  this._type      = undefined;
  this._startTime = undefined;
  this._endTime   = undefined;

  this._parseTraceInfo(trace[this._traceStart], true);

  this._head = cpuprofile.createHead(this._process, this._scriptId++); 
  this._samples = [];

  this._shortStacks = opts.shortStacks;
}

var proto = Converter.prototype;
module.exports = Converter;

// Overrides
proto._parseFrame = function _parseFrame(frame) { 
  throw new Error('Need to implement _parseFrame.');
}

proto._parseTraceInfo = function _parseTraceInfo(frame) { 
  throw new Error('Need to implement _parseTraceInfo.');
}

proto._normalizeFrame = function _normalizeFrame(frame) { 
  throw new Error('Need to implement _normalizeFrame.');
}

proto._adjustTime = function _adjustTime(frame) { 
  throw new Error('Need to implement _adjustTime.');
}

// Base methods
proto.findOrCreateNode = function findOrCreateNode(parent, nextId, stackFrame) {
  var child;
  for (var i = 0; i < parent.children.length; i++) {
    child = parent.children[i]  
    if (child._stackFrame === stackFrame) { 
      return child;
    }
  }

  var opts = this._parseFrame(stackFrame);

  var node = cpuprofile.createNode(nextId, stackFrame, opts);
  parent.children.push(node);
  return node;
}

proto.objectifyStack = function objectifyStack(stackStart, stackEnd) {
  var parent = this._head, frame;
  // cpuprofiler children are in parent->child order while stacks have parents below children
  for (var i = stackEnd; i >= stackStart; i--) {
    frame = this._normalizeFrame(this._trace[i]);
    // remove frames whose description became empty after all the cleaning up
    if (!frame.length) continue;

    parent = this.findOrCreateNode(parent, this._id, frame);
    this._id = Math.max(parent.id + 1, this._id);
  }

  parent.hitCount++;
  this._samples.push(parent.id);
}

proto.objectifyTrace = function objectifyTrace() {
  var stackStart = 0, insideStack = false, line, nextLine, nextNextLine, lastTraceInfo;

  for (var i = this._traceStart; i < this._trace.length; i++) {
    line = this._trace[i];
    // right above a new stack, i.e: iojs 49959 140951795: profile-1ms:
    if (!insideStack && line.length && line.charAt(0) !== ' ') {

      // a stack may be entirely empty due to previous filtering of internals
      nextLine = this._trace[i + 1];
      if (!nextLine || !nextLine.length) continue;

      // skip stacks that have only one frame unless we want to keep those
      if (!this._shortStacks) {
        nextNextLine = this._trace[i + 2];
        if (!nextNextLine || !nextNextLine.length) continue;
      }

      lastTraceInfo = line; 

      stackStart = i + 1;
      insideStack = true;
    } 

    if (insideStack && !line.length) {
      this.objectifyStack(stackStart, i - 1);
      insideStack = false;
    }
  }

  // last stack had end time since it was the last tick
  this._parseTraceInfo(lastTraceInfo, false);
  return this;
}

proto.cpuprofile = function cpuprofile() {
  return { 
      typeId    : 'CPU ' + this._type
    , uid       : 1
    , title     : this._process + ' - ' + this._type
    , head      : this._head
    , startTime : this._adjustTime(this._startTime)
    , endTime   : this._adjustTime(this._endTime)
    , samples   : this._samples
  }
}

proto.convert = function convert() {
  return this.objectifyTrace().cpuprofile();
}
