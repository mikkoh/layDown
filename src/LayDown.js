var LayDownNode = require( './LayoutNode' );


var LayDown = function( layoutFunction, readFunction, createFunction ) {

	this.layoutFunction = layoutFunction;
	this.readFunction = readFunction;
	this.createFunction = createFunction;
	this.nodes = [];
};

LayDown.prototype.x = 0;
LayDown.prototype.y = 0;
LayDown.prototype.width = 0;
LayDown.prototype.height = 0;
LayDown.prototype.layoutFunction = null;
LayDown.prototype.readFunction = null;
LayDown.prototype.createFunction = null;
LayDown.prototype.nodes = null;

LayDown.prototype.create = function( itemToLayDown ) {

	if( itemToLayDown && this.createFunction != null ) {

		this.createFunction( itemToLayDown );
	}

	var nNode = new LayDownNode( this, itemToLayDown, this.layoutFunction, this.readFunction );	

	this.nodes.push( nNode );

	return nNode;
};

LayDown.prototype.resizeAndPosition = function( x, y, width, height ) {

	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;

	this.doLayout();
};

LayDown.prototype.nodeChanged = function( node ) {

	this.doLayout();
};

LayDown.prototype.doLayout = function() {

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