module.exports = function( value ) {

	this._x = Math.max( this._x, value );
	this._y = Math.max( this._y, value );
};