module.exports = function() {

	if( arguments.length == 1 ) {

		if( typeof arguments[ 0 ] == 'number' ) {

			this._width = Math.max( this._width, arguments[ 0 ] );
			this._height = Math.max( this._height, arguments[ 0 ] );
		} else {

			this._width = Math.max( this._width, arguments[ 0 ].width );
			this._height = Math.max( this._height, arguments[ 0 ].height ); 
		}
	} else if( typeof arguments[ 0 ] == 'number' && typeof arguments[ 1 ] == 'number' ) {

		this._width = Math.max( this._width, arguments[ 0 ] );
		this._height = Math.max( this._height, arguments[ 1 ] );
	}
};