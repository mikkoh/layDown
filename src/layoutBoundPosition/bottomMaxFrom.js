module.exports = function( item ) {

	this._y = Math.min( this._y, item.y + item.height - this._height );
};