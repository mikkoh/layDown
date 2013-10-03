/************************************************************/
/************************************************************/
/**********************PROPS TO EFFECT***********************/
/************************************************************/
/************************************************************/
var SIZE = 'SIZE';
var SIZE_WIDTH = 'SIZE_WIDTH';
var SIZE_HEIGHT = 'SIZE_HEIGHT';
var POSITION = 'POSITION';
var POSITION_X = 'POSITION_X';
var POSITION_Y = 'POSITION_Y';




var LayoutNode = function( layout, item, layoutFunction ) {

	this.layout = layout;
	this.item = item;
	this.layoutFunction = layoutFunction;
	this.dependencies = [];
	this.rulesPos = [];
	this.rulesPosProp = [];
	this.rulesSize = [];
	this.rulesSizeProp = [];
	this.rulesPosBound = [];
	this.rulesPosBoundProp = [];
	this.rulesSizeBound = [];
	this.rulesSizeBoundProp = [];
};


LayoutNode.prototype._x = 0;
LayoutNode.prototype._y = 0;
LayoutNode.prototype._width = 0;
LayoutNode.prototype._height = 0;
LayoutNode.prototype._offX = 0;
LayoutNode.prototype._offY = 0;
LayoutNode.prototype._offWidth = 0;
LayoutNode.prototype._offHeight = 0;
LayoutNode.prototype.layout = null;
LayoutNode.prototype.item = null;
LayoutNode.prototype.layoutFunction = null;
LayoutNode.prototype.lastPropTypeEffected = null;
LayoutNode.prototype.dependencies = null;
LayoutNode.prototype.hasBeenLayedOut = false;
LayoutNode.prototype.rulesPos = null;
LayoutNode.prototype.rulesPosProp = null;
LayoutNode.prototype.rulesSize = null;
LayoutNode.prototype.rulesSizeProp = null;
LayoutNode.prototype.rulesPosBound = null;
LayoutNode.prototype.rulesPosBoundProp = null;
LayoutNode.prototype.rulesSizeBound = null;
LayoutNode.prototype.rulesSizeBoundProp = null;

Object.defineProperty( LayoutNode.prototype, 'x', {

	get: function() {

		return this._x;
	},

	set: function( value ) {

		this.lastPropTypeEffected = POSITION_X;
		this.plus( value - this._x );

		if( this.hasBeenLayedOut ) {
			
			this.layout.nodeChanged( this );
		}
	}
});

Object.defineProperty( LayoutNode.prototype, 'y', {

	get: function() {

		return this._y;
	},

	set: function( value ) {

		this.lastPropTypeEffected = POSITION_Y;
		this.plus( value - this._y );

		if( this.hasBeenLayedOut ) {

			this.layout.nodeChanged( this );
		}
	}
});

Object.defineProperty( LayoutNode.prototype, 'width', {

	get: function() {

		return this._width;
	},

	set: function( value ) {

		this.lastPropTypeEffected = SIZE_WIDTH;
		this.plus( value - this._width );

		if( this.hasBeenLayedOut ) {
			
			this.layout.nodeChanged( this );
		}
	}
});

Object.defineProperty( LayoutNode.prototype, 'height', {

	get: function() {

		return this._height;
	},

	set: function( value ) {

		this.lastPropTypeEffected = SIZE_HEIGHT;
		this.plus( value - this._height );

		if( this.hasBeenLayedOut ) {
			
			this.layout.nodeChanged( this );
		}
	}
});


