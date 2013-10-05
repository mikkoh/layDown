module.exports = function( originalWidth, originalHeight ) {

	this._height += this._width / originalWidth * originalHeight;
};