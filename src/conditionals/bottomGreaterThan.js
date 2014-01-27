module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.y + this.height > value;	
	} else {

		return this.y + this.height > value.y + value.height;
	}
};