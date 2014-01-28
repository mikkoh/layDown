
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
var positionIsAPercentageOf = require( './layoutPosition/positionIsAPercentageOf' );
var rightAlignedWith = require( './layoutPosition/rightAlignedWith' );
var topAlignedWith = require( './layoutPosition/topAlignedWith' );
var verticallyCenteredWith = require( './layoutPosition/verticallyCenteredWith' );
var xIs = require( './layoutPosition/xIs' );
var yIs = require( './layoutPosition/yIs' );
var xIsAPercentageOf = require( './layoutPosition/xIsAPercentageOf' );
var yIsAPercentageOf = require( './layoutPosition/yIsAPercentageOf' );

//POSITION BOUND FUNCTIONS
var bottomMax = require( './layoutBoundPosition/bottomMax' );
var bottomMaxFrom = require( './layoutBoundPosition/bottomMaxFrom' );
var bottomMin = require( './layoutBoundPosition/bottomMin' );
var bottomMinFrom = require( './layoutBoundPosition/bottomMinFrom' );
var leftMax = require( './layoutBoundPosition/leftMax' );
var leftMaxFrom = require( './layoutBoundPosition/leftMaxFrom' );
var leftMin = require( './layoutBoundPosition/leftMin' );
var leftMinFrom = require( './layoutBoundPosition/leftMinFrom' );
var maxPosition = require( './layoutBoundPosition/maxPosition' );
var maxPositionFrom = require( './layoutBoundPosition/maxPositionFrom' );
var minPosition = require( './layoutBoundPosition/minPosition' );
var minPositionFrom = require( './layoutBoundPosition/minPositionFrom' );
var rightMax = require( './layoutBoundPosition/rightMax' );
var rightMaxFrom = require( './layoutBoundPosition/rightMaxFrom' );
var rightMin = require( './layoutBoundPosition/rightMin' );
var rightMinFrom = require( './layoutBoundPosition/rightMinFrom' );
var topMax = require( './layoutBoundPosition/topMax' );
var topMaxFrom = require( './layoutBoundPosition/topMaxFrom' );
var topMin = require( './layoutBoundPosition/topMin' );
var topMinFrom = require( './layoutBoundPosition/topMinFrom' );

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
var widthLessThan = require( './conditionals/widthLessThan' );
var heightLessThan = require( './conditionals/heightLessThan' );
var leftGreaterThan = require( './conditionals/leftGreaterThan' );
var rightGreaterThan = require( './conditionals/rightGreaterThan' );
var leftLessThan = require( './conditionals/leftLessThan' );
var rightLessThan = require( './conditionals/rightLessThan' );
var bottomGreaterThan = require( './conditionals/bottomGreaterThan' );
var topGreaterThan = require( './conditionals/topGreaterThan' );
var bottomLessThan = require( './conditionals/bottomLessThan' );
var topLessThan = require( './conditionals/topLessThan' );
var isInside = require( './conditionals/isInside' );
var isOutside = require( './conditionals/isOutside' );

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
var vMinusHeight = require( './offsets/vMinusHeight' );
var vMinusPosition = require( './offsets/vMinusPosition' );
var vMinusSize = require( './offsets/vMinusSize' );
var vMinusWidth = require( './offsets/vMinusWidth' );
var vMinusX = require( './offsets/vMinusX' );
var vMinusY = require( './offsets/vMinusY' );
var vPlusHeight = require( './offsets/vPlusHeight' );
var vPlusPosition = require( './offsets/vPlusPosition' );
var vPlusSize = require( './offsets/vPlusSize' );
var vPlusWidth = require( './offsets/vPlusWidth' );
var vPlusX = require( './offsets/vPlusX' );
var vPlusY = require( './offsets/vPlusY' );





/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*---------------------PROPS TO EFFECT----------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
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





/**
LayoutNode is where all the magic happens. LayoutNode's are created from LayDown. You will never instantiate LayoutNodes 
directly however you will use the LayDown node to always instantiate them.

LayoutNode's abstract positioning elements on screen using rules.

Basically what that means is if you're using the DOM, LayoutNode's will sit between the DOM and the logic
to position and resize things on screen.

To do this you add "rules" to the LayoutNode's by calling their rule functions. For ease of use and to keep inline with the
libraries goal of being very readable, handy to translate designers needs, all rules are chainable and form "sentences".

For example the code:

node.leftAlignedWith( someUI ).alignedBelow( someUI ).plus( 3 );

Would read as:

Our node will be left aligned with Some UI and aligned below Some UI plus 3 pixels.

@class LayoutNode
@constructor
@param {LayDown} layout Is the parent LayDown object. The parent LayDown object will manage relationships between all LayoutNode's and will
						handle circular dependencies and all that fun stuff.

@param item {Object} item will be what will be positioned on screen. For instance an HTML DOM Element or a PIXI DisplayObject. It's
				whatever you want to layout on screen.

@param layoutFunction {function} The layoutFunction function is a function which will translate the x, y, width, and height properties of a
LayoutNode into actual physical screen position. So for instance if we're working with the DOM it would set
CSS properties on the "item" passed in to ensure that the item is on screen at x, y at the correct size.

@param readFunction {function} If you define no sizing rules to set width and height of an "item"/LayoutNode then we will need to read the
width and height of the object to be able to position dependent LayoutNode's. 

So for instance if we have LayoutNode Button and LayoutNode Image and we wanted Image to be below Button and
Button has no layout rules for setting it's height we will need to "read" in Buttons height to be able to correctly
position Image. So if Button is a DIV element we will read in it's height to be able to postion Image below it.

**/
var LayoutNode = function( layout, item, layoutFunction, readFunction ) {

	this.layout = layout;
	this.item = item === undefined ? null : item;
	this.layoutFunction = layoutFunction === undefined ? null : layoutFunction;
	this.readFunction = readFunction === undefined ? null : readFunction;
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

	this._inner = null;
	this._x = 0;
	this._y = 0;
	this._width = 0;
	this._height = 0;
	this._offX = 0;
	this._offY = 0;
	this._offWidth = 0;
	this._offHeight = 0;
	this._isDoingWhen = false;
	this._hasConditional = false;
	this._isDoingDefault = false;
	this.lastPropTypeEffected = null;
	this.hasBeenLayedOut = false;
	this.layoutNodeForDefault = null;
	this.conditionalParent = null; //this is the parent LayoutNode that this conditional LayoutNode was created from
	this.defaultConditionalListener = null;
	this.lastConditionalListnerIdx = -1;
	this.lastConditionalListenerIsDefault = false;
	this.doNotReadWidth = false;
	this.doNotReadHeight = false;
};

/**
This constant describes or is a key for size layout rules where both width and height will be effected. 

This is used for instance used when adding custom rules.

@property SIZE_LAYOUT
@type String
@static
@final
**/
LayoutNode.SIZE_LAYOUT = 'SIZE_LAYOUT';

/**
This constant describes or is a key for size bound rules where both width and height will be bound. 

This is used for instance used when adding custom rules.

@property SIZE_BOUND
@type String
@static
@final
**/
LayoutNode.SIZE_BOUND = 'SIZE_BOUND';

/**
This constant describes or is a key for width layout rules where width will be effected. 

This is used for instance used when adding custom rules.

@property SIZE_WIDTH_LAYOUT
@type String
@static
@final
**/
LayoutNode.SIZE_WIDTH_LAYOUT = 'SIZE_WIDTH_LAYOUT';

/**
This constant describes or is a key for width bound rules where width will be bound. 

This is used for instance used when adding custom rules.

@property SIZE_WIDTH_BOUND
@type String
@static
@final
**/
LayoutNode.SIZE_WIDTH_BOUND = 'SIZE_WIDTH_BOUND';

/**
This constant describes or is a key for height layout rules where height will be effected. 

This is used for instance used when adding custom rules.

@property SIZE_HEIGHT_LAYOUT
@type String
@static
@final
**/
LayoutNode.SIZE_HEIGHT_LAYOUT = 'SIZE_HEIGHT_LAYOUT';

/**
This constant describes or is a key for height bound rules where height will be bound. 

This is used for instance used when adding custom rules.

@property SIZE_HEIGHT_BOUND
@type String
@static
@final
**/
LayoutNode.SIZE_HEIGHT_BOUND = 'SIZE_HEIGHT_BOUND';

/**
This constant describes or is a key for position layout rules where x and y will be effected. 

This is used for instance used when adding custom rules.

@property POSITION_LAYOUT
@type String
@static
@final
**/
LayoutNode.POSITION_LAYOUT = 'POSITION_LAYOUT';

