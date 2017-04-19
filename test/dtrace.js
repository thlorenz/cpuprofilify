var test = require('tape')
var check = require('./util/check-conversion')

var stack1 = [
    'iojs 86454 181016967: profile-1ms:'
  , '            node`v8::internal::Runtime_ArrayConcat(int, v8::internal::Object**, v8::internal::Isolate*)+0x1249'
  , '            0x36197f9060bb Stub:CEntryStub'
  , '            0x36197fa3bf9c LazyCompile:*ArrayConcatJS native array.js:366'
  , '            0x36197f91f0c0 Builtin:JSEntryTrampoline'
  , '            0x36197f91dff1 Stub:JSEntryStub'
  , '            node`v8::internal::Invoke(bool, v8::internal::Handle<v8::internal::JSFunction>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*)+0x238'
  , '            node`v8::internal::CallJsBuiltin(v8::internal::Isolate*, char const*, v8::internal::(anonymous namespace)::BuiltinArguments<(v8::internal::BuiltinExtraArguments)0>)+0x312'
  , '            node`v8::internal::Builtin_ArrayConcat(int, v8::internal::Object**, v8::internal::Isolate*)+0x2c3'
  , '            0x36197f9060bb Stub:CEntryStub'
  , '            0x36197fa3ad9c LazyCompile:*toFib /Volumes/d/dev/js/projects/cpuprofilify/example/fibonacci.js:43'
  , '            0x36197f91ea55 Builtin:ArgumentsAdaptorTrampoline'
  , '            0x36197fa139d1 LazyCompile:~reduce native array.js:1082'
  , '            0x36197fa12f5d LazyCompile:~cal_arrayConcat /Volumes/d/dev/js/projects/cpuprofilify/example/fibonacci.js:41'
  , '            0x36197fa0b490 LazyCompile:~onRequest /Volumes/d/dev/js/projects/cpuprofilify/example/fibonacci.js:27'
  , '            0x36197f9eafb4 LazyCompile:~emit events.js:56'
  , '            0x36197f91ea55 Builtin:ArgumentsAdaptorTrampoline'
  , '            0x36197fa09975 LazyCompile:~parserOnIncoming _http_server.js:401'
  , '            0x36197fa06c38 LazyCompile:~parserOnHeadersComplete _http_common.js:43'
  , '            0x36197f91f0c0 Builtin:JSEntryTrampoline'
  , '            0x36197f91dff1 Stub:JSEntryStub'
  , '            node`v8::internal::Invoke(bool, v8::internal::Handle<v8::internal::JSFunction>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*)+0x238'
  , '            node`v8::Function::Call(v8::Handle<v8::Value>, int, v8::Handle<v8::Value>*)+0xc6'
  , '            node`node::Parser::on_headers_complete_()+0x1f3'
  , '            node`http_parser_execute+0x319'
  , '            node`node::Parser::Execute(v8::FunctionCallbackInfo<v8::Value> const&)+0x106'
  , '            node`v8::internal::FunctionCallbackArguments::Call(void (*)(v8::FunctionCallbackInfo<v8::Value> const&))+0x9f'
  , '            node`v8::internal::Builtin_HandleApiCall(int, v8::internal::Object**, v8::internal::Isolate*)+0x22b'
  , '            0x36197f9060bb Stub:CEntryStub'
  , '            0x36197fa06147 LazyCompile:~socketOnData _http_server.js:321'
  , '            0x36197f9eaf4f LazyCompile:~emit events.js:56'
  , '            0x36197f91ea55 Builtin:ArgumentsAdaptorTrampoline'
  , '            0x36197f9fe13c LazyCompile:~readableAddChunk _stream_readable.js:119'
  , '            0x36197f9fdbca LazyCompile:~Readable.push _stream_readable.js:95'
  , '            0x36197f91ea55 Builtin:ArgumentsAdaptorTrampoline'
  , '            0x36197f9fc3bd LazyCompile:~onread net.js:487'
  , '            0x36197f91ea55 Builtin:ArgumentsAdaptorTrampoline'
  , '            0x36197f91f0bc Builtin:JSEntryTrampoline'
  , '            0x36197f91dff1 Stub:JSEntryStub'
  , '            node`v8::internal::Invoke(bool, v8::internal::Handle<v8::internal::JSFunction>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*)+0x238'
  , '            node`v8::Function::Call(v8::Handle<v8::Value>, int, v8::Handle<v8::Value>*)+0xc6'
  , '            node`node::AsyncWrap::MakeCallback(v8::Handle<v8::Function>, int, v8::Handle<v8::Value>*)+0x21d'
  , '            node`node::StreamWrapCallbacks::DoRead(uv_stream_s*, long, uv_buf_t const*, uv_handle_type)+0x276'
  , '            node`uv__stream_io+0x4f2'
  , '            node`uv__io_poll+0x62d'
  , '            node`uv_run+0x114'
  , '            node`node::Start(int, char**)+0x1ce'
  , '            node`start+0x34'
  , '            node`0x3'
]

var stack2 = [
    'iojs 86454 181012037: profile-1ms:'
  , '              libsystem_kernel.dylib`read+0xa'
  , '              node`uv__io_poll+0x62d'
  , '              node`uv_run+0x114'
  , '              node`node::Start(int, char**)+0x1ce'
  , '              node`start+0x34'
  , '              node`0x3'
]

