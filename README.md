flow-skewness
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

Transform stream factory to calculate the sample skewness of streamed data values.


## Installation

``` bash
$ npm install flow-skewness
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## API

To create a stream factory,

``` javascript
var flowFactory = require( 'flow-skewness' );

// Create a new factory:
var flowStream = flowFactory();
```

### flowStream.stream()

To create a new stream,

``` javascript
var stream = flowStream.stream();
```


## Usage

Methods are chainable.

``` javascript
flowFactory()
	.stream()
	.pipe( /* writable stream */ );
```



## Examples

``` javascript
var eventStream = require( 'event-stream' ),
	flowFactory = require( 'flow-skewness' );

// Create some data...
var data = new Array( 1000 );
for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random();
}

// Create a readable stream:
var readStream = eventStream.readArray( data );

// Create a new stream:
var stream = flowFactory().stream();

// Pipe the data:
readStream
	.pipe( stream )
	.pipe( eventStream.map( function( d, clbk ){
		clbk( null, d.toString()+'\n' );
	}))
	.pipe( process.stdout );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ open reports/coverage/lcov-report/index.html
```


## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/flow-skewness.svg
[npm-url]: https://npmjs.org/package/flow-skewness

[travis-image]: http://img.shields.io/travis/flow-io/flow-skewness/master.svg
[travis-url]: https://travis-ci.org/flow-io/flow-skewness

[coveralls-image]: https://img.shields.io/coveralls/flow-io/flow-skewness/master.svg
[coveralls-url]: https://coveralls.io/r/flow-io/flow-skewness?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/flow-skewness.svg
[dependencies-url]: https://david-dm.org/flow-io/flow-skewness

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/flow-skewness.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/flow-skewness

[github-issues-image]: http://img.shields.io/github/issues/flow-io/flow-skewness.svg
[github-issues-url]: https://github.com/flow-io/flow-skewness/issues