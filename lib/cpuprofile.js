'use strict';

exports.createHead = function createHead(execname, id) {
  return {
      functionName  : execname        
    , url           : ''
    , lineNumber    : 0
    , callUiD       : 0   // todo: what is this and do we need it?
    , bailoutReason : ''
    , id            : id 
    , scriptId      : 0
    , hitCount      : 0
    , children      : []
  }
}

exports.createNode = function createNode(id, stackFrame, opts) {
  return {
      functionName  : opts.functionName
    , url           : opts.url           || ''
    , lineNumber    : opts.lineNumber    || 0
    , bailoutReason : opts.bailoutReason || ''
    , id            : id
    , scriptId      : opts.scriptId      || 0
    , hitCount      : 0
    , children      : []
    , _stackFrame   : stackFrame
  }
}