/**
This constant describes or is a key for position bound rules where x and y will be both bound. 

This is used for instance used when adding custom rules.

@property POSITION_BOUND
@type String
@static
@final
**/
LayoutNode.POSITION_BOUND = 'POSITION_BOUND';

/**
This constant describes or is a key for x layout rules where x will be effected. 

This is used for instance used when adding custom rules.

@property POSITION_X_LAYOUT
@type String
@static
@final
**/
LayoutNode.POSITION_X_LAYOUT = 'POSITION_X_LAYOUT';

/**
This constant describes or is a key for x bound rules where x will be bound. 

This is used for instance used when adding custom rules.

@property POSITION_X_BOUND
@type String
@static
@final
**/
LayoutNode.POSITION_X_BOUND = 'POSITION_X_BOUND';

/**
This constant describes or is a key for y layout rules where y will be effected. 

This is used for instance used when adding custom rules.

@property POSITION_Y_LAYOUT
@type String
@static
@final
**/
LayoutNode.POSITION_Y_LAYOUT = 'POSITION_Y_LAYOUT';

/**
This constant describes or is a key for y bound rules where y will be bound. 

This is used for instance used when adding custom rules.

@property POSITION_Y_BOUND
@type String
@static
@final
**/
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

/**
This is the x position of the LayoutNode on screen. Initially the value of x will be 0 until this node has been layed out.

Once this node has been layed out the x position will be set from all the rules applied to this node.

You can also set the x position of a node by simply setting the x value:

	node.x = 10;

What this will do is adjust an offset in this LayoutNode. So in practice what this means is that you can freely move around
nodes for instance by dragging but all dependent nodes will still position themselves according to the rules set on them.

So for instance if you had an image that is right aligned to another image. If you grab the image on the left and move it around 
the image on the right will follow.

@property x
@type Number
**/
Object.defineProperty( LayoutNode.prototype, 'x', {

	get: function() {

		return this._x;
	},

	set: function( value ) {

		this.lastPropTypeEffected = POSITION_X;

		this._offX += value - this._x;
		
		if( this.hasBeenLayedOut ) {
			
			this.layout.nodeChanged( this );
		}
	}
});

/**
This is the y position of the LayoutNode on screen. Initially the value of y will be 0 until this node has been layed out.

Once this node has been layed out the y position will be set from all the rules applied to this node.

You can also set the y position of a node by simply setting the y value:

	node.y = 10;

What this will do is adjust an offset in this LayoutNode. So in practice what this means is that you can freely move around
nodes for instance by dragging but all dependent nodes will still position themselves according to the rules set on them.

So for instance if you had an image that is right aligned to another image. If you grab the image on the left and move it around 
the image on the right will follow.

@property y
@type Number
**/
Object.defineProperty( LayoutNode.prototype, 'y', {

	get: function() {

		return this._y;
	},

	set: function( value ) {

		this.lastPropTypeEffected = POSITION_Y;
		
		this._offY += value - this._y;

		if( this.hasBeenLayedOut ) {

			this.layout.nodeChanged( this );
		}
	}
});

/**
This is the width of a LayoutNode on screen. Initially the value of width will be 0 until this node has been layed out.

Once this node has been layed out the width will be set from all the rules applied to this node or read in by the read function.

You can also set the width of a node by simply setting the width value:

	node.width = 200;

What this will do is adjust an offset in this LayoutNode. So in practice what this means is that you can set the sizes of nodes
and still all dependent nodes will follow their dependency rules.

So let's say you had an image called image1 which you wanted to scale up however another image called image2 aligned left of image1.
You can still set image1.width to be whatever value you wanted and image2 would align left of image1.

@property width
@type Number
**/
Object.defineProperty( LayoutNode.prototype, 'width', {

	get: function() {

		return this._width;
	},

	set: function( value ) {

		this.lastPropTypeEffected = SIZE_WIDTH;

		this._offWidth += value - this._width;

		if( this.hasBeenLayedOut ) {
			
			this.layout.nodeChanged( this );
		}
	}
});

/**
This is the height of a LayoutNode on screen. Initially the value of height will be 0 until this node has been layed out.

Once this node has been layed out the height will be set from all the rules applied to this node or read in by the read function.

You can also set the height of a node by simply setting the height value:

	node.height = 333;

What this will do is adjust an offset in this LayoutNode. So in practice what this means is that you can set the sizes of nodes
and still all dependent nodes will follow their dependency rules.

So let's say you had an image called image1 which you wanted to scale up however another image called image2 aligned below image1.
You can still set image1.height to be whatever value you wanted and image2 would align below image1.

@property width
@type Number
**/
Object.defineProperty( LayoutNode.prototype, 'height', {

	get: function() {

		return this._height;
	},

	set: function( value ) {

		this.lastPropTypeEffected = SIZE_HEIGHT;

		this._offHeight += value - this._height;

		if( this.hasBeenLayedOut ) {
			
			this.layout.nodeChanged( this );
		}
	}
});


/**
Inner is a LayoutNode that is contained by this LayoutNode. Inner will match the size of this node but will have no positonal values.

It is useful when working with the DOM to handle nested content inside html elements. For instance if we have a div with an image inside. You can
can apply a LayoutNode to the div and use the inner attribute to center the image inside.

	var ourDiv = layout.create( document.getElementById( 'ourDiv' ) );
	var ourImageInsideDiv = layout.create( document.getElementById( 'ourImageInsideDiv' ) );

	ourDiv.matchesSizeOf( layout );
	ourImageInsideDiv.matchesWidthOf( ourDiv.inner ).heightIsProportional( 400, 300 ).centeredWith( ourDiv.inner );

@property inner
@type LayoutNode
**/
Object.defineProperty( LayoutNode.prototype, 'inner', {

	get: function() {

		if( this._inner === null ) {

			this._inner = this.layout.create();
			this._inner.matchesSizeOf( this );
		}

		return this._inner;
	}
});

/**
doLayout will perform the layout of this LayoutNode. This function should never be called directly but be called by the LayDown layout.
This way dependencies will be handled correctly.

So for instance if you have one LayoutNode which sets it's size according to another node calling doLayout manually could potentially be
destructive.

Although this is the entry point to perform layouts the actual grunt work is performed in the "doLayoutWork" function. This function will
evaluate conditionals (if there are any) and grab the appropriate rule sets to use. After the rule sets are determined by the conditionals
doLayoutWork is called.

@protected
@method doLayout
**/
LayoutNode.prototype.doLayout = function() {

	this.hasBeenLayedOut = true;

	this._x = this._y = this._width = this._height = 0;
	this.doLayoutWork();

	//this is the listener added when an on function was called after creating a conditional
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

	//If this layoyt node has something to position and size and has a layout function run it
	if( this.item && this.layoutFunction ) {
		
		this.layoutFunction( this.item, this, this.doNotReadWidth, this.doNotReadHeight );
	}

	//if a conditional has been validated it should be called now
	if( listenerForConditional ) {

		listenerForConditional( true );
	}
};


