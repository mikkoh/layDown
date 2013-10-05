module.exports = function( value ) {

	if( typeof value == 'number' ) {

		this._width = Math.max( this._width, value );
	} else {

		this._width = Math.max( this._width, value.width ); 
	}
};