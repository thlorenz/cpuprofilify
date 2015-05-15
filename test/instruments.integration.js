'use strict';

// Don't run these in the browser -- don't wanna use brfs just for tests
if (typeof window !== 'undefined') return;

/*
 * These tests check the entire JSON cpuprofiles generated via the conversion.
 * The data was manually check inside DevTools to confirm that it makes sense/is valid.
 *
 * Should the tests break (since they are brittle) please regenerate the cpuprofiles, check them very carefully
 * manually and then overwrite the expected results in order to pass the tests again.
 */

var test = require('tape')
  , fs = require('fs')
  , cpuprofilify = require('../')()

test('\nInstruments default opts integration', function (t) {
  var trace = fs.readFileSync(__dirname + '/fixtures/instruments.csv', 'utf8').split('\n')
    , expectedJSON = fs.readFileSync(__dirname + '/fixtures/instruments.cpuprofile', 'utf8')

  var expected = JSON.parse(expectedJSON);

  var res = cpuprofilify.convert(trace);

  t.deepEqual(res, expected, 'matches previously generated cpuprofile exactly')
  t.end()
})

test('\nInstruments with provided map-file integration', function (t) {
  var trace = fs.readFileSync(__dirname + '/fixtures/instruments.unresolved.csv', 'utf8').split('\n')
    , map = fs.readFileSync(__dirname + '/fixtures/instruments.unresolved.map', 'utf8')
    , expectedJSON = fs.readFileSync(__dirname + '/fixtures/instruments.unresolved.cpuprofile', 'utf8')

  var expected = JSON.parse(expectedJSON);

  var res = cpuprofilify.convert(trace, { map: map });

  t.deepEqual(res, expected, 'matches previously generated cpuprofile exactly')
  t.end()
})
