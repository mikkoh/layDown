module.exports = function( item ) {

	this._x = Math.max( this._x, item.x );
	this._y = Math.max( this._y, item.y );
};