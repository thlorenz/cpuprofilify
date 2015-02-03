'use strict';

var path                  = require('path')
  , fs                    = require('fs')
  , resolveSymbolsFromMap = require('./resolve-symbols-from-map')
  , mapFilesDir           = '/tmp'

// only used on command line, so sync ops are ok
exports = module.exports = 
  
/**
 * Tries to find a `perf-<pid>.map` file for the given `pid` in the `/tmp` dir.
 * If found it will use it's symbol information in order to resolve symbols in the given trace.
 * 
 * @name resolveSymbols
 * @function
 * @private
 * @param {Number} pid the pid of the process that was traced
 * @param {Array<String>} trace the trace generated for the process
 * @return {Object} { resolved: set if trace was resolved, reason: a message indicating why it wasn't resolved (if so) }
 */
function resolveSymbols(pid, trace) {
  var file = path.join(mapFilesDir, 'perf-' + pid + '.map');

  if (!fs.existsSync(file))
    return { 
        resolved: false
      , reason: 'Could not find "' + file + '". Did you run your process with --perf-basic-prof flag?'
    }

  var stats = fs.statSync(file)
  if (!stats.size)
    return { 
        resolved: false
      , reason: 
          'File "' + file + '" did you properly shut down your process?.\n'
        + 'Try either of the following to ensure the perf-<pid>.map file gets flushes:\n'
        + '  - Handle SIGTERM: https://github.com/thlorenz/talks/blob/gh-pages/jit/slides.md#handle-sigterm\n'
        + '  - Patch v8 and rebuild io.js: https://github.com/thlorenz/talks/blob/gh-pages/jit/slides.md#apply-v8-patch'
    }
  
  var map = fs.readFileSync(file, 'utf8');
  return resolveSymbolsFromMap(map, trace);
}
