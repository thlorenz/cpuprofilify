'use strict';

var regex = /^\W*[*~]/
  // replacement indicates that this was either ~ or * and also doesn't
  // break tools that look for ~ to identify JS
  , replacement = '~*'

var go = module.exports = function removeOptimizationInfo(functionName) {
  return functionName.replace(regex, replacement);    
}
