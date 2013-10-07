
///POSITION FUNCTIONS
var alignedAbove = require( './layoutPosition/alignedAbove' );
var alignedBelow = require( './layoutPosition/alignedBelow' );
var alignedLeftOf = require( './layoutPosition/alignedLeftOf' );
var alignedRightOf = require( './layoutPosition/alignedRightOf' );
var alignedWith = require( './layoutPosition/alignedWith' );
var bottomAlignedWith = require( './layoutPosition/bottomAlignedWith' );
var centeredWith = require( './layoutPosition/centeredWith' );
var horizonallyCenteredWith = require( './layoutPosition/horizonallyCenteredWith' );
var leftAlignedWith = require( './layoutPosition/leftAlignedWith' );
var positionIs = require( './layoutPosition/positionIs' );
var rightAlignedWith = require( './layoutPosition/rightAlignedWith' );
var topAlignedWith = require( './layoutPosition/topAlignedWith' );
var verticallyCenteredWith = require( './layoutPosition/verticallyCenteredWith' );
var xIs = require( './layoutPosition/xIs' );
var yIs = require( './layoutPosition/yIs' );

//POSITION BOUND FUNCTIONS
var maxPosition = require( './layoutBoundPosition/maxPosition' );
var maxPositionFrom = require( './layoutBoundPosition/maxPositionFrom' );
var maxX = require( './layoutBoundPosition/maxX' );
var maxXFrom = require( './layoutBoundPosition/maxXFrom' );
var maxY = require( './layoutBoundPosition/maxY' );
var maxYFrom = require( './layoutBoundPosition/maxYFrom' );
var minPosition = require( './layoutBoundPosition/minPosition' );
var minPositionFrom = require( './layoutBoundPosition/minPositionFrom' );
var minX = require( './layoutBoundPosition/minX' );
var minXFrom = require( './layoutBoundPosition/minXFrom' );
var minY = require( './layoutBoundPosition/minY' );
var minYFrom = require( './layoutBoundPosition/minYFrom' );

///SIZE FUNCTIONS
var heightIs = require( './layoutSize/heightIs' );
var heightIsAPercentageOf = require( './layoutSize/heightIsAPercentageOf' );
var heightIsProportional = require( './layoutSize/heightIsProportional' );
var matchesHeightOf = require( './layoutSize/matchesHeightOf' );
var matchesSizeOf = require( './layoutSize/matchesSizeOf' );
var matchesWidthOf = require( './layoutSize/matchesWidthOf' );
var sizeIs = require( './layoutSize/sizeIs' );
var sizeIsAPercentageOf = require( './layoutSize/sizeIsAPercentageOf' );
var sizeIsProportional = require( './layoutSize/sizeIsProportional' );
var widthIs = require( './layoutSize/widthIs' );
var widthIsAPercentageOf = require( './layoutSize/widthIsAPercentageOf' );
var widthIsProportional = require( './layoutSize/widthIsProportional' );


//SIZE BOUND FUNCTIONS
var maxHeight = require( './layoutBoundSize/maxHeight' );
var maxHeightFrom = require( './layoutBoundSize/maxHeightFrom' );
var maxSize = require( './layoutBoundSize/maxSize' );
var maxSizeFrom = require( './layoutBoundSize/maxSizeFrom' );
var maxWidth = require( './layoutBoundSize/maxWidth' );
var maxWidthFrom = require( './layoutBoundSize/maxWidthFrom' );
var minHeight = require( './layoutBoundSize/minHeight' );
var minHeightFrom = require( './layoutBoundSize/minHeightFrom' );
var minSize = require( './layoutBoundSize/minSize' );
var minSizeFrom = require( './layoutBoundSize/minSizeFrom' );
var minWidth = require( './layoutBoundSize/minWidth' );
var minWidthFrom = require( './layoutBoundSize/minWidthFrom' );






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
	this.sizeDependencies = [];
	this.positionDependencies = [];
	this.rulesPos = [];
	this.rulesPosProp = [];
	this.rulesSize = [];
	this.rulesSizeProp = [];
	this.rulesPosBound = [];
	this.rulesPosBoundProp = [];
	this.rulesSizeBound = [];
	this.rulesSizeBoundProp = [];
};

