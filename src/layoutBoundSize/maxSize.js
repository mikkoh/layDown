module.exports = function() {

	if( arguments.length == 1 ) {

		this._width = Math.min( this._width, arguments[ 0 ] );
		this._height = Math.min( this._height, arguments[ 0 ] );
	} else {

		this._width = Math.min( this._width, arguments[ 0 ] );
		this._height = Math.min( this._height, arguments[ 1 ] );
	}
};