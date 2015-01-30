'use strict';

var test = require('tape')
  , check = require('./util/check-conversion')

var stack1 = [
    'node 22610 13108.249784: cpu-clock:u: '
  , '	    7f8f7ab2e910 strlen (/lib/x86_64-linux-gnu/libc-2.19.so)'
  , '	          8b0757 v8::internal::Logger::CodeCreateEvent(v8::internal::Logger::LogEventsAndTags, v8::internal::Code*, v8::internal::Name*) (/usr/local/bin/node)'
  , '	          9bdbde v8::internal::BaseLoadStoreStubCompiler::GetCode(v8::internal::Code::Kind, v8::internal::Code::StubType, v8::internal::Handle<v8::internal::Name>) (/usr/local/bin/node)'
  , '	          a4f7ea v8::internal::LoadStubCompiler::CompileLoadGlobal(v8::internal::Handle<v8::internal::TypeImpl<v8::internal::HeapTypeConfig> >, v8::internal::Handle<v8::internal::GlobalObject>, v8::internal::Handle<v8::internal::PropertyCell>, v8::internal::Handle<v8::internal::Name>, bool) (/usr/local/bin/node)'
  , '	          867de2 v8::internal::LoadIC::CompileHandler(v8::internal::LookupResult*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::String>, v8::internal::Handle<v8::internal::Object>, v8::internal::InlineCacheHolderFlag) (/usr/local/bin/node)'
  , '	          8679ae v8::internal::IC::ComputeHandler(v8::internal::LookupResult*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::String>, v8::internal::Handle<v8::internal::Object>) (/usr/local/bin/node)'
  , '	          866bdb v8::internal::LoadIC::UpdateCaches(v8::internal::LookupResult*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::String>) (/usr/local/bin/node)'
  , '	          866982 v8::internal::LoadIC::Load(v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::String>) (/usr/local/bin/node)'
  , '	          86b638 v8::internal::LoadIC_Miss(int, v8::internal::Object**, v8::internal::Isolate*) (/usr/local/bin/node)'
  , '	    1bab88b060a2 Stub:CEntryStub (/tmp/perf-22610.map)'
  , '	    1bab88b3e05f LazyCompile:~SetUpError.a native messages.js:837 (/tmp/perf-22610.map)'
  , '	    1bab88b3ddfa LazyCompile:~SetUpError native messages.js:836 (/tmp/perf-22610.map)'
  , '	    1bab88b3d410 Script:~native messages.js (/tmp/perf-22610.map)'
  , '	    1bab88b1ef60 Builtin:JSEntryTrampoline (/tmp/perf-22610.map)'
  , '	    1bab88b1dd50 Stub:JSEntryStub (/tmp/perf-22610.map)'
  , '	          78c65d v8::internal::Invoke(bool, v8::internal::Handle<v8::internal::JSFunction>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*) (/usr/local/bin/node)'
  , '	          72a466 v8::internal::Genesis::CompileScriptCached(v8::internal::Isolate*, v8::internal::Vector<char const>, v8::internal::Handle<v8::internal::String>, v8::internal::SourceCodeCache*, v8::Extension*, v8::internal::Handle<v8::internal::Context>, bool) (/usr/local/bin/node)'
  , '	          72a16a v8::internal::Genesis::CompileNative(v8::internal::Isolate*, v8::internal::Vector<char const>, v8::internal::Handle<v8::internal::String>) (/usr/local/bin/node)'
  , '	          72ea0c v8::internal::Genesis::InstallNatives() (/usr/local/bin/node)'
  , '	          7327fc v8::internal::Genesis::Genesis(v8::internal::Isolate*, v8::internal::Handle<v8::internal::Object>, v8::Handle<v8::ObjectTemplate>, v8::ExtensionConfiguration*) (/usr/local/bin/node)'
  , '	          721a2d v8::internal::Bootstrapper::CreateEnvironment(v8::internal::Handle<v8::internal::Object>, v8::Handle<v8::ObjectTemplate>, v8::ExtensionConfiguration*) (/usr/local/bin/node)'
  , '	          704354 v8::Context::New(v8::Isolate*, v8::ExtensionConfiguration*, v8::Handle<v8::ObjectTemplate>, v8::Handle<v8::Value>) (/usr/local/bin/node)'
  , '	          a5e6a7 node::Start(int, char**) (/usr/local/bin/node)'
  , '	    7f8f7aac6ec5 __libc_start_main (/lib/x86_64-linux-gnu/libc-2.19.so)'
];