LayoutNode.SIZE_LAYOUT = 'SIZE_LAYOUT';
LayoutNode.SIZE_BOUND = 'SIZE_BOUND';
LayoutNode.SIZE_WIDTH_LAYOUT = 'SIZE_WIDTH_LAYOUT';
LayoutNode.SIZE_WIDTH_BOUND = 'SIZE_WIDTH_BOUND';
LayoutNode.SIZE_HEIGHT_LAYOUT = 'SIZE_HEIGHT_LAYOUT';
LayoutNode.SIZE_HEIGHT_BOUND = 'SIZE_HEIGHT_BOUND';

LayoutNode.POSITION_LAYOUT = 'POSITION_LAYOUT';
LayoutNode.POSITION_BOUND = 'POSITION_BOUND';
LayoutNode.POSITION_X_LAYOUT = 'POSITION_X_LAYOUT';
LayoutNode.POSITION_X_BOUND = 'POSITION_X_BOUND';
LayoutNode.POSITION_Y_LAYOUT = 'POSITION_Y_LAYOUT';
LayoutNode.POSITION_Y_BOUND = 'POSITION_Y_BOUND';


LayoutNode.prototype.SIZE_LAYOUT = LayoutNode.SIZE_LAYOUT;
LayoutNode.prototype.SIZE_BOUND = LayoutNode.SIZE_BOUND;
LayoutNode.prototype.SIZE_WIDTH_LAYOUT = LayoutNode.SIZE_WIDTH_LAYOUT;
LayoutNode.prototype.SIZE_WIDTH_BOUND = LayoutNode.SIZE_WIDTH_BOUND;
LayoutNode.prototype.SIZE_HEIGHT_LAYOUT = LayoutNode.SIZE_HEIGHT_LAYOUT;
LayoutNode.prototype.SIZE_HEIGHT_BOUND = LayoutNode.SIZE_HEIGHT_BOUND;

LayoutNode.prototype.POSITION_LAYOUT = LayoutNode.POSITION_LAYOUT;
LayoutNode.prototype.POSITION_BOUND = LayoutNode.POSITION_BOUND;
LayoutNode.prototype.POSITION_X_LAYOUT = LayoutNode.POSITION_X_LAYOUT;
LayoutNode.prototype.POSITION_X_BOUND = LayoutNode.POSITION_X_BOUND;
LayoutNode.prototype.POSITION_Y_LAYOUT = LayoutNode.POSITION_Y_LAYOUT;
LayoutNode.prototype.POSITION_Y_BOUND = LayoutNode.POSITION_Y_BOUND;
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
LayoutNode.prototype.sizeDependencies = null;
LayoutNode.prototype.positionDependencies = null;
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

	for( var i = 0, len = this.sizeDependencies.length; i < len; i++ ) {

		if( !this.sizeDependencies[ i ].hasBeenLayedOut ) {

			this.sizeDependencies[ i ].doLayout();
		}
	}	

	for( var i = 0, len = this.positionDependencies.length; i < len; i++ ) {

		if( !this.positionDependencies[ i ].hasBeenLayedOut ) {

			this.positionDependencies[ i ].doLayout();
		}
	}	


	//HANDLE SIZE
	for( var i = 0, len = this.rulesSize.length; i < len; i++ ) {

		this.rulesSize[ i ].apply( this, this.rulesSizeProp[ i ] );
	}

	this._width += this._offWidth;
	this._height += this._offHeight;

	for( var i = 0, len = this.rulesSizeBound.length; i < len; i++ ) {

		this.rulesSizeBound[ i ].apply( this, this.rulesSizeBoundProp[ i ] );
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

	//check if this is just a utility LayoutNode (it doesn't actually position and resize anything)
	if( this.item ) {
		
		this.layoutFunction( this.item, this );
	}

	this.hasBeenLayedOut = true;
};

