'use strict';

var v8internalsRegex = new RegExp(
    'node::Start\\(|node`(?:start\\+)?0x[0-9A-Fa-f]+'                                // node startup
  + '|v8::internal::|v8::Function::Call|v8::Function::NewInstance'                   // v8 internal C++
  + '|Builtin:|Stub:|StoreIC:|LoadIC:|LoadPolymorphicIC:|KeyedLoadIC:'               // v8 generated boilerplate
  + '|<Unknown Address>|_platform_\\w+\\$VARIANT\\$|DYLD-STUB\\$|_os_lock_spin_lock' // unknown and lower level things
  + '|\\(root'
);

var sysinternalsRegex = /^\W+dyld|__libc_start/;

var unresolvedsRegex = /^\W*0x[0-9A-Fa-f]+\W*$/ // lonely unresolved hex address
var v8gcRegex = /v8::internal::Heap::Scavenge/ 

module.exports = function filterInternals(lines, opts) {
  var unresolveds  = opts.unresolveds
    , sysinternals = opts.sysinternals
    , v8internals  = opts.v8internals
    , v8gc         = opts.v8gc

  function notInternal(l) {
    if (v8gc && v8gcRegex.test(l)) return true;
    return (unresolveds   || !unresolvedsRegex.test(l)) 
        && (sysinternals  || !sysinternalsRegex.test(l))
        && (v8internals   || !v8internalsRegex.test(l))
  }

  return lines.filter(notInternal);
}