LayoutNode.prototype.doLayout = function() {

	this._x = this._y = this._width = this._height = 0;

	for( var i = 0, len = this.dependencies.length; i < len; i++ ) {

		if( !this.dependencies[ i ].hasBeenLayedOut ) {

			this.dependencies[ i ].doLayout();
		}
	}	


	//HANDLE SIZE
	for( var i = 0, len = this.rulesSize.length; i < len; i++ ) {

		this.rulesSize[ i ].apply( this, this.rulesSizeProp[ i ] );
	}

	this._width += this._offWidth;
	this._height += this._offHeight;

	for( var i = 0, len = this.rulesSizeBound.length; i < len; i++ ) {

		this.rulesSizeBound[ i ].apply( this, this.rulesPosBoundProp[ i ] );
	}


	//HANDLE POSITION
	for( var i = 0, len = this.rulesPos.length; i < len; i++ ) {

		this.rulesPos[ i ].apply( this, this.rulesPosProp[ i ] );
	}

	this._x += this._offX;
	this._y += this._offY;

	for( var i = 0, len = this.rulesPosBound.length; i < len; i++ ) {

		this.rulesPosBound[ i ].apply( this, this.rulesPosBoundProp[ i ] );
	}

	
	

	this.layoutFunction( this.item, this );

	this.hasBeenLayedOut = true;
};

LayoutNode.prototype.setLayoutFunction = function( layoutFunction ) {

	this.layoutFunction = layoutFunction;

	return this;
};

LayoutNode.prototype.addDependency = function( item ) {

	if( item != this.layout ) {
		
		this.dependencies.push( item );
	}

	return this;
};


/************************************************************/
/************************************************************/
/********************POSITION FUNCTIONS**********************/
/************************************************************/
/************************************************************/

LayoutNode.prototype.positionIs = function( x, y ) {

	addRule.call( this, positionIs, arguments, this.rulesPos, this.rulesPosProp, POSITION );

	return this;
};

LayoutNode.prototype.xIs = function( x ) {

	addRule.call( this, xIs, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );

	return this;
};

LayoutNode.prototype.yIs = function( y ) {

	addRule.call( this, yIs, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );

	return this;
};

LayoutNode.prototype.alignedBelow = function( item ) {

	addRule.call( this, alignedBelow, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );

	this.addDependency( item );

	return this;
};

LayoutNode.prototype.alignedAbove = function( item ) {

	addRule.call( this, alignedAbove, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );

	this.addDependency( item );
	
	return this;
};

LayoutNode.prototype.alignedLeftOf = function( item ) {

	addRule.call( this, alignedLeftOf, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );

	this.addDependency( item );
	
	return this;
};

LayoutNode.prototype.alignedRightOf = function( item ) {

	addRule.call( this, alignedRightOf, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );

	this.addDependency( item );
	
	return this;
};

LayoutNode.prototype.alignedWith = function( item ) {

	addRule.call( this, alignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION );

	this.addDependency( item );

	return this;
};

LayoutNode.prototype.leftAlignedWith = function( item ) {

	addRule.call( this, leftAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );

	this.addDependency( item );

	return this;
};

LayoutNode.prototype.rightAlignedWith = function( item ) {

	addRule.call( this, rightAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );

	this.addDependency( item );

	return this;
};

LayoutNode.prototype.topAlignedWith = function( item ) {

	addRule.call( this, topAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );

	this.addDependency( item );
	
	return this;
};

LayoutNode.prototype.bottomAlignedWith = function( item ) {

	addRule.call( this, bottomAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );

	this.addDependency( item );
	
	return this;
};

LayoutNode.prototype.centeredWith = function( item ) {

	addRule.call( this, centeredWith, arguments, this.rulesPos, this.rulesPosProp, POSITION );

	this.addDependency( item );

	return this;
};

LayoutNode.prototype.horizonallyCenteredWith = function( item ) {

	addRule.call( this, horizonallyCenteredWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );

	this.addDependency( item );

	return this;
};

LayoutNode.prototype.verticallyCenteredWith = function( item ) {

	addRule.call( this, verticallyCenteredWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );

	this.addDependency( item );

	return this;
};






/************************************************************/
/************************************************************/
/**********************SIZE FUNCTIONS************************/
/************************************************************/
/************************************************************/
LayoutNode.prototype.sizeIs = function( width, height ) {

	addRule.call( this, sizeIs, arguments, this.rulesSize, this.rulesSizeProp, SIZE );

	return this;
}

LayoutNode.prototype.widthIs = function( width ) {

	addRule.call( this, widthIs, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );

	return this;
}