test('\nwhen converting a perf stack containing C++ and resolved JavaScript with the default settings', function (t) {
  var opts = { 
    fns   : 6,
    hits  : 1,
    id    : 4,
    fn    : 'strlen',
    url   : '',
    names :
    [ 'node',
      'v8::Context::New(v8::Isolate*, v8::ExtensionConfiguration*, v8::Handle<v8::ObjectTemplate>, v8::Handle<v8::Value>)',
      'Script:~native messages.js',
      '~SetUpError native ',
      '~SetUpError.a native ',
      'strlen' ] }

  check(t, stack1, null, opts)
})

test('\nwhen converting a perf stack containing C++ and resolved JavaScript keeping v8internals', function (t) {
  var opts = { 
    fns   : 24,
    hits  : 1,
    id    : 22,
    fn    : 'strlen',
    url   : '',
    names :
    [ 'node',
      'node::Start(int, char**)',
      'v8::Context::New(v8::Isolate*, v8::ExtensionConfiguration*, v8::Handle<v8::ObjectTemplate>, v8::Handle<v8::Value>)',
      'v8::internal::Bootstrapper::CreateEnvironment(v8::internal::Handle<v8::internal::Object>, v8::Handle<v8::ObjectTemplate>, v8::ExtensionConfiguration*)',
      'v8::internal::Genesis::Genesis(v8::internal::Isolate*, v8::internal::Handle<v8::internal::Object>, v8::Handle<v8::ObjectTemplate>, v8::ExtensionConfiguration*)',
      'v8::internal::Genesis::InstallNatives()',
      'v8::internal::Genesis::CompileNative(v8::internal::Isolate*, v8::internal::Vector<char const>, v8::internal::Handle<v8::internal::String>)',
      'v8::internal::Genesis::CompileScriptCached(v8::internal::Isolate*, v8::internal::Vector<char const>, v8::internal::Handle<v8::internal::String>, v8::internal::SourceCodeCache*, v8::Extension*, v8::internal::Handle<v8::internal::Context>, bool)',
      'v8::internal::Invoke(bool, v8::internal::Handle<v8::internal::JSFunction>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*)',
      'Stub:JSEntryStub',
      'Builtin:JSEntryTrampoline',
      'Script:~native messages.js',
      '~SetUpError native ',
      '~SetUpError.a native ',
      'Stub:CEntryStub',
      'v8::internal::LoadIC_Miss(int, v8::internal::Object**, v8::internal::Isolate*)',
      'v8::internal::LoadIC::Load(v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::String>)',
      'v8::internal::LoadIC::UpdateCaches(v8::internal::LookupResult*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::String>)',
      'v8::internal::IC::ComputeHandler(v8::internal::LookupResult*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::String>, v8::internal::Handle<v8::internal::Object>)',
      'v8::internal::LoadIC::CompileHandler(v8::internal::LookupResult*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::String>, v8::internal::Handle<v8::internal::Object>, v8::internal::InlineCacheHolderFlag)',
      'v8::internal::LoadStubCompiler::CompileLoadGlobal(v8::internal::Handle<v8::internal::TypeImpl<v8::internal::HeapTypeConfig> >, v8::internal::Handle<v8::internal::GlobalObject>, v8::internal::Handle<v8::internal::PropertyCell>, v8::internal::Handle<v8::internal::Name>, bool)',
      'v8::internal::BaseLoadStoreStubCompiler::GetCode(v8::internal::Code::Kind, v8::internal::Code::StubType, v8::internal::Handle<v8::internal::Name>)',
      'v8::internal::Logger::CodeCreateEvent(v8::internal::Logger::LogEventsAndTags, v8::internal::Code*, v8::internal::Name*)',
      'strlen' ] }
  check(t, stack1, { v8internals: true }, opts)
})

test('\nwhen converting a perf stack containing C++ and resolved JavaScript keeping sysinternals', function (t) {
  var opts = { 
    fns   : 7,
    hits  : 1,
    id    : 5,
    fn    : 'strlen',
    url   : '',
    names :
    [ 'node',
      '__libc_start_main',
      'v8::Context::New(v8::Isolate*, v8::ExtensionConfiguration*, v8::Handle<v8::ObjectTemplate>, v8::Handle<v8::Value>)',
      'Script:~native messages.js',
      '~SetUpError native ',
      '~SetUpError.a native ',
      'strlen' ] } 

  check(t, stack1, { sysinternals: true }, opts)
})
