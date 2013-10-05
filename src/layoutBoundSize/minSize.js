module.exports = function( value ) {

	this._width = Math.max( this._width, value );
	this._height = Math.max( this._height, value );
};