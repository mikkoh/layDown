module.exports = function( item ) {

	this._y = Math.max( this._y, item.y + item.height - this._height );
};