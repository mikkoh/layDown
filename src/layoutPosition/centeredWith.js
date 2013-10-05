module.exports = function( item ) {

	this._x += item.x + ( item.width - this._width ) * 0.5;	
	this._y += item.y + ( item.height - this._height ) * 0.5;
};