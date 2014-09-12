/**
*
*	STREAM: skewness
*
*
*	DESCRIPTION:
*		- Transform stream factory to calculate the sample skewness of streamed data values.
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var // Stream-combiner:
		pipeline = require( 'stream-combiner' ),

		// Map transform stream:
		mapper = require( 'flow-map' ),

		// Stream reduce:
		reducer = require( 'flow-reduce' );


	// FUNCTIONS //

	/**
	* FUNCTION: reduce()
	*	Returns a data reduction function.
	*
	* @private
	* @returns {Function} data reduction function
	*/
	function reduce() {
		var delta = 0,
			delta_n = 0,
			term1 = 0;
		/**
		* FUNCTION: reduce( acc, data )
		*	Defines the data reduction.
		*
		* @private
		* @param {Object} acc - accumulation object containing the following properties: N, mean, M2, M3. 'N' is the observatio number. 'mean' is the mean accumulator. 'M2' is the sum of squared difference accumulator. 'M3' is the cubed difference accumulator.
		* @param {Number} data - numeric stream data
		* @returns {Object} accumulation object
		*/
		return function reduce( acc, x ) {
			acc.N += 1;

			delta = x - acc.mean;
			delta_n = delta / acc.N;
			
			term1 = delta * delta_n * (acc.N-1);

			acc.M3 += term1*delta_n*(acc.N-2) - 3*delta_n*acc.M2;
			acc.M2 += term1;
			acc.mean += delta_n;

			return acc;
		};
	} // end FUNCTION reduce()

	/**
	* FUNCTION: transform( data )
	*	Defines the data transformation.
	*
	* @private
	* @param {Object} data - stream data
	* @returns {Number} transformed data
	*/
	function transform( data ) {
		var N = data.N,
			g;

		// Population skewness:
		g = Math.sqrt( N )*data.M3 / Math.pow( data.M2, 3/2 );

		// Sample skewness correction:
		return Math.sqrt( N*N-1)*g / (N-2);
	} // end FUNCTION transform()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {Stream} Stream instance
	*/
	function Stream() {
		// Default accumulator values:
		this._values = [ 0, 0 ];
		this._mean = 0;
		this._N = 0;

		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: values( seeds )
	*	Setter and getter for initial values from which to begin accumulation. If a value array is provided, sets the initial values. If no array is provided, returns the initial values.
	*
	* @param {Array} seeds - 2-element array with the following differences raised to powers: [ M2, M3 ]. E.g., M2 = (x-mu)^2; M3 = (x-mu)^3.
	* @returns {Stream|Array} Stream instance or initial values
	*/
	Stream.prototype.values = function( values ) {
		if ( !arguments.length ) {
			return this._values.slice();
		}
		if ( !Array.isArray( values ) ) {
			throw new Error( 'values()::invalid input argument. Argument must an array.' );
		}
		if ( values.length !== 2 ) {
			throw new Error( 'values()::invalid input argument. Input argument must be a 2-element array.' );
		}
		this._values = values;
		return this;
	}; // end METHOD values()

	/**
	* METHOD: mean( value )
	*	Setter and getter for initial mean value used during accumulation. If a value is provided, sets the initial mean value. If no value is provided, returns the mean value.
	*
	* @param {Number} value - initial mean value
	* @returns {Stream|Number} Stream instance or initial value
	*/
	Stream.prototype.mean = function( value ) {
		if ( !arguments.length ) {
			return this._mean;
		}
		if ( typeof value !== 'number' || value !== value ) {
			throw new Error( 'mean()::invalid input argument. Mean must be numeric.' );
		}
		this._mean = value;
		return this;
	}; // end METHOD mean()

	/**
	* METHOD: numValues( value )
	*	Setter and getter for the total number of values the initial value for accumulation represents. If a value is provided, sets the number of values. If no value is provided, returns the number of values.
	*
	* @param {Number} value - initial value number
	* @returns {Stream|Number} Stream instance or initial value number
	*/
	Stream.prototype.numValues = function( value ) {
		if ( !arguments.length ) {
			return this._N;
		}
		this._N = value;
		return this;
	}; // end METHOD numValues()

	/**
	* METHOD: stream()
	*	Returns a JSON data reduction stream for calculating the statistic.
	*
	* @returns {Object} stream pipeline
	*/
	Stream.prototype.stream = function() {
		var rStream, mStream, pStream;

		// Get the reduction stream:
		rStream = reducer()
			.reduce( reduce() )
			.acc({
				'N': this._N,
				'mean': this._mean,
				'M2': this._values[ 0 ],
				'M3': this._values[ 1 ]
			})
			.stream();

		// Get the map stream:
		mStream = mapper()
			.map( transform )
			.stream();

		// Create the pipeline:
		pStream = pipeline(
			rStream,
			mStream
		);

		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();