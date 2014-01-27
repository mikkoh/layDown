module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.y > value;	
	} else {

		return this.y > value.y;
	}
};