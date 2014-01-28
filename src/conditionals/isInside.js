module.exports = function() {

	var left, top, right, bottom;

	if( arguments.length == 4 ) {

		left = arguments[ 0 ];
		top = arguments[ 1 ];
		right = arguments[ 2 ] + left;
		bottom = arguments[ 3 ] + top;
	} else {

		left = arguments[ 0 ].x;
		top = arguments[ 0 ].y;
		right = arguments[ 0 ].width + left;
		bottom = arguments[ 0 ].height + top;
	}

	var myLeft = this.x;
	var myTop = this.y;
	var myRight = this.x + this.width;
	var myBottom = this.y + this.height;

	return ( myLeft > left && myLeft < right && myTop > top && myTop < bottom ) || //top left corner is inside
		   ( myRight > left && myRight < right && myTop > top && myTop < bottom ) || //top right corner is inside
		   ( myRight > left && myRight < right && myBottom > top && myBottom < bottom ) || //bottom right corner is inside
		   ( myLeft > left && myLeft < right && myBottom > top && myBottom < bottom ); //bottom left corner is inside
};