/**
doLayoutWork will perform the layout work of this LayoutNode. This function should never be called directly but be called by doLayout after
all conditionals (if any) are evaluated.

This function ensures everything is evaluated in correct order:

1. Size Dependencies
2. Position Dependencies
3. Size Rules
4. Size Bounds
5. Size Offsets
6. Size Bounds (again after size offset)
7. Reading width, height if they were not set
8. Position rules
9. Positional Bounds
10. Positional Offsets
11. Positional Bounds (again after position offset)

The basic rule of thumb is we can't position anything until we know it's size. Bounds are used to ensure things don't go off screen, get too big or small.

@protected
@method doLayoutWork
**/
LayoutNode.prototype.doLayoutWork = function() {

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

	for( var j = 0, lenJ = this.rulesSizeBound.length; j < lenJ; j++ ) {

		this.rulesSizeBound[ j ].apply( this, this.rulesSizeBoundProp[ j ] );
	}

	
	//check if we should read in a size for an item
	if( this.item ) {

		if( this.readFunction ) {

			if( !this.doNotReadWidth && !this.doNotReadWidth ) {

				this._width = this.readFunction( this.item, 'width' );
				this._height = this.readFunction( this.item, 'height' );
			} else if( !this.doNotReadWidth ) {

				this._width = this.readFunction( this.item, 'width' );
			} else if( !this.doNotReadHeight ) {

				this._height = this.readFunction( this.item, 'height' );
			}
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

/**
Use this function to set the layout function for this node. Layout functions perform the actual work to move things on screen. LayoutNode's and rules
on LayoutNode's perform the virtual positioning of an object where the layoutFunction performs the actual physical.

For instance if you're working with the DOM the layoutFunction could set CSS width and height properties or scale. Or if you really wanted to get fancy
it could perform an animation to position the HTML element.

@method setLayoutFunction
@param layoutFunction {function} This is the layout function that will position this LayoutNode.

Layout function's should take four properties: item, node, setWidth, setHeight. 

+ Where item is the item to layout (DOM element or PIXI DisplayObject)
+ node will be a LayoutNode from which you can read x, y, width, height
+ setWidth will be a boolean for whether the layout function should set the width of the item
+ setHeight will be a boolean for whether the layout function should set the height of the item
**/
LayoutNode.prototype.setLayoutFunction = function( layoutFunction ) {

	this.layoutFunction = layoutFunction;

	return this;
};

/**
You can use addCustomRule to define new rules which may not be defined by LayDown. This could be handy for instance if you wanted to set the
colour of a DIV element based on how large it is. Really the sky is the limit here. Although to ensure your new rule is performed correctly and
does not interfere with other rules you must pass in a rule type.

@method addCustomRule
@param {function} ruleFunction This a new rule you'd like to add. To see how rules are composed we suggest looking at the following functions
in the src folder.

###### Setting size (width, height):
- src/layoutSize/sizeIs (if your rule will be setting both width and height at the same time from values)
- src/layoutSize/widthIs (if your rule will be setting only the width from a value)
- src/layoutSize/heightIs (if your rule will be setting only the height from a value)
- src/layoutSize/matchesSizeOf (if your rule will be setting both width and height from another node)
- src/layoutSize/matchesWidthOf (if your rule will be setting both width from another node)
- src/layoutSize/matchesHeightOf (if your rule will be setting both height from another node)

###### Setting position (x, y):
- src/layoutPosition/positionIs (if your rule will be setting x and y from a values at the same time)
- src/layoutPosition/xIs (if your rule will be setting x from a value)
- src/layoutPosition/yIs (if your rule will be setting y from a value)
- src/layoutPosition/alignedWith (if your rule will be setting x and y based on another node)
- src/layoutPosition/leftAlignedWith (if your rule will be setting x based on another node)
- src/layoutPosition/topAlignedWith (if your rule will be setting y based on another node)

###### Bounding size (width, height):
- src/layoutBoundSize/maxSize (if your rule will be bounding both width and height at the same time)
- src/layoutBoundSize/maxWidth (if your rule will be bounding width only)
- src/layoutBoundSize/maxHeight (if your rule will be bounding height only)
- src/layoutBoundSize/maxSizeFrom (if your rule will be bounding width and height based on another item)
- src/layoutBoundSize/maxWidthFrom (if your rule will be bounding width based on another item)
- src/layoutBoundSize/maxHeightFrom (if your rule will be bounding height based on another item)

###### Bounding position (x, y):
- src/layoutBoundSize/maxPosition (if your rule will be bounding both x and y at the same time)
- src/layoutBoundSize/leftMax (if your rule will be bounding x only)
- src/layoutBoundSize/topMax (if your rule will be bounding y only)
- src/layoutBoundSize/maxPositionFrom (if your rule will be bounding x and y based on another item)
- src/layoutBoundSize/leftMaxFrom (if your rule will be bounding x based on another item)
- src/layoutBoundSize/topMaxFrom (if your rule will be bounding y based on another item)

@param {String} ruleType is a string which describes what type of rule you're defining. For utility you can use the static constants defined
on LayoutNode:

- {{#crossLink "LayoutNode/SIZE_LAYOUT:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/SIZE_LAYOUT:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/SIZE_BOUND:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/SIZE_WIDTH_LAYOUT:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/SIZE_WIDTH_BOUND:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/SIZE_HEIGHT_LAYOUT:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/SIZE_HEIGHT_BOUND:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/POSITION_LAYOUT:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/POSITION_BOUND:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/POSITION_X_LAYOUT:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/POSITION_X_BOUND:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/POSITION_Y_LAYOUT:property"}}{{/crossLink}}
- {{#crossLink "LayoutNode/POSITION_Y_BOUND:property"}}{{/crossLink}}


**/
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

LayoutNode.prototype.resetRules = function() {

	this.resetSizeRules();
	this.resetPositionRules();

	return this;
};

LayoutNode.prototype.resetPositionRules = function() {

	this.lastPropTypeEffected = null;
	this.positionDependencies = [];
	this.rulesPos = [];
	this.rulesPosProp = [];
	this._offX = this._offY = 0;

	if( this.hasBeenLayedOut ) {
			
		this.layout.nodeChanged( this );
	}

	return this;
};

LayoutNode.prototype.resetSizeRules = function() {

	this.lastPropTypeEffected = null;
	this.sizeDependencies = [];
	this.rulesSize = [];
	this.rulesSizeProp = [];
	this._offWidth = this._offHeight = 0;

	if( this.hasBeenLayedOut ) {
			
		this.layout.nodeChanged( this );
	}

	return this;
};

/**
This is a utility function to create a new LayoutNode. It will use the parent layout (LayDown) of this node.

This is basically for those peeps who loves them chainings. (don't get too crazy though)

@method create
@param itemToLayDown {Object} This is a new item to be laid out. eg. A DOM element or a DixiDisplayObject or whatever
**/
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
	//has been added so we should create a new LayoutNode for the conditionals
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


/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*-------------------POSITION FUNCTIONS---------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/

/**
This rule will position an item at the cordinate passed in.

@method positionIs
@param x {Number} x cordinate where the item being positioned should go
@param y {Number} y cordinate where the item being positioned should go
@chainable
**/
LayoutNode.prototype.positionIs = function( x, y ) {

	return addRule.call( this, positionIs, arguments, this.rulesPos, this.rulesPosProp, POSITION );
};

/**
This rule will position an item at the x and y calculated by taking the width and height of the LayoutNode passed in times the
percentage passed in.

@method positionIsAPercentageOf
@param item {LayoutNode} this LayoutNode's width and height is going to be used to calculate the positon of this LayoutNode
@param percentage {Number} this percentage will be used to the calculate the x and y position of this LayoutNode
@chainable
**/
LayoutNode.prototype.positionIsAPercentageOf = function( item, percentage ) {

	return addRule.call( this, positionIsAPercentageOf, arguments, this.rulesPos, this.rulesPosProp, POSITION );
};

/**
This rule will position an item at the x cordinate passed in.

@method xIs
@param x {Number} x cordinate where the item being positioned should go
@chainable
**/
LayoutNode.prototype.xIs = function( x ) {

	return addRule.call( this, xIs, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

/**
This rule will position an item at the x calculated by taking the width of the LayoutNode passed in times the
percentage passed in.

@method xIsAPercentageOf
@param item {LayoutNode} this LayoutNode's width is going to be used to calculate the positon of this LayoutNode
@param percentage {Number} this percentage will be used to the calculate the x position of this LayoutNode
@chainable
**/
LayoutNode.prototype.xIsAPercentageOf = function( item, percentage ) {

	return addRule.call( this, xIsAPercentageOf, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

/**
This rule will position an item at the y cordinate passed in.

@method yIs
@param y {Number} y cordinate where the item being positioned should go
@chainable
**/
LayoutNode.prototype.yIs = function( y ) {

	return addRule.call( this, yIs, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
};

/**
This rule will position an item at the y calculated by taking the height of the LayoutNode passed in times the
percentage passed in.

@method yIsAPercentageOf
@param item {LayoutNode} this LayoutNode's height is going to be used to calculate the positon of this LayoutNode
@param percentage {Number} this percentage will be used to the calculate the y position of this LayoutNode
@chainable
**/
LayoutNode.prototype.yIsAPercentageOf = function( item, percentage ) {

	return addRule.call( this, yIsAPercentageOf, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
};

/**
This rule will position this LayoutNode below the item passed.

@method alignedBelow
@param item {LayoutNode} item that this LayoutNode should be below
@chainable
**/
LayoutNode.prototype.alignedBelow = function( item ) {

	return addRule.call( this, alignedBelow, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
};

/**
This rule will position this LayoutNode above the item passed.

@method alignedAbove
@param item {LayoutNode} item that this LayoutNode should be above
@chainable
**/
LayoutNode.prototype.alignedAbove = function( item ) {

	return addRule.call( this, alignedAbove, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );

};

/**
This rule will position this LayoutNode left of the item passed.

@method alignedLeftOf
@param item {LayoutNode} item that this LayoutNode should be left of
@chainable
**/
LayoutNode.prototype.alignedLeftOf = function( item ) {

	return addRule.call( this, alignedLeftOf, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

/**
This rule will position this LayoutNode right of the item passed.

@method alignedRightOf
@param item {LayoutNode} item that this LayoutNode should be right of
@chainable
**/
LayoutNode.prototype.alignedRightOf = function( item ) {

	return addRule.call( this, alignedRightOf, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

/**
This rule will position this LayoutNode so that it's aligned fully (top, left) with the item passed in.

@method alignedWith
@param item {LayoutNode} item that this LayoutNode should align to
@chainable
**/
LayoutNode.prototype.alignedWith = function( item ) {

	return addRule.call( this, alignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION );
};

/**
This rule will position this LayoutNode so that it's left aligned with the item passed in.

@method leftAlignedWith
@param item {LayoutNode} item that this LayoutNode should left align to
@chainable
**/
LayoutNode.prototype.leftAlignedWith = function( item ) {

	return addRule.call( this, leftAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

/**
This rule will position this LayoutNode so that it's right aligned with the item passed in.

@method rightAlignedWith
@param item {LayoutNode} item that this LayoutNode should right align to
@chainable
**/
LayoutNode.prototype.rightAlignedWith = function( item ) {

	return addRule.call( this, rightAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

/**
This rule will position this LayoutNode so that it's top aligned with the item passed in.

@method topAlignedWith
@param item {LayoutNode} item that this LayoutNode should top align to
@chainable
**/
LayoutNode.prototype.topAlignedWith = function( item ) {

	return addRule.call( this, topAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
};

/**
This rule will position this LayoutNode so that it's bottom aligned with the item passed in.

@method bottomAlignedWith
@param item {LayoutNode} item that this LayoutNode should bottom align to
@chainable
**/
LayoutNode.prototype.bottomAlignedWith = function( item ) {

	return addRule.call( this, bottomAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
};

/**
This rule will position this LayoutNode so that it's center (horizontally and verically) aligned with the item passed in.

@method centeredWith
@param item {LayoutNode} item that this LayoutNode should center align to
@chainable
**/
LayoutNode.prototype.centeredWith = function( item ) {

	return addRule.call( this, centeredWith, arguments, this.rulesPos, this.rulesPosProp, POSITION );
};

/**
This rule will position this LayoutNode so that it's horizontally centered with the item passed in.

@method horizontallyCenteredWith
@param item {LayoutNode} item that this LayoutNode should be horizontally centered to
@chainable
**/
LayoutNode.prototype.horizontallyCenteredWith = function( item ) {

	return addRule.call( this, horizontallyCenteredWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
};

/**
This rule will position this LayoutNode so that it's vertically centered with the item passed in.

@method verticallyCenteredWith
@param item {LayoutNode} item that this LayoutNode should be vertically centered to
@chainable
**/
LayoutNode.prototype.verticallyCenteredWith = function( item ) {

	return addRule.call( this, verticallyCenteredWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
};

/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*---------------------SIZE FUNCTIONS-----------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/

/**
This rule will size an item to be the exact size value (width and height) passed in

@method sizeIs
@param width {Number} width of this LayoutNode
@param height {Number} height of this LayoutNode
@chainable
**/
LayoutNode.prototype.sizeIs = function( width, height ) {

	return addRule.call( this, sizeIs, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
}

/**
This rule will set the width of an item to be the exact value passed in

@method widthIs
@param width {Number} width of this LayoutNode
@chainable
**/
LayoutNode.prototype.widthIs = function( width ) {

	return addRule.call( this, widthIs, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
}

/**
This rule will set the height of an item to be the exact value passed in

@method heightIs
@param height {Number} height of this LayoutNode
@chainable
**/
LayoutNode.prototype.heightIs = function( height ) {

	return addRule.call( this, heightIs, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );

}

/**
This rule will set the width or height of this LayoutNode to be proportional based on the original width and height passed in.
It is handy for when you have rules adjusting either width or height only and yet you want the untouched property to be
proportional.

So if you have an image that is 200x100 if there are rules applied to this LayoutNode where the width will become 400px
this rule will see that height has not been effected at all and will set the height to be proportional to the width based on
the original height passed in. So in this case our image's size would be 400x200 where this rule sets the height to be 200px
to stay in proportion to the original width.

@method sizeIsProportional
@param originalWidth {Number} the original width of the item being layed out before any layout functions are applied
@param originalHeight {Number} the original height of the item being layed out before any layout functions are applied
@chainable
**/
LayoutNode.prototype.sizeIsProportional = function( originalWidth, originalHeight ) {

	return addRule.call( this, sizeIsProportional, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
}

/**
This rule will set the width of the LayoutNode to be proportional to the height based on the originalWidth passed.
It is handy for when you have rules adjusting height and width should remain proportional to the height.

For instance you have an image which is 200x100. Once rules are applied to it the height becomes 200px. Ideally we'll
want the width to also be 2x larger. So this rule will set the width to be 400px and our final resolution is 400x200.

@method widthIsProportional
@param originalWidth {Number} the original width of the item being layed out before any layout functions are applied
@param originalHeight {Number} the original height of the item being layed out before any layout functions are applied
@chainable
**/
LayoutNode.prototype.widthIsProportional = function( originalWidth, originalHeight ) {

	return addRule.call( this, widthIsProportional, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
}

/**
This rule will set the height of the LayoutNode to be proportional to the width based on the originalHeight passed.
It is handy for when you have rules adjusting width and height should remain proportional to the width.

For instance you have an image which is 200x100. Once rules are applied to it the width becomes 400px. Ideally we'll
want the height to also be 2x larger. So this rule will set the height to be 200px and our final resolution is 400x200.

@method heightIsProportional
@param originalWidth {Number} the original width of the item being layed out before any layout functions are applied
@param originalHeight {Number} the original height of the item being layed out before any layout functions are applied
@chainable
**/
LayoutNode.prototype.heightIsProportional = function( originalWidth, originalHeight ) {

	return addRule.call( this, heightIsProportional, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
}

/**
This rule will set the width and height of this LayoutNode to match the width and height of the LayoutNode passed in.

@method matchesSizeOf
@param item {LayoutNode} item is a LayoutNode that this LayoutNode will match in size
@chainable
**/
LayoutNode.prototype.matchesSizeOf = function( item ) {

	return addRule.call( this, matchesSizeOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
}

/**
This rule will set the width of this LayoutNode to match the width of the LayoutNode passed in.

@method matchesWidthOf
@param item {LayoutNode} item is a LayoutNode that this LayoutNode will match in width
@chainable
**/
LayoutNode.prototype.matchesWidthOf = function( item ) {

	return addRule.call( this, matchesWidthOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
}

/**
This rule will set the height of this LayoutNode to match the height of the LayoutNode passed in.

@method matchesHeightOf
@param item {LayoutNode} item is a LayoutNode that this LayoutNode will match in height
@chainable
**/
LayoutNode.prototype.matchesHeightOf = function( item ) {

	return addRule.call( this, matchesHeightOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
}

/**
This rule will set the width and height of this LayoutNode to be a percentage of the LayoutNode passed in.

So for instance if the LayoutNode we're passing in is 400x200 after all rules have been applied and 
we say this LayoutNode should be 0.5 of the LayoutNode passed in this LayoutNode's size will be 200x100 or 50% of 400x200.

@method sizeIsAPercentageOf
@param item {LayoutNode} the LayoutNode that this LayoutNode will set it's width and height from
@param percentage {Number} a percentage value in decimal that states how big this LayoutNode should be based on the LayoutNode passed in
@chainable
**/
LayoutNode.prototype.sizeIsAPercentageOf = function( item, percentage ) {

	return addRule.call( this, sizeIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
}

/**
This rule will set the width of this LayoutNode to be a percentage of the LayoutNode passed in.

So for instance if the LayoutNode we're passing in is 400x200 after all rules have been applied and 
we say this LayoutNode's width should be 0.5 of the width of the LayoutNode passed in. This LayoutNode's width will be 
200px or 50% of 400px.

@method widthIsAPercentageOf
@param item {LayoutNode} the LayoutNode that this LayoutNode will set it's width from
@param percentage {Number} a percentage value in decimal that states how wide this LayoutNode should be based on the LayoutNode passed in
@chainable
**/
LayoutNode.prototype.widthIsAPercentageOf = function( item, percentage ) {

	return addRule.call( this, widthIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
}

/**
This rule will set the height of this LayoutNode to be a percentage of the LayoutNode passed in.

So for instance if the LayoutNode we're passing in is 400x200 after all rules have been applied and 
we say this LayoutNode's height should be 0.5 of the height of the LayoutNode passed in. This LayoutNode's height will be 
100px or 50% of 200px.

@method heightIsAPercentageOf
@param item {LayoutNode} the LayoutNode that this LayoutNode will set it's height from
@param percentage {Number} a percentage value in decimal that states how tall this LayoutNode should be based on the LayoutNode passed in
@chainable
**/
LayoutNode.prototype.heightIsAPercentageOf = function( item, percentage ) {

	return addRule.call( this, heightIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
}


/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*--------------------OFFSET FUNCTIONS----------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/

/**
plus is an offset function. Offset functions will offset the property previously effected.

So for instance if we did:

	node.widthIs( 200 ).plus( 10 );

Then the width of this LayoutNode would be 210px. However if we do:

	node.yIs( 100 ).plus( 30 );

Then the y position of this LayoutNode would be at 130px.

As you can see plus' context will change based on the type of rule applied previously.

Plus is handy for when a designer sais "Can you move this over by X pixels".

@method plus
@chainable
**/
LayoutNode.prototype.plus = function() {

	switch( this.lastPropTypeEffected ) {

		case SIZE:
		case BOUND_SIZE:

			if( arguments.length == 1 ) {

				if( arguments[ 0 ] instanceof LayoutNode ) {

					addRule.call( this, plusSize, arguments, this.rulesSize, this.rulesSizeProp, SIZE );	
				} else {

					addRule.call( this, vPlusSize, [ arguments[ 0 ], arguments[ 0 ] ], this.rulesSize, this.rulesSizeProp, SIZE );	
				}
			} else if( arguments.length == 2 ) {

				addRule.call( this, vPlusSize, arguments, this.rulesSize, this.rulesSizeProp, SIZE );	
			}
			
			this.doNotReadWidth = true;
			this.doNotReadHeight = true;
		break;

		case SIZE_WIDTH:
		case BOUND_SIZE_WIDTH:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addRule.call( this, plusWidth, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
			} else {

				addRule.call( this, vPlusWidth, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
			}

			this.doNotReadWidth = true;
		break;

		case SIZE_HEIGHT:
		case BOUND_SIZE_HEIGHT:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addRule.call( this, plusHeight, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
			} else {

				addRule.call( this, vPlusHeight, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
			}

			this.doNotReadHeight = true;
		break;

		case POSITION:
		case BOUND_POSITION:
			if( arguments.length == 1 ) {

				if( arguments[ 0 ] instanceof LayoutNode ) {

					addRule.call( this, plusPosition, arguments, this.rulesPos, this.rulesPosProp, POSITION );
				} else {

					addRule.call( this, vPlusPosition, [ arguments[ 0 ], arguments[ 0 ] ], this.rulesPos, this.rulesPosProp, POSITION );
				}
			} else if( arguments.length == 2 ) {

				addRule.call( this, vPlusPosition, arguments, this.rulesPos, this.rulesPosProp, POSITION );
			}
			
		break;

		case POSITION_X:
		case BOUND_POSITION_X:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addRule.call( this, plusX, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
			} else {

				addRule.call( this, vPlusX, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
			}
		break;

		case POSITION_Y:
		case BOUND_POSITION_Y:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addRule.call( this, plusY, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
			} else {

				addRule.call( this, vPlusY, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
			}
		break;

		case null:

			if( arguments[ 0 ] instanceof LayoutNode ) {

				addRule.call( this, plusSize, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
				addRule.call( this, plusPosition, arguments, this.rulesPos, this.rulesPosProp, POSITION );
			}

			this.lastPropTypeEffected = null;
		break;
	}

	return this;
};

/**
minus is an offset function. Offset functions will offset the property previously effected.

So for instance if we did:

	node.widthIs( 200 ).minus( 10 );

Then the width of this LayoutNode would be 190px. However if we do:

	node.yIs( 100 ).minus( 30 );

Then the y position of this LayoutNode would be at 70px.

As you can see minus' context will change based on the type of rule applied previously.

Minus is handy for when a designer sais "Can you move this over by X pixels".

@method minus
@chainable
**/
LayoutNode.prototype.minus = function() {

	switch( this.lastPropTypeEffected ) {

		case SIZE:
		case BOUND_SIZE:

			if( arguments.length == 1 ) {

				if( arguments[ 0 ] instanceof LayoutNode ) {

					addRule.call( this, minusSize, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
				} else {

					addRule.call( this, vMinusSize, [ arguments[ 0 ], arguments[ 0 ] ], this.rulesSize, this.rulesSizeProp, SIZE );
				}
			} else if( arguments.length == 2 ) {

				addRule.call( this, vMinusSize, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
			}
			
			this.doNotReadWidth = true;
			this.doNotReadHeight = true;
		break;

		case SIZE_WIDTH:
		case BOUND_SIZE_WIDTH:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addRule.call( this, minusWidth, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
			} else {

				addRule.call( this, vMinusWidth, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
			}

			this.doNotReadWidth = true;
		break;

		case SIZE_HEIGHT:
		case BOUND_SIZE_HEIGHT:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addRule.call( this, minusHeight, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
			} else {

				addRule.call( this, vMinusHeight, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
			}
			this.doNotReadHeight = true;
		break;

		case POSITION:
		case BOUND_POSITION:

			if( arguments.length == 1 ) {

				if( arguments[ 0 ] instanceof LayoutNode ) {

					addRule.call( this, minusPosition, arguments, this.rulesPos, this.rulesPosProp, POSITION );
				} else {

					addRule.call( this, vMinusPosition, [ arguments[ 0 ], arguments[ 0 ] ], this.rulesPos, this.rulesPosProp, POSITION );
				}
			} else if( arguments.length == 2 ) {

				addRule.call( this, vMinusPosition, arguments, this.rulesPos, this.rulesPosProp, POSITION );
			}
		break;

		case POSITION_X:
		case BOUND_POSITION_X:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addRule.call( this, minusX, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
			} else {

				addRule.call( this, vMinusX, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
			}
		break;

		case POSITION_Y:
		case BOUND_POSITION_Y:
			if( arguments[ 0 ] instanceof LayoutNode ) {

				addRule.call( this, minusY, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
			} else {

				addRule.call( this, vMinusY, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
			}
		break;

		case null:

			if( arguments[ 0 ] instanceof LayoutNode ) {

				addRule.call( this, minusSize, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
				addRule.call( this, minusPosition, arguments, this.rulesPos, this.rulesPosProp, POSITION );
			}

			this.lastPropTypeEffected = null;
		break;
	}

	return this;
};

/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*-------------------BOUND FUNCTIONS------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/

/**
maxSize is a bounding function.

There are three different ways to use maxSize. All are noted in this documentation.

You can pass in a LayoutNode that this LayoutNode will never be larger than. So for instance:

	node1.sizeIs( 200, 100 );
	node2.sizeIs( 300, 300 ).maxSize( node1 );

When run node2's width and height will be 200x100 not 300x300 because it will be bound to not be larger than
node1.

@method maxSize
@param layoutNode {LayoutNode} this LayoutNode will always be larger or the same size as the LayoutNode this function is called on
@chainable
**/

/**
maxSize is a bounding function.

There are three different ways to use maxSize. All are noted in this documentation.

You can pass in width and height that this LayoutNode will never be larger than. So for instance:

	node2.sizeIs( 300, 300 ).maxSize( 200, 100 );

When run node2's width and height will be 200x100 not 300x300 because it will be bound to not be larger than
200x100.

@method maxSize
@param width {Number} the LayoutNode's width that this function is called on will never be larger than this value passed in
@param height {Number} the LayoutNode's height that this function is called on will never be larger than this value passed in
@chainable
**/

/**
maxSize is a bounding function.

There are three different ways to use maxSize. All are noted in this documentation.

You can pass in a size that this LayoutNode will never be larger than. So for instance:

	node2.sizeIs( 300, 300 ).maxSize( 200 );

When run node2's width and height will be 200x200 not 300x300 because it will be bound to not be larger than
200x200.

@method maxSize
@param size {Number} the LayoutNode's width and height that this function is called on will never be larger than this value passed in
@chainable
**/
LayoutNode.prototype.maxSize = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxSizeFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );	
	} else {

		return addRule.call( this, maxSize, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE );
	}
};




/**
maxWidth is a bounding function.

There are two different ways to use maxWidth. All are noted in this documentation.

You can pass in a LayoutNode that this LayoutNode's width will never be larger than. So for instance:

	node1.widthIs( 200 );
	node2.widthIs( 300 ).maxWidth( node1 );

When run in the end node2's width will be 200px not 300px because it will be bound to not be larger than
node1.

@method maxWidth
@param layoutNode {LayoutNode} this LayoutNode will always be larger or the same size as the LayoutNode this function is called on
@chainable
**/

/**
maxWidth is a bounding function.

There are two different ways to use maxWidth. All are noted in this documentation.

You can pass in width that this LayoutNode will never be larger than. So for instance:

	node2.widthIs( 300 ).maxWidth( 200 );

When run node2's width will be 200px not 300px because it will be bound to not be larger than
200px.

@method maxWidth
@param width {Number} the LayoutNode's width that this function is called on will never be larger than this value passed in
@param height {Number} the LayoutNode's height that this function is called on will never be larger than this value passed in
@chainable
**/
LayoutNode.prototype.maxWidth = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxWidthFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );	
	} else {

		return addRule.call( this, maxWidth, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );	
	}
};




/**
maxHeight is a bounding function.

There are two different ways to use maxHeight. All are noted in this documentation.

You can pass in a LayoutNode that this LayoutNode's width will never be larger than. So for instance:

	node1.heightIs( 200 );
	node2.heightIs( 300 ).maxHeight( node1 );

When run node2's height will be 200px not 300px because it will be bound to not be larger than
node1.

@method maxHeight
@param layoutNode {LayoutNode} this LayoutNode will always be larger or the same size as the LayoutNode this function is called on
@chainable
**/

/**
maxHeight is a bounding function.

There are two different ways to use maxHeight. All are noted in this documentation.

You can pass in width that this LayoutNode will never be larger than. So for instance:

	node2.heightIs( 300 ).maxHeight( 200 );

When run node2's height will be 200px not 300px because it will be bound to not be larger than
200px.

@method maxHeight
@param width {Number} the LayoutNode's width that this function is called on will never be larger than this value passed in
@param height {Number} the LayoutNode's height that this function is called on will never be larger than this value passed in
@chainable
**/
LayoutNode.prototype.maxHeight = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxHeightFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
	} else {

		return addRule.call( this, maxHeight, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
	}
};



/**
minSize is a bounding function.

There are three different ways to use minSize. All are noted in this documentation.

You can pass in a LayoutNode that this LayoutNode will never be larger than. So for instance:

	node1.sizeIs( 200, 100 );
	node2.sizeIs( 50, 50 ).minSize( node1 );

When run node2's width and height will be 200x100 not 50x50 because it will be bound to not be larger than
node1.

@method minSize
@param layoutNode {LayoutNode} this LayoutNode that this rule is applied to will never be smaller than than this LayoutNode passed in
@chainable
**/

/**
minSize is a bounding function.

There are three different ways to use minSize. All are noted in this documentation.

You can pass in width and height that this LayoutNode will never be larger than. So for instance:

	node2.sizeIs( 50, 50 ).minSize( 200, 100 );

When run node2's width and height will be 200x100 not 300x300 because it will be bound to not be larger than
200x100.

@method minSize
@param width {Number} the LayoutNode's width that this function is called on will never be smaller than this value passed in
@param height {Number} the LayoutNode's height that this function is called on will never be smaller than this value passed in
@chainable
**/

/**
minSize is a bounding function.

There are three different ways to use minSize. All are noted in this documentation.

You can pass in a size that this LayoutNode will never be larger than. So for instance:

	node2.sizeIs( 100, 50 ).minSize( 200 );

When run node2's width and height will be 200x200 not 100x50 because it will be bound to not be smaller than
200x200.

@method minSize
@param size {Number} the LayoutNode's width and height that this function is called on will never be smaller than this value passed in
@chainable
**/
LayoutNode.prototype.minSize = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minSizeFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE );
	} else {

		return addRule.call( this, minSize, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE );
	}
};




/**
minWidth is a bounding function.

There are two different ways to use minWidth. All are noted in this documentation.

You can pass in a LayoutNode that this LayoutNode's width will never be larger than. So for instance:

	node1.widthIs( 200 );
	node2.widthIs( 50 ).minWidth( node1 );

When run node2's width will be 200px not 50px because it will be bound to not be larger than node1.

@method minWidth
@param layoutNode {LayoutNode} the width of the node that this function is called on will never be larger than the width of this node passed in
@chainable
**/
/**
minWidth is a bounding function.

There are two different ways to use minWidth. All are noted in this documentation.

You can pass in a width that this LayoutNode will never be larger than. So for instance:

	node2.widthIs( 100 ).minWidth( 50 );

When run node2's width will be 50px not 100px because it will be bound to not be larger than 50px.

@method minWidth
@param size {Number} the LayoutNode's width that this function is called on will never be smaller than this value passed in
@chainable
**/
LayoutNode.prototype.minWidth = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minWidthFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );
	} else {

		return addRule.call( this, minWidth, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_WIDTH );
	}
};




/**
minHeight is a bounding function.

There are two different ways to use minHeight. All are noted in this documentation.

You can pass in a LayoutNode that this LayoutNode's height will never be larger than. So for instance:

	node1.heightIs( 200 );
	node2.heightIs( 50 ).minHeight( node1 );

When run node2's height will be 200px not 50px because it will be bound to not be larger than node1.

@method minHeight
@param layoutNode {LayoutNode} the height of the node that this function is called on will never be larger than the height of this node passed in
@chainable
**/
/**
minHeight is a bounding function.

There are two different ways to use minHeight. All are noted in this documentation.

You can pass in a height that this LayoutNode will never be larger than. So for instance:

	node2.heightIs( 100 ).minHeight( 50 );

When run node2's height will be 50px not 100px because it will be bound to not be larger than 50px.

@method minHeight
@param size {Number} the LayoutNode's height that this function is called on will never be smaller than this value passed in
@chainable
**/
LayoutNode.prototype.minHeight = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minHeightFrom, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
	} else {

		return addRule.call( this, minHeight, arguments, this.rulesSizeBound, this.rulesSizeBoundProp, BOUND_SIZE_HEIGHT );
	}
};





/**
maxPosition is a bounding function.

There are three different ways to use maxPosition. All are noted in this documentation.

You can pass in a LayoutNode. This LayoutNode's position will never be larger than the position of the passed node.

	node1.positionIs( 300, 200 );
	node2.positionIs( 400, 400 ).maxPosition( node1 );

When run node2's x and y will be 200 and 100 not x 300 and y 200 because it will be bound x and y to not be larger than
node1's x and y.

@method maxPosition
@param layoutNode {LayoutNode} this passed in LayoutNode's x and y position will be be the maximum x and y position for this node
@chainable
**/

/**
maxPosition is a bounding function.

There are three different ways to use maxPosition. All are noted in this documentation.

You can pass in a maximum x and y position for this node.

	node2.positionIs( 300, 300 ).maxPosition( 200, 100 );

When run node2's x and y will be x 200 and y 100 not x 300 and y 300 because it will be bound x and y to not be larger than
x 200 and y 100.

@method maxPosition
@param x {Number} the maximum x value for this node's x value
@param y {Number} the maximum y value for this node's y value
@chainable
**/

/**
maxPosition is a bounding function.

There are three different ways to use maxPosition. All are noted in this documentation.

You can pass in a value that this LayoutNode's x and y will never be larger than. So for instance:

	node2.positionIs( 300, 400 ).maxPosition( 200 );

When run node2's width and height will be 200x200 not 300x400 because it will be bound to not be larger x
200 and y 200.

@method maxPosition
@param value {Number} the maximum x and y value for this node
@chainable
**/
LayoutNode.prototype.maxPosition = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxPositionFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, maxPosition, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};




/**
leftMax is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in a LayoutNode from which this node's maximum x value will be read from.

	node1.xIs( 200 );
	node2.xIs( 400 ).leftMax( node1 );

When run node2's x value will be 200 and not 400 because it will be bound to node1's x value.

@method leftMax
@param layoutNode {LayoutNode} The LayoutNode whose x value will be the maximum x value for this node
@chainable
**/
/**
leftMax is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in an x value from which this node's maximum x value will be set.

	node2.xIs( 400 ).leftMax( 200 );

When run node2's x value will be 200 and not 400 because it will be bound to the x value 200.

@method leftMax
@param x {Number} The maximum x value for this LayoutNode
@chainable
**/
LayoutNode.prototype.leftMax = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, leftMaxFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, leftMax, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};





/**
topMax is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in a LayoutNode from which this node's maximum y value will be read from.

	node1.yIs( 200 );
	node2.yIs( 400 ).topMax( node1 );

When run node2's y value will be 200 and not 400 because it will be bound to node1's y value.

@method topMax
@param layoutNode {LayoutNode} The LayoutNode whose y value will be the maximum y value for this node
@chainable
**/
/**
topMax is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in an y value from which this node's maximum y value will be set.

	node2.yIs( 400 ).topMax( 200 );

When run node2's x value will be 200 and not 400 because it will be bound to the y value 200.

@method topMax
@param y {Number} The maximum y value for this LayoutNode
@chainable
**/
LayoutNode.prototype.topMax = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, topMaxFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, topMax, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};





/**
minPosition is a bounding function.

There are three different ways to use minPosition. All are noted in this documentation.

You can pass in a LayoutNode. This LayoutNode's position will never be smaller than the position of the passed node.

	node1.positionIs( 300, 200 );
	node2.positionIs( 100, 100 ).minPosition( node1 );

When run node2's x and y will be 300 and 200 not x 100 and y 100 because it will be bound x and y to not be smaller than
node1's x and y.

@method minPosition
@param layoutNode {LayoutNode} this passed in LayoutNode's x and y position will be be the minimum x and y position for this node
@chainable
**/

/**
minPosition is a bounding function.

There are three different ways to use minPosition. All are noted in this documentation.

You can pass in a minimum x and y position for this node.

	node2.positionIs( 100, 100 ).minPosition( 200, 100 );

When run node2's x and y will be x 200 and y 100 not x 100 and y 100 because it will be bound x and y to not be smaller than
x 200 and y 100.

@method minPosition
@param x {Number} the minimum x value for this node's x value
@param y {Number} the minimum y value for this node's y value
@chainable
**/

/**
minPosition is a bounding function.

There are three different ways to use minPosition. All are noted in this documentation.

You can pass in a value that this LayoutNode's x and y will never be smaller than. So for instance:

	node2.positionIs( 100, 50 ).minPosition( 200 );

When run node2's x and y will be x 200 and y 200 not 100 x and 50 y because it will be bound to not be smaller than x
200 and y 200.

@method minPosition
@param value {Number} the minimum x and y value for this node
@chainable
**/
LayoutNode.prototype.minPosition = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minPositionFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, minPosition, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};




/**
leftMin is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in a LayoutNode from which this node's minimum x value will be read from.

	node1.xIs( 200 );
	node2.xIs( 100 ).leftMin( node1 );

When run node2's x value will be 200 and not 100 because it will be bound to node1's x value.

@method leftMin
@param layoutNode {LayoutNode} The LayoutNode whose x value will be the minimum x value for this node
@chainable
**/
/**
leftMin is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in an x value from which this node's minimum x value will be set.

	node2.xIs( 100 ).leftMin( 200 );

When run node2's x value will be 200 and not 100 because it will be bound to the x value 200.

@method leftMin
@param x {Number} The minimum x value for this LayoutNode
@chainable
**/
LayoutNode.prototype.leftMin = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, leftMinFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, leftMin, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};





/**
topMin is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in a LayoutNode from which this node's minimum y value will be read from.

	node1.yIs( 200 );
	node2.yIs( 100 ).topMin( node1 );

When run node2's y value will be 200 and not 100 because it will be bound to node1's y value.

@method topMin
@param layoutNode {LayoutNode} The LayoutNode whose y value will be the minimum y value for this node
@chainable
**/
/**
topMin is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in an y value from which this node's minimum y value will be set.

	node2.yIs( 100 ).topMin( 200 );

When run node2's y value will be 200 and not 100 because it will be bound to the y value 200.

@method topMin
@param y {Number} The minimum y value for this LayoutNode
@chainable
**/
LayoutNode.prototype.topMin = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, topMinFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, topMin, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};



LayoutNode.prototype.bottomMax = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, bottomMaxFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, bottomMax, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};

LayoutNode.prototype.bottomMin = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, bottomMinFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, bottomMin, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};

LayoutNode.prototype.rightMax = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, rightMaxFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, rightMax, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};

LayoutNode.prototype.rightMin = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, rightMinFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, rightMin, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};




/**
max is a bounding function.

It's a general bounding function which derives it's context from the previous rule added.

So basically:

	node.xIs( 200 ).max( 100 );

The x value of the node would end up being 100.

Another example:

	node.widthIs( 240 ).max( 40 );

The width value of the node would end up being being 40.

So as you can see act's like all the other max functions. For reference look at:
- {{#crossLink "LayoutNode/maxWidth:method"}}{{/crossLink}}
- {{#crossLink "LayoutNode/maxPosition:method"}}{{/crossLink}}
- {{#crossLink "LayoutNode/topMax:method"}}{{/crossLink}}

@method max
@chainable
**/
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
				return addRule.call( this, leftMaxFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_X );
			

			case POSITION_Y:
			case BOUND_POSITION_Y:
				return addRule.call( this, topMaxFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_Y );
			
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
				return addRule.call( this, leftMax, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_X );
			

			case POSITION_Y:
			case BOUND_POSITION_Y:
				return addRule.call( this, topMax, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_Y );
			
		}
	}
};




/**
min is a bounding function.

It's a general bounding function which derives it's context from the previous rule added.

So basically:

	node.xIs( 50 ).min( 100 );

The x value of the node would end up being 100.

Another example:

	node.widthIs( -400 ).min( -40 );

The width value of the node would end up being being -40.

So as you can see act's like all the other max functions. For reference look at:
- {{#crossLink "LayoutNode/minWidth:method"}}{{/crossLink}}
- {{#crossLink "LayoutNode/minPosition:method"}}{{/crossLink}}
- {{#crossLink "LayoutNode/topMin:method"}}{{/crossLink}}

@method min
@chainable
**/
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
				return addRule.call( this, leftMinFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_X );
			

			case POSITION_Y:
			case BOUND_POSITION_Y:
				return addRule.call( this, topMinFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_Y );
			
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
				return addRule.call( this, leftMin, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_X );
			

			case POSITION_Y:
			case BOUND_POSITION_Y:
				return addRule.call( this, topMin, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION_Y );
			
		}
	}
};


/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
/*--------------------CONDITIONALS--------------------------*/
/*----------------------------------------------------------*/
/*----------------------------------------------------------*/
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

/**
Using the when function you can create conditionals. It is the first function to call when creating a conditonal. 
It specifies what LayoutNode will be used when evaluating a conditional statement that follows.

For instance:

	node1.when( node2 ).widthGreaterThan( 200 ).widthIs( 100 );

Basically what this statement sais is "when node2's width is greater than 200px node1's width is 100px".

A conditional statement must always follow after a when statement.

@method when
@param node {LayoutNode} the LayoutNode which following conditionals will be evaluated against
@chainable
**/
LayoutNode.prototype.when = function( node ) {

	//we're checking of this is LayoutNode created based on conditionals
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

/**
The andWhen function in essence is the same as an && operator. andWhen statements must follow after a conditional.

For example:

	node1.when( node2 ).widthGreaterThan( 100 ).andWhen( node2 ).widthLessThan( 200 ).widthIs( 100 );

What the above is saying is "When node2's width is greater than 100px and when node2's width is less than 200px then node1's width is
100px"

andWhen statements must follow after a conditional statement.

@method andWhen
@param node {LayoutNode} the LayoutNode which following conditionals will be evaluated against
@chainable
**/
LayoutNode.prototype.andWhen = function( node ) {

	if( this.conditionalParent ) {

		this.conditionalParent.andWhen( node );
	}

	this._isDoingWhen = true;

	var idx = this.itemsToCompare.length - 1;
	this.itemsToCompare[ idx ].push( node );

	return this;
};

/**
The default statement is the equivalent to an else statement.

For instance if we have the following statement:

	node1
	.when( node2 ).widthGreaterThan( 100 ).widthIs( 100 )
	.default().widthIs( 50 );

What the above means is "When node2's width is greater than 100px the width of node1 is 100px. Otherwise if the width of node2 is not
greater than 100px then the width of node1 is 50px"

Something to note is that you can also add rules which will always evaluate by doing the following:

	node1
	.heightIs( 200 )
	.when( node2 ).widthGreaterThan( 100 ).widthIs( 100 )
	.default().widthIs( 50 );

Basically regardless of the width of node2 the height of node1 will be 200px. This clearly differs from the "default" statement.

@method default
@chainable
**/
LayoutNode.prototype.default = function() {

	this._isDoingDefault = true;

	if( this.conditionalParent ) {

		return this.conditionalParent.default();
	}

	this.lastConditionalListnerIdx = -1;
	this.lastConditionalListenerIsDefault = true;

	return this;
};

/**
You can use this method to add callbacks for when conditionals evaluate.

So let's say we do:

	node1.when( node2 ).heightLessThan( 300 ).matchesHeightOf( node2 ).on( function( isTrue ) {
		
		console.log( "Is the height of node2 smaller than 300?", isTrue );
	});

Everytime the layout is updated the call back will fire with a boolean which is whether the conditional is
true or false.

The on function will only be applied to the previous "when" or "default" statement preceding the on statement.

@method on
@param listener {Function} This is the listener for the call back when this conditional evaluates
@chainable
**/
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




/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).widthGreaterThan( 300 ).matchesHeightOf( node2 );

The above is stating "when the width of node2 is greater than 300px node1 should match the height of node2".

@method widthGreaterThan
@param value {Number} This value states the width that the LayoutNode's width should be evaluated against
@chainable
**/
LayoutNode.prototype.widthGreaterThan = function( value ) {

	return addConditional.call( this, widthGreaterThan, arguments );
};




/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).heightGreaterThan( 300 ).matchesHeightOf( node2 );

The above is stating "when the height of node2 is greater than 300px node1 should match the height of node2".

@method heightGreaterThan
@param value {Number} This value states the height that the LayoutNode's height should be evaluated against
@chainable
**/
LayoutNode.prototype.heightGreaterThan = function( value ) {

	return addConditional.call( this, heightGreaterThan, arguments );
};




/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).widthLessThan( 300 ).matchesHeightOf( node2 );

The above is stating "when the width of node2 is less than 300px node1 should match the height of node2".

@method widthLessThan
@param value {Number} This value states the width that the LayoutNode's width should be evaluated against
@chainable
**/
LayoutNode.prototype.widthLessThan = function( value ) {

	return addConditional.call( this, widthLessThan, arguments );
};




/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).heightLessThan( 300 ).matchesHeightOf( node2 );

The above is stating "when the height of node2 is less than 300px node1 should match the height of node2".

@method heightLessThan
@param value {Number} This value states the height that the LayoutNode's height should be evaluated against
@chainable
**/
LayoutNode.prototype.heightLessThan = function( value ) {

	return addConditional.call( this, heightLessThan, arguments );
};


/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).leftGreaterThan( 400 ).xIs( 400 );

The above is stating "when the the left side (node2.x position) of node2 is greater than 400 node1's x will be 400".

@method leftGreaterThan
@param value {Number} When the x value of LayoutNode passed in the when statement is greater than this value the 
conditionals layout rules will be run
@chainable
**/
LayoutNode.prototype.leftGreaterThan = function( value ) {

	return addConditional.call( this, leftGreaterThan, arguments );
};




/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).leftLessThan( 400 ).xIs( 400 );

The above is stating "when the the left side (node2.x position) of node2 is less than 400 node1's x will be 400".

@method leftLessThan
@param value {Number} When the x value of LayoutNode passed in the when statement is less than this value the 
conditionals layout rules will be run
@chainable
**/
LayoutNode.prototype.leftLessThan = function( value ) {

	return addConditional.call( this, leftLessThan, arguments );
};




/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).rightGreaterThan( 400 ).xIs( 400 );

The above is stating "when the the right side (node2.x + node2.width) of node2 is greater than 400 node1's x will be 400".

@method rightGreaterThan
@param value {Number} When x + width value of LayoutNode passed in the when statement is greater than this value the 
conditionals layout rules will be run
@chainable
**/
LayoutNode.prototype.rightGreaterThan = function( value ) {

	return addConditional.call( this, rightGreaterThan, arguments );
};




/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).rightLessThan( 400 ).xIs( 400 );

The above is stating "when the the right side (node2.x + node2.width) of node2 is less than 400 node1's x will be 400".

@method rightLessThan
@param value {Number} When x + width value of LayoutNode passed in the when statement is less than this value the 
conditionals layout rules will be run
@chainable
**/
LayoutNode.prototype.rightLessThan = function( value ) {

	return addConditional.call( this, rightLessThan, arguments );
};



/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).topGreaterThan( 400 ).yIs( 400 );

The above is stating "when the the left side (node2.y position) of node2 is greater than 400 node1's y will be 400".

@method topGreaterThan
@param value {Number} When the y value of LayoutNode passed in the when statement is greater than this value the 
conditionals layout rules will be run
@chainable
**/
LayoutNode.prototype.topGreaterThan = function( value ) {

	return addConditional.call( this, topGreaterThan, arguments );
};




/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).topLessThan( 400 ).yIs( 400 );

The above is stating "when the the left side (node2.y position) of node2 is less than 400 node1's y will be 400".

@method topLessThan
@param value {Number} When the y value of LayoutNode passed in the when statement is less than this value the 
conditionals layout rules will be run
@chainable
**/
LayoutNode.prototype.topLessThan = function( value ) {

	return addConditional.call( this, topLessThan, arguments );
};




/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).bottomGreaterThan( 400 ).yIs( 400 );

The above is stating "when the the right side (node2.y + node2.height) of node2 is greater than 400 node1's y will be 400".

@method bottomGreaterThan
@param value {Number} When y + height value of LayoutNode passed in the when statement is greater than this value the 
conditionals layout rules will be run
@chainable
**/
LayoutNode.prototype.bottomGreaterThan = function( value ) {

	return addConditional.call( this, bottomGreaterThan, arguments );
};




/**
This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).bottomLessThan( 400 ).yIs( 400 );

The above is stating "when the the right side (node2.y + node2.width) of node2 is less than 400 node1's y will be 400".

@method bottomLessThan
@param value {Number} When y + width value of LayoutNode passed in the when statement is less than this value the 
conditionals layout rules will be run
@chainable
**/
LayoutNode.prototype.bottomLessThan = function( value ) {

	return addConditional.call( this, bottomLessThan, arguments );
};



/**
There are two ways to use this function both are documented.

This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).isInside( node1 ).yIs( 400 );

The above is stating "when any part of node1 is inside node y is 400".

@method isInside
@param node {LayoutNode} if the layout node which isInside is called on is inside this passed LayoutNode then this conditional
will evaluate true
@chainable
**/
/**
There are two ways to use this function both are documented.

This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).isInside( 0, 0, 100, 100 ).yIs( 400 );

The above is stating "when any part of node1 is inside the rectangle 0, 0, 100, 100 then the y value of node1 will be 400".

@method isInside
@param x {Number} x position of rectangular area to check
@param y {Number} y position of rectangular area to check
@param width {Number} width of rectangular area to check
@param height {Number} height of rectangular area to check
will evaluate true
@chainable
**/
LayoutNode.prototype.isInside = function() {

	return addConditional.call( this, isInside, arguments );
};


/**
There are two ways to use this function both are documented.

This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).isOutside( node1 ).yIs( 400 );

The above is stating "when node1 is fully outside node2 (no part of node1 is inside node2) node1 y is 400".

@method isOutside
@param node {LayoutNode} if the layout node which isOutside is called on is inside this passed LayoutNode then this conditional
will evaluate true
@chainable
**/
/**
There are two ways to use this function both are documented.

This function is a conditional. It must follow after a "when" or "andWhen" statement and a layout rule must follow
this conditional statement.

Here is a usage example:
	
	node1.when( node2 ).isOutside( 0, 0, 100, 100 ).yIs( 400 );

The above is stating "when no part of node1 is inside the rectangle 0, 0, 100, 100 then the y value of node1 will be 400".

@method isOutside
@param x {Number} x position of rectangular area to check
@param y {Number} y position of rectangular area to check
@param width {Number} width of rectangular area to check
@param height {Number} height of rectangular area to check
will evaluate true
@chainable
**/
LayoutNode.prototype.isOutside = function() {

	return addConditional.call( this, isOutside, arguments );
};




module.exports = LayoutNode;