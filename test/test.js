
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Mock writing to the stream:
	write = require( 'flow-mock-write' ),

	// Mock reading from the stream:
	read = require( 'flow-mock-read' ),

	// Module to be tested:
	flowFactory = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'flow-skewness', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( flowFactory ).to.be.a( 'function' );
	});

	it( 'should compute the skewness of streamed data', function test( done ) {
		var scores = [ 61, 64, 67, 70, 73 ],
			freq = [ 5, 18, 42, 27, 8 ],
			idx = 0,
			data = [],
			expected,
			stream;

		for ( var i = 0; i < scores.length; i++ ) {
			for ( var j = 0; j < freq[ i ]; j++ ) {
				data.push( scores[ i ] );
				idx += 1;
			}
		}
		expected = -0.1098;

		// Skewness stream:
		stream = flowFactory().stream();

		// Mock reading from the stream:
		read( stream, onEnd );

		// Mock writing to the stream:
		write( data, stream );

		function onEnd( error, data ) {
			if ( error ) {
				assert.notOk( true );
			} else {
				assert.closeTo( data, expected, 0.001 );
			}
			done();
		}
	});

});