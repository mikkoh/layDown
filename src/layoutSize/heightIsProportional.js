module.exports = function( originalWidth, originalHeight ) {

	this._height += ( this._width + this._offWidth ) / originalWidth * originalHeight;
};