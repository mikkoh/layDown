module.exports = function( originalWidth, originalHeight ) {

	this._width += ( this._height + this._offHeight ) / originalHeight * originalWidth;
}