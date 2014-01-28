module.exports = function( item ) {

	this._x = Math.min( this._x, item.x - this._height );
};