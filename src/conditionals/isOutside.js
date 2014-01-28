var isInside = require( './isInside' );

module.exports = function() {

	return !isInside.apply( this, arguments );
}