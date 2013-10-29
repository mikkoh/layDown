
///POSITION FUNCTIONS
var alignedAbove = require( './layoutPosition/alignedAbove' );
var alignedBelow = require( './layoutPosition/alignedBelow' );
var alignedLeftOf = require( './layoutPosition/alignedLeftOf' );
var alignedRightOf = require( './layoutPosition/alignedRightOf' );
var alignedWith = require( './layoutPosition/alignedWith' );
var bottomAlignedWith = require( './layoutPosition/bottomAlignedWith' );
var centeredWith = require( './layoutPosition/centeredWith' );
var horizontallyCenteredWith = require( './layoutPosition/horizontallyCenteredWith' );
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

//CONDITIONAL FUNCTIONS
var widthGreaterThan = require( './conditionals/widthGreaterThan' );
var heightGreaterThan = require( './conditionals/heightGreaterThan' );
var widthSmallerThan = require( './conditionals/widthSmallerThan' );
var heightSmallerThan = require( './conditionals/heightSmallerThan' );

//OFFSET FUNCTIONS
var minusHeight = require( './offsets/minusHeight' );
var minusPosition = require( './offsets/minusPosition' );
var minusSize = require( './offsets/minusSize' );
var minusWidth = require( './offsets/minusWidth' );
var minusX = require( './offsets/minusX' );
var minusY = require( './offsets/minusY' );
var plusHeight = require( './offsets/plusHeight' );
var plusPosition = require( './offsets/plusPosition' );
var plusSize = require( './offsets/plusSize' );
var plusWidth = require( './offsets/plusWidth' );
var plusX = require( './offsets/plusX' );
var plusY = require( './offsets/plusY' );






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

var BOUND_SIZE = 'BOUND_SIZE';
var BOUND_SIZE_WIDTH = 'BOUND_SIZE_WIDTH';
var BOUND_SIZE_HEIGHT = 'BOUND_SIZE_HEIGHT';
var BOUND_POSITION = 'BOUND_POSITION';
var BOUND_POSITION_X = 'BOUND_POSITION_X';
var BOUND_POSITION_Y = 'BOUND_POSITION_Y';






