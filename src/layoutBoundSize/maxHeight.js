module.exports = function( value ) {

	if( typeof value == 'number' ) {

		this._height = Math.min( this._height, value );
	} else {

		this._height = Math.min( this._height, value.height ); 
	}
};