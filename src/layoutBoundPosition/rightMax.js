module.exports = function( value ) {

	this._x = Math.min( this._x, value - this._width );
};