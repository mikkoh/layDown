module.exports = function() {

	if( arguments.length == 1 ) {

		this._x = Math.max( this._x, arguments[ 0 ] );
		this._y = Math.max( this._y, arguments[ 0 ] );
	} else {

		this._x = Math.max( this._x, arguments[ 0 ] );
		this._y = Math.max( this._y, arguments[ 1 ] );
	}
};