/* eslint-disable camelcase */
var PORT = 8000
var http = require('http')
var server = http.createServer()
var calculateFibonacci = cal_arrayConcat

if (~process.argv.indexOf('push')) calculateFibonacci = cal_arrayPush
if (~process.argv.indexOf('iter')) calculateFibonacci = cal_iterative

server
  .on('request', onRequest)
  .on('listening', onListening)
  .listen(PORT)

// Cleanly shut down process on SIGTERM to ensure that perf-<pid>.map gets flushed
process.on('SIGTERM', onSIGTERM)

function onSIGTERM() {
  // IMPORTANT to log on stderr, to not clutter stdout which is purely for data, i.e. dtrace stacks
  console.error('Caught SIGTERM, shutting down.')
  server.close()
  process.exit(0)
}

console.error('pid', process.pid)

function onRequest(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  var n = parseInt(req.url.slice(1))
  if (isNaN(n) || n < 0) return res.end('Please supply a number larger than 0, i.e. curl localhost:8000/12')

  var fib = calculateFibonacci(n)
  res.end('fibonacci(' + n + ') is ' + fib + '\r\n')
}

function onListening() {
  console.error('HTTP server listening on port', PORT)
}

function cal_arrayConcat(n) {
  function toFib(x, y, z) {
    return x.concat((z < 2) ? z : x[z - 1] + x[z - 2])
  }

  var arr = Array.apply(null, new Array(n)).reduce(toFib, [])
  var len = arr.length
  return arr[len - 1] + arr[len - 2]
}

// Calculate Fibonacci Array Push
function cal_arrayPush(n) {
  function toFib(x, y, z) {
    x.push((z < 2) ? z : x[z - 1] + x[z - 2])
    return x
  }

  var arr = Array.apply(null, new Array(n)).reduce(toFib, [])
  var len = arr.length
  return arr[len - 1] + arr[len - 2]
}

function cal_iterative(n) {
  var x = 0
  var y = 1
  var c = 0
  var t

  while (c !== n) {
    t = x
    x = y
    y += t
    c++
  }
  return x
}
