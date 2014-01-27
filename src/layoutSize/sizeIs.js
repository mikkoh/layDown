module.exports = function( width, height ) {

	if( arguments.length == 1 ) {

		this._width += arguments[ 0 ];
		this._height += arguments[ 0 ];
	} else {

		this._width += arguments[ 0 ];
		this._height += arguments[ 1 ];
	}
};