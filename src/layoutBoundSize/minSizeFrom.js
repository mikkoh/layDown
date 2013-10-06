module.exports = function( item ) {

	this._width = Math.max( this._width, item.width );
	this._height = Math.max( this._height, item.height ); 
};