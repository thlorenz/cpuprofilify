# cpuprofilify [![build status](https://secure.travis-ci.org/thlorenz/cpuprofilify.png?branch=master)](http://travis-ci.org/thlorenz/cpuprofilify)

[![testling badge](https://ci.testling.com/thlorenz/cpuprofilify.png)](https://ci.testling.com/thlorenz/cpuprofilify)


Converts output of various profiling/sampling tools to the .cpuprofile format so it can be loaded into Chrome DevTools.

## Instructions

*subject to change*

### Install the Tools

```
npm install -g resolve-jit-symbols
git clone https://github.com/thlorenz/cpuprofilify.git && cd cpuprofilify
```

### Trace the App

```sh
# In Terminal A
node --perf-basic-prof example/fibonacci.js

# In Terminal B
sudo ./tools/dtrace-sample.d -o stack.txt -p <pid of node process>

# In Terminal C
curl localhost:8000/1000
kill <pid of node process>
```

### Resolve JavaScript and Create CPU Profile

```sh
cat stack.txt | rjs /tmp/perf-<pid of node process>.map | node bin/cpuprofilify > my.cpuprofile
```

## Installation

    npm install cpuprofilify

## API

*TODO*

## License

MIT
