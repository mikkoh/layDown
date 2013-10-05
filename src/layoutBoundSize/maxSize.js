module.exports = function( value ) {

	this._width = Math.min( this._width, value );
	this._height = Math.min( this._height, value );

	console.log( this.width, this._height, value );
};