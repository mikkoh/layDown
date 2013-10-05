module.exports = function( value ) {

	if( typeof value == 'number' ) {

		this._height = Math.max( this._height, value );
	} else {

		this._height = Math.max( this._height, value.height ); 
	}
};