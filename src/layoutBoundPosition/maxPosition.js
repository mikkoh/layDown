module.exports = function( value ) {

	this._x = Math.min( this._x, value );
	this._y = Math.min( this._y, value );
}