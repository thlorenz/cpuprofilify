'use strict';

exports.normalizeEmptyLines = function normalizeEmptyLines(trace) {
  // need *exactly* ONE empty line after last stack
  var l = trace.length - 1;
  while(l > 0 && trace[l].trim() === '') l--;
  trace.length = l + 2;
  trace[l + 1] = '';
  return trace;
}

exports.traceStart = function traceStart(lines) {
  for (var i = 0; i < lines.length; i++) {
    // ignore empty lines and comments starting with #
    if (lines[i] && lines[i].length && lines[i][0] !== '#') return i;
  }
}
