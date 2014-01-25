module.exports = function() {

	if( arguments.length == 1 ) {

		this._x = Math.min( this._x, arguments[ 0 ] );
		this._y = Math.min( this._y, arguments[ 0 ] );
	} else {

		this._x = Math.min( this._x, arguments[ 0 ] );
		this._y = Math.min( this._y, arguments[ 1 ] );
	}
};