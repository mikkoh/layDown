var LayDownNode = require( './LayoutNode' );


var LayDown = function( layoutFunction ) {

	this.layoutFunction = layoutFunction;
	this.nodes = [];
};

LayDown.prototype.x = 0;
LayDown.prototype.y = 0;
LayDown.prototype.width = 0;
LayDown.prototype.height = 0;
LayDown.prototype.layoutFunction = null;
LayDown.prototype.nodes = null;

LayDown.prototype.create = function( itemToLayDown ) {

	var nNode = new LayDownNode( this, itemToLayDown, this.layoutFunction );	

	this.nodes.push( nNode );

	return nNode;
};

LayDown.prototype.resizeAndPosition = function( x, y, width, height ) {

	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;

	//we need to reset all the hasBeenLayedOut
	for( var i = 0, len = this.nodes.length; i < len; i++ ) {

		this.nodes[ i ].hasBeenLayedOut = false;
	}

	//now doLayDown on all of them that haven't been layed out
	//they could become layedout if other nodes have dependencies
	for( var i = 0, len = this.nodes.length; i < len; i++ ) {

		if( !this.nodes[ i ].hasBeenLayedOut ) {

			this.nodes[ i ].doLayout();
		}
	}
};



module.exports = LayDown;