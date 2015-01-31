# cpuprofilify [![build status](https://secure.travis-ci.org/thlorenz/cpuprofilify.png?branch=master)](http://travis-ci.org/thlorenz/cpuprofilify)

[![testling badge](https://ci.testling.com/thlorenz/cpuprofilify.png)](https://ci.testling.com/thlorenz/cpuprofilify)

Converts output of various profiling/sampling tools to the .cpuprofile format so it can be loaded into Chrome DevTools.

![screenshot](assets/cpuprofilify.gif)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
- [Instructions](#instructions)
- [Example](#example)
- [cpuprofilify and `perf`](#cpuprofilify-and-perf)
- [API](#api)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

    npm install -g cpuprofilify

## Instructions

cpuprofilify installs two binary scripts:

- **`profile_1ms.d`**: DTrace script that samples your process, use either of the following to generate a trace
  - `sudo profile_1ms.d -p <process id> | cpuprofilify > out.cpuprofile`
  - `sudo profile_1ms.d -c <command> | cpuprofilify > out.cpuprofile`
- **`cpuprofilify`**: which will convert a *perf* or *DTrace* trace into a `.cpuprofile` importable into Chrome DevTools

## Example

*using DTrace script*

```sh
# In Terminal A

➝  sudo profile_1ms.d -c 'node --perf-basic-prof example/fibonacci' | cpuprofilify > /tmp/example.cpuprofile
pid <process-pid>
HTTP server listening on port 8000

# In Terminal B
➝  ab -n 6 -c 2 http://:::8000/1000/
This is ApacheBench, Version 2.3 <$Revision: 1554214 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking :: (be patient).....done
[ .. ]

➝  sudo kill <process-pid>
```

Now open `/tmp/example.cpuprofile` in Chrome DevTools *Profiles - Load*

**NOTE:** in order to try the above example please clone this repository.

## cpuprofilify and `perf`

*use this on any system that doesn't have DTrace, but perf instead like Linux*

```sh
perf record -e cycles:u -g -- node --perf-basic-prof myapp.js
perf script | cpuprofilify > out.cpuprofile
```

## API

*TODO*

## License

MIT