var LayoutNode = function( layout, item, layoutFunction, readFunction ) {

	this.layout = layout;
	this.item = item;
	this.layoutFunction = layoutFunction;
	this.readFunction = readFunction;
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
	this.itemsToCompare = [];
	this.conditionalsForItem = [];
	this.conditionalsArgumentsForItem = [];
	this.layoutNodeForConditional = [];
	this.conditionalListeners = [];
	this.offFunctionsSize = [];
	this.offFunctionsSizeArgs = [];
	this.offFunctionsPosition = [];
	this.offFunctionsPositionArgs = [];
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
LayoutNode.prototype._isDoingWhen = false;
LayoutNode.prototype._hasConditional = false;
LayoutNode.prototype._isDoingDefault = false;
LayoutNode.prototype.layout = null;
LayoutNode.prototype.item = null;
LayoutNode.prototype.layoutFunction = null;
LayoutNode.prototype.readFunction = null;
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
LayoutNode.prototype.itemsToCompare = null;
LayoutNode.prototype.conditionalsForItem = null;
LayoutNode.prototype.conditionalsArgumentsForItem = null;
LayoutNode.prototype.layoutNodeForConditional = null;
LayoutNode.prototype.layoutNodeForDefault = null;
LayoutNode.prototype.conditionalParent = null; //this is the parent LayoutNode that this conditional LayoutNode was created from
LayoutNode.prototype.conditionalListeners = null;
LayoutNode.prototype.defaultConditionalListener = null;
LayoutNode.prototype.lastConditionalListnerIdx = -1;
LayoutNode.prototype.lastConditionalListenerIsDefault = false;
LayoutNode.prototype.doNotReadWidth = false;
LayoutNode.prototype.doNotReadHeight = false;
LayoutNode.prototype.offFunctionsSize = null;
LayoutNode.prototype.offFunctionsSizeArgs = null;
LayoutNode.prototype.offFunctionsPosition = null;
LayoutNode.prototype.offFunctionsPositionArgs = null;

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

	this.hasBeenLayedOut = true;

	this._x = this._y = this._width = this._height = 0;

	var listenerForConditional = null;

	if( this.itemsToCompare.length > 0 ) {

		var conditionalLayedOut = false;

		for( var i = 0, lenI = this.itemsToCompare.length; i < lenI; i++ ) {

			var layoutNode = this.layoutNodeForConditional[ i ];
			var itemsToCompareTo = this.itemsToCompare[ i ];
			var isConditionalValid = true;

			for( var j = 0, lenJ = itemsToCompareTo.length; isConditionalValid && j < lenJ; j++ ) {

				var conditionals = this.conditionalsForItem[ i ][ j ];
				var argumentsForConditionals = this.conditionalsArgumentsForItem[ i ][ j ];
				
				for( var k = 0, lenK = conditionals.length; isConditionalValid && k < lenK; k++ ) {

					isConditionalValid = conditionals[ k ].apply( itemsToCompareTo[ k ], argumentsForConditionals[ k ] );
				}
			}

			//if the conditional is still valid after
			//all the tests then we should do layout with this other node
			//instead of "this" which is now considered the default value
			if( isConditionalValid ) {

				layoutNode.doLayout();

				conditionalLayedOut = true;

				listenerForConditional = this.conditionalListeners[ i ];

				//since layout is performed we'll just exit this function
				break;
			} else {

				if( this.conditionalListeners[ i ] ) {

					this.conditionalListeners[ i ]( false );
				}				
			}
		}

		//if all of the above evaluated false then we'll get here
		//in which case we should check if theres a default
		if( !conditionalLayedOut && this.layoutNodeForDefault ) {

			listenerForConditional = this.defaultConditionalListener;

			this.layoutNodeForDefault.doLayout();
		}
	}

	//after conditionals have evaluated we may want to run
	//items that we will ALWAYS RUN
	doLayoutWork.call( this );

	//If this layoyt node has something to position and size and has a layout function run it
	if( this.item && this.layoutFunction ) {
		
		this.layoutFunction( this.item, this, this.doNotReadWidth, this.doNotReadHeight );
	}

	//if a conditional has been validated it should be called now
	if( listenerForConditional ) {

		listenerForConditional( true );
	}
};


//this is not a property of the prototype cause there's no need to have two functions
//on prototype that have similar names and in theory the other always uses the other
function doLayoutWork() {

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

		//HANDLE BOUNDING SIZE
		for( var j = 0, lenJ = this.rulesSizeBound.length; j < lenJ; j++ ) {

			this.rulesSizeBound[ j ].apply( this, this.rulesSizeBoundProp[ j ] );
		}
	}

	this._width += this._offWidth;
	this._height += this._offHeight;


	for( var i = 0, lenI = this.offFunctionsSize.length; i < lenI; i++ ) {

		this.offFunctionsSize[ i ].apply( this, this.offFunctionsSizeArgs[ i ] );
	}



	//HANDLE BOUNDING SIZE
	for( var j = 0, lenJ = this.rulesSizeBound.length; j < lenJ; j++ ) {

		this.rulesSizeBound[ j ].apply( this, this.rulesSizeBoundProp[ j ] );
	}
	

	//check if we should read in a size for an item
	if( this.item ) {

		if( !this.doNotReadWidth && !this.doNotReadWidth ) {

			this._width = this.readFunction( this.item, 'width' );
			this._height = this.readFunction( this.item, 'height' );
		} else if( !this.doNotReadWidth ) {

			this._width = this.readFunction( this.item, 'width' );
		} else if( !this.doNotReadHeight ) {

			this._height = this.readFunction( this.item, 'height' );
		}	
	}




	//HANDLE POSITION
	for( var i = 0, len = this.rulesPos.length; i < len; i++ ) {

		this.rulesPos[ i ].apply( this, this.rulesPosProp[ i ] );

		//HANDLE BOUNDING POSITION
		for( var j = 0, lenJ = this.rulesPosBound.length; j < lenJ; j++ ) {

			this.rulesPosBound[ j ].apply( this, this.rulesPosBoundProp[ j ] );
		}
	}

	this._x += this._offX;
	this._y += this._offY;

	for( var i = 0, lenI = this.offFunctionsPosition.length; i < lenI; i++ ) {

		this.offFunctionsPosition[ i ].apply( this, this.offFunctionsPositionArgs[ i ] );
	}

	//BOUND POSITION
	for( var j = 0, lenJ = this.rulesPosBound.length; j < lenJ; j++ ) {

		this.rulesPosBound[ j ].apply( this, this.rulesPosBoundProp[ j ] );
	}


	



	//because other items will actually rely on the values of the
	//parent node of a conditional node then we need to set the _x, _y, _width, _height
	//for the parent also
	if( this.conditionalParent != null ) {

		this.conditionalParent._x += this._x;
		this.conditionalParent._y += this._y;
		this.conditionalParent._width += this._width;
		this.conditionalParent._height += this._height;
	}
};

