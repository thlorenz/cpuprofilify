'use strict';

var filterInternals = require('./lib/filter-internals')
  , traceUtil       = require('./lib/trace-util')
  , getConverter    = require('./lib/get-converter')
  , resolveSymbols  = require('./lib/resolve-symbols')
  , xtend           = require('xtend')
  , inherits        = require('inherits')
  , EventEmitter    = require('events').EventEmitter

/**
 * Creates new CpuProfilifier
 * 
 * @name CpuProfilifier
 * @function
 */
function CpuProfilifier() {
  if (!(this instanceof CpuProfilifier)) return new CpuProfilifier();
  EventEmitter.call(this);
}

inherits(CpuProfilifier, EventEmitter);

var proto = CpuProfilifier.prototype;
module.exports = CpuProfilifier;

proto.convert = 

/**
 * Converts the given trace taking according to the given opts.
 *
 * ```
 * var cpuprofilifier = require('cpuprofilifier');
 * var cpuprofile = cpuprofilifier().convert(trace);
 * fs.writeFileSync('/tmp/my.cpuprofile', JSON.stringify(cpuprofile));
 * ```
 *
 * @name CpuProfilifier::convert
 * @function
 * @param {Array.<String>} trace a trace generated via `perf script` or the `profile_1ms.d` DTrace script
 * @param {Object=} opts 
 * @param {Boolean} opts.shortStack stacks that have only one line are ignored unless this flag is set
 * @param {Boolean} opts.unresolveds unresolved addresses like `0x1a23c` are filtered from the trace unless this flag is set (default: false)
 * @param {Boolean} opts.sysinternals sysinternals like `__lib_c_start...` are filtered from the trace unless this flag is set (default: false)
 * @param {Boolean} opts.v8internals v8internals like `v8::internal::...` are filtered from the trace unless this flag is set (default: false)
 * @param {Boolean} opts.v8gc        when v8internals are filtered, garbage collection info is as well unless this flag set  (default: true)
 * @return {Object} an cpuprofile presentation of the given trace
 */
function convert(trace, opts) {
  opts = opts || {};
  this._opts = xtend({ v8gc: true }, opts);
  this.emit('info', 'Options: %j', this._opts);

  this._trace = trace;
  this._traceLen = trace.length;

  if (!this._traceLen) {
    this.emit('warn', 'Trace was empty, quitting');
    return;
  }

  try { 
    this._traceStart = traceUtil.traceStart(this._trace);

    this._converterCtr = getConverter(this._trace, this._traceStart, this._opts.type);
    
    this._resolveTraceInfo();
    this._tryResolveSymbols();
    this._filterInternals();

    var converter = this._converterCtr(this._filtered, this._traceStart, this._opts);

    this.emit('info', 'Converting trace of length %d', this._filteredLen);
    return converter.convert();
  } catch (err) {
    this.emit('error', err);
  }
}

proto._tryResolveSymbols = function _tryResolveSymbols() {
  var res = resolveSymbols(this.traceInfo.pid, this._trace);
  if (res.resolved) { 
    this.emit('info', 'Resolved symbols in trace.');
    this._trace = res.resolved;
    return;
  }

  this.emit('warn', res.reason);
}

proto._resolveTraceInfo = function _resolveTraceInfo() {
  var converter = this._converterCtr(this._trace, this._traceStart, this._opts);
  converter._parseTraceInfo(this._trace[this._traceStart], true);

  this.traceInfo = { 
      process   : converter._process
    , pid       : converter._pid
    , startTime : converter._startTime
    , type      : converter._type
  }

  this.emit('info', 'Trace info: %j', this.traceInfo)
}

proto._filterInternals = function _filterInternals() {
  this._filtered = filterInternals(this._trace, this._opts);
  this._filteredLen = this._filtered.length;

  this.emit('info', 'Filtered %d internals from given trace', this._traceLen - this._filteredLen);
}