test('\nwhen converting a DTrace stack containing C++ and resolved JavaScript with the default settings', function(t) {
  var opts = {
    fns: 22,
    hits: 1,
    id: 20,
    fn: '~*ArrayConcatJS',
    url: 'native array.js',
    names:
    [ 'iojs',
      'uv_run',
      'uv__io_poll',
      'uv__stream_io',
      'node::StreamWrapCallbacks::DoRead(uv_stream_s*, long, uv_buf_t const*, uv_handle_type)',
      'node::AsyncWrap::MakeCallback(v8::Handle<v8::Function>, int, v8::Handle<v8::Value>*)',
      '~*onread',
      '~*Readable.push',
      '~*readableAddChunk',
      '~*emit',
      '~*socketOnData',
      'node::Parser::Execute(v8::FunctionCallbackInfo<v8::Value> const&)',
      'http_parser_execute',
      'node::Parser::on_headers_complete_()',
      '~*parserOnHeadersComplete',
      '~*parserOnIncoming',
      '~*emit',
      '~*onRequest',
      '~*cal_arrayConcat',
      '~*reduce',
      '~*toFib',
      '~*ArrayConcatJS' ] }

  check(t, stack1, null, opts)
})

test('\nwhen converting a DTrace stack containing C++ and resolved JavaScript keeping optimization info', function(t) {
  var opts = {
      fns  : 22
    , hits : 1
    , id   : 20
    , fn   : '*ArrayConcatJS'
    , url  : 'native array.js'
    , names:
        [ 'iojs',
          'uv_run',
          'uv__io_poll',
          'uv__stream_io',
          'node::StreamWrapCallbacks::DoRead(uv_stream_s*, long, uv_buf_t const*, uv_handle_type)',
          'node::AsyncWrap::MakeCallback(v8::Handle<v8::Function>, int, v8::Handle<v8::Value>*)',
          '~onread',
          '~Readable.push',
          '~readableAddChunk',
          '~emit',
          '~socketOnData',
          'node::Parser::Execute(v8::FunctionCallbackInfo<v8::Value> const&)',
          'http_parser_execute',
          'node::Parser::on_headers_complete_()',
          '~parserOnHeadersComplete',
          '~parserOnIncoming',
          '~emit',
          '~onRequest',
          '~cal_arrayConcat',
          '~reduce',
          '*toFib',
          '*ArrayConcatJS' ] }

  check(t, stack1, { optimizationinfo: true }, opts)
})

test('\nwhen converting a DTrace stack containing C++ and resolved JavaScript keeping v8internals', function(t) {
  var opts = {
    fns: 48,
    hits: 1,
    id: 46,
    fn: 'v8::internal::Runtime_ArrayConcat(int, v8::internal::Object**, v8::internal::Isolate*)',
    url: '',
    names:
    [ 'iojs',
      'start',
      'node::Start(int, char**)',
      'uv_run',
      'uv__io_poll',
      'uv__stream_io',
      'node::StreamWrapCallbacks::DoRead(uv_stream_s*, long, uv_buf_t const*, uv_handle_type)',
      'node::AsyncWrap::MakeCallback(v8::Handle<v8::Function>, int, v8::Handle<v8::Value>*)',
      'v8::Function::Call(v8::Handle<v8::Value>, int, v8::Handle<v8::Value>*)',
      'v8::internal::Invoke(bool, v8::internal::Handle<v8::internal::JSFunction>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*)',
      ' Stub:JSEntryStub',
      ' Builtin:JSEntryTrampoline',
      ' Builtin:ArgumentsAdaptorTrampoline',
      '~*onread',
      ' Builtin:ArgumentsAdaptorTrampoline',
      '~*Readable.push',
      '~*readableAddChunk',
      ' Builtin:ArgumentsAdaptorTrampoline',
      '~*emit',
      '~*socketOnData',
      ' Stub:CEntryStub',
      'v8::internal::Builtin_HandleApiCall(int, v8::internal::Object**, v8::internal::Isolate*)',
      'v8::internal::FunctionCallbackArguments::Call(void (*)(v8::FunctionCallbackInfo<v8::Value> const&))',
      'node::Parser::Execute(v8::FunctionCallbackInfo<v8::Value> const&)',
      'http_parser_execute',
      'node::Parser::on_headers_complete_()',
      'v8::Function::Call(v8::Handle<v8::Value>, int, v8::Handle<v8::Value>*)',
      'v8::internal::Invoke(bool, v8::internal::Handle<v8::internal::JSFunction>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*)',
      ' Stub:JSEntryStub',
      ' Builtin:JSEntryTrampoline',
      '~*parserOnHeadersComplete',
      '~*parserOnIncoming',
      ' Builtin:ArgumentsAdaptorTrampoline',
      '~*emit',
      '~*onRequest',
      '~*cal_arrayConcat',
      '~*reduce',
      ' Builtin:ArgumentsAdaptorTrampoline',
      '~*toFib',
      ' Stub:CEntryStub',
      'v8::internal::Builtin_ArrayConcat(int, v8::internal::Object**, v8::internal::Isolate*)',
      'v8::internal::CallJsBuiltin(v8::internal::Isolate*, char const*, v8::internal::(anonymous namespace)::BuiltinArguments<(v8::internal::BuiltinExtraArguments)0>)',
      'v8::internal::Invoke(bool, v8::internal::Handle<v8::internal::JSFunction>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*)',
      ' Stub:JSEntryStub',
      ' Builtin:JSEntryTrampoline',
      '~*ArrayConcatJS',
      ' Stub:CEntryStub',
      'v8::internal::Runtime_ArrayConcat(int, v8::internal::Object**, v8::internal::Isolate*)' ] }

  check(t, stack1, { v8internals: true }, opts)
})

test('\nwhen converting a DTrace stack containing C++ and resolved JavaScript keeping sysinternals', function(t) {
  var opts = {
    fns: 4,
    hits: 1,
    id: 2,
    fn: 'libsystem_kernel.dylib`read',
    url: '',
    names: [ 'iojs', 'uv_run', 'uv__io_poll', 'libsystem_kernel.dylib`read' ] }
  check(t, stack2, { sysinternals: true }, opts)
})
