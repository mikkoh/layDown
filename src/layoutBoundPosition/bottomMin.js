module.exports = function( value ) {

	this._y = Math.max( this._y, value - this._height );
};