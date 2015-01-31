'use strict';
var select = require('JSONSelect')
  , cpuprofilify = require('../../')()

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

module.exports = function check(t, stack, convertOpts, opts) {
  var res = cpuprofilify.convert(stack, convertOpts);

  var hits   =  select.match('.hitCount:expr(x=1)', res)
    , nohits =  select.match('.hitCount:expr(x=0)', res)
    , fns    =  select.match('.functionName', res)
    , id     =  select.match('.hitCount:expr(x=1) ~.id', res)
    , fn     =  select.match('.hitCount:expr(x=1) ~.functionName', res)
    , url    =  select.match('.hitCount:expr(x=1) ~.url', res)

  if (!opts) {
    inspect({
        fns  : fns.length
      , hits : hits.length
      , id   : id[0]
      , fn   : fn[0]
      , url  : url[0]
      , names : fns
    })
    return t.end()
  }

  t.equal(fns.length, opts.fns, 'have a total of ' + opts.fns + ' functions')
  t.deepEqual(hits, [ opts.hits ], 'one node has hitcount of ' + opts.hits)
  t.equal(nohits.length, fns.length - 1, 'all other functions have no hits')
  t.deepEqual(id, [ opts.id ], 'id of function with hit is ' + opts.id)
  t.deepEqual(res.samples, id, 'samples contain only function id')

  t.deepEqual(fn, [ opts.fn ], 'function name is top of stack not filtered function cleaned up')
  t.deepEqual(url, [ opts.url ], 'url is top of stack url')

  t.deepEqual(fns, opts.names, 'all function names where cleaned up correctly')

  t.end()
}

