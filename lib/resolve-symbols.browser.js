'use strict';

// no op function since we cannot resolve symbols in the browser (no access to .map file
module.exports = function resolveSymbols(pid, trace) { return trace; }