LayoutNode.prototype.heightIs = function( height ) {

	addRule.call( this, heightIs, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
	
	return this;
}

LayoutNode.prototype.sizeIsProportional = function( originalWidth, originalHeight ) {

	addRule.call( this, sizeIsProportional, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
	
	return this;
}

LayoutNode.prototype.widthIsProportional = function( originalWidth, originalHeight ) {

	addRule.call( this, widthIsProportional, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );

	return this;
}

LayoutNode.prototype.heightIsProportional = function( originalWidth, originalHeight ) {

	addRule.call( this, heightIsProportional, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );

	return this;
}

LayoutNode.prototype.matchesSizeOf = function( item ) {

	addRule.call( this, matchesSizeOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE );

	this.addDependency( item );

	return this;
}

LayoutNode.prototype.matchesWidthOf = function( item ) {

	addRule.call( this, matchesWidthOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );

	this.addDependency( item );

	return this;
}

LayoutNode.prototype.matchesHeightOf = function( item ) {

	addRule.call( this, matchesHeightOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );

	this.addDependency( item );

	return this;
}

LayoutNode.prototype.sizeIsAPercentageOf = function( item, percentage ) {

	addRule.call( this, sizeIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE );

	this.addDependency( item );

	return this;
}

LayoutNode.prototype.widthIsAPercentageOf = function( item, percentage ) {

	addRule.call( this, widthIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );

	this.addDependency( item );

	return this;
}

LayoutNode.prototype.heightIsAPercentageOf = function( item, percentage ) {

	addRule.call( this, heightIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );

	this.addDependency( item );

	return this;
}



/************************************************************/
/************************************************************/
/*********************OFFSET FUNCTIONS***********************/
/************************************************************/
/************************************************************/
LayoutNode.prototype.plus = function() {

	switch( this.lastPropTypeEffected ) {

		case SIZE:
			this.lastPropTypeEffected = SIZE;
			this._offWidth += arguments[ 0 ];
			this._offHeight += arguments[ 0 ];
		break;

		case SIZE_WIDTH:
			this.lastPropTypeEffected = SIZE_WIDTH;
			this._offWidth += arguments[ 0 ];
		break;

		case SIZE_HEIGHT:
			this.lastPropTypeEffected = SIZE_HEIGHT;
			this._offHeight += arguments[ 0 ];
		break;

		case POSITION:
			this.lastPropTypeEffected = POSITION;
			this._offX += arguments[ 0 ];
			this._offY += arguments[ 0 ];
		break;

		case POSITION_X:
			this.lastPropTypeEffected = POSITION_X;
			this._offX += arguments[ 0 ];
		break;

		case POSITION_Y:
			athis.lastPropTypeEffected = POSITION_Y;
			this._offY += arguments[ 0 ];
		break;
	}

	return this;
};

LayoutNode.prototype.minus = function() {

	switch( this.lastPropTypeEffected ) {

		case SIZE:
			this.lastPropTypeEffected = SIZE;
			this._offWidth -= arguments[ 0 ];
			this._offHeight -= arguments[ 0 ];
		break;

		case SIZE_WIDTH:
			this.lastPropTypeEffected = SIZE_WIDTH;
			this._offWidth -= arguments[ 0 ];
		break;

		case SIZE_HEIGHT:
			this.lastPropTypeEffected = SIZE_HEIGHT;
			this._offHeight -= arguments[ 0 ];
		break;

		case POSITION:
			this.lastPropTypeEffected = POSITION;
			this._offX -= arguments[ 0 ];
			this._offY -= arguments[ 0 ];
		break;

		case POSITION_X:
			this.lastPropTypeEffected = POSITION_X;
			this._offX -= arguments[ 0 ];
		break;

		case POSITION_Y:
			athis.lastPropTypeEffected = POSITION_Y;
			this._offY -= arguments[ 0 ];
		break;
	}

	return this;
};

LayoutNode.prototype.min = function() {

	switch( this.lastPropTypeEffected ) {

		case SIZE:
			addRule.call( this, minSize, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE );
		break;

		case SIZE_WIDTH:
			addRule.call( this, minWidth, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE_WIDTH );
		break;

		case SIZE_HEIGHT:
			addRule.call( this, minHeight, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE_HEIGHT );
		break;

		case POSITION:
			addRule.call( this, minPosition, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION );
		break;

		case POSITION_X:
			addRule.call( this, minX, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION_X );
		break;

		case POSITION_Y:
			addRule.call( this, minY, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION_Y );
		break;
	}

	return this;
};

LayoutNode.prototype.max = function() {

	switch( this.lastPropTypeEffected ) {

		case SIZE:
			addRule.call( this, maxSize, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE );
		break;

		case SIZE_WIDTH:
			addRule.call( this, maxWidth, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE_WIDTH );
		break;

		case SIZE_HEIGHT:
			addRule.call( this, maxHeight, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE_HEIGHT );
		break;

		case POSITION:
			addRule.call( this, maxPosition, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION );
		break;

		case POSITION_X:
			addRule.call( this, maxX, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION_X );
		break;

		case POSITION_Y:
			addRule.call( this, maxY, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION_Y );
		break;
	}

	return this;
};











/************************************************************/
/************************************************************/
/********************POSITION FUNCTIONS**********************/
/************************************************************/
/************************************************************/
function positionIs( x, y ) {

	this._x += x;
	this._y += y;
}

function xIs( x ) {

	this._x += x;
}

function yIs( y ) {

	this._y += y;
}

function alignedBelow( item ) {

	this._y += item.y + item.height;
}

function alignedAbove( item ) {

	this._y += item.y - this._height;
}

function alignedLeftOf( item ) {

	this._x += item.x - this._width;
}

function alignedRightOf( item ) {

	this._x += item.x + item.width;
}

function alignedWith( item ) {

	this._x += item.x;
	this._y += item.y;
}

function leftAlignedWith( item ) {

	this._x += item.x;
}

function rightAlignedWith( item ) {

	this._x += item.x + item.width - this._width;
}

function topAlignedWith( item ) {

	this._y += item.y;
}

function bottomAlignedWith( item ) {

	this._y += item.y + item.height - this._height;
}

function centeredWith( item ) {

	this._x += item.x + ( item.width - this._width ) * 0.5;	
	this._y += item.y + ( item.height - this._height ) * 0.5;
}

function horizonallyCenteredWith( item ) {

	this._x += item.x + ( item.width - this._width ) * 0.5;
}

function verticallyCenteredWith( item ) {

	this._y += item.y + ( item.height - this._height ) * 0.5;
}


/************************************************************/
/************************************************************/
/**********************SIZE FUNCTIONS************************/
/************************************************************/
/************************************************************/
function sizeIs( width, height ) {

	this._width += width;
	this._height += height;
}

function widthIs( width ) {

	this._width += width;
}

function heightIs( height ) {

	this._height += height;
}

function sizeIsProportional( originalWidth, originalHeight ) {

	if( this._width == 0 ) {

		this._width += this._height / originalHeight * originalWidth;
	} else if( this._height == 0 ) {

		this._height += this._width / originalWidth * originalHeight;
	}
}

function widthIsProportional( originalWidth, originalHeight ) {

	this._width += this._height / originalHeight * originalWidth;
}

function heightIsProportional( originalWidth, originalHeight ) {

	this._height += this._width / originalWidth * originalHeight;
}

function matchesSizeOf( item ) {

	this._width += item.width;
	this._height += item.height;
}

function matchesWidthOf( item ) {

	this._width += item.width;
}

function matchesHeightOf( item ) {

	this._height += item.height;
}

function sizeIsAPercentageOf( item, percentage ) {

	this._width += item.width * percentage;	
	this._height += item.height * percentage;
}

function widthIsAPercentageOf( item, percentage ) {

	this._width += item.width * percentage;
}

function heightIsAPercentageOf( item, percentage ) {

	this._height += item.height * percentage;
}







function addRule( rule, ruleArguments, ruleArr, rulePropArr, type ) {

	ruleArr.push( rule );
	rulePropArr.push( ruleArguments );

	this.lastPropTypeEffected = type;
}






module.exports = LayoutNode;