LayoutNode.prototype.setLayoutFunction = function( layoutFunction ) {

	this.layoutFunction = layoutFunction;

	return this;
};

LayoutNode.prototype.addDependency = function( item ) {

	if( item != this.layout ) {
		
		if( this.lastPropTypeEffected == SIZE || 
			this.lastPropTypeEffected == SIZE_WIDTH ||
			this.lastPropTypeEffected == SIZE_HEIGHT ) {

			this.sizeDependencies.push( item );
		} else {

			this.positionDependencies.push( item );
		}
	}

	return this;
};

LayoutNode.prototype.addCustomRule = function( ruleFunction, ruleType ) {

	arguments = Array.prototype.slice.call( arguments, 2 );

	var effectsProperties = null;
	var ruleArr = null;
	var rulePropArr = null;

	switch( ruleType ) {

		case LayoutNode.SIZE_LAYOUT:
			effectsProperties = SIZE;
			ruleArr = this.rulesSize;
			rulePropArr = this.rulesSizeProp;
		break;

		case LayoutNode.SIZE_BOUND:
			effectsProperties = SIZE;
			ruleArr = this.rulesSizeBound;
			rulePropArr = this.rulesSizeBoundProp;
		break;

		case LayoutNode.SIZE_WIDTH_LAYOUT:
			effectsProperties = SIZE_WIDTH;
			ruleArr = this.rulesSize;
			rulePropArr = this.rulesSizeProp;
		break;

		case LayoutNode.SIZE_WIDTH_BOUND:
			effectsProperties = SIZE_WIDTH;
			ruleArr = this.rulesSizeBound;
			rulePropArr = this.rulesSizeBoundProp;
		break;		

		case LayoutNode.SIZE_HEIGHT_LAYOUT:
			effectsProperties = SIZE_HEIGHT;
			ruleArr = this.rulesSize;
			rulePropArr = this.rulesSizeProp;
		break;

		case LayoutNode.SIZE_HEIGHT_BOUND:
			effectsProperties = SIZE_HEIGHT;
			ruleArr = this.rulesSizeBound;
			rulePropArr = this.rulesSizeBoundProp;
		break;

		case LayoutNode.POSITION_LAYOUT:
			effectsProperties = POSITION;
			ruleArr = this.rulesPos;
			rulePropArr = this.rulesPosProp;
		break;

		case LayoutNode.POSITION_BOUND:

			effectsProperties = POSITION;
			ruleArr = this.rulesPosBound;
			rulePropArr = this.rulesPosBoundProp;
		break;

		case LayoutNode.POSITION_X_LAYOUT:
			effectsProperties = POSITION_X;
			ruleArr = this.rulesPos;
			rulePropArr = this.rulesPosProp;
		break;

		case LayoutNode.POSITION_X_BOUND:
			effectsProperties = POSITION_X;
			ruleArr = this.rulesPosBound;
			rulePropArr = this.rulesPosBoundProp;
		break;		

		case LayoutNode.POSITION_Y_LAYOUT:
			effectsProperties = POSITION_Y;
			ruleArr = this.rulesPos;
			rulePropArr = this.rulesPosProp;
		break;

		case LayoutNode.POSITION_Y_BOUND:
			effectsProperties = POSITION_Y;
			ruleArr = this.rulesPosBound;
			rulePropArr = this.rulesPosBoundProp;
		break;

		default: 
			throw 'Uknown rule type';
		break;
	};

	addRule.call( this, ruleFunction, arguments, ruleArr, rulePropArr, effectsProperties );

	return this;
};

