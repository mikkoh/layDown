module.exports = function( item ) {

	this._x = Math.min( this._x, item.x );
	this._y = Math.min( this._y, item.y );
};