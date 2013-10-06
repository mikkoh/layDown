module.exports = function() {

	if( arguments.length == 1 ) {

		this._width = Math.max( this._width, arguments[ 0 ] );
		this._height = Math.max( this._height, arguments[ 0 ] );
	} else {

		this._width = Math.max( this._width, arguments[ 0 ] );
		this._height = Math.max( this._height, arguments[ 1 ] );
	}
};