'use strict';
/*jshint asi: true */

var test = require('tape')
  , roi = require('../lib/remove-optimization-info')

test('\nremoving optimization info', function (t) {
  t.equal(roi('~onread'), '~*onread', 'adjusts ~onread to ~*onread')
  t.equal(roi('*onread'), '~*onread', 'adjusts *onread to ~*onread')

  t.equal(roi(' ~onread'), '~*onread', 'adjusts " ~onread" to ~*onread')
  t.equal(roi(' *onread'), '~*onread', 'adjusts " *onread" to ~*onread')
  t.end()
})
