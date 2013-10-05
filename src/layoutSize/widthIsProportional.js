module.exports = function( originalWidth, originalHeight ) {

	this._width += this._height / originalHeight * originalWidth;
}