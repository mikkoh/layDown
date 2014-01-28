module.exports = function( value ) {

	this._x = Math.max( this._x, value - this._width );
};