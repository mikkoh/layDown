module.exports = function( value ) {

	if( typeof value == 'number' ) {

		this._width = Math.min( this._width, value );
	} else {

		this._width = Math.min( this._width, value.width ); 
	}
};