LayoutNode.prototype.resetRules = function() {

	this.resetPositionRules();
	this.resetSizeRules();

	return this;
};

LayoutNode.prototype.resetPositionRules = function() {

	this.positionDependencies = [];
	this._offX = this._offY = 0;
	this.rulesPos = [];
	this.rulesPosProp = [];

	if( this.hasBeenLayedOut ) {
			
		this.layout.nodeChanged( this );
	}

	return this;
};

LayoutNode.prototype.resetSizeRules = function() {

	this.sizeDependencies = [];
	this._offWidth = this._offHeight = 0;
	this.rulesSize = [];
	this.rulesSizeProp = [];

	if( this.hasBeenLayedOut ) {
			
		this.layout.nodeChanged( this );
	}

	return this;
};

LayoutNode.prototype.create = function( itemToLayDown ) {

	return this.layout.create( itemToLayDown );
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
			this._offWidth += arguments[ 0 ];
			this._offHeight += arguments[ 0 ];
		break;

		case SIZE_WIDTH:
			this._offWidth += arguments[ 0 ];
		break;

		case SIZE_HEIGHT:
			this._offHeight += arguments[ 0 ];
		break;

		case POSITION:
			this._offX += arguments[ 0 ];
			this._offY += arguments[ 0 ];
		break;

		case POSITION_X:
			this._offX += arguments[ 0 ];
		break;

		case POSITION_Y:
			this._offY += arguments[ 0 ];
		break;
	}

	return this;
};

LayoutNode.prototype.minus = function() {

	switch( this.lastPropTypeEffected ) {

		case SIZE:
			this._offWidth -= arguments[ 0 ];
			this._offHeight -= arguments[ 0 ];
		break;

		case SIZE_WIDTH:
			this._offWidth -= arguments[ 0 ];
		break;

		case SIZE_HEIGHT:
			this._offHeight -= arguments[ 0 ];
		break;

		case POSITION:
			this._offX -= arguments[ 0 ];
			this._offY -= arguments[ 0 ];
		break;

		case POSITION_X:
			this._offX -= arguments[ 0 ];
		break;

		case POSITION_Y:
			this._offY -= arguments[ 0 ];
		break;
	}

	return this;
};

LayoutNode.prototype.min = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		this.addDependency( arguments[ 0 ] );

		switch( this.lastPropTypeEffected ) {

			case SIZE:
				addRule.call( this, minSizeFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE );
			break;

			case SIZE_WIDTH:
				addRule.call( this, minWidthFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE_WIDTH );
			break;

			case SIZE_HEIGHT:
				addRule.call( this, minHeightFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE_HEIGHT );
			break;

			case POSITION:
				addRule.call( this, minPositionFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION );
			break;

			case POSITION_X:
				addRule.call( this, minXFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION_X );
			break;

			case POSITION_Y:
				addRule.call( this, minYFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION_Y );
			break;
		}		
	} else {

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
	}

	return this;
};

LayoutNode.prototype.max = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		this.addDependency( arguments[ 0 ] );

		switch( this.lastPropTypeEffected ) {

			case SIZE:
				addRule.call( this, maxSizeFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE );
			break;

			case SIZE_WIDTH:
				addRule.call( this, maxWidthFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE_WIDTH );
			break;

			case SIZE_HEIGHT:
				addRule.call( this, maxHeightFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, SIZE_HEIGHT );
			break;

			case POSITION:
				addRule.call( this, maxPositionFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION );
			break;

			case POSITION_X:
				addRule.call( this, maxXFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION_X );
			break;

			case POSITION_Y:
				addRule.call( this, maxYFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, POSITION_Y );
			break;
		}
	} else {

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
	}

	return this;
};

function addRule( rule, ruleArguments, ruleArr, rulePropArr, type ) {

	ruleArr.push( rule );
	rulePropArr.push( ruleArguments );

	this.lastPropTypeEffected = type;
}






module.exports = LayoutNode;