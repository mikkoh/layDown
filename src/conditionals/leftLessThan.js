module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.x < value;	
	} else {

		return this.x < value.x;
	}
};