module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.x + this.width > value;
	} else {

		return this.x + this.width > value.x + value.width;
	}
};