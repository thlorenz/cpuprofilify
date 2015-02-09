'use strict';

var cpuprofile  = require('./cpuprofile')
  , traceUtil   = require('./trace-util')
  , roi         = require('./remove-optimization-info')
  , Converter   = require('./converter').proto
  , headerRegex = /^Running Time, *Self,.*, *Symbol Name/

/*
 * Totally different from the other converters since the data is a callgraph.
 * The depth is indicated by the indentation.
 * No timeline can be extraced since only the aggregated "Running Time" of each function is shown.
 * We translate the ms to hitCounts assuming that sample rate was 1ms.
 */
function InstrumentsConverter(trace, traceStart, opts) {
  if (!(this instanceof InstrumentsConverter)) return new InstrumentsConverter(trace, traceStart, opts);

  this._trace = traceUtil.normalizeEmptyLines(trace);
  this._traceStart = traceStart;
  if (headerRegex.test(this._trace[this._traceStart])) this._traceStart++;
  
  this._scriptId = 0;
  this._scriptIds = {};
  this._samples = [];

  this._stack = [];
  this._id = 0;

  this._process = 'unknown';
  this._pid     = 0;
  this._startTime = 0;
  this._type    = 'instruments';
  this._samples = [];

  this._optimizationinfo = opts.optimizationinfo;

  this._head = cpuprofile.createHead(this._process, this._id++); 
}

var proto = InstrumentsConverter.prototype;
proto._regex = /(\d+)\.\d+ms[^,]+,\d+,\s+,(\s*)(.+)/;
  
proto.findOrCreateNode = function findOrCreateNode(parent, nextId, stackFrame) {
  var child;
  for (var i = 0; i < parent.children.length; i++) {
    child = parent.children[i]  
    if (child._stackFrame === stackFrame) { 
      return child;
    }
  }

  var node = cpuprofile
    .createNode(nextId, stackFrame, { functionName: this.adjustFunctionName(stackFrame) });
  parent.children.push(node);
  return node;
}

proto._parseTraceInfo = function _parseTraceInfo() { /* no trace info inside an Instruments callgraph */ }

proto._processLine = function _processLine(line) {
  var parent = this._head, stackFrame;
  var matches = line.match(this._regex);
  if (!matches || !matches.length) return;

  var ms    = matches[1];
  var depth = matches[2].length;

  var fn    = matches[3];
  this._stack[depth] = fn;

  for (var i = 0; i < depth; i++) { 
    stackFrame = this._stack[i];
    // ignore empty frames which occur due to internals filtering
    if (stackFrame) {
      parent = this.findOrCreateNode(
          parent
        , this._id
        , this._stack[i] 
      );
      this._id = Math.max(parent.id + 1, this._id);
    }
  }

  parent.hitCount = parseInt(ms);
  for (var j = 0; j < ms; j++) this._samples.push(parent.id);
}

proto.objectifyTrace = function objectifyTrace() {
  for (var i = this._traceStart; i < this._trace.length; i++)
    this._processLine(this._trace[i]);

  return this;
}

proto.convert = function convert() {
  return this.objectifyTrace().cpuprofile();
}

proto.adjustFunctionName = function adjustFunctionName(name) {
  return this._optimizationinfo ? name : roi(name);
}

proto.cpuprofile = function cpuprofile() {
  return { 
      typeId    : 'CPU ' + this._type
    , uid       : 1
    , title     : this._process + ' - ' + this._type
    , head      : this._head
    , startTime : this._startTime
    , endTime   : 5
    , samples   : this._samples
  }
}

proto.type  = 'instruments';

exports       = module.exports   = InstrumentsConverter;
exports.ctor  = InstrumentsConverter;
exports.proto = proto;
