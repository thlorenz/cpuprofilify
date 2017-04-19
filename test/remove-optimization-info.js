var test = require('tape')
var roi = require('../lib/remove-optimization-info')

test('\nremoving optimization info', function(t) {
  t.equal(roi('~onread'), '~*onread', 'adjusts ~onread to ~*onread')
  t.equal(roi('*onread'), '~*onread', 'adjusts *onread to ~*onread')

  t.equal(roi(' ~onread'), '~*onread', 'adjusts " ~onread" to ~*onread')
  t.equal(roi(' *onread'), '~*onread', 'adjusts " *onread" to ~*onread')
  t.end()
})