LayoutNode.prototype.setLayoutFunction = function( layoutFunction ) {

	this.layoutFunction = layoutFunction;

	return this;
};

LayoutNode.prototype.addDependency = function( item ) {

	switch( this.lastPropTypeEffected ) {

		case SIZE:
		case BOUND_SIZE:
		case SIZE_WIDTH:
		case BOUND_SIZE_WIDTH:
		case SIZE_HEIGHT:
		case BOUND_SIZE_HEIGHT:

			this.sizeDependencies.push( item );
		break;

		case POSITION:
		case BOUND_POSITION:
		case POSITION_X:
		case BOUND_POSITION_X:
		case POSITION_Y:
		case BOUND_POSITION_Y:

			this.positionDependencies.push( item );
		break;
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

	return addRule.call( this, ruleFunction, arguments, ruleArr, rulePropArr, effectsProperties );
};

LayoutNode.prototype.resetRules = function() {

	this.resetSizeRules();
	this.resetPositionRules();

	return this;
};

LayoutNode.prototype.resetPositionRules = function() {

	this.lastPropTypeEffected = null;
	this.positionDependencies = [];
	this._offX = this._offY = 0;
	this.offFunctionsPosition = [];
	this.offFunctionsPositionArgs = [];
	this.rulesPos = [];
	this.rulesPosProp = [];

	if( this.hasBeenLayedOut ) {
			
		this.layout.nodeChanged( this );
	}

	return this;
};

LayoutNode.prototype.resetSizeRules = function() {

	this.lastPropTypeEffected = null;
	this.sizeDependencies = [];
	this._offWidth = this._offHeight = 0;
	this.offFunctionsSize = [];
	this.offFunctionsSizeArgs = [];
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

//This is not a part of prototype cause it's more just a utility function to add rules quickly
//don't want people to get confused if there's an add rule function on the proto
function addRule( rule, ruleArguments, ruleArr, rulePropArr, type ) {

	if( this.conditionalParent ) { 

		//check wheter width is being effected
		this.conditionalParent.doNotReadWidth = this.conditionalParent.doNotReadWidth || 
		type == SIZE ||
		type == SIZE_WIDTH;

		this.conditionalParent.doNotReadHeight = this.conditionalParent.doNotReadHeight || 
		type == SIZE ||
		type == SIZE_HEIGHT;


		//if we're in a child conditional and this is a bound function it should be added to the parent
		if( type == BOUND_SIZE ||
		    type == BOUND_SIZE_WIDTH ||
		    type == BOUND_SIZE_HEIGHT ) {

			ruleArr = this.conditionalParent.rulesSizeBound;
			rulePropArr = this.conditionalParent.rulesSizeBoundProp;

		//if we're in a child conditional and this is a bound function it should be added to the parent
		} else if( type == BOUND_POSITION ||
				   type == BOUND_POSITION_X ||
				   type == BOUND_POSITION_Y ) {

			ruleArr = this.conditionalParent.rulesPosBound;
			rulePropArr = this.conditionalParent.rulesPosBoundProp;
		}
	} else {

		//check wheter width is being effected
		this.doNotReadWidth = this.doNotReadWidth || 
		type == SIZE ||
		type == SIZE_WIDTH;

		this.doNotReadHeight = this.doNotReadHeight || 
		type == SIZE ||
		type == SIZE_HEIGHT;
	}


	//just check if we've started writing a conditional but didnt add a case
	if( this._isDoingWhen && !this._hasConditional ) {

		throw 'You should add a conditional such as "widthGreaterThan" before adding a rule';

	//if these are both true then when has been called and a conditional
	//has been added so we should create a new layout node for the conditionals
	} else if( ( this._isDoingWhen && this._hasConditional ) || this._isDoingDefault ) {

		var nNode = new LayoutNode( this.layout );
		nNode.conditionalParent = this;

		if( !this._isDoingDefault ) {

			this.layoutNodeForConditional.push( nNode );
		} else {

			this.layoutNodeForDefault = nNode;
		}

		this._isDoingWhen = false;
		this._hasConditional = false;
		this._isDoingDefault = false;

		//need to figure out which ruleArr and rulePropArr to use
		switch( type ) {

			case SIZE:
			case SIZE_WIDTH:
			case SIZE_HEIGHT:

				ruleArr = nNode.rulesSize;
				rulePropArr = nNode.rulesSizeProp;
			break;

			case POSITION:
			case POSITION_X:
			case POSITION_Y:

				ruleArr = nNode.rulesPos;
				rulePropArr  = nNode.rulesPosProp;
			break;
		}

		//this will return the new node
		return addRule.call( nNode, rule, ruleArguments, ruleArr, rulePropArr, type );
	}

	ruleArr.push( rule );
	rulePropArr.push( ruleArguments );

	this.lastPropTypeEffected = type;

	if( ruleArguments[ 0 ] instanceof LayoutNode ) {

		this.addDependency( ruleArguments[ 0 ] );
	}

	return this;
}


/************************************************************/
/************************************************************/
/********************POSITION FUNCTIONS**********************/
/************************************************************/
/************************************************************/

LayoutNode.prototype.positionIs = function( x, y ) {

	return addRule.call( this, positionIs, arguments, this.rulesPos, this.rulesPosProp, POSITION );
};

LayoutNode.prototype.xIs = function( x ) {

	return addRule.call( this, xIs, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

LayoutNode.prototype.yIs = function( y ) {

	return addRule.call( this, yIs, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
};

LayoutNode.prototype.alignedBelow = function( item ) {

	return addRule.call( this, alignedBelow, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
};

LayoutNode.prototype.alignedAbove = function( item ) {

	return addRule.call( this, alignedAbove, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );

};

LayoutNode.prototype.alignedLeftOf = function( item ) {

	return addRule.call( this, alignedLeftOf, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

LayoutNode.prototype.alignedRightOf = function( item ) {

	return addRule.call( this, alignedRightOf, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

LayoutNode.prototype.alignedWith = function( item ) {

	return addRule.call( this, alignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION );
};

LayoutNode.prototype.leftAlignedWith = function( item ) {

	return addRule.call( this, leftAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

LayoutNode.prototype.rightAlignedWith = function( item ) {

	return addRule.call( this, rightAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

LayoutNode.prototype.topAlignedWith = function( item ) {

	return addRule.call( this, topAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
};

LayoutNode.prototype.bottomAlignedWith = function( item ) {

	return addRule.call( this, bottomAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
};

LayoutNode.prototype.centeredWith = function( item ) {

	return addRule.call( this, centeredWith, arguments, this.rulesPos, this.rulesPosProp, POSITION );
};

LayoutNode.prototype.horizontallyCenteredWith = function( item ) {

	return addRule.call( this, horizontallyCenteredWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

LayoutNode.prototype.verticallyCenteredWith = function( item ) {

	return addRule.call( this, verticallyCenteredWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
};

/************************************************************/
/************************************************************/
/**********************SIZE FUNCTIONS************************/
/************************************************************/
/************************************************************/
LayoutNode.prototype.sizeIs = function( width, height ) {

	return addRule.call( this, sizeIs, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
}

LayoutNode.prototype.widthIs = function( width ) {

	return addRule.call( this, widthIs, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
}

LayoutNode.prototype.heightIs = function( height ) {

	return addRule.call( this, heightIs, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );

}

LayoutNode.prototype.sizeIsProportional = function( originalWidth, originalHeight ) {

	return addRule.call( this, sizeIsProportional, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
}

LayoutNode.prototype.widthIsProportional = function( originalWidth, originalHeight ) {

	return addRule.call( this, widthIsProportional, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
}

LayoutNode.prototype.heightIsProportional = function( originalWidth, originalHeight ) {

	return addRule.call( this, heightIsProportional, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
}

LayoutNode.prototype.matchesSizeOf = function( item ) {

	return addRule.call( this, matchesSizeOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
}

LayoutNode.prototype.matchesWidthOf = function( item ) {

	return addRule.call( this, matchesWidthOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
}

LayoutNode.prototype.matchesHeightOf = function( item ) {

	return addRule.call( this, matchesHeightOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
}

LayoutNode.prototype.sizeIsAPercentageOf = function( item, percentage ) {

	return addRule.call( this, sizeIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
}

LayoutNode.prototype.widthIsAPercentageOf = function( item, percentage ) {

	return addRule.call( this, widthIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
}

LayoutNode.prototype.heightIsAPercentageOf = function( item, percentage ) {

	return addRule.call( this, heightIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
}



/************************************************************/
/************************************************************/
/*********************OFFSET FUNCTIONS***********************/
/************************************************************/
/************************************************************/
function addOffFunction( func, arguments ) {

	this.addDependency( arguments[ 0 ] );

	switch( this.lastPropTypeEffected ) {

		case SIZE:
		case BOUND_SIZE:
		case SIZE_WIDTH:
		case BOUND_SIZE_WIDTH:
		case SIZE_HEIGHT:
		case BOUND_SIZE_HEIGHT:

			this.offFunctionsSize.push( func );
			this.offFunctionsSizeArgs.push( arguments );
		break;

		case POSITION:
		case BOUND_POSITION:
		case POSITION_X:
		case BOUND_POSITION_X:
		case POSITION_Y:
		case BOUND_POSITION_Y:

			this.offFunctionsPosition.push( func );
			this.offFunctionsPositionArgs.push( arguments );
		break;
	}
}

LayoutNode.prototype.plus = function() {

	switch( this.lastPropTypeEffected ) {

		case SIZE:
		case BOUND_SIZE:

			if( arguments.length == 1 ) {

				if( arguments[ 0 ] instanceof LayoutNode ) {

					addOffFunction.call( this, plusSize, arguments );
				} else {

					this._offWidth += arguments[ 0 ];
					this._offHeight += arguments[ 0 ];		
				}
			} else if( arguments.length == 2 ) {

				this._offWidth += arguments[ 0 ];
				this._offHeight += arguments[ 1 ];
			}
			
			this.doNotReadWidth = true;
			this.doNotReadHeight = true;
		break;

		case SIZE_WIDTH:
		case BOUND_SIZE_WIDTH:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addOffFunction.call( this, plusWidth, arguments );
			} else {

				this._offWidth += arguments[ 0 ];
			}

			this.doNotReadWidth = true;
		break;

		case SIZE_HEIGHT:
		case BOUND_SIZE_HEIGHT:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addOffFunction.call( this, plusHeight, arguments );
			} else {

				this._offHeight += arguments[ 0 ];
			}

			this.doNotReadHeight = true;
		break;

		case POSITION:
		case BOUND_POSITION:
			if( arguments.length == 1 ) {

				if( arguments[ 0 ] instanceof LayoutNode ) {

					addOffFunction.call( this, plusPosition, arguments );
				} else {

					this._offX += arguments[ 0 ];
					this._offY += arguments[ 0 ];	
				}
			} else if( arguments.length == 2 ) {

				this._offX += arguments[ 0 ];
				this._offY += arguments[ 1 ];
			}
			
		break;

		case POSITION_X:
		case BOUND_POSITION_X:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addOffFunction.call( this, plusX, arguments );
			} else {

				this._offX += arguments[ 0 ];
			}
		break;

		case POSITION_Y:
		case BOUND_POSITION_Y:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addOffFunction.call( this, plusY, arguments );
			} else {

				this._offY += arguments[ 0 ];
			}
		break;

		case null:

			if( arguments[ 0 ] instanceof LayoutNode ) {

				this.lastPropTypeEffected = POSITION;
				addOffFunction.call( this, plusPosition, arguments );

				this.lastPropTypeEffected = SIZE;
				addOffFunction.call( this, plusSize, arguments );	

				this.lastPropTypeEffected = null;
			} else if( arguments.length == 1 ) {

				this._offX += arguments[ 0 ];
			} else if( arguments.length == 2 ) {

				this._offX += arguments[ 0 ];
				this._offY += arguments[ 1 ];
			}
		break;
	}

	return this;
};

LayoutNode.prototype.minus = function() {

	switch( this.lastPropTypeEffected ) {

		case SIZE:
		case BOUND_SIZE:

			if( arguments.length == 1 ) {

				if( arguments[ 0 ] instanceof LayoutNode ) {

					addOffFunction.call( this, minusSize, arguments );
				} else {

					this._offWidth -= arguments[ 0 ];
					this._offHeight -= arguments[ 0 ];	
				}
			} else if( arguments.length == 2 ) {

				this._offWidth -= arguments[ 0 ];
				this._offHeight -= arguments[ 1 ];
			}
			
			this.doNotReadWidth = true;
			this.doNotReadHeight = true;
		break;

		case SIZE_WIDTH:
		case BOUND_SIZE_WIDTH:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addOffFunction.call( this, minusWidth, arguments );
			} else {

				this._offWidth -= arguments[ 0 ];
			}

			this.doNotReadWidth = true;
		break;

		case SIZE_HEIGHT:
		case BOUND_SIZE_HEIGHT:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addOffFunction.call( this, minusHeight, arguments );
			} else {

				this._offHeight -= arguments[ 0 ];
			}
			this.doNotReadHeight = true;
		break;

		case POSITION:
		case BOUND_POSITION:

			if( arguments.length == 1 ) {

				if( arguments[ 0 ] instanceof LayoutNode ) {

					addOffFunction.call( this, minusPosition, arguments );
				} else {

					this._offX -= arguments[ 0 ];
					this._offY -= arguments[ 0 ];
				}
			} else if( arguments.length == 2 ) {

				this._offX -= arguments[ 0 ];
				this._offY -= arguments[ 1 ];
			}
		break;

		case POSITION_X:
		case BOUND_POSITION_X:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addOffFunction.call( this, minusX, arguments );
			} else {

				this._offX -= arguments[ 0 ];
			}
		break;

		case POSITION_Y:
		case BOUND_POSITION_Y:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addOffFunction.call( this, minusY, arguments );
			} else {

				this._offY -= arguments[ 0 ];
			}
		break;

		case null:

			if( arguments[ 0 ] instanceof LayoutNode ) {

				this.lastPropTypeEffected = POSITION;
				addOffFunction.call( this, minusPosition, arguments );

				this.lastPropTypeEffected = SIZE;
				addOffFunction.call( this, plusPosition, arguments );	

				this.lastPropTypeEffected = null;
			} else if( arguments.length == 1 ) {

				this._offX -= arguments[ 0 ];
			} else if( arguments.length == 2 ) {

				this._offX -= arguments[ 0 ];
				this._offY -= arguments[ 1 ];
			}
		break;
	}

	return this;
};

/************************************************************/
/************************************************************/
/********************BOUND FUNCTIONS*************************/
/************************************************************/
/************************************************************/
LayoutNode.prototype.maxSize = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxSizeFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );	
	} else {

		return addRule.call( this, maxSize, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE );
	}
};

LayoutNode.prototype.maxWidth = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxWidthFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );	
	} else {

		return addRule.call( this, maxWidth, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );	
	}
};

LayoutNode.prototype.maxHeight = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxHeightFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
	} else {

		return addRule.call( this, maxHeight, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
	}
};

LayoutNode.prototype.minSize = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minSizeFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE );
	} else {

		return addRule.call( this, minSize, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE );
	}
};

LayoutNode.prototype.minWidth = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minWidthFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );
	} else {

		return addRule.call( this, minWidth, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );
	}
};

LayoutNode.prototype.minHeight = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minHeightFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
	} else {

		return addRule.call( this, minHeight, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
	}
};

LayoutNode.prototype.maxPosition = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxPositionFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, maxPosition, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};

LayoutNode.prototype.maxX = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxXFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, maxX, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};

LayoutNode.prototype.maxY = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxYFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, maxY, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};

LayoutNode.prototype.minPosition = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minPositionFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, minPosition, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};

LayoutNode.prototype.minX = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minXFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, minX, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};

LayoutNode.prototype.maxY = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minYFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, minY, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};





//General max and min functions that can be called after anything and the previous value will be used
LayoutNode.prototype.max = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		this.addDependency( arguments[ 0 ] );

		switch( this.lastPropTypeEffected ) {

			case SIZE:
			case BOUND_SIZE:
				return addRule.call( this, maxSizeFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE );
			

			case SIZE_WIDTH:
			case BOUND_SIZE_WIDTH:
				return addRule.call( this, maxWidthFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );
			

			case SIZE_HEIGHT:
			case BOUND_SIZE_HEIGHT:
				return addRule.call( this, maxHeightFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
			

			case POSITION:
			case BOUND_POSITION:
				return addRule.call( this, maxPositionFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
			

			case POSITION_X:
			case BOUND_POSITION_X:
				return addRule.call( this, maxXFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_X );
			

			case POSITION_Y:
			case BOUND_POSITION_Y:
				return addRule.call( this, maxYFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_Y );
			
		}
	} else {

		switch( this.lastPropTypeEffected ) {

			case SIZE:
			case BOUND_SIZE:
				return addRule.call( this, maxSize, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE );
			

			case SIZE_WIDTH:
			case BOUND_SIZE_WIDTH:
				return addRule.call( this, maxWidth, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );
			

			case SIZE_HEIGHT:
			case BOUND_SIZE_HEIGHT:
				return addRule.call( this, maxHeight, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
			

			case POSITION:
			case BOUND_POSITION:
				return addRule.call( this, maxPosition, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
			

			case POSITION_X:
			case BOUND_POSITION_X:
				return addRule.call( this, maxX, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_X );
			

			case POSITION_Y:
			case BOUND_POSITION_Y:
				return addRule.call( this, maxY, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_Y );
			
		}
	}
};

LayoutNode.prototype.min = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		this.addDependency( arguments[ 0 ] );

		switch( this.lastPropTypeEffected ) {

			case SIZE:
			case BOUND_SIZE:
				return addRule.call( this, minSizeFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE );
			

			case SIZE_WIDTH:
			case BOUND_SIZE_WIDTH:
				return addRule.call( this, minWidthFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );
			

			case SIZE_HEIGHT:
			case BOUND_SIZE_HEIGHT:
				return addRule.call( this, minHeightFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
			

			case POSITION:
			case BOUND_POSITION:
				return addRule.call( this, minPositionFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
			

			case POSITION_X:
			case BOUND_POSITION_X:
				return addRule.call( this, minXFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_X );
			

			case POSITION_Y:
			case BOUND_POSITION_Y:
				return addRule.call( this, minYFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_Y );
			
		}		
	} else {

		switch( this.lastPropTypeEffected ) {

			case SIZE:
			case BOUND_SIZE:
				return addRule.call( this, minSize, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE );
			

			case SIZE_WIDTH:
			case BOUND_SIZE_WIDTH:
				return addRule.call( this, minWidth, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );
			

			case SIZE_HEIGHT:
			case BOUND_SIZE_HEIGHT:
				return addRule.call( this, minHeight, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
			

			case POSITION:
			case BOUND_POSITION:
				return addRule.call( this, minPosition, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
			

			case POSITION_X:
			case BOUND_POSITION_X:
				return addRule.call( this, minX, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_X );
			

			case POSITION_Y:
			case BOUND_POSITION_Y:
				return addRule.call( this, minY, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_Y );
			
		}
	}
};


/************************************************************/
/************************************************************/
/*********************CONDITIONALS***************************/
/************************************************************/
/************************************************************/
function addConditional( cFunction, cArguments ) {

	if( !this._isDoingWhen ) {

		throw 'Before adding a conditional such as "widthGreaterThan" you should call the "when" function to declare which item we\'ll be comparing to';
	}

	this._hasConditional = true;

	var idx1 = this.itemsToCompare.length - 1;

	//we don't has many conditionals to compare against as we have items to compare against
	if( this.conditionalsForItem[ idx1 ] == undefined ) {

		this.conditionalsForItem[ idx1 ] = [];
		this.conditionalsArgumentsForItem[ idx1 ] = [];

		this.conditionalsForItem[ idx1 ].push( [] );
		this.conditionalsArgumentsForItem[ idx1 ].push( [] );

	} else if( this.itemsToCompare[ idx1 ].length != this.conditionalsForItem[ idx1 ].length ) {

		this.conditionalsForItem[ idx1 ].push( [] );
		this.conditionalsArgumentsForItem[ idx1 ].push( [] );
	}


	var idx2 = this.conditionalsForItem[ idx1 ].length - 1;

	this.conditionalsForItem[ idx1 ][ idx2 ].push( cFunction );
	this.conditionalsArgumentsForItem[ idx1 ][ idx2 ].push( cArguments );

	return this;
}


LayoutNode.prototype.when = function( node ) {

	//we're checking of this is layout node created based on conditionals
	//if when is called we should kick back to the parent nodes when function and call when there
	if( this.conditionalParent !== null ) {

		return this.conditionalParent.when( node );
	}

	//Check if they've called when and tried to call it again
	if( this._isDoingWhen && !this._hasConditional ) {

		throw 'You should call when or andWhen after adding conditionals such "widthGreaterThan"';
	}

	this._isDoingWhen = true;

	var itemArray = [];
	this.itemsToCompare.push( itemArray );
	itemArray.push( node );

	this.conditionalListeners.push( null );
	this.lastConditionalListnerIdx = this.conditionalListeners.length - 1;
	this.lastConditionalListenerIsDefault = false;

	return this;
};

LayoutNode.prototype.andWhen = function( node ) {

	if( this.conditionalParent ) {

		this.conditionalParent.andWhen( node );
	}

	this._isDoingWhen = true;

	var idx = this.itemsToCompare.length - 1;
	this.itemsToCompare[ idx ].push( node );

	return this;
};

LayoutNode.prototype.default = function() {

	this._isDoingDefault = true;

	if( this.conditionalParent ) {

		return this.conditionalParent.default();
	}

	this.lastConditionalListnerIdx = -1;
	this.lastConditionalListenerIsDefault = true;

	return this;
};

LayoutNode.prototype.on = function( listener ) {


	if( this.conditionalParent ) {

		this.conditionalParent.on( listener );
	} else {

		if( !this.lastConditionalListenerIsDefault ) {

			if( this.lastConditionalListnerIdx > -1 ) {

				this.conditionalListeners[ this.lastConditionalListnerIdx ] = listener;
			}
		} else {

			this.defaultConditionalListener = listener;
		}
	}

	return this;
};

LayoutNode.prototype.widthGreaterThan = function( value ) {

	return addConditional.call( this, widthGreaterThan, arguments );
};

LayoutNode.prototype.heightGreaterThan = function( value ) {

	return addConditional.call( this, heightGreaterThan, arguments );
};

LayoutNode.prototype.widthSmallerThan = function( value ) {

	return addConditional.call( this, widthSmallerThan, arguments );
};

LayoutNode.prototype.heightSmallerThan = function( value ) {

	return addConditional.call( this, heightSmallerThan, arguments );
};





module.exports = LayoutNode;