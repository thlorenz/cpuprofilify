// Don't run these in the browser -- don't wanna use brfs just for tests
if (typeof window === 'undefined') {
/*
 * These tests check the entire JSON cpuprofiles generated via the conversion.
 * The data was manually check inside DevTools to confirm that it makes sense/is valid.
 *
 * Should the tests break (since they are brittle) please regenerate the cpuprofiles, check them very carefully
 * manually and then overwrite the expected results in order to pass the tests again.
 */

var test = require('tape')
var fs = require('fs')
var path = require('path')
var fixtures = path.join(__dirname, 'fixtures')
var cpuprofilify = require('../')()

test('\nperf default opts integration', function(t) {
  var trace = fs.readFileSync(path.join(fixtures, 'perf-script.txt'), 'utf8').split('\n')
  var expectedJSON = fs.readFileSync(path.join(fixtures, 'perf-script.cpuprofile'), 'utf8')

  var expected = JSON.parse(expectedJSON)

  var res = cpuprofilify.convert(trace)

  t.deepEqual(res, expected, 'matches previously generated cpuprofile exactly')
  t.end()
})
}
