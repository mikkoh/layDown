;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LayDown = require( '../../src/LayDown' );


var ballXDirection = 1;
var ballYDirection = 1;
var ballVelocity = { x: 0, y: 0 };





var layout = new LayDown( layoutFunction, readFunction, createFunction );

var paddle1 = layout.create( document.getElementById( 'paddle1' ) );
var paddle2 = layout.create( document.getElementById( 'paddle2' ) );
var ball = layout.create( document.getElementById( 'ball' ) );
var field = layout.create( document.getElementById( 'field' ) );
var velocity = layout.create( ballVelocity, null );

ball.name = 'ball';

velocity.readFunction = null;
velocity.layoutFunction = function( ballVelocity, node ) {

	ballVelocity.x = node.x;
	ballVelocity.y = node.y;
};




field.matchesSizeOf( layout ).minus( 100 )
.positionIs( 50, 50 );

paddle1
.widthIsAPercentageOf( field, 0.03 ).heightIsAPercentageOf( field, 0.3 )
.leftAlignedWith( field ).plus( 20 ).verticallyCenteredWith( field )
.topMin( field ).bottomMax( field );

paddle2.matchesSizeOf( paddle1 ).topAlignedWith( paddle1 ).rightAlignedWith( field ).minus( 20 );

ball.matchesWidthOf( paddle1 ).heightIsProportional( 10, 10 ).centeredWith( field )
.when( ball ).rightGreaterThan( field ).on( function() {

	ballXDirection *= -1;
		ball.x = field.x + field.width - ball.width;
})
.when( ball ).leftLessThan( field ).on( function() {

	ballXDirection *= -1;
	ball.x = field.x;
})
.when( ball ).topLessThan( field ).on( function() {

	ballYDirection *= -1;
	ball.y = field.y;
})
.when( ball ).bottomGreaterThan( field ).on( function() {

	ballYDirection *= -1;
	ball.y = field.y + field.height - ball.height;
})
.when( ball ).isInside( paddle1 ).on( function() {

	ballXDirection *= -1;
	ball.x = paddle1.x + paddle1.width + ballXDirection * ballVelocity.x;
})
.when( ball ).isInside( paddle2 ).on( function() {

	ballXDirection *= -1;
	ball.x = paddle2.x - ball.width + ballXDirection * ballVelocity.x;
});

velocity.positionIsAPercentageOf( field, 0.008 );





onResize();
onEnterFrame();

window.onresize = onResize;
window.onmousemove = onMouseMove;

function onMouseMove( ev ) {

	paddle1.y = ev.pageY - paddle1.height * 0.5;
}

function onEnterFrame() {

	ball.x += ballVelocity.x * ballXDirection;
	ball.y += ballVelocity.y * ballYDirection;

	requestAnimationFrame( onEnterFrame );
}

function onResize() {

	layout.resizeAndPosition( 0, 0, window.innerWidth, window.innerHeight );
}

function layoutFunction( item, node, setWidth, setHeight ) { 

	item.style.left = Math.floor( node.x ) + 'px';
	item.style.top = Math.floor( node.y ) + 'px';

	if( setWidth ) {

		item.style.width = Math.floor( node.width ) + 'px';
	}

	if( setHeight ) {

		item.style.height = Math.floor( node.height ) + 'px';
	}
}

function readFunction( item, name ) {

	if( name == 'width' ) {

		return item.clientWidth;
	} else {

		return item.clientHeight;
	}
}

function createFunction( item ) {

	item.style[ 'box-sizing' ] = 'border-box';
	item.style[ '-moz-box-sizing' ] = 'border-box';
	item.style[ '-webkit-box-sizing' ] = 'border-box';

	item.style[ 'position' ] = 'absolute';
}
},{"../../src/LayDown":2}],2:[function(require,module,exports){
var LayoutNode = require( './LayoutNode' );

/**
LayDown is the root of the layDown library. It is a factory to create {{#crossLink "LayoutNode"}}{{/crossLink}}'s.

An instance of LayDown is equivalent to saying "a layout". So a LayDown is a layout that you lay down items on.

When you instantiate a LayDown you must pass in two functions. 

The first one is a layout function which will position things. 

An example layout function:

	function layoutFunction( item, node, setWidth, setHeight ) { 

		item.style.left = Math.floor( node.x ) + 'px';
		item.style.top = Math.floor( node.y ) + 'px';

		if( setWidth ) {

			item.style.width = Math.floor( node.width ) + 'px';
		}

		if( setHeight ) {

			item.style.height = Math.floor( node.height ) + 'px';
		}
	}


The second is a read function which will read in the width and height of an item if no rules effected those properties. 

Here is an example readFunction:

	function readFunction( item, name ) {

		if( name == 'width' ) {

			return item.clientWidth;
		} else {

			return item.clientHeight;
		}
	}

The third function that you may pass in is a create function which will be run on each item before a LayoutNode is created.

Here is an example createFunction:

	function createFunction( item ) {

		item.style[ 'box-sizing' ] = 'border-box';
		item.style[ '-moz-box-sizing' ] = 'border-box';
		item.style[ '-webkit-box-sizing' ] = 'border-box';

		item.style[ 'position' ] = 'absolute';
	}



@class LayDown
@constructor

@param layoutFunction {Function} The layoutFunction function is a function which will translate the x, y, width, and height properties of a
LayoutNode into actual physical screen position. (see the above example)

So for instance if we're working with the DOM it would set CSS properties on the "item" passed in to ensure that the item is on 
screen at x, y at the correct size. (see the above example)

@param readFunction {function} If you define no sizing rules to set width and height of an "item"/LayoutNode then we will need to read the
width and height of the object to be able to position dependent LayoutNode's.

@param createFunction {function} Is a function that will be run on every every item to be layed out before a LayoutNode is created.

Let's say you're working with the DOM you may want to for instance set the CSS position property to be absolute within this function. (see the above example)

**/
var LayDown = function( layoutFunction, readFunction, createFunction ) {

	this.layoutFunction = layoutFunction;
	this.readFunction = readFunction;
	this.createFunction = createFunction || null;
	this.nodes = [];
};

/**
This is the x position of the LayDown on screen. Initially the value of x will be 0 until 
{{#crossLink "LayDown/resizeAndPosition:method"}}{{/crossLink}} is called.

Once {{#crossLink "LayDown/resizeAndPosition:method"}}{{/crossLink}} has been called the x value will be whatever was passed
in for the x parameter.

This property is read only and should not be set manually.

@property x
@type Number
@readOnly
**/
LayDown.prototype.x = 0;


/**
This is the y position of the LayDown on screen. Initially the value of y will be 0 until 
{{#crossLink "LayDown/resizeAndPosition:method"}}{{/crossLink}} is called.

Once {{#crossLink "LayDown/resizeAndPosition:method"}}{{/crossLink}} has been called the y value will be whatever was passed
in for the y parameter.

This property is read only and should not be set manually.

@property y
@type Number
@readOnly
**/
LayDown.prototype.y = 0;


/**
This is the width position of the LayDown on screen. Initially the value of width will be 0 until 
{{#crossLink "LayDown/resizeAndPosition:method"}}{{/crossLink}} is called.

Once {{#crossLink "LayDown/resizeAndPosition:method"}}{{/crossLink}} has been called the width value will be whatever was passed
in for the width parameter.

This property is read only and should not be set manually.

@property width
@type Number
@readOnly
**/
LayDown.prototype.width = 0;


/**
This is the height position of the LayDown on screen. Initially the value of height will be 0 until 
{{#crossLink "LayDown/resizeAndPosition:method"}}{{/crossLink}} is called.

Once {{#crossLink "LayDown/resizeAndPosition:method"}}{{/crossLink}} has been called the height value will be whatever was passed
in for the height parameter.

This property is read only and should not be set manually.

@property height
@type Number
@readOnly
**/
LayDown.prototype.height = 0;

/**
This is the layout function which will be used by default for all LayoutNode's. This value is set in the constructor initially.

@property layoutFunction
@type Function
**/
LayDown.prototype.layoutFunction = null;

/**
This is the read function which will be used by default for all LayoutNode's. This value is set in the constructor initially.

@property readFunction
@type Function
**/
LayDown.prototype.readFunction = null;

/**
This is the create function which will be used on all items being layed out. This value is set in the constructor initially.

@property createFunction
@type Function
**/
LayDown.prototype.createFunction = null;
LayDown.prototype.nodes = null;

/**
The create method will create a {{#crossLink "LayoutNode"}}{{/crossLink}} which rules can then be applied to.

@method create
@param itemToLayDown {Object} This will be the item that we'll be laying down. For instance if we were working with the DOM it could be
an image html element or a div element or whatever you'd like.

@param createFunction {Function} This function will be used before creating the LayoutNode where this is handy is if you want to override the 
default create function
**/
LayDown.prototype.create = function( itemToLayDown, createFunction ) {

	createFunction = createFunction === undefined ? this.createFunction : createFunction;

	if( createFunction && itemToLayDown) {

		this.createFunction( itemToLayDown );
	}

	var nNode = new LayoutNode( this, itemToLayDown, this.layoutFunction, this.readFunction );	

	this.nodes.push( nNode );

	return nNode;
};

/**
Call resizeAndPosition whenever you'd like to layout all your items. For instance you may want to call this when a window resizes.

@method resizeAndPosition
@param x {Number} This is the x position of where this layout should begin. For instance x = 0 could be the left side of the screen.
@param y {Number} This is the y position of where this layout should begin. For instance y = 0 could be the left side of the screen.
@param width {Number} This is the width of the layout. For instance this could be the width of the screen.
@param height {Number} This is the height of the layout. For instance this could be the height of the screen.
**/
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
},{"./LayoutNode":3}],3:[function(require,module,exports){

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

	this._doingSelfConditional = false;
	this.selfItemsToCompare = [];
	this.selfConditionalsForItem = [];
	this.selfConditionalArgumentsForItem = [];
	this.selfConditionalListeners = [];
	this.lastSelfConditionalListenerIdx = -1;

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

	//this is the listener added when an on function was called after creating a conditional
	var trueConditionals = [];

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

				//if we simply just do a conditional with a listener we'll have no layoutNode
				if( layoutNode ) {

					layoutNode.doLayout();	
				}
			
				conditionalLayedOut = true;

				if( this.conditionalListeners[ i ] ) {

					trueConditionals.push( this.conditionalListeners[ i ] );	
				}
			}
		}

		//if all of the above evaluated false then we'll get here
		//in which case we should check if theres a default
		if( !conditionalLayedOut && this.layoutNodeForDefault ) {

			if( this.defaultConditionalListener ) {

				trueConditionals.push( this.defaultConditionalListener );	
			}
			
			if( this.layoutNodeForDefault ) {

				this.layoutNodeForDefault.doLayout();	
			}
		}
	}

	//Do the actual layout
	this.doLayoutWork();



	//Now do self conditionals
	for( var i = 0, lenI = this.selfItemsToCompare.length; i < lenI; i++ ) {

		var itemsToCompareTo = this.selfItemsToCompare[ i ];
		var isConditionalValid = true;

		for( var j = 0, lenJ = itemsToCompareTo.length; isConditionalValid && j < lenJ; j++ ) {

			var conditionals = this.selfConditionalsForItem[ i ][ j ];
			var argumentsForConditionals = this.selfConditionalArgumentsForItem[ i ][ j ];
			
			for( var k = 0, lenK = conditionals.length; isConditionalValid && k < lenK; k++ ) {

				isConditionalValid = conditionals[ k ].apply( itemsToCompareTo[ k ], argumentsForConditionals[ k ] );
			}

			if( isConditionalValid && this.selfConditionalListeners[ i ] ) {

				trueConditionals.push( this.selfConditionalListeners[ i ] );
			}
		}
	}


	//If this layoyt node has something to position and size and has a layout function run it
	if( this.item && this.layoutFunction ) {
		
		this.layoutFunction( this.item, this, this.doNotReadWidth, this.doNotReadHeight );
	}

	//if a conditional has been validated it should be called now
	for( var i = 0, len = trueConditionals.length; i < len; i++ ) {

		trueConditionals[ i ]();
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

	//we never want to allow adding rules to a self conditional
	if( this._doingSelfConditional ) {

		throw 'You cannot add layout rules after adding a conditional to the item itself';
	}

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


/**
bottomMax is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

Here is an example usage of bottomMax:

	node1.heightIs( 100 ).yIs( 50 );
	node2.heightIs( 100 ).yIs( 100 ).bottomMax( node1 );

If we evaluated the above node2's y value would be 50 and not 100. This is because the maximum value for the bottom of
node2 is the y position of node1 plus its height (node1.y + node1.height).


@method bottomMax
@param layoutNode {LayoutNode} The LayoutNode whose bottom ( y + height ) value will be the maximum bottom value for this node
@chainable
**/
/**
bottomMax is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

Here is an example usage of bottomMax:

	node2.heightIs( 100 ).yIs( 200 ).bottomMax( 200 );

If we evaluated the above node2's y value would be 100 and not 200. This is because the maximum value for the bottom of
node2 is 200. Bottom values are calculated from y + height.


@method bottomMax
@param maxBottom {Number} The maximum bottom ( y + height ) value for this LayoutNode
@chainable
**/
LayoutNode.prototype.bottomMax = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, bottomMaxFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, bottomMax, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};


/**
bottomMin is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

Here is an example usage of bottomMin:

	node1.heightIs( 100 ).yIs( 50 );
	node2.heightIs( 100 ).yIs( 20 ).bottomMin( node1 );

If we evaluated the above node2's y value would be 50 and not 20. This is because the minimum value for the bottom of
node2 is the y position of node1 plus its height (node1.y + node1.height).


@method bottomMin
@param layoutNode {LayoutNode} The LayoutNode whose bottom ( y + height ) value will be the minimum bottom value for this node
@chainable
**/
/**
bottomMin is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

Here is an example usage of bottomMin:

	node2.heightIs( 100 ).yIs( 50 ).bottomMin( 200 );

If we evaluated the above node2's y value would be 100 and not 50. This is because the minimum value for the bottom of
node2 is 200. Bottom values are calculated from y + height.


@method bottomMin
@param y {Number} The minimum bottom ( y + height ) value for this LayoutNode
@chainable
**/
LayoutNode.prototype.bottomMin = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, bottomMinFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, bottomMin, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};


/**
rightMax is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

Here is an example usage of rightMax:

	node1.widthIs( 100 ).xIs( 50 );
	node2.widthIs( 100 ).xIs( 100 ).rightMax( node1 );

If we evaluated the above node2's x value would be 50 and not 100. This is because the maximum value for the right side of
node2 is the x position of node1 plus its height (node1.x + node1.width).


@method rightMax
@param layoutNode {LayoutNode} The LayoutNode whose right (x + width) value will be the maximum right value for this node
@chainable
**/
/**
rightMax is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

Here is an example usage of rightMax:

	node2.widthIs( 100 ).xIs( 200 ).rightMax( 200 );

If we evaluated the above node2's x value would be 100 and not 200. This is because the maximum value for the right side of
node2 is 200. Bottom values are calculated from x + width.


@method rightMax
@param maxRight {Number} The maximum right value for this LayoutNode
@chainable
**/
LayoutNode.prototype.rightMax = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, rightMaxFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, rightMax, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};



/**
rightMin is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

Here is an example usage of rightMin:

	node1.widthIs( 100 ).xIs( 100 );
	node2.widthIs( 100 ).xIs( 50 ).rightMin( node1 );

If we evaluated the above node2's x value would be 100 and not 50. This is because the minimum value for the right side of
node2 is the x position of node1 plus its height (node1.x + node1.width).


@method rightMin
@param layoutNode {LayoutNode} The LayoutNode whose x value will be the minimum right value for this node
@chainable
**/
/**
rightMin is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

Here is an example usage of rightMin:

	node2.widthIs( 100 ).xIs( 50 ).rightMin( 200 );

If we evaluated the above node2's x value would be 100 and not 50. This is because the minimum value for the right side of
node2 is 200. Bottom values are calculated from x + width.


@method rightMin
@param minRight {Number} The minimum "right" ( x + width ) value for this LayoutNode
@chainable
**/
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

	//if we're not doing a self conditional then do this
	if( !this._doingSelfConditional ) {

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
	} else {

		
		var idx1 = this.selfItemsToCompare.length - 1;

		//we don't has many conditionals to compare against as we have items to compare against
		if( this.selfConditionalsForItem[ idx1 ] == undefined ) {

			this.selfConditionalsForItem[ idx1 ] = [];
			this.selfConditionalArgumentsForItem[ idx1 ] = [];

			this.selfConditionalsForItem[ idx1 ].push( [] );
			this.selfConditionalArgumentsForItem[ idx1 ].push( [] );

		} else if( this.selfItemsToCompare[ idx1 ].length != this.selfConditionalsForItem[ idx1 ].length ) {

			this.selfConditionalsForItem[ idx1 ].push( [] );
			this.selfConditionalArgumentsForItem[ idx1 ].push( [] );
		}


		var idx2 = this.selfConditionalsForItem[ idx1 ].length - 1;

		this.selfConditionalsForItem[ idx1 ][ idx2 ].push( cFunction );
		this.selfConditionalArgumentsForItem[ idx1 ][ idx2 ].push( cArguments );
	}

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

	//Check if they've called when and tried to call it again
	if( this._isDoingWhen && !this._hasConditional ) {

		throw 'You should call when or andWhen after adding conditionals such "widthGreaterThan"';
	}

	//we're checking of this is LayoutNode created based on conditionals
	//if when is called we should kick back to the parent nodes when function and call when there
	if( this.conditionalParent !== null ) {

		return this.conditionalParent.when( node );
	}

	//reset lastConditionalListenerIsDefault to false
	this._isDoingWhen = true;
	this.lastConditionalListenerIsDefault = false;
	this._doingSelfConditional = false;

	if( node != this ) {

		this.itemsToCompare.push( [ node ] );

		this.conditionalListeners.push( null );
		this.lastConditionalListnerIdx = this.conditionalListeners.length - 1;
	} else {

		this._doingSelfConditional = true;

		this.selfItemsToCompare.push( [ node ] ); //add this to the self list
		this.selfConditionalListeners.push( null );
		this.lastSelfConditionalListenerIdx = this.selfConditionalListeners.length - 1;
	}

	return this;
};

/**
The andWhen function in essence is the same as an && operator. andWhen statements must follow after another conditional.

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

	if( !this._isDoingWhen ) {

		throw 'You should call when before calling andWhen';		
	} else if( this.conditionalParent ) {

		throw 'You should call when before calling andWhen';
	}

	//if andWhen was called then and we're not doing a self conditional
	//we want to grab the regular conditionals and push them to the self conditional array
	if( node == this && !this._doingSelfConditional ) {

		this._doingSelfConditional = true;

		//remove the array that was added to make this a self conditional
		this.selfItemsToCompare.push( this.itemsToCompare.pop() );
		//add this node in
		this.selfItemsToCompare[ this.selfItemsToCompare.length - 1 ].push( node );
		//reverse whats been added for listeners
		this.conditionalListeners.pop();
		//set this back to -1 so that on cant be called for regular listeners
		this.lastConditionalListnerIdx = -1;

	//we're doing a self conditional and another item to compare
	} else if( this._doingSelfConditional ) {

		this.selfItemsToCompare.push( node );
	//this is just a regular old and when statement so add the node to items to compare
	} else {

		var idx = this.itemsToCompare.length - 1;
		this.itemsToCompare[ idx ].push( node );
	}
	
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
	this.lastSelfConditionalListenerIdx = -1;
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
	} else if( this._doingSelfConditional ) {

		if( this.lastSelfConditionalListenerIdx > -1 ) {

			this.selfConditionalListeners[ this.lastSelfConditionalListenerIdx ] = listener;
		}
	} else {

		//are we doing the default listener
		if( !this.lastConditionalListenerIsDefault ) {

			//if we have a conditional listener idx (when called)
			if( this.lastConditionalListnerIdx > -1 ) {

				this.conditionalListeners[ this.lastConditionalListnerIdx ] = listener;
			} else {

				throw 'You must call the when function before trying to add a listener';
			}
		//we are doing the default listener
		} else {

			this.defaultConditionalListener = listener;
		}
	}

	return this;
};




/**
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
This function is a conditional. It must follow after a "when" or "andWhen" statement.

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

This function is a conditional. It must follow after a "when" or "andWhen" statement.

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

This function is a conditional. It must follow after a "when" or "andWhen" statement.

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

This function is a conditional. It must follow after a "when" or "andWhen" statement.

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

This function is a conditional. It must follow after a "when" or "andWhen" statement.

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
},{"./conditionals/bottomGreaterThan":4,"./conditionals/bottomLessThan":5,"./conditionals/heightGreaterThan":6,"./conditionals/heightLessThan":7,"./conditionals/isInside":8,"./conditionals/isOutside":9,"./conditionals/leftGreaterThan":10,"./conditionals/leftLessThan":11,"./conditionals/rightGreaterThan":12,"./conditionals/rightLessThan":13,"./conditionals/topGreaterThan":14,"./conditionals/topLessThan":15,"./conditionals/widthGreaterThan":16,"./conditionals/widthLessThan":17,"./layoutBoundPosition/bottomMax":18,"./layoutBoundPosition/bottomMaxFrom":19,"./layoutBoundPosition/bottomMin":20,"./layoutBoundPosition/bottomMinFrom":21,"./layoutBoundPosition/leftMax":22,"./layoutBoundPosition/leftMaxFrom":23,"./layoutBoundPosition/leftMin":24,"./layoutBoundPosition/leftMinFrom":25,"./layoutBoundPosition/maxPosition":26,"./layoutBoundPosition/maxPositionFrom":27,"./layoutBoundPosition/minPosition":28,"./layoutBoundPosition/minPositionFrom":29,"./layoutBoundPosition/rightMax":30,"./layoutBoundPosition/rightMaxFrom":31,"./layoutBoundPosition/rightMin":32,"./layoutBoundPosition/rightMinFrom":33,"./layoutBoundPosition/topMax":34,"./layoutBoundPosition/topMaxFrom":35,"./layoutBoundPosition/topMin":36,"./layoutBoundPosition/topMinFrom":37,"./layoutBoundSize/maxHeight":38,"./layoutBoundSize/maxHeightFrom":39,"./layoutBoundSize/maxSize":40,"./layoutBoundSize/maxSizeFrom":41,"./layoutBoundSize/maxWidth":42,"./layoutBoundSize/maxWidthFrom":43,"./layoutBoundSize/minHeight":44,"./layoutBoundSize/minHeightFrom":45,"./layoutBoundSize/minSize":46,"./layoutBoundSize/minSizeFrom":47,"./layoutBoundSize/minWidth":48,"./layoutBoundSize/minWidthFrom":49,"./layoutPosition/alignedAbove":50,"./layoutPosition/alignedBelow":51,"./layoutPosition/alignedLeftOf":52,"./layoutPosition/alignedRightOf":53,"./layoutPosition/alignedWith":54,"./layoutPosition/bottomAlignedWith":55,"./layoutPosition/centeredWith":56,"./layoutPosition/horizontallyCenteredWith":57,"./layoutPosition/leftAlignedWith":58,"./layoutPosition/positionIs":59,"./layoutPosition/positionIsAPercentageOf":60,"./layoutPosition/rightAlignedWith":61,"./layoutPosition/topAlignedWith":62,"./layoutPosition/verticallyCenteredWith":63,"./layoutPosition/xIs":64,"./layoutPosition/xIsAPercentageOf":65,"./layoutPosition/yIs":66,"./layoutPosition/yIsAPercentageOf":67,"./layoutSize/heightIs":68,"./layoutSize/heightIsAPercentageOf":69,"./layoutSize/heightIsProportional":70,"./layoutSize/matchesHeightOf":71,"./layoutSize/matchesSizeOf":72,"./layoutSize/matchesWidthOf":73,"./layoutSize/sizeIs":74,"./layoutSize/sizeIsAPercentageOf":75,"./layoutSize/sizeIsProportional":76,"./layoutSize/widthIs":77,"./layoutSize/widthIsAPercentageOf":78,"./layoutSize/widthIsProportional":79,"./offsets/minusHeight":80,"./offsets/minusPosition":81,"./offsets/minusSize":82,"./offsets/minusWidth":83,"./offsets/minusX":84,"./offsets/minusY":85,"./offsets/plusHeight":86,"./offsets/plusPosition":87,"./offsets/plusSize":88,"./offsets/plusWidth":89,"./offsets/plusX":90,"./offsets/plusY":91,"./offsets/vMinusHeight":92,"./offsets/vMinusPosition":93,"./offsets/vMinusSize":94,"./offsets/vMinusWidth":95,"./offsets/vMinusX":96,"./offsets/vMinusY":97,"./offsets/vPlusHeight":98,"./offsets/vPlusPosition":99,"./offsets/vPlusSize":100,"./offsets/vPlusWidth":101,"./offsets/vPlusX":102,"./offsets/vPlusY":103}],4:[function(require,module,exports){
module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.y + this.height > value;	
	} else {

		return this.y + this.height > value.y + value.height;
	}
};
},{}],5:[function(require,module,exports){
module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.y + this.height < value;	
	} else {

		return this.y + this.height < value.y + value.height;
	}
};
},{}],6:[function(require,module,exports){
module.exports = function( value ) {

	return this.height > value;
};
},{}],7:[function(require,module,exports){
module.exports = function( value ) {

	return this.height < value;
};
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
var isInside = require( './isInside' );

module.exports = function() {

	return !isInside.apply( this, arguments );
}
},{"./isInside":8}],10:[function(require,module,exports){
module.exports = function( value ) {

	return this.x > value;
};
},{}],11:[function(require,module,exports){
module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.x < value;	
	} else {

		return this.x < value.x;
	}
};
},{}],12:[function(require,module,exports){
module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.x + this.width > value;
	} else {

		return this.x + this.width > value.x + value.width;
	}
};
},{}],13:[function(require,module,exports){
module.exports = function( value ) {

	return this.x + this.width < value;
};
},{}],14:[function(require,module,exports){
module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.y > value;	
	} else {

		return this.y > value.y;
	}
};
},{}],15:[function(require,module,exports){
module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.y < value;	
	} else {

		return this.y < value.y;
	}
};
},{}],16:[function(require,module,exports){
module.exports = function( value ) {

	return this.width > value;
};
},{}],17:[function(require,module,exports){
module.exports = function( value ) {

	return this.width < value;
};
},{}],18:[function(require,module,exports){
module.exports = function( value ) {

	this._y = Math.min( this._y, value - this._height );
};
},{}],19:[function(require,module,exports){
module.exports = function( item ) {

	this._y = Math.min( this._y, item.y + item.height - this._height );
};
},{}],20:[function(require,module,exports){
module.exports = function( value ) {

	this._y = Math.max( this._y, value - this._height );
};
},{}],21:[function(require,module,exports){
module.exports = function( item ) {

	this._y = Math.max( this._y, item.y + item.height - this._height );
};
},{}],22:[function(require,module,exports){
module.exports = function( value ) {

	this._x = Math.min( this._x, value );
};
},{}],23:[function(require,module,exports){
module.exports = function( item ) {

	this._x = Math.min( this._x, item.x );
};
},{}],24:[function(require,module,exports){
module.exports = function( value ) {

	this._x = Math.max( this._x, value );
};
},{}],25:[function(require,module,exports){
module.exports = function( item ) {

	this._x = Math.max( this._x, item.x );
};
},{}],26:[function(require,module,exports){
module.exports = function() {

	if( arguments.length == 1 ) {

		this._x = Math.min( this._x, arguments[ 0 ] );
		this._y = Math.min( this._y, arguments[ 0 ] );
	} else {

		this._x = Math.min( this._x, arguments[ 0 ] );
		this._y = Math.min( this._y, arguments[ 1 ] );
	}
};
},{}],27:[function(require,module,exports){
module.exports = function( item ) {

	this._x = Math.min( this._x, item.x );
	this._y = Math.min( this._y, item.y );
};
},{}],28:[function(require,module,exports){
module.exports = function() {

	if( arguments.length == 1 ) {

		this._x = Math.max( this._x, arguments[ 0 ] );
		this._y = Math.max( this._y, arguments[ 0 ] );
	} else {

		this._x = Math.max( this._x, arguments[ 0 ] );
		this._y = Math.max( this._y, arguments[ 1 ] );
	}
};
},{}],29:[function(require,module,exports){
module.exports = function( item ) {

	this._x = Math.max( this._x, item.x );
	this._y = Math.max( this._y, item.y );
};
},{}],30:[function(require,module,exports){
module.exports = function( value ) {

	this._x = Math.min( this._x, value - this._width );
};
},{}],31:[function(require,module,exports){
module.exports = function( item ) {

	this._x = Math.min( this._x, item.x - this._height );
};
},{}],32:[function(require,module,exports){
module.exports = function( value ) {

	this._x = Math.max( this._x, value - this._width );
};
},{}],33:[function(require,module,exports){
module.exports=require(32)
},{}],34:[function(require,module,exports){
module.exports = function( value ) {

	this._y = Math.min( this._y, value );
}
},{}],35:[function(require,module,exports){
module.exports = function( item ) {

	this._y = Math.min( this._y, item.y + item.height - this._height );
}
},{}],36:[function(require,module,exports){
module.exports = function( value ) {

	this._y = Math.max( this._y, value );
};
},{}],37:[function(require,module,exports){
module.exports = function( item ) {

	this._y = Math.max( this._y, item.y );
};
},{}],38:[function(require,module,exports){
module.exports = function( value ) {

	this._height = Math.min( this._height, value );
};
},{}],39:[function(require,module,exports){
exports.module = function( item ) {

	this._height = Math.min( this._height, item.height ); 
};
},{}],40:[function(require,module,exports){
module.exports = function() {

	if( arguments.length == 1 ) {

		this._width = Math.min( this._width, arguments[ 0 ] );
		this._height = Math.min( this._height, arguments[ 0 ] );
	} else {

		this._width = Math.min( this._width, arguments[ 0 ] );
		this._height = Math.min( this._height, arguments[ 1 ] );
	}
};
},{}],41:[function(require,module,exports){
module.exports = function() {

	this._width = Math.min( this._width, item.width );
	this._height = Math.min( this._height, item.height ); 
};
},{}],42:[function(require,module,exports){
module.exports = function( value ) {

	this._width = Math.min( this._width, value );
};
},{}],43:[function(require,module,exports){
module.exports = function( item ) {

	this._width = Math.min( this._width, item.width ); 
};
},{}],44:[function(require,module,exports){
module.exports = function( value ) {

	this._height = Math.max( this._height, value );
};
},{}],45:[function(require,module,exports){
module.exports = function( item ) {

	this._height = Math.max( this._height, item.height ); 
};
},{}],46:[function(require,module,exports){
module.exports = function() {

	if( arguments.length == 1 ) {

		this._width = Math.max( this._width, arguments[ 0 ] );
		this._height = Math.max( this._height, arguments[ 0 ] );
	} else {

		this._width = Math.max( this._width, arguments[ 0 ] );
		this._height = Math.max( this._height, arguments[ 1 ] );
	}
};
},{}],47:[function(require,module,exports){
module.exports = function( item ) {

	this._width = Math.max( this._width, item.width );
	this._height = Math.max( this._height, item.height ); 
};
},{}],48:[function(require,module,exports){
module.exports = function( value ) {

	this._width = Math.max( this._width, value );
};
},{}],49:[function(require,module,exports){
module.exports = function( item ) {

	this._width = Math.max( this._width, item.width ); 
};
},{}],50:[function(require,module,exports){
module.exports = function( item ) {

	this._y += item.y - this._height;
};
},{}],51:[function(require,module,exports){
module.exports = function( item ) {

	this._y += item.y + item.height;
};
},{}],52:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x - this._width;
};
},{}],53:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x + item.width;
};
},{}],54:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x;
	this._y += item.y;
};
},{}],55:[function(require,module,exports){
module.exports = function( item ) {

	this._y += item.y + item.height - this._height;
};
},{}],56:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x + ( item.width - this._width ) * 0.5;	
	this._y += item.y + ( item.height - this._height ) * 0.5;
};
},{}],57:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x + ( item.width - this._width ) * 0.5;
};
},{}],58:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x;
};
},{}],59:[function(require,module,exports){
module.exports = function( x, y ) {

	this._x += x;
	this._y += y;
};
},{}],60:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._x += item.width * percentage;
	this._y += item.height * percentage;
};
},{}],61:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x + item.width - this._width;
};
},{}],62:[function(require,module,exports){
module.exports = function( item ) {

	this._y += item.y;
};
},{}],63:[function(require,module,exports){
module.exports = function( item ) {

	this._y += item.y + ( item.height - this._height ) * 0.5;
};
},{}],64:[function(require,module,exports){
module.exports = function( x ) {

	this._x += x;
};
},{}],65:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._x += item.width * percentage;
};
},{}],66:[function(require,module,exports){
module.exports = function( y ) {

	this._y += y;
};
},{}],67:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._y += item.height * percentage;
};
},{}],68:[function(require,module,exports){
module.exports = function( height ) {

	this._height += height;
};
},{}],69:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._height += item.height * percentage;
};
},{}],70:[function(require,module,exports){
module.exports = function( originalWidth, originalHeight ) {

	this._height += this._width / originalWidth * originalHeight;
};
},{}],71:[function(require,module,exports){
module.exports = function( item ) {

	this._height += item.height;
};
},{}],72:[function(require,module,exports){
module.exports = function( item ) {

	this._width += item.width;
	this._height += item.height;
};
},{}],73:[function(require,module,exports){
module.exports = function( item ) {

	this._width += item.width;
};
},{}],74:[function(require,module,exports){
module.exports = function( width, height ) {

	if( arguments.length == 1 ) {

		this._width += arguments[ 0 ];
		this._height += arguments[ 0 ];
	} else {

		this._width += arguments[ 0 ];
		this._height += arguments[ 1 ];
	}
};
},{}],75:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._width += item.width * percentage;	
	this._height += item.height * percentage;
};
},{}],76:[function(require,module,exports){
module.exports = function( originalWidth, originalHeight ) {

	if( this._width == 0 ) {

		this._width += this._height / originalHeight * originalWidth;
	} else if( this._height == 0 ) {

		this._height += this._width / originalWidth * originalHeight;
	}
};
},{}],77:[function(require,module,exports){
module.exports = function( width ) {

	this._width += width;
};
},{}],78:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._width += item.width * percentage;
};
},{}],79:[function(require,module,exports){
module.exports = function( originalWidth, originalHeight ) {

	this._width += this._height / originalHeight * originalWidth;
}
},{}],80:[function(require,module,exports){
module.exports = function( item ) {

	this._height -= item.height;
};
},{}],81:[function(require,module,exports){
module.exports = function( item ) {

	this._x -= item.x;
	this._y -= item.y;
};
},{}],82:[function(require,module,exports){
module.exports = function( item ) {

	this._width -= item.width;
	this._height -= item.height;
};
},{}],83:[function(require,module,exports){
module.exports = function( item ) {

	this._width -= item.width;
};
},{}],84:[function(require,module,exports){
module.exports = function( item ) {

	this._x -= item.x;
};
},{}],85:[function(require,module,exports){
module.exports = function( item ) {

	this._y -= item.y;
};
},{}],86:[function(require,module,exports){
module.exports=require(71)
},{}],87:[function(require,module,exports){
module.exports=require(54)
},{}],88:[function(require,module,exports){
module.exports=require(72)
},{}],89:[function(require,module,exports){
module.exports=require(73)
},{}],90:[function(require,module,exports){
module.exports=require(58)
},{}],91:[function(require,module,exports){
module.exports=require(62)
},{}],92:[function(require,module,exports){
module.exports = function( value ) {

	this._height -= value;
};
},{}],93:[function(require,module,exports){
module.exports = function( x, y ) {

	this._x -= x;
	this._y -= y;
};
},{}],94:[function(require,module,exports){
module.exports = function( width, height ) {

	this._width -= width;
	this._height -= height;
};
},{}],95:[function(require,module,exports){
module.exports = function( value ) {

	this._width -= value;
};
},{}],96:[function(require,module,exports){
module.exports = function( value ) {

	this._x -= value;
};
},{}],97:[function(require,module,exports){
module.exports = function( value ) {

	this._y -= value;
};
},{}],98:[function(require,module,exports){
module.exports = function( value ) {

	this._height += value;
};
},{}],99:[function(require,module,exports){
module.exports=require(59)
},{}],100:[function(require,module,exports){
module.exports = function( width, height ) {

	this._width += width;
	this._height += height;
};
},{}],101:[function(require,module,exports){
module.exports = function( value ) {

	this._width += value;
};
},{}],102:[function(require,module,exports){
module.exports = function( value ) {

	this._x += value;
};
},{}],103:[function(require,module,exports){
module.exports = function( value ) {

	this._y += value;
};
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vZXhhbXBsZS9wb25nL21haW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL0xheURvd24uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL0xheW91dE5vZGUuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2NvbmRpdGlvbmFscy9ib3R0b21HcmVhdGVyVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL2JvdHRvbUxlc3NUaGFuLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvaGVpZ2h0R3JlYXRlclRoYW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2NvbmRpdGlvbmFscy9oZWlnaHRMZXNzVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL2lzSW5zaWRlLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvaXNPdXRzaWRlLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvbGVmdEdyZWF0ZXJUaGFuLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvbGVmdExlc3NUaGFuLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvcmlnaHRHcmVhdGVyVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL3JpZ2h0TGVzc1RoYW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2NvbmRpdGlvbmFscy90b3BHcmVhdGVyVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL3RvcExlc3NUaGFuLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvd2lkdGhHcmVhdGVyVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL3dpZHRoTGVzc1RoYW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vYm90dG9tTWF4LmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL2JvdHRvbU1heEZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vYm90dG9tTWluLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL2JvdHRvbU1pbkZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vbGVmdE1heC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi9sZWZ0TWF4RnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi9sZWZ0TWluLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL2xlZnRNaW5Gcm9tLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFBvc2l0aW9uLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFBvc2l0aW9uRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5Qb3NpdGlvbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5Qb3NpdGlvbkZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vcmlnaHRNYXguanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vcmlnaHRNYXhGcm9tLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL3JpZ2h0TWluLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL3JpZ2h0TWluRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi90b3BNYXguanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vdG9wTWF4RnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi90b3BNaW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vdG9wTWluRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21heEhlaWdodC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21heEhlaWdodEZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9tYXhTaXplLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFNpemUvbWF4U2l6ZUZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9tYXhXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21heFdpZHRoRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21pbkhlaWdodC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21pbkhlaWdodEZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9taW5TaXplLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFNpemUvbWluU2l6ZUZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9taW5XaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21pbldpZHRoRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vYWxpZ25lZEFib3ZlLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9hbGlnbmVkQmVsb3cuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL2FsaWduZWRMZWZ0T2YuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL2FsaWduZWRSaWdodE9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9hbGlnbmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vYm90dG9tQWxpZ25lZFdpdGguanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL2NlbnRlcmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vaG9yaXpvbnRhbGx5Q2VudGVyZWRXaXRoLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9sZWZ0QWxpZ25lZFdpdGguanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL3Bvc2l0aW9uSXMuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL3Bvc2l0aW9uSXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9yaWdodEFsaWduZWRXaXRoLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi90b3BBbGlnbmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vdmVydGljYWxseUNlbnRlcmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24veElzLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi94SXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi95SXMuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL3lJc0FQZXJjZW50YWdlT2YuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFNpemUvaGVpZ2h0SXMuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFNpemUvaGVpZ2h0SXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL2hlaWdodElzUHJvcG9ydGlvbmFsLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL21hdGNoZXNIZWlnaHRPZi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0U2l6ZS9tYXRjaGVzU2l6ZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL21hdGNoZXNXaWR0aE9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3NpemVJcy5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0U2l6ZS9zaXplSXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3NpemVJc1Byb3BvcnRpb25hbC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0U2l6ZS93aWR0aElzLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3dpZHRoSXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3dpZHRoSXNQcm9wb3J0aW9uYWwuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNQb3NpdGlvbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9taW51c1NpemUuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9taW51c1guanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNZLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3BsdXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvcGx1c1Bvc2l0aW9uLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3BsdXNTaXplLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3BsdXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9wbHVzWC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9wbHVzWS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92TWludXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdk1pbnVzUG9zaXRpb24uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdk1pbnVzU2l6ZS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92TWludXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92TWludXNYLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3ZNaW51c1kuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNQb3NpdGlvbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92UGx1c1NpemUuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92UGx1c1guanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNZLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbInZhciBMYXlEb3duID0gcmVxdWlyZSggJy4uLy4uL3NyYy9MYXlEb3duJyApO1xuXG5cbnZhciBiYWxsWERpcmVjdGlvbiA9IDE7XG52YXIgYmFsbFlEaXJlY3Rpb24gPSAxO1xudmFyIGJhbGxWZWxvY2l0eSA9IHsgeDogMCwgeTogMCB9O1xuXG5cblxuXG5cbnZhciBsYXlvdXQgPSBuZXcgTGF5RG93biggbGF5b3V0RnVuY3Rpb24sIHJlYWRGdW5jdGlvbiwgY3JlYXRlRnVuY3Rpb24gKTtcblxudmFyIHBhZGRsZTEgPSBsYXlvdXQuY3JlYXRlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3BhZGRsZTEnICkgKTtcbnZhciBwYWRkbGUyID0gbGF5b3V0LmNyZWF0ZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdwYWRkbGUyJyApICk7XG52YXIgYmFsbCA9IGxheW91dC5jcmVhdGUoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnYmFsbCcgKSApO1xudmFyIGZpZWxkID0gbGF5b3V0LmNyZWF0ZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdmaWVsZCcgKSApO1xudmFyIHZlbG9jaXR5ID0gbGF5b3V0LmNyZWF0ZSggYmFsbFZlbG9jaXR5LCBudWxsICk7XG5cbmJhbGwubmFtZSA9ICdiYWxsJztcblxudmVsb2NpdHkucmVhZEZ1bmN0aW9uID0gbnVsbDtcbnZlbG9jaXR5LmxheW91dEZ1bmN0aW9uID0gZnVuY3Rpb24oIGJhbGxWZWxvY2l0eSwgbm9kZSApIHtcblxuXHRiYWxsVmVsb2NpdHkueCA9IG5vZGUueDtcblx0YmFsbFZlbG9jaXR5LnkgPSBub2RlLnk7XG59O1xuXG5cblxuXG5maWVsZC5tYXRjaGVzU2l6ZU9mKCBsYXlvdXQgKS5taW51cyggMTAwIClcbi5wb3NpdGlvbklzKCA1MCwgNTAgKTtcblxucGFkZGxlMVxuLndpZHRoSXNBUGVyY2VudGFnZU9mKCBmaWVsZCwgMC4wMyApLmhlaWdodElzQVBlcmNlbnRhZ2VPZiggZmllbGQsIDAuMyApXG4ubGVmdEFsaWduZWRXaXRoKCBmaWVsZCApLnBsdXMoIDIwICkudmVydGljYWxseUNlbnRlcmVkV2l0aCggZmllbGQgKVxuLnRvcE1pbiggZmllbGQgKS5ib3R0b21NYXgoIGZpZWxkICk7XG5cbnBhZGRsZTIubWF0Y2hlc1NpemVPZiggcGFkZGxlMSApLnRvcEFsaWduZWRXaXRoKCBwYWRkbGUxICkucmlnaHRBbGlnbmVkV2l0aCggZmllbGQgKS5taW51cyggMjAgKTtcblxuYmFsbC5tYXRjaGVzV2lkdGhPZiggcGFkZGxlMSApLmhlaWdodElzUHJvcG9ydGlvbmFsKCAxMCwgMTAgKS5jZW50ZXJlZFdpdGgoIGZpZWxkIClcbi53aGVuKCBiYWxsICkucmlnaHRHcmVhdGVyVGhhbiggZmllbGQgKS5vbiggZnVuY3Rpb24oKSB7XG5cblx0YmFsbFhEaXJlY3Rpb24gKj0gLTE7XG5cdFx0YmFsbC54ID0gZmllbGQueCArIGZpZWxkLndpZHRoIC0gYmFsbC53aWR0aDtcbn0pXG4ud2hlbiggYmFsbCApLmxlZnRMZXNzVGhhbiggZmllbGQgKS5vbiggZnVuY3Rpb24oKSB7XG5cblx0YmFsbFhEaXJlY3Rpb24gKj0gLTE7XG5cdGJhbGwueCA9IGZpZWxkLng7XG59KVxuLndoZW4oIGJhbGwgKS50b3BMZXNzVGhhbiggZmllbGQgKS5vbiggZnVuY3Rpb24oKSB7XG5cblx0YmFsbFlEaXJlY3Rpb24gKj0gLTE7XG5cdGJhbGwueSA9IGZpZWxkLnk7XG59KVxuLndoZW4oIGJhbGwgKS5ib3R0b21HcmVhdGVyVGhhbiggZmllbGQgKS5vbiggZnVuY3Rpb24oKSB7XG5cblx0YmFsbFlEaXJlY3Rpb24gKj0gLTE7XG5cdGJhbGwueSA9IGZpZWxkLnkgKyBmaWVsZC5oZWlnaHQgLSBiYWxsLmhlaWdodDtcbn0pXG4ud2hlbiggYmFsbCApLmlzSW5zaWRlKCBwYWRkbGUxICkub24oIGZ1bmN0aW9uKCkge1xuXG5cdGJhbGxYRGlyZWN0aW9uICo9IC0xO1xuXHRiYWxsLnggPSBwYWRkbGUxLnggKyBwYWRkbGUxLndpZHRoICsgYmFsbFhEaXJlY3Rpb24gKiBiYWxsVmVsb2NpdHkueDtcbn0pXG4ud2hlbiggYmFsbCApLmlzSW5zaWRlKCBwYWRkbGUyICkub24oIGZ1bmN0aW9uKCkge1xuXG5cdGJhbGxYRGlyZWN0aW9uICo9IC0xO1xuXHRiYWxsLnggPSBwYWRkbGUyLnggLSBiYWxsLndpZHRoICsgYmFsbFhEaXJlY3Rpb24gKiBiYWxsVmVsb2NpdHkueDtcbn0pO1xuXG52ZWxvY2l0eS5wb3NpdGlvbklzQVBlcmNlbnRhZ2VPZiggZmllbGQsIDAuMDA4ICk7XG5cblxuXG5cblxub25SZXNpemUoKTtcbm9uRW50ZXJGcmFtZSgpO1xuXG53aW5kb3cub25yZXNpemUgPSBvblJlc2l6ZTtcbndpbmRvdy5vbm1vdXNlbW92ZSA9IG9uTW91c2VNb3ZlO1xuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZSggZXYgKSB7XG5cblx0cGFkZGxlMS55ID0gZXYucGFnZVkgLSBwYWRkbGUxLmhlaWdodCAqIDAuNTtcbn1cblxuZnVuY3Rpb24gb25FbnRlckZyYW1lKCkge1xuXG5cdGJhbGwueCArPSBiYWxsVmVsb2NpdHkueCAqIGJhbGxYRGlyZWN0aW9uO1xuXHRiYWxsLnkgKz0gYmFsbFZlbG9jaXR5LnkgKiBiYWxsWURpcmVjdGlvbjtcblxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIG9uRW50ZXJGcmFtZSApO1xufVxuXG5mdW5jdGlvbiBvblJlc2l6ZSgpIHtcblxuXHRsYXlvdXQucmVzaXplQW5kUG9zaXRpb24oIDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcbn1cblxuZnVuY3Rpb24gbGF5b3V0RnVuY3Rpb24oIGl0ZW0sIG5vZGUsIHNldFdpZHRoLCBzZXRIZWlnaHQgKSB7IFxuXG5cdGl0ZW0uc3R5bGUubGVmdCA9IE1hdGguZmxvb3IoIG5vZGUueCApICsgJ3B4Jztcblx0aXRlbS5zdHlsZS50b3AgPSBNYXRoLmZsb29yKCBub2RlLnkgKSArICdweCc7XG5cblx0aWYoIHNldFdpZHRoICkge1xuXG5cdFx0aXRlbS5zdHlsZS53aWR0aCA9IE1hdGguZmxvb3IoIG5vZGUud2lkdGggKSArICdweCc7XG5cdH1cblxuXHRpZiggc2V0SGVpZ2h0ICkge1xuXG5cdFx0aXRlbS5zdHlsZS5oZWlnaHQgPSBNYXRoLmZsb29yKCBub2RlLmhlaWdodCApICsgJ3B4Jztcblx0fVxufVxuXG5mdW5jdGlvbiByZWFkRnVuY3Rpb24oIGl0ZW0sIG5hbWUgKSB7XG5cblx0aWYoIG5hbWUgPT0gJ3dpZHRoJyApIHtcblxuXHRcdHJldHVybiBpdGVtLmNsaWVudFdpZHRoO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGl0ZW0uY2xpZW50SGVpZ2h0O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdGl0ZW0uc3R5bGVbICdib3gtc2l6aW5nJyBdID0gJ2JvcmRlci1ib3gnO1xuXHRpdGVtLnN0eWxlWyAnLW1vei1ib3gtc2l6aW5nJyBdID0gJ2JvcmRlci1ib3gnO1xuXHRpdGVtLnN0eWxlWyAnLXdlYmtpdC1ib3gtc2l6aW5nJyBdID0gJ2JvcmRlci1ib3gnO1xuXG5cdGl0ZW0uc3R5bGVbICdwb3NpdGlvbicgXSA9ICdhYnNvbHV0ZSc7XG59IiwidmFyIExheW91dE5vZGUgPSByZXF1aXJlKCAnLi9MYXlvdXROb2RlJyApO1xuXG4vKipcbkxheURvd24gaXMgdGhlIHJvb3Qgb2YgdGhlIGxheURvd24gbGlicmFyeS4gSXQgaXMgYSBmYWN0b3J5IHRvIGNyZWF0ZSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlXCJ9fXt7L2Nyb3NzTGlua319J3MuXG5cbkFuIGluc3RhbmNlIG9mIExheURvd24gaXMgZXF1aXZhbGVudCB0byBzYXlpbmcgXCJhIGxheW91dFwiLiBTbyBhIExheURvd24gaXMgYSBsYXlvdXQgdGhhdCB5b3UgbGF5IGRvd24gaXRlbXMgb24uXG5cbldoZW4geW91IGluc3RhbnRpYXRlIGEgTGF5RG93biB5b3UgbXVzdCBwYXNzIGluIHR3byBmdW5jdGlvbnMuIFxuXG5UaGUgZmlyc3Qgb25lIGlzIGEgbGF5b3V0IGZ1bmN0aW9uIHdoaWNoIHdpbGwgcG9zaXRpb24gdGhpbmdzLiBcblxuQW4gZXhhbXBsZSBsYXlvdXQgZnVuY3Rpb246XG5cblx0ZnVuY3Rpb24gbGF5b3V0RnVuY3Rpb24oIGl0ZW0sIG5vZGUsIHNldFdpZHRoLCBzZXRIZWlnaHQgKSB7IFxuXG5cdFx0aXRlbS5zdHlsZS5sZWZ0ID0gTWF0aC5mbG9vciggbm9kZS54ICkgKyAncHgnO1xuXHRcdGl0ZW0uc3R5bGUudG9wID0gTWF0aC5mbG9vciggbm9kZS55ICkgKyAncHgnO1xuXG5cdFx0aWYoIHNldFdpZHRoICkge1xuXG5cdFx0XHRpdGVtLnN0eWxlLndpZHRoID0gTWF0aC5mbG9vciggbm9kZS53aWR0aCApICsgJ3B4Jztcblx0XHR9XG5cblx0XHRpZiggc2V0SGVpZ2h0ICkge1xuXG5cdFx0XHRpdGVtLnN0eWxlLmhlaWdodCA9IE1hdGguZmxvb3IoIG5vZGUuaGVpZ2h0ICkgKyAncHgnO1xuXHRcdH1cblx0fVxuXG5cblRoZSBzZWNvbmQgaXMgYSByZWFkIGZ1bmN0aW9uIHdoaWNoIHdpbGwgcmVhZCBpbiB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiBhbiBpdGVtIGlmIG5vIHJ1bGVzIGVmZmVjdGVkIHRob3NlIHByb3BlcnRpZXMuIFxuXG5IZXJlIGlzIGFuIGV4YW1wbGUgcmVhZEZ1bmN0aW9uOlxuXG5cdGZ1bmN0aW9uIHJlYWRGdW5jdGlvbiggaXRlbSwgbmFtZSApIHtcblxuXHRcdGlmKCBuYW1lID09ICd3aWR0aCcgKSB7XG5cblx0XHRcdHJldHVybiBpdGVtLmNsaWVudFdpZHRoO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHJldHVybiBpdGVtLmNsaWVudEhlaWdodDtcblx0XHR9XG5cdH1cblxuVGhlIHRoaXJkIGZ1bmN0aW9uIHRoYXQgeW91IG1heSBwYXNzIGluIGlzIGEgY3JlYXRlIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgcnVuIG9uIGVhY2ggaXRlbSBiZWZvcmUgYSBMYXlvdXROb2RlIGlzIGNyZWF0ZWQuXG5cbkhlcmUgaXMgYW4gZXhhbXBsZSBjcmVhdGVGdW5jdGlvbjpcblxuXHRmdW5jdGlvbiBjcmVhdGVGdW5jdGlvbiggaXRlbSApIHtcblxuXHRcdGl0ZW0uc3R5bGVbICdib3gtc2l6aW5nJyBdID0gJ2JvcmRlci1ib3gnO1xuXHRcdGl0ZW0uc3R5bGVbICctbW96LWJveC1zaXppbmcnIF0gPSAnYm9yZGVyLWJveCc7XG5cdFx0aXRlbS5zdHlsZVsgJy13ZWJraXQtYm94LXNpemluZycgXSA9ICdib3JkZXItYm94JztcblxuXHRcdGl0ZW0uc3R5bGVbICdwb3NpdGlvbicgXSA9ICdhYnNvbHV0ZSc7XG5cdH1cblxuXG5cbkBjbGFzcyBMYXlEb3duXG5AY29uc3RydWN0b3JcblxuQHBhcmFtIGxheW91dEZ1bmN0aW9uIHtGdW5jdGlvbn0gVGhlIGxheW91dEZ1bmN0aW9uIGZ1bmN0aW9uIGlzIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCB0cmFuc2xhdGUgdGhlIHgsIHksIHdpZHRoLCBhbmQgaGVpZ2h0IHByb3BlcnRpZXMgb2YgYVxuTGF5b3V0Tm9kZSBpbnRvIGFjdHVhbCBwaHlzaWNhbCBzY3JlZW4gcG9zaXRpb24uIChzZWUgdGhlIGFib3ZlIGV4YW1wbGUpXG5cblNvIGZvciBpbnN0YW5jZSBpZiB3ZSdyZSB3b3JraW5nIHdpdGggdGhlIERPTSBpdCB3b3VsZCBzZXQgQ1NTIHByb3BlcnRpZXMgb24gdGhlIFwiaXRlbVwiIHBhc3NlZCBpbiB0byBlbnN1cmUgdGhhdCB0aGUgaXRlbSBpcyBvbiBcbnNjcmVlbiBhdCB4LCB5IGF0IHRoZSBjb3JyZWN0IHNpemUuIChzZWUgdGhlIGFib3ZlIGV4YW1wbGUpXG5cbkBwYXJhbSByZWFkRnVuY3Rpb24ge2Z1bmN0aW9ufSBJZiB5b3UgZGVmaW5lIG5vIHNpemluZyBydWxlcyB0byBzZXQgd2lkdGggYW5kIGhlaWdodCBvZiBhbiBcIml0ZW1cIi9MYXlvdXROb2RlIHRoZW4gd2Ugd2lsbCBuZWVkIHRvIHJlYWQgdGhlXG53aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBvYmplY3QgdG8gYmUgYWJsZSB0byBwb3NpdGlvbiBkZXBlbmRlbnQgTGF5b3V0Tm9kZSdzLlxuXG5AcGFyYW0gY3JlYXRlRnVuY3Rpb24ge2Z1bmN0aW9ufSBJcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBydW4gb24gZXZlcnkgZXZlcnkgaXRlbSB0byBiZSBsYXllZCBvdXQgYmVmb3JlIGEgTGF5b3V0Tm9kZSBpcyBjcmVhdGVkLlxuXG5MZXQncyBzYXkgeW91J3JlIHdvcmtpbmcgd2l0aCB0aGUgRE9NIHlvdSBtYXkgd2FudCB0byBmb3IgaW5zdGFuY2Ugc2V0IHRoZSBDU1MgcG9zaXRpb24gcHJvcGVydHkgdG8gYmUgYWJzb2x1dGUgd2l0aGluIHRoaXMgZnVuY3Rpb24uIChzZWUgdGhlIGFib3ZlIGV4YW1wbGUpXG5cbioqL1xudmFyIExheURvd24gPSBmdW5jdGlvbiggbGF5b3V0RnVuY3Rpb24sIHJlYWRGdW5jdGlvbiwgY3JlYXRlRnVuY3Rpb24gKSB7XG5cblx0dGhpcy5sYXlvdXRGdW5jdGlvbiA9IGxheW91dEZ1bmN0aW9uO1xuXHR0aGlzLnJlYWRGdW5jdGlvbiA9IHJlYWRGdW5jdGlvbjtcblx0dGhpcy5jcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uIHx8IG51bGw7XG5cdHRoaXMubm9kZXMgPSBbXTtcbn07XG5cbi8qKlxuVGhpcyBpcyB0aGUgeCBwb3NpdGlvbiBvZiB0aGUgTGF5RG93biBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2YgeCB3aWxsIGJlIDAgdW50aWwgXG57eyNjcm9zc0xpbmsgXCJMYXlEb3duL3Jlc2l6ZUFuZFBvc2l0aW9uOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBpcyBjYWxsZWQuXG5cbk9uY2Uge3sjY3Jvc3NMaW5rIFwiTGF5RG93bi9yZXNpemVBbmRQb3NpdGlvbjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gaGFzIGJlZW4gY2FsbGVkIHRoZSB4IHZhbHVlIHdpbGwgYmUgd2hhdGV2ZXIgd2FzIHBhc3NlZFxuaW4gZm9yIHRoZSB4IHBhcmFtZXRlci5cblxuVGhpcyBwcm9wZXJ0eSBpcyByZWFkIG9ubHkgYW5kIHNob3VsZCBub3QgYmUgc2V0IG1hbnVhbGx5LlxuXG5AcHJvcGVydHkgeFxuQHR5cGUgTnVtYmVyXG5AcmVhZE9ubHlcbioqL1xuTGF5RG93bi5wcm90b3R5cGUueCA9IDA7XG5cblxuLyoqXG5UaGlzIGlzIHRoZSB5IHBvc2l0aW9uIG9mIHRoZSBMYXlEb3duIG9uIHNjcmVlbi4gSW5pdGlhbGx5IHRoZSB2YWx1ZSBvZiB5IHdpbGwgYmUgMCB1bnRpbCBcbnt7I2Nyb3NzTGluayBcIkxheURvd24vcmVzaXplQW5kUG9zaXRpb246bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGlzIGNhbGxlZC5cblxuT25jZSB7eyNjcm9zc0xpbmsgXCJMYXlEb3duL3Jlc2l6ZUFuZFBvc2l0aW9uOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBoYXMgYmVlbiBjYWxsZWQgdGhlIHkgdmFsdWUgd2lsbCBiZSB3aGF0ZXZlciB3YXMgcGFzc2VkXG5pbiBmb3IgdGhlIHkgcGFyYW1ldGVyLlxuXG5UaGlzIHByb3BlcnR5IGlzIHJlYWQgb25seSBhbmQgc2hvdWxkIG5vdCBiZSBzZXQgbWFudWFsbHkuXG5cbkBwcm9wZXJ0eSB5XG5AdHlwZSBOdW1iZXJcbkByZWFkT25seVxuKiovXG5MYXlEb3duLnByb3RvdHlwZS55ID0gMDtcblxuXG4vKipcblRoaXMgaXMgdGhlIHdpZHRoIHBvc2l0aW9uIG9mIHRoZSBMYXlEb3duIG9uIHNjcmVlbi4gSW5pdGlhbGx5IHRoZSB2YWx1ZSBvZiB3aWR0aCB3aWxsIGJlIDAgdW50aWwgXG57eyNjcm9zc0xpbmsgXCJMYXlEb3duL3Jlc2l6ZUFuZFBvc2l0aW9uOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBpcyBjYWxsZWQuXG5cbk9uY2Uge3sjY3Jvc3NMaW5rIFwiTGF5RG93bi9yZXNpemVBbmRQb3NpdGlvbjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gaGFzIGJlZW4gY2FsbGVkIHRoZSB3aWR0aCB2YWx1ZSB3aWxsIGJlIHdoYXRldmVyIHdhcyBwYXNzZWRcbmluIGZvciB0aGUgd2lkdGggcGFyYW1ldGVyLlxuXG5UaGlzIHByb3BlcnR5IGlzIHJlYWQgb25seSBhbmQgc2hvdWxkIG5vdCBiZSBzZXQgbWFudWFsbHkuXG5cbkBwcm9wZXJ0eSB3aWR0aFxuQHR5cGUgTnVtYmVyXG5AcmVhZE9ubHlcbioqL1xuTGF5RG93bi5wcm90b3R5cGUud2lkdGggPSAwO1xuXG5cbi8qKlxuVGhpcyBpcyB0aGUgaGVpZ2h0IHBvc2l0aW9uIG9mIHRoZSBMYXlEb3duIG9uIHNjcmVlbi4gSW5pdGlhbGx5IHRoZSB2YWx1ZSBvZiBoZWlnaHQgd2lsbCBiZSAwIHVudGlsIFxue3sjY3Jvc3NMaW5rIFwiTGF5RG93bi9yZXNpemVBbmRQb3NpdGlvbjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gaXMgY2FsbGVkLlxuXG5PbmNlIHt7I2Nyb3NzTGluayBcIkxheURvd24vcmVzaXplQW5kUG9zaXRpb246bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGhhcyBiZWVuIGNhbGxlZCB0aGUgaGVpZ2h0IHZhbHVlIHdpbGwgYmUgd2hhdGV2ZXIgd2FzIHBhc3NlZFxuaW4gZm9yIHRoZSBoZWlnaHQgcGFyYW1ldGVyLlxuXG5UaGlzIHByb3BlcnR5IGlzIHJlYWQgb25seSBhbmQgc2hvdWxkIG5vdCBiZSBzZXQgbWFudWFsbHkuXG5cbkBwcm9wZXJ0eSBoZWlnaHRcbkB0eXBlIE51bWJlclxuQHJlYWRPbmx5XG4qKi9cbkxheURvd24ucHJvdG90eXBlLmhlaWdodCA9IDA7XG5cbi8qKlxuVGhpcyBpcyB0aGUgbGF5b3V0IGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgdXNlZCBieSBkZWZhdWx0IGZvciBhbGwgTGF5b3V0Tm9kZSdzLiBUaGlzIHZhbHVlIGlzIHNldCBpbiB0aGUgY29uc3RydWN0b3IgaW5pdGlhbGx5LlxuXG5AcHJvcGVydHkgbGF5b3V0RnVuY3Rpb25cbkB0eXBlIEZ1bmN0aW9uXG4qKi9cbkxheURvd24ucHJvdG90eXBlLmxheW91dEZ1bmN0aW9uID0gbnVsbDtcblxuLyoqXG5UaGlzIGlzIHRoZSByZWFkIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgdXNlZCBieSBkZWZhdWx0IGZvciBhbGwgTGF5b3V0Tm9kZSdzLiBUaGlzIHZhbHVlIGlzIHNldCBpbiB0aGUgY29uc3RydWN0b3IgaW5pdGlhbGx5LlxuXG5AcHJvcGVydHkgcmVhZEZ1bmN0aW9uXG5AdHlwZSBGdW5jdGlvblxuKiovXG5MYXlEb3duLnByb3RvdHlwZS5yZWFkRnVuY3Rpb24gPSBudWxsO1xuXG4vKipcblRoaXMgaXMgdGhlIGNyZWF0ZSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIHVzZWQgb24gYWxsIGl0ZW1zIGJlaW5nIGxheWVkIG91dC4gVGhpcyB2YWx1ZSBpcyBzZXQgaW4gdGhlIGNvbnN0cnVjdG9yIGluaXRpYWxseS5cblxuQHByb3BlcnR5IGNyZWF0ZUZ1bmN0aW9uXG5AdHlwZSBGdW5jdGlvblxuKiovXG5MYXlEb3duLnByb3RvdHlwZS5jcmVhdGVGdW5jdGlvbiA9IG51bGw7XG5MYXlEb3duLnByb3RvdHlwZS5ub2RlcyA9IG51bGw7XG5cbi8qKlxuVGhlIGNyZWF0ZSBtZXRob2Qgd2lsbCBjcmVhdGUgYSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlXCJ9fXt7L2Nyb3NzTGlua319IHdoaWNoIHJ1bGVzIGNhbiB0aGVuIGJlIGFwcGxpZWQgdG8uXG5cbkBtZXRob2QgY3JlYXRlXG5AcGFyYW0gaXRlbVRvTGF5RG93biB7T2JqZWN0fSBUaGlzIHdpbGwgYmUgdGhlIGl0ZW0gdGhhdCB3ZSdsbCBiZSBsYXlpbmcgZG93bi4gRm9yIGluc3RhbmNlIGlmIHdlIHdlcmUgd29ya2luZyB3aXRoIHRoZSBET00gaXQgY291bGQgYmVcbmFuIGltYWdlIGh0bWwgZWxlbWVudCBvciBhIGRpdiBlbGVtZW50IG9yIHdoYXRldmVyIHlvdSdkIGxpa2UuXG5cbkBwYXJhbSBjcmVhdGVGdW5jdGlvbiB7RnVuY3Rpb259IFRoaXMgZnVuY3Rpb24gd2lsbCBiZSB1c2VkIGJlZm9yZSBjcmVhdGluZyB0aGUgTGF5b3V0Tm9kZSB3aGVyZSB0aGlzIGlzIGhhbmR5IGlzIGlmIHlvdSB3YW50IHRvIG92ZXJyaWRlIHRoZSBcbmRlZmF1bHQgY3JlYXRlIGZ1bmN0aW9uXG4qKi9cbkxheURvd24ucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKCBpdGVtVG9MYXlEb3duLCBjcmVhdGVGdW5jdGlvbiApIHtcblxuXHRjcmVhdGVGdW5jdGlvbiA9IGNyZWF0ZUZ1bmN0aW9uID09PSB1bmRlZmluZWQgPyB0aGlzLmNyZWF0ZUZ1bmN0aW9uIDogY3JlYXRlRnVuY3Rpb247XG5cblx0aWYoIGNyZWF0ZUZ1bmN0aW9uICYmIGl0ZW1Ub0xheURvd24pIHtcblxuXHRcdHRoaXMuY3JlYXRlRnVuY3Rpb24oIGl0ZW1Ub0xheURvd24gKTtcblx0fVxuXG5cdHZhciBuTm9kZSA9IG5ldyBMYXlvdXROb2RlKCB0aGlzLCBpdGVtVG9MYXlEb3duLCB0aGlzLmxheW91dEZ1bmN0aW9uLCB0aGlzLnJlYWRGdW5jdGlvbiApO1x0XG5cblx0dGhpcy5ub2Rlcy5wdXNoKCBuTm9kZSApO1xuXG5cdHJldHVybiBuTm9kZTtcbn07XG5cbi8qKlxuQ2FsbCByZXNpemVBbmRQb3NpdGlvbiB3aGVuZXZlciB5b3UnZCBsaWtlIHRvIGxheW91dCBhbGwgeW91ciBpdGVtcy4gRm9yIGluc3RhbmNlIHlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiBhIHdpbmRvdyByZXNpemVzLlxuXG5AbWV0aG9kIHJlc2l6ZUFuZFBvc2l0aW9uXG5AcGFyYW0geCB7TnVtYmVyfSBUaGlzIGlzIHRoZSB4IHBvc2l0aW9uIG9mIHdoZXJlIHRoaXMgbGF5b3V0IHNob3VsZCBiZWdpbi4gRm9yIGluc3RhbmNlIHggPSAwIGNvdWxkIGJlIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIHNjcmVlbi5cbkBwYXJhbSB5IHtOdW1iZXJ9IFRoaXMgaXMgdGhlIHkgcG9zaXRpb24gb2Ygd2hlcmUgdGhpcyBsYXlvdXQgc2hvdWxkIGJlZ2luLiBGb3IgaW5zdGFuY2UgeSA9IDAgY291bGQgYmUgdGhlIGxlZnQgc2lkZSBvZiB0aGUgc2NyZWVuLlxuQHBhcmFtIHdpZHRoIHtOdW1iZXJ9IFRoaXMgaXMgdGhlIHdpZHRoIG9mIHRoZSBsYXlvdXQuIEZvciBpbnN0YW5jZSB0aGlzIGNvdWxkIGJlIHRoZSB3aWR0aCBvZiB0aGUgc2NyZWVuLlxuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSBUaGlzIGlzIHRoZSBoZWlnaHQgb2YgdGhlIGxheW91dC4gRm9yIGluc3RhbmNlIHRoaXMgY291bGQgYmUgdGhlIGhlaWdodCBvZiB0aGUgc2NyZWVuLlxuKiovXG5MYXlEb3duLnByb3RvdHlwZS5yZXNpemVBbmRQb3NpdGlvbiA9IGZ1bmN0aW9uKCB4LCB5LCB3aWR0aCwgaGVpZ2h0ICkge1xuXG5cdHRoaXMueCA9IHg7XG5cdHRoaXMueSA9IHk7XG5cdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHR0aGlzLndpZHRoID0gd2lkdGg7XG5cblx0dGhpcy5kb0xheW91dCgpO1xufTtcblxuTGF5RG93bi5wcm90b3R5cGUubm9kZUNoYW5nZWQgPSBmdW5jdGlvbiggbm9kZSApIHtcblxuXHR0aGlzLmRvTGF5b3V0KCk7XG59O1xuXG5MYXlEb3duLnByb3RvdHlwZS5kb0xheW91dCA9IGZ1bmN0aW9uKCkge1xuXG5cdC8vd2UgbmVlZCB0byByZXNldCBhbGwgdGhlIGhhc0JlZW5MYXllZE91dFxuXHRmb3IoIHZhciBpID0gMCwgbGVuID0gdGhpcy5ub2Rlcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblxuXHRcdHRoaXMubm9kZXNbIGkgXS5oYXNCZWVuTGF5ZWRPdXQgPSBmYWxzZTtcblx0fVxuXG5cdC8vbm93IGRvTGF5RG93biBvbiBhbGwgb2YgdGhlbSB0aGF0IGhhdmVuJ3QgYmVlbiBsYXllZCBvdXRcblx0Ly90aGV5IGNvdWxkIGJlY29tZSBsYXllZG91dCBpZiBvdGhlciBub2RlcyBoYXZlIGRlcGVuZGVuY2llc1xuXHRmb3IoIHZhciBpID0gMCwgbGVuID0gdGhpcy5ub2Rlcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblxuXHRcdGlmKCAhdGhpcy5ub2Rlc1sgaSBdLmhhc0JlZW5MYXllZE91dCApIHtcblxuXHRcdFx0dGhpcy5ub2Rlc1sgaSBdLmRvTGF5b3V0KCk7XG5cdFx0fVxuXHR9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBMYXlEb3duOyIsIlxuLy8vUE9TSVRJT04gRlVOQ1RJT05TXG52YXIgYWxpZ25lZEFib3ZlID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vYWxpZ25lZEFib3ZlJyApO1xudmFyIGFsaWduZWRCZWxvdyA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL2FsaWduZWRCZWxvdycgKTtcbnZhciBhbGlnbmVkTGVmdE9mID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vYWxpZ25lZExlZnRPZicgKTtcbnZhciBhbGlnbmVkUmlnaHRPZiA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL2FsaWduZWRSaWdodE9mJyApO1xudmFyIGFsaWduZWRXaXRoID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vYWxpZ25lZFdpdGgnICk7XG52YXIgYm90dG9tQWxpZ25lZFdpdGggPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi9ib3R0b21BbGlnbmVkV2l0aCcgKTtcbnZhciBjZW50ZXJlZFdpdGggPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi9jZW50ZXJlZFdpdGgnICk7XG52YXIgaG9yaXpvbnRhbGx5Q2VudGVyZWRXaXRoID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vaG9yaXpvbnRhbGx5Q2VudGVyZWRXaXRoJyApO1xudmFyIGxlZnRBbGlnbmVkV2l0aCA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL2xlZnRBbGlnbmVkV2l0aCcgKTtcbnZhciBwb3NpdGlvbklzID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vcG9zaXRpb25JcycgKTtcbnZhciBwb3NpdGlvbklzQVBlcmNlbnRhZ2VPZiA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3Bvc2l0aW9uSXNBUGVyY2VudGFnZU9mJyApO1xudmFyIHJpZ2h0QWxpZ25lZFdpdGggPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi9yaWdodEFsaWduZWRXaXRoJyApO1xudmFyIHRvcEFsaWduZWRXaXRoID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vdG9wQWxpZ25lZFdpdGgnICk7XG52YXIgdmVydGljYWxseUNlbnRlcmVkV2l0aCA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3ZlcnRpY2FsbHlDZW50ZXJlZFdpdGgnICk7XG52YXIgeElzID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24veElzJyApO1xudmFyIHlJcyA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3lJcycgKTtcbnZhciB4SXNBUGVyY2VudGFnZU9mID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24veElzQVBlcmNlbnRhZ2VPZicgKTtcbnZhciB5SXNBUGVyY2VudGFnZU9mID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24veUlzQVBlcmNlbnRhZ2VPZicgKTtcblxuLy9QT1NJVElPTiBCT1VORCBGVU5DVElPTlNcbnZhciBib3R0b21NYXggPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL2JvdHRvbU1heCcgKTtcbnZhciBib3R0b21NYXhGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9ib3R0b21NYXhGcm9tJyApO1xudmFyIGJvdHRvbU1pbiA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vYm90dG9tTWluJyApO1xudmFyIGJvdHRvbU1pbkZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL2JvdHRvbU1pbkZyb20nICk7XG52YXIgbGVmdE1heCA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vbGVmdE1heCcgKTtcbnZhciBsZWZ0TWF4RnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vbGVmdE1heEZyb20nICk7XG52YXIgbGVmdE1pbiA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vbGVmdE1pbicgKTtcbnZhciBsZWZ0TWluRnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vbGVmdE1pbkZyb20nICk7XG52YXIgbWF4UG9zaXRpb24gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFBvc2l0aW9uJyApO1xudmFyIG1heFBvc2l0aW9uRnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vbWF4UG9zaXRpb25Gcm9tJyApO1xudmFyIG1pblBvc2l0aW9uID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5Qb3NpdGlvbicgKTtcbnZhciBtaW5Qb3NpdGlvbkZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL21pblBvc2l0aW9uRnJvbScgKTtcbnZhciByaWdodE1heCA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vcmlnaHRNYXgnICk7XG52YXIgcmlnaHRNYXhGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9yaWdodE1heEZyb20nICk7XG52YXIgcmlnaHRNaW4gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL3JpZ2h0TWluJyApO1xudmFyIHJpZ2h0TWluRnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vcmlnaHRNaW5Gcm9tJyApO1xudmFyIHRvcE1heCA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vdG9wTWF4JyApO1xudmFyIHRvcE1heEZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL3RvcE1heEZyb20nICk7XG52YXIgdG9wTWluID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi90b3BNaW4nICk7XG52YXIgdG9wTWluRnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vdG9wTWluRnJvbScgKTtcblxuLy8vU0laRSBGVU5DVElPTlNcbnZhciBoZWlnaHRJcyA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvaGVpZ2h0SXMnICk7XG52YXIgaGVpZ2h0SXNBUGVyY2VudGFnZU9mID0gcmVxdWlyZSggJy4vbGF5b3V0U2l6ZS9oZWlnaHRJc0FQZXJjZW50YWdlT2YnICk7XG52YXIgaGVpZ2h0SXNQcm9wb3J0aW9uYWwgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL2hlaWdodElzUHJvcG9ydGlvbmFsJyApO1xudmFyIG1hdGNoZXNIZWlnaHRPZiA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvbWF0Y2hlc0hlaWdodE9mJyApO1xudmFyIG1hdGNoZXNTaXplT2YgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL21hdGNoZXNTaXplT2YnICk7XG52YXIgbWF0Y2hlc1dpZHRoT2YgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL21hdGNoZXNXaWR0aE9mJyApO1xudmFyIHNpemVJcyA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvc2l6ZUlzJyApO1xudmFyIHNpemVJc0FQZXJjZW50YWdlT2YgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL3NpemVJc0FQZXJjZW50YWdlT2YnICk7XG52YXIgc2l6ZUlzUHJvcG9ydGlvbmFsID0gcmVxdWlyZSggJy4vbGF5b3V0U2l6ZS9zaXplSXNQcm9wb3J0aW9uYWwnICk7XG52YXIgd2lkdGhJcyA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvd2lkdGhJcycgKTtcbnZhciB3aWR0aElzQVBlcmNlbnRhZ2VPZiA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvd2lkdGhJc0FQZXJjZW50YWdlT2YnICk7XG52YXIgd2lkdGhJc1Byb3BvcnRpb25hbCA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvd2lkdGhJc1Byb3BvcnRpb25hbCcgKTtcblxuXG4vL1NJWkUgQk9VTkQgRlVOQ1RJT05TXG52YXIgbWF4SGVpZ2h0ID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21heEhlaWdodCcgKTtcbnZhciBtYXhIZWlnaHRGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21heEhlaWdodEZyb20nICk7XG52YXIgbWF4U2l6ZSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9tYXhTaXplJyApO1xudmFyIG1heFNpemVGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21heFNpemVGcm9tJyApO1xudmFyIG1heFdpZHRoID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21heFdpZHRoJyApO1xudmFyIG1heFdpZHRoRnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9tYXhXaWR0aEZyb20nICk7XG52YXIgbWluSGVpZ2h0ID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21pbkhlaWdodCcgKTtcbnZhciBtaW5IZWlnaHRGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21pbkhlaWdodEZyb20nICk7XG52YXIgbWluU2l6ZSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9taW5TaXplJyApO1xudmFyIG1pblNpemVGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21pblNpemVGcm9tJyApO1xudmFyIG1pbldpZHRoID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21pbldpZHRoJyApO1xudmFyIG1pbldpZHRoRnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9taW5XaWR0aEZyb20nICk7XG5cbi8vQ09ORElUSU9OQUwgRlVOQ1RJT05TXG52YXIgd2lkdGhHcmVhdGVyVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy93aWR0aEdyZWF0ZXJUaGFuJyApO1xudmFyIGhlaWdodEdyZWF0ZXJUaGFuID0gcmVxdWlyZSggJy4vY29uZGl0aW9uYWxzL2hlaWdodEdyZWF0ZXJUaGFuJyApO1xudmFyIHdpZHRoTGVzc1RoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvd2lkdGhMZXNzVGhhbicgKTtcbnZhciBoZWlnaHRMZXNzVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy9oZWlnaHRMZXNzVGhhbicgKTtcbnZhciBsZWZ0R3JlYXRlclRoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvbGVmdEdyZWF0ZXJUaGFuJyApO1xudmFyIHJpZ2h0R3JlYXRlclRoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvcmlnaHRHcmVhdGVyVGhhbicgKTtcbnZhciBsZWZ0TGVzc1RoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvbGVmdExlc3NUaGFuJyApO1xudmFyIHJpZ2h0TGVzc1RoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvcmlnaHRMZXNzVGhhbicgKTtcbnZhciBib3R0b21HcmVhdGVyVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy9ib3R0b21HcmVhdGVyVGhhbicgKTtcbnZhciB0b3BHcmVhdGVyVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy90b3BHcmVhdGVyVGhhbicgKTtcbnZhciBib3R0b21MZXNzVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy9ib3R0b21MZXNzVGhhbicgKTtcbnZhciB0b3BMZXNzVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy90b3BMZXNzVGhhbicgKTtcbnZhciBpc0luc2lkZSA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy9pc0luc2lkZScgKTtcbnZhciBpc091dHNpZGUgPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvaXNPdXRzaWRlJyApO1xuXG4vL09GRlNFVCBGVU5DVElPTlNcbnZhciBtaW51c0hlaWdodCA9IHJlcXVpcmUoICcuL29mZnNldHMvbWludXNIZWlnaHQnICk7XG52YXIgbWludXNQb3NpdGlvbiA9IHJlcXVpcmUoICcuL29mZnNldHMvbWludXNQb3NpdGlvbicgKTtcbnZhciBtaW51c1NpemUgPSByZXF1aXJlKCAnLi9vZmZzZXRzL21pbnVzU2l6ZScgKTtcbnZhciBtaW51c1dpZHRoID0gcmVxdWlyZSggJy4vb2Zmc2V0cy9taW51c1dpZHRoJyApO1xudmFyIG1pbnVzWCA9IHJlcXVpcmUoICcuL29mZnNldHMvbWludXNYJyApO1xudmFyIG1pbnVzWSA9IHJlcXVpcmUoICcuL29mZnNldHMvbWludXNZJyApO1xudmFyIHBsdXNIZWlnaHQgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3BsdXNIZWlnaHQnICk7XG52YXIgcGx1c1Bvc2l0aW9uID0gcmVxdWlyZSggJy4vb2Zmc2V0cy9wbHVzUG9zaXRpb24nICk7XG52YXIgcGx1c1NpemUgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3BsdXNTaXplJyApO1xudmFyIHBsdXNXaWR0aCA9IHJlcXVpcmUoICcuL29mZnNldHMvcGx1c1dpZHRoJyApO1xudmFyIHBsdXNYID0gcmVxdWlyZSggJy4vb2Zmc2V0cy9wbHVzWCcgKTtcbnZhciBwbHVzWSA9IHJlcXVpcmUoICcuL29mZnNldHMvcGx1c1knICk7XG52YXIgdk1pbnVzSGVpZ2h0ID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92TWludXNIZWlnaHQnICk7XG52YXIgdk1pbnVzUG9zaXRpb24gPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZNaW51c1Bvc2l0aW9uJyApO1xudmFyIHZNaW51c1NpemUgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZNaW51c1NpemUnICk7XG52YXIgdk1pbnVzV2lkdGggPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZNaW51c1dpZHRoJyApO1xudmFyIHZNaW51c1ggPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZNaW51c1gnICk7XG52YXIgdk1pbnVzWSA9IHJlcXVpcmUoICcuL29mZnNldHMvdk1pbnVzWScgKTtcbnZhciB2UGx1c0hlaWdodCA9IHJlcXVpcmUoICcuL29mZnNldHMvdlBsdXNIZWlnaHQnICk7XG52YXIgdlBsdXNQb3NpdGlvbiA9IHJlcXVpcmUoICcuL29mZnNldHMvdlBsdXNQb3NpdGlvbicgKTtcbnZhciB2UGx1c1NpemUgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZQbHVzU2l6ZScgKTtcbnZhciB2UGx1c1dpZHRoID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92UGx1c1dpZHRoJyApO1xudmFyIHZQbHVzWCA9IHJlcXVpcmUoICcuL29mZnNldHMvdlBsdXNYJyApO1xudmFyIHZQbHVzWSA9IHJlcXVpcmUoICcuL29mZnNldHMvdlBsdXNZJyApO1xuXG5cblxuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS1QUk9QUyBUTyBFRkZFQ1QtLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xudmFyIFNJWkUgPSAnU0laRSc7XG52YXIgU0laRV9XSURUSCA9ICdTSVpFX1dJRFRIJztcbnZhciBTSVpFX0hFSUdIVCA9ICdTSVpFX0hFSUdIVCc7XG52YXIgUE9TSVRJT04gPSAnUE9TSVRJT04nO1xudmFyIFBPU0lUSU9OX1ggPSAnUE9TSVRJT05fWCc7XG52YXIgUE9TSVRJT05fWSA9ICdQT1NJVElPTl9ZJztcblxudmFyIEJPVU5EX1NJWkUgPSAnQk9VTkRfU0laRSc7XG52YXIgQk9VTkRfU0laRV9XSURUSCA9ICdCT1VORF9TSVpFX1dJRFRIJztcbnZhciBCT1VORF9TSVpFX0hFSUdIVCA9ICdCT1VORF9TSVpFX0hFSUdIVCc7XG52YXIgQk9VTkRfUE9TSVRJT04gPSAnQk9VTkRfUE9TSVRJT04nO1xudmFyIEJPVU5EX1BPU0lUSU9OX1ggPSAnQk9VTkRfUE9TSVRJT05fWCc7XG52YXIgQk9VTkRfUE9TSVRJT05fWSA9ICdCT1VORF9QT1NJVElPTl9ZJztcblxuXG5cblxuXG4vKipcbkxheW91dE5vZGUgaXMgd2hlcmUgYWxsIHRoZSBtYWdpYyBoYXBwZW5zLiBMYXlvdXROb2RlJ3MgYXJlIGNyZWF0ZWQgZnJvbSBMYXlEb3duLiBZb3Ugd2lsbCBuZXZlciBpbnN0YW50aWF0ZSBMYXlvdXROb2RlcyBcbmRpcmVjdGx5IGhvd2V2ZXIgeW91IHdpbGwgdXNlIHRoZSBMYXlEb3duIG5vZGUgdG8gYWx3YXlzIGluc3RhbnRpYXRlIHRoZW0uXG5cbkxheW91dE5vZGUncyBhYnN0cmFjdCBwb3NpdGlvbmluZyBlbGVtZW50cyBvbiBzY3JlZW4gdXNpbmcgcnVsZXMuXG5cbkJhc2ljYWxseSB3aGF0IHRoYXQgbWVhbnMgaXMgaWYgeW91J3JlIHVzaW5nIHRoZSBET00sIExheW91dE5vZGUncyB3aWxsIHNpdCBiZXR3ZWVuIHRoZSBET00gYW5kIHRoZSBsb2dpY1xudG8gcG9zaXRpb24gYW5kIHJlc2l6ZSB0aGluZ3Mgb24gc2NyZWVuLlxuXG5UbyBkbyB0aGlzIHlvdSBhZGQgXCJydWxlc1wiIHRvIHRoZSBMYXlvdXROb2RlJ3MgYnkgY2FsbGluZyB0aGVpciBydWxlIGZ1bmN0aW9ucy4gRm9yIGVhc2Ugb2YgdXNlIGFuZCB0byBrZWVwIGlubGluZSB3aXRoIHRoZVxubGlicmFyaWVzIGdvYWwgb2YgYmVpbmcgdmVyeSByZWFkYWJsZSwgaGFuZHkgdG8gdHJhbnNsYXRlIGRlc2lnbmVycyBuZWVkcywgYWxsIHJ1bGVzIGFyZSBjaGFpbmFibGUgYW5kIGZvcm0gXCJzZW50ZW5jZXNcIi5cblxuRm9yIGV4YW1wbGUgdGhlIGNvZGU6XG5cbm5vZGUubGVmdEFsaWduZWRXaXRoKCBzb21lVUkgKS5hbGlnbmVkQmVsb3coIHNvbWVVSSApLnBsdXMoIDMgKTtcblxuV291bGQgcmVhZCBhczpcblxuT3VyIG5vZGUgd2lsbCBiZSBsZWZ0IGFsaWduZWQgd2l0aCBTb21lIFVJIGFuZCBhbGlnbmVkIGJlbG93IFNvbWUgVUkgcGx1cyAzIHBpeGVscy5cblxuQGNsYXNzIExheW91dE5vZGVcbkBjb25zdHJ1Y3RvclxuQHBhcmFtIHtMYXlEb3dufSBsYXlvdXQgSXMgdGhlIHBhcmVudCBMYXlEb3duIG9iamVjdC4gVGhlIHBhcmVudCBMYXlEb3duIG9iamVjdCB3aWxsIG1hbmFnZSByZWxhdGlvbnNoaXBzIGJldHdlZW4gYWxsIExheW91dE5vZGUncyBhbmQgd2lsbFxuXHRcdFx0XHRcdFx0aGFuZGxlIGNpcmN1bGFyIGRlcGVuZGVuY2llcyBhbmQgYWxsIHRoYXQgZnVuIHN0dWZmLlxuXG5AcGFyYW0gaXRlbSB7T2JqZWN0fSBpdGVtIHdpbGwgYmUgd2hhdCB3aWxsIGJlIHBvc2l0aW9uZWQgb24gc2NyZWVuLiBGb3IgaW5zdGFuY2UgYW4gSFRNTCBET00gRWxlbWVudCBvciBhIFBJWEkgRGlzcGxheU9iamVjdC4gSXQnc1xuXHRcdFx0XHR3aGF0ZXZlciB5b3Ugd2FudCB0byBsYXlvdXQgb24gc2NyZWVuLlxuXG5AcGFyYW0gbGF5b3V0RnVuY3Rpb24ge2Z1bmN0aW9ufSBUaGUgbGF5b3V0RnVuY3Rpb24gZnVuY3Rpb24gaXMgYSBmdW5jdGlvbiB3aGljaCB3aWxsIHRyYW5zbGF0ZSB0aGUgeCwgeSwgd2lkdGgsIGFuZCBoZWlnaHQgcHJvcGVydGllcyBvZiBhXG5MYXlvdXROb2RlIGludG8gYWN0dWFsIHBoeXNpY2FsIHNjcmVlbiBwb3NpdGlvbi4gU28gZm9yIGluc3RhbmNlIGlmIHdlJ3JlIHdvcmtpbmcgd2l0aCB0aGUgRE9NIGl0IHdvdWxkIHNldFxuQ1NTIHByb3BlcnRpZXMgb24gdGhlIFwiaXRlbVwiIHBhc3NlZCBpbiB0byBlbnN1cmUgdGhhdCB0aGUgaXRlbSBpcyBvbiBzY3JlZW4gYXQgeCwgeSBhdCB0aGUgY29ycmVjdCBzaXplLlxuXG5AcGFyYW0gcmVhZEZ1bmN0aW9uIHtmdW5jdGlvbn0gSWYgeW91IGRlZmluZSBubyBzaXppbmcgcnVsZXMgdG8gc2V0IHdpZHRoIGFuZCBoZWlnaHQgb2YgYW4gXCJpdGVtXCIvTGF5b3V0Tm9kZSB0aGVuIHdlIHdpbGwgbmVlZCB0byByZWFkIHRoZVxud2lkdGggYW5kIGhlaWdodCBvZiB0aGUgb2JqZWN0IHRvIGJlIGFibGUgdG8gcG9zaXRpb24gZGVwZW5kZW50IExheW91dE5vZGUncy4gXG5cblNvIGZvciBpbnN0YW5jZSBpZiB3ZSBoYXZlIExheW91dE5vZGUgQnV0dG9uIGFuZCBMYXlvdXROb2RlIEltYWdlIGFuZCB3ZSB3YW50ZWQgSW1hZ2UgdG8gYmUgYmVsb3cgQnV0dG9uIGFuZFxuQnV0dG9uIGhhcyBubyBsYXlvdXQgcnVsZXMgZm9yIHNldHRpbmcgaXQncyBoZWlnaHQgd2Ugd2lsbCBuZWVkIHRvIFwicmVhZFwiIGluIEJ1dHRvbnMgaGVpZ2h0IHRvIGJlIGFibGUgdG8gY29ycmVjdGx5XG5wb3NpdGlvbiBJbWFnZS4gU28gaWYgQnV0dG9uIGlzIGEgRElWIGVsZW1lbnQgd2Ugd2lsbCByZWFkIGluIGl0J3MgaGVpZ2h0IHRvIGJlIGFibGUgdG8gcG9zdGlvbiBJbWFnZSBiZWxvdyBpdC5cblxuKiovXG52YXIgTGF5b3V0Tm9kZSA9IGZ1bmN0aW9uKCBsYXlvdXQsIGl0ZW0sIGxheW91dEZ1bmN0aW9uLCByZWFkRnVuY3Rpb24gKSB7XG5cblx0dGhpcy5sYXlvdXQgPSBsYXlvdXQ7XG5cdHRoaXMuaXRlbSA9IGl0ZW0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBpdGVtO1xuXHR0aGlzLmxheW91dEZ1bmN0aW9uID0gbGF5b3V0RnVuY3Rpb24gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBsYXlvdXRGdW5jdGlvbjtcblx0dGhpcy5yZWFkRnVuY3Rpb24gPSByZWFkRnVuY3Rpb24gPT09IHVuZGVmaW5lZCA/IG51bGwgOiByZWFkRnVuY3Rpb247XG5cdHRoaXMuc2l6ZURlcGVuZGVuY2llcyA9IFtdO1xuXHR0aGlzLnBvc2l0aW9uRGVwZW5kZW5jaWVzID0gW107XG5cdHRoaXMucnVsZXNQb3MgPSBbXTtcblx0dGhpcy5ydWxlc1Bvc1Byb3AgPSBbXTtcblx0dGhpcy5ydWxlc1NpemUgPSBbXTtcblx0dGhpcy5ydWxlc1NpemVQcm9wID0gW107XG5cdHRoaXMucnVsZXNQb3NCb3VuZCA9IFtdO1xuXHR0aGlzLnJ1bGVzUG9zQm91bmRQcm9wID0gW107XG5cdHRoaXMucnVsZXNTaXplQm91bmQgPSBbXTtcblx0dGhpcy5ydWxlc1NpemVCb3VuZFByb3AgPSBbXTtcblx0dGhpcy5pdGVtc1RvQ29tcGFyZSA9IFtdO1xuXHR0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW0gPSBbXTtcblx0dGhpcy5jb25kaXRpb25hbHNBcmd1bWVudHNGb3JJdGVtID0gW107XG5cdHRoaXMubGF5b3V0Tm9kZUZvckNvbmRpdGlvbmFsID0gW107XG5cdHRoaXMuY29uZGl0aW9uYWxMaXN0ZW5lcnMgPSBbXTtcblxuXHR0aGlzLl9pbm5lciA9IG51bGw7XG5cdHRoaXMuX3ggPSAwO1xuXHR0aGlzLl95ID0gMDtcblx0dGhpcy5fd2lkdGggPSAwO1xuXHR0aGlzLl9oZWlnaHQgPSAwO1xuXHR0aGlzLl9vZmZYID0gMDtcblx0dGhpcy5fb2ZmWSA9IDA7XG5cdHRoaXMuX29mZldpZHRoID0gMDtcblx0dGhpcy5fb2ZmSGVpZ2h0ID0gMDtcblx0dGhpcy5faXNEb2luZ1doZW4gPSBmYWxzZTtcblx0dGhpcy5faGFzQ29uZGl0aW9uYWwgPSBmYWxzZTtcblx0dGhpcy5faXNEb2luZ0RlZmF1bHQgPSBmYWxzZTtcblx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IG51bGw7XG5cdHRoaXMuaGFzQmVlbkxheWVkT3V0ID0gZmFsc2U7XG5cblx0dGhpcy5sYXlvdXROb2RlRm9yRGVmYXVsdCA9IG51bGw7XG5cdHRoaXMuY29uZGl0aW9uYWxQYXJlbnQgPSBudWxsOyAvL3RoaXMgaXMgdGhlIHBhcmVudCBMYXlvdXROb2RlIHRoYXQgdGhpcyBjb25kaXRpb25hbCBMYXlvdXROb2RlIHdhcyBjcmVhdGVkIGZyb21cblx0dGhpcy5kZWZhdWx0Q29uZGl0aW9uYWxMaXN0ZW5lciA9IG51bGw7XG5cdHRoaXMubGFzdENvbmRpdGlvbmFsTGlzdG5lcklkeCA9IC0xO1xuXHR0aGlzLmxhc3RDb25kaXRpb25hbExpc3RlbmVySXNEZWZhdWx0ID0gZmFsc2U7XG5cblx0dGhpcy5fZG9pbmdTZWxmQ29uZGl0aW9uYWwgPSBmYWxzZTtcblx0dGhpcy5zZWxmSXRlbXNUb0NvbXBhcmUgPSBbXTtcblx0dGhpcy5zZWxmQ29uZGl0aW9uYWxzRm9ySXRlbSA9IFtdO1xuXHR0aGlzLnNlbGZDb25kaXRpb25hbEFyZ3VtZW50c0Zvckl0ZW0gPSBbXTtcblx0dGhpcy5zZWxmQ29uZGl0aW9uYWxMaXN0ZW5lcnMgPSBbXTtcblx0dGhpcy5sYXN0U2VsZkNvbmRpdGlvbmFsTGlzdGVuZXJJZHggPSAtMTtcblxuXHR0aGlzLmRvTm90UmVhZFdpZHRoID0gZmFsc2U7XG5cdHRoaXMuZG9Ob3RSZWFkSGVpZ2h0ID0gZmFsc2U7XG59O1xuXG4vKipcblRoaXMgY29uc3RhbnQgZGVzY3JpYmVzIG9yIGlzIGEga2V5IGZvciBzaXplIGxheW91dCBydWxlcyB3aGVyZSBib3RoIHdpZHRoIGFuZCBoZWlnaHQgd2lsbCBiZSBlZmZlY3RlZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBTSVpFX0xBWU9VVFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5TSVpFX0xBWU9VVCA9ICdTSVpFX0xBWU9VVCc7XG5cbi8qKlxuVGhpcyBjb25zdGFudCBkZXNjcmliZXMgb3IgaXMgYSBrZXkgZm9yIHNpemUgYm91bmQgcnVsZXMgd2hlcmUgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgYm91bmQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgU0laRV9CT1VORFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5TSVpFX0JPVU5EID0gJ1NJWkVfQk9VTkQnO1xuXG4vKipcblRoaXMgY29uc3RhbnQgZGVzY3JpYmVzIG9yIGlzIGEga2V5IGZvciB3aWR0aCBsYXlvdXQgcnVsZXMgd2hlcmUgd2lkdGggd2lsbCBiZSBlZmZlY3RlZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBTSVpFX1dJRFRIX0xBWU9VVFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5TSVpFX1dJRFRIX0xBWU9VVCA9ICdTSVpFX1dJRFRIX0xBWU9VVCc7XG5cbi8qKlxuVGhpcyBjb25zdGFudCBkZXNjcmliZXMgb3IgaXMgYSBrZXkgZm9yIHdpZHRoIGJvdW5kIHJ1bGVzIHdoZXJlIHdpZHRoIHdpbGwgYmUgYm91bmQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgU0laRV9XSURUSF9CT1VORFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5TSVpFX1dJRFRIX0JPVU5EID0gJ1NJWkVfV0lEVEhfQk9VTkQnO1xuXG4vKipcblRoaXMgY29uc3RhbnQgZGVzY3JpYmVzIG9yIGlzIGEga2V5IGZvciBoZWlnaHQgbGF5b3V0IHJ1bGVzIHdoZXJlIGhlaWdodCB3aWxsIGJlIGVmZmVjdGVkLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFNJWkVfSEVJR0hUX0xBWU9VVFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5TSVpFX0hFSUdIVF9MQVlPVVQgPSAnU0laRV9IRUlHSFRfTEFZT1VUJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3IgaGVpZ2h0IGJvdW5kIHJ1bGVzIHdoZXJlIGhlaWdodCB3aWxsIGJlIGJvdW5kLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFNJWkVfSEVJR0hUX0JPVU5EXG5AdHlwZSBTdHJpbmdcbkBzdGF0aWNcbkBmaW5hbFxuKiovXG5MYXlvdXROb2RlLlNJWkVfSEVJR0hUX0JPVU5EID0gJ1NJWkVfSEVJR0hUX0JPVU5EJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3IgcG9zaXRpb24gbGF5b3V0IHJ1bGVzIHdoZXJlIHggYW5kIHkgd2lsbCBiZSBlZmZlY3RlZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBQT1NJVElPTl9MQVlPVVRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuUE9TSVRJT05fTEFZT1VUID0gJ1BPU0lUSU9OX0xBWU9VVCc7XG5cbi8qKlxuVGhpcyBjb25zdGFudCBkZXNjcmliZXMgb3IgaXMgYSBrZXkgZm9yIHBvc2l0aW9uIGJvdW5kIHJ1bGVzIHdoZXJlIHggYW5kIHkgd2lsbCBiZSBib3RoIGJvdW5kLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFBPU0lUSU9OX0JPVU5EXG5AdHlwZSBTdHJpbmdcbkBzdGF0aWNcbkBmaW5hbFxuKiovXG5MYXlvdXROb2RlLlBPU0lUSU9OX0JPVU5EID0gJ1BPU0lUSU9OX0JPVU5EJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3IgeCBsYXlvdXQgcnVsZXMgd2hlcmUgeCB3aWxsIGJlIGVmZmVjdGVkLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFBPU0lUSU9OX1hfTEFZT1VUXG5AdHlwZSBTdHJpbmdcbkBzdGF0aWNcbkBmaW5hbFxuKiovXG5MYXlvdXROb2RlLlBPU0lUSU9OX1hfTEFZT1VUID0gJ1BPU0lUSU9OX1hfTEFZT1VUJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3IgeCBib3VuZCBydWxlcyB3aGVyZSB4IHdpbGwgYmUgYm91bmQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgUE9TSVRJT05fWF9CT1VORFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5QT1NJVElPTl9YX0JPVU5EID0gJ1BPU0lUSU9OX1hfQk9VTkQnO1xuXG4vKipcblRoaXMgY29uc3RhbnQgZGVzY3JpYmVzIG9yIGlzIGEga2V5IGZvciB5IGxheW91dCBydWxlcyB3aGVyZSB5IHdpbGwgYmUgZWZmZWN0ZWQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgUE9TSVRJT05fWV9MQVlPVVRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuUE9TSVRJT05fWV9MQVlPVVQgPSAnUE9TSVRJT05fWV9MQVlPVVQnO1xuXG4vKipcblRoaXMgY29uc3RhbnQgZGVzY3JpYmVzIG9yIGlzIGEga2V5IGZvciB5IGJvdW5kIHJ1bGVzIHdoZXJlIHkgd2lsbCBiZSBib3VuZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBQT1NJVElPTl9ZX0JPVU5EXG5AdHlwZSBTdHJpbmdcbkBzdGF0aWNcbkBmaW5hbFxuKiovXG5MYXlvdXROb2RlLlBPU0lUSU9OX1lfQk9VTkQgPSAnUE9TSVRJT05fWV9CT1VORCc7XG5cblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUuU0laRV9MQVlPVVQgPSBMYXlvdXROb2RlLlNJWkVfTEFZT1VUO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuU0laRV9CT1VORCA9IExheW91dE5vZGUuU0laRV9CT1VORDtcbkxheW91dE5vZGUucHJvdG90eXBlLlNJWkVfV0lEVEhfTEFZT1VUID0gTGF5b3V0Tm9kZS5TSVpFX1dJRFRIX0xBWU9VVDtcbkxheW91dE5vZGUucHJvdG90eXBlLlNJWkVfV0lEVEhfQk9VTkQgPSBMYXlvdXROb2RlLlNJWkVfV0lEVEhfQk9VTkQ7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5TSVpFX0hFSUdIVF9MQVlPVVQgPSBMYXlvdXROb2RlLlNJWkVfSEVJR0hUX0xBWU9VVDtcbkxheW91dE5vZGUucHJvdG90eXBlLlNJWkVfSEVJR0hUX0JPVU5EID0gTGF5b3V0Tm9kZS5TSVpFX0hFSUdIVF9CT1VORDtcblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUuUE9TSVRJT05fTEFZT1VUID0gTGF5b3V0Tm9kZS5QT1NJVElPTl9MQVlPVVQ7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5QT1NJVElPTl9CT1VORCA9IExheW91dE5vZGUuUE9TSVRJT05fQk9VTkQ7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5QT1NJVElPTl9YX0xBWU9VVCA9IExheW91dE5vZGUuUE9TSVRJT05fWF9MQVlPVVQ7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5QT1NJVElPTl9YX0JPVU5EID0gTGF5b3V0Tm9kZS5QT1NJVElPTl9YX0JPVU5EO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuUE9TSVRJT05fWV9MQVlPVVQgPSBMYXlvdXROb2RlLlBPU0lUSU9OX1lfTEFZT1VUO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuUE9TSVRJT05fWV9CT1VORCA9IExheW91dE5vZGUuUE9TSVRJT05fWV9CT1VORDtcblxuLyoqXG5UaGlzIGlzIHRoZSB4IHBvc2l0aW9uIG9mIHRoZSBMYXlvdXROb2RlIG9uIHNjcmVlbi4gSW5pdGlhbGx5IHRoZSB2YWx1ZSBvZiB4IHdpbGwgYmUgMCB1bnRpbCB0aGlzIG5vZGUgaGFzIGJlZW4gbGF5ZWQgb3V0LlxuXG5PbmNlIHRoaXMgbm9kZSBoYXMgYmVlbiBsYXllZCBvdXQgdGhlIHggcG9zaXRpb24gd2lsbCBiZSBzZXQgZnJvbSBhbGwgdGhlIHJ1bGVzIGFwcGxpZWQgdG8gdGhpcyBub2RlLlxuXG5Zb3UgY2FuIGFsc28gc2V0IHRoZSB4IHBvc2l0aW9uIG9mIGEgbm9kZSBieSBzaW1wbHkgc2V0dGluZyB0aGUgeCB2YWx1ZTpcblxuXHRub2RlLnggPSAxMDtcblxuV2hhdCB0aGlzIHdpbGwgZG8gaXMgYWRqdXN0IGFuIG9mZnNldCBpbiB0aGlzIExheW91dE5vZGUuIFNvIGluIHByYWN0aWNlIHdoYXQgdGhpcyBtZWFucyBpcyB0aGF0IHlvdSBjYW4gZnJlZWx5IG1vdmUgYXJvdW5kXG5ub2RlcyBmb3IgaW5zdGFuY2UgYnkgZHJhZ2dpbmcgYnV0IGFsbCBkZXBlbmRlbnQgbm9kZXMgd2lsbCBzdGlsbCBwb3NpdGlvbiB0aGVtc2VsdmVzIGFjY29yZGluZyB0byB0aGUgcnVsZXMgc2V0IG9uIHRoZW0uXG5cblNvIGZvciBpbnN0YW5jZSBpZiB5b3UgaGFkIGFuIGltYWdlIHRoYXQgaXMgcmlnaHQgYWxpZ25lZCB0byBhbm90aGVyIGltYWdlLiBJZiB5b3UgZ3JhYiB0aGUgaW1hZ2Ugb24gdGhlIGxlZnQgYW5kIG1vdmUgaXQgYXJvdW5kIFxudGhlIGltYWdlIG9uIHRoZSByaWdodCB3aWxsIGZvbGxvdy5cblxuQHByb3BlcnR5IHhcbkB0eXBlIE51bWJlclxuKiovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoIExheW91dE5vZGUucHJvdG90eXBlLCAneCcsIHtcblxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuX3g7XG5cdH0sXG5cblx0c2V0OiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0XHR0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkID0gUE9TSVRJT05fWDtcblxuXHRcdHRoaXMuX29mZlggKz0gdmFsdWUgLSB0aGlzLl94O1xuXHRcdFxuXHRcdGlmKCB0aGlzLmhhc0JlZW5MYXllZE91dCApIHtcblx0XHRcdFxuXHRcdFx0dGhpcy5sYXlvdXQubm9kZUNoYW5nZWQoIHRoaXMgKTtcblx0XHR9XG5cdH1cbn0pO1xuXG4vKipcblRoaXMgaXMgdGhlIHkgcG9zaXRpb24gb2YgdGhlIExheW91dE5vZGUgb24gc2NyZWVuLiBJbml0aWFsbHkgdGhlIHZhbHVlIG9mIHkgd2lsbCBiZSAwIHVudGlsIHRoaXMgbm9kZSBoYXMgYmVlbiBsYXllZCBvdXQuXG5cbk9uY2UgdGhpcyBub2RlIGhhcyBiZWVuIGxheWVkIG91dCB0aGUgeSBwb3NpdGlvbiB3aWxsIGJlIHNldCBmcm9tIGFsbCB0aGUgcnVsZXMgYXBwbGllZCB0byB0aGlzIG5vZGUuXG5cbllvdSBjYW4gYWxzbyBzZXQgdGhlIHkgcG9zaXRpb24gb2YgYSBub2RlIGJ5IHNpbXBseSBzZXR0aW5nIHRoZSB5IHZhbHVlOlxuXG5cdG5vZGUueSA9IDEwO1xuXG5XaGF0IHRoaXMgd2lsbCBkbyBpcyBhZGp1c3QgYW4gb2Zmc2V0IGluIHRoaXMgTGF5b3V0Tm9kZS4gU28gaW4gcHJhY3RpY2Ugd2hhdCB0aGlzIG1lYW5zIGlzIHRoYXQgeW91IGNhbiBmcmVlbHkgbW92ZSBhcm91bmRcbm5vZGVzIGZvciBpbnN0YW5jZSBieSBkcmFnZ2luZyBidXQgYWxsIGRlcGVuZGVudCBub2RlcyB3aWxsIHN0aWxsIHBvc2l0aW9uIHRoZW1zZWx2ZXMgYWNjb3JkaW5nIHRvIHRoZSBydWxlcyBzZXQgb24gdGhlbS5cblxuU28gZm9yIGluc3RhbmNlIGlmIHlvdSBoYWQgYW4gaW1hZ2UgdGhhdCBpcyByaWdodCBhbGlnbmVkIHRvIGFub3RoZXIgaW1hZ2UuIElmIHlvdSBncmFiIHRoZSBpbWFnZSBvbiB0aGUgbGVmdCBhbmQgbW92ZSBpdCBhcm91bmQgXG50aGUgaW1hZ2Ugb24gdGhlIHJpZ2h0IHdpbGwgZm9sbG93LlxuXG5AcHJvcGVydHkgeVxuQHR5cGUgTnVtYmVyXG4qKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSggTGF5b3V0Tm9kZS5wcm90b3R5cGUsICd5Jywge1xuXG5cdGdldDogZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5feTtcblx0fSxcblxuXHRzZXQ6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRcdHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgPSBQT1NJVElPTl9ZO1xuXHRcdFxuXHRcdHRoaXMuX29mZlkgKz0gdmFsdWUgLSB0aGlzLl95O1xuXG5cdFx0aWYoIHRoaXMuaGFzQmVlbkxheWVkT3V0ICkge1xuXG5cdFx0XHR0aGlzLmxheW91dC5ub2RlQ2hhbmdlZCggdGhpcyApO1xuXHRcdH1cblx0fVxufSk7XG5cbi8qKlxuVGhpcyBpcyB0aGUgd2lkdGggb2YgYSBMYXlvdXROb2RlIG9uIHNjcmVlbi4gSW5pdGlhbGx5IHRoZSB2YWx1ZSBvZiB3aWR0aCB3aWxsIGJlIDAgdW50aWwgdGhpcyBub2RlIGhhcyBiZWVuIGxheWVkIG91dC5cblxuT25jZSB0aGlzIG5vZGUgaGFzIGJlZW4gbGF5ZWQgb3V0IHRoZSB3aWR0aCB3aWxsIGJlIHNldCBmcm9tIGFsbCB0aGUgcnVsZXMgYXBwbGllZCB0byB0aGlzIG5vZGUgb3IgcmVhZCBpbiBieSB0aGUgcmVhZCBmdW5jdGlvbi5cblxuWW91IGNhbiBhbHNvIHNldCB0aGUgd2lkdGggb2YgYSBub2RlIGJ5IHNpbXBseSBzZXR0aW5nIHRoZSB3aWR0aCB2YWx1ZTpcblxuXHRub2RlLndpZHRoID0gMjAwO1xuXG5XaGF0IHRoaXMgd2lsbCBkbyBpcyBhZGp1c3QgYW4gb2Zmc2V0IGluIHRoaXMgTGF5b3V0Tm9kZS4gU28gaW4gcHJhY3RpY2Ugd2hhdCB0aGlzIG1lYW5zIGlzIHRoYXQgeW91IGNhbiBzZXQgdGhlIHNpemVzIG9mIG5vZGVzXG5hbmQgc3RpbGwgYWxsIGRlcGVuZGVudCBub2RlcyB3aWxsIGZvbGxvdyB0aGVpciBkZXBlbmRlbmN5IHJ1bGVzLlxuXG5TbyBsZXQncyBzYXkgeW91IGhhZCBhbiBpbWFnZSBjYWxsZWQgaW1hZ2UxIHdoaWNoIHlvdSB3YW50ZWQgdG8gc2NhbGUgdXAgaG93ZXZlciBhbm90aGVyIGltYWdlIGNhbGxlZCBpbWFnZTIgYWxpZ25lZCBsZWZ0IG9mIGltYWdlMS5cbllvdSBjYW4gc3RpbGwgc2V0IGltYWdlMS53aWR0aCB0byBiZSB3aGF0ZXZlciB2YWx1ZSB5b3Ugd2FudGVkIGFuZCBpbWFnZTIgd291bGQgYWxpZ24gbGVmdCBvZiBpbWFnZTEuXG5cbkBwcm9wZXJ0eSB3aWR0aFxuQHR5cGUgTnVtYmVyXG4qKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSggTGF5b3V0Tm9kZS5wcm90b3R5cGUsICd3aWR0aCcsIHtcblxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuX3dpZHRoO1xuXHR9LFxuXG5cdHNldDogZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdFx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IFNJWkVfV0lEVEg7XG5cblx0XHR0aGlzLl9vZmZXaWR0aCArPSB2YWx1ZSAtIHRoaXMuX3dpZHRoO1xuXG5cdFx0aWYoIHRoaXMuaGFzQmVlbkxheWVkT3V0ICkge1xuXHRcdFx0XG5cdFx0XHR0aGlzLmxheW91dC5ub2RlQ2hhbmdlZCggdGhpcyApO1xuXHRcdH1cblx0fVxufSk7XG5cbi8qKlxuVGhpcyBpcyB0aGUgaGVpZ2h0IG9mIGEgTGF5b3V0Tm9kZSBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2YgaGVpZ2h0IHdpbGwgYmUgMCB1bnRpbCB0aGlzIG5vZGUgaGFzIGJlZW4gbGF5ZWQgb3V0LlxuXG5PbmNlIHRoaXMgbm9kZSBoYXMgYmVlbiBsYXllZCBvdXQgdGhlIGhlaWdodCB3aWxsIGJlIHNldCBmcm9tIGFsbCB0aGUgcnVsZXMgYXBwbGllZCB0byB0aGlzIG5vZGUgb3IgcmVhZCBpbiBieSB0aGUgcmVhZCBmdW5jdGlvbi5cblxuWW91IGNhbiBhbHNvIHNldCB0aGUgaGVpZ2h0IG9mIGEgbm9kZSBieSBzaW1wbHkgc2V0dGluZyB0aGUgaGVpZ2h0IHZhbHVlOlxuXG5cdG5vZGUuaGVpZ2h0ID0gMzMzO1xuXG5XaGF0IHRoaXMgd2lsbCBkbyBpcyBhZGp1c3QgYW4gb2Zmc2V0IGluIHRoaXMgTGF5b3V0Tm9kZS4gU28gaW4gcHJhY3RpY2Ugd2hhdCB0aGlzIG1lYW5zIGlzIHRoYXQgeW91IGNhbiBzZXQgdGhlIHNpemVzIG9mIG5vZGVzXG5hbmQgc3RpbGwgYWxsIGRlcGVuZGVudCBub2RlcyB3aWxsIGZvbGxvdyB0aGVpciBkZXBlbmRlbmN5IHJ1bGVzLlxuXG5TbyBsZXQncyBzYXkgeW91IGhhZCBhbiBpbWFnZSBjYWxsZWQgaW1hZ2UxIHdoaWNoIHlvdSB3YW50ZWQgdG8gc2NhbGUgdXAgaG93ZXZlciBhbm90aGVyIGltYWdlIGNhbGxlZCBpbWFnZTIgYWxpZ25lZCBiZWxvdyBpbWFnZTEuXG5Zb3UgY2FuIHN0aWxsIHNldCBpbWFnZTEuaGVpZ2h0IHRvIGJlIHdoYXRldmVyIHZhbHVlIHlvdSB3YW50ZWQgYW5kIGltYWdlMiB3b3VsZCBhbGlnbiBiZWxvdyBpbWFnZTEuXG5cbkBwcm9wZXJ0eSB3aWR0aFxuQHR5cGUgTnVtYmVyXG4qKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSggTGF5b3V0Tm9kZS5wcm90b3R5cGUsICdoZWlnaHQnLCB7XG5cblx0Z2V0OiBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB0aGlzLl9oZWlnaHQ7XG5cdH0sXG5cblx0c2V0OiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0XHR0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkID0gU0laRV9IRUlHSFQ7XG5cblx0XHR0aGlzLl9vZmZIZWlnaHQgKz0gdmFsdWUgLSB0aGlzLl9oZWlnaHQ7XG5cblx0XHRpZiggdGhpcy5oYXNCZWVuTGF5ZWRPdXQgKSB7XG5cdFx0XHRcblx0XHRcdHRoaXMubGF5b3V0Lm5vZGVDaGFuZ2VkKCB0aGlzICk7XG5cdFx0fVxuXHR9XG59KTtcblxuXG4vKipcbklubmVyIGlzIGEgTGF5b3V0Tm9kZSB0aGF0IGlzIGNvbnRhaW5lZCBieSB0aGlzIExheW91dE5vZGUuIElubmVyIHdpbGwgbWF0Y2ggdGhlIHNpemUgb2YgdGhpcyBub2RlIGJ1dCB3aWxsIGhhdmUgbm8gcG9zaXRvbmFsIHZhbHVlcy5cblxuSXQgaXMgdXNlZnVsIHdoZW4gd29ya2luZyB3aXRoIHRoZSBET00gdG8gaGFuZGxlIG5lc3RlZCBjb250ZW50IGluc2lkZSBodG1sIGVsZW1lbnRzLiBGb3IgaW5zdGFuY2UgaWYgd2UgaGF2ZSBhIGRpdiB3aXRoIGFuIGltYWdlIGluc2lkZS4gWW91IGNhblxuY2FuIGFwcGx5IGEgTGF5b3V0Tm9kZSB0byB0aGUgZGl2IGFuZCB1c2UgdGhlIGlubmVyIGF0dHJpYnV0ZSB0byBjZW50ZXIgdGhlIGltYWdlIGluc2lkZS5cblxuXHR2YXIgb3VyRGl2ID0gbGF5b3V0LmNyZWF0ZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdvdXJEaXYnICkgKTtcblx0dmFyIG91ckltYWdlSW5zaWRlRGl2ID0gbGF5b3V0LmNyZWF0ZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdvdXJJbWFnZUluc2lkZURpdicgKSApO1xuXG5cdG91ckRpdi5tYXRjaGVzU2l6ZU9mKCBsYXlvdXQgKTtcblx0b3VySW1hZ2VJbnNpZGVEaXYubWF0Y2hlc1dpZHRoT2YoIG91ckRpdi5pbm5lciApLmhlaWdodElzUHJvcG9ydGlvbmFsKCA0MDAsIDMwMCApLmNlbnRlcmVkV2l0aCggb3VyRGl2LmlubmVyICk7XG5cbkBwcm9wZXJ0eSBpbm5lclxuQHR5cGUgTGF5b3V0Tm9kZVxuKiovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoIExheW91dE5vZGUucHJvdG90eXBlLCAnaW5uZXInLCB7XG5cblx0Z2V0OiBmdW5jdGlvbigpIHtcblxuXHRcdGlmKCB0aGlzLl9pbm5lciA9PT0gbnVsbCApIHtcblxuXHRcdFx0dGhpcy5faW5uZXIgPSB0aGlzLmxheW91dC5jcmVhdGUoKTtcblx0XHRcdHRoaXMuX2lubmVyLm1hdGNoZXNTaXplT2YoIHRoaXMgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5faW5uZXI7XG5cdH1cbn0pO1xuXG4vKipcbmRvTGF5b3V0IHdpbGwgcGVyZm9ybSB0aGUgbGF5b3V0IG9mIHRoaXMgTGF5b3V0Tm9kZS4gVGhpcyBmdW5jdGlvbiBzaG91bGQgbmV2ZXIgYmUgY2FsbGVkIGRpcmVjdGx5IGJ1dCBiZSBjYWxsZWQgYnkgdGhlIExheURvd24gbGF5b3V0LlxuVGhpcyB3YXkgZGVwZW5kZW5jaWVzIHdpbGwgYmUgaGFuZGxlZCBjb3JyZWN0bHkuXG5cblNvIGZvciBpbnN0YW5jZSBpZiB5b3UgaGF2ZSBvbmUgTGF5b3V0Tm9kZSB3aGljaCBzZXRzIGl0J3Mgc2l6ZSBhY2NvcmRpbmcgdG8gYW5vdGhlciBub2RlIGNhbGxpbmcgZG9MYXlvdXQgbWFudWFsbHkgY291bGQgcG90ZW50aWFsbHkgYmVcbmRlc3RydWN0aXZlLlxuXG5BbHRob3VnaCB0aGlzIGlzIHRoZSBlbnRyeSBwb2ludCB0byBwZXJmb3JtIGxheW91dHMgdGhlIGFjdHVhbCBncnVudCB3b3JrIGlzIHBlcmZvcm1lZCBpbiB0aGUgXCJkb0xheW91dFdvcmtcIiBmdW5jdGlvbi4gVGhpcyBmdW5jdGlvbiB3aWxsXG5ldmFsdWF0ZSBjb25kaXRpb25hbHMgKGlmIHRoZXJlIGFyZSBhbnkpIGFuZCBncmFiIHRoZSBhcHByb3ByaWF0ZSBydWxlIHNldHMgdG8gdXNlLiBBZnRlciB0aGUgcnVsZSBzZXRzIGFyZSBkZXRlcm1pbmVkIGJ5IHRoZSBjb25kaXRpb25hbHNcbmRvTGF5b3V0V29yayBpcyBjYWxsZWQuXG5cbkBwcm90ZWN0ZWRcbkBtZXRob2QgZG9MYXlvdXRcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuZG9MYXlvdXQgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLmhhc0JlZW5MYXllZE91dCA9IHRydWU7XG5cblx0dGhpcy5feCA9IHRoaXMuX3kgPSB0aGlzLl93aWR0aCA9IHRoaXMuX2hlaWdodCA9IDA7XG5cblx0Ly90aGlzIGlzIHRoZSBsaXN0ZW5lciBhZGRlZCB3aGVuIGFuIG9uIGZ1bmN0aW9uIHdhcyBjYWxsZWQgYWZ0ZXIgY3JlYXRpbmcgYSBjb25kaXRpb25hbFxuXHR2YXIgdHJ1ZUNvbmRpdGlvbmFscyA9IFtdO1xuXG5cdGlmKCB0aGlzLml0ZW1zVG9Db21wYXJlLmxlbmd0aCA+IDAgKSB7XG5cblx0XHR2YXIgY29uZGl0aW9uYWxMYXllZE91dCA9IGZhbHNlO1xuXG5cdFx0Zm9yKCB2YXIgaSA9IDAsIGxlbkkgPSB0aGlzLml0ZW1zVG9Db21wYXJlLmxlbmd0aDsgaSA8IGxlbkk7IGkrKyApIHtcblxuXHRcdFx0dmFyIGxheW91dE5vZGUgPSB0aGlzLmxheW91dE5vZGVGb3JDb25kaXRpb25hbFsgaSBdO1xuXHRcdFx0dmFyIGl0ZW1zVG9Db21wYXJlVG8gPSB0aGlzLml0ZW1zVG9Db21wYXJlWyBpIF07XG5cdFx0XHR2YXIgaXNDb25kaXRpb25hbFZhbGlkID0gdHJ1ZTtcblxuXHRcdFx0Zm9yKCB2YXIgaiA9IDAsIGxlbkogPSBpdGVtc1RvQ29tcGFyZVRvLmxlbmd0aDsgaXNDb25kaXRpb25hbFZhbGlkICYmIGogPCBsZW5KOyBqKysgKSB7XG5cblx0XHRcdFx0dmFyIGNvbmRpdGlvbmFscyA9IHRoaXMuY29uZGl0aW9uYWxzRm9ySXRlbVsgaSBdWyBqIF07XG5cdFx0XHRcdHZhciBhcmd1bWVudHNGb3JDb25kaXRpb25hbHMgPSB0aGlzLmNvbmRpdGlvbmFsc0FyZ3VtZW50c0Zvckl0ZW1bIGkgXVsgaiBdO1xuXHRcdFx0XHRcblx0XHRcdFx0Zm9yKCB2YXIgayA9IDAsIGxlbksgPSBjb25kaXRpb25hbHMubGVuZ3RoOyBpc0NvbmRpdGlvbmFsVmFsaWQgJiYgayA8IGxlbks7IGsrKyApIHtcblxuXHRcdFx0XHRcdGlzQ29uZGl0aW9uYWxWYWxpZCA9IGNvbmRpdGlvbmFsc1sgayBdLmFwcGx5KCBpdGVtc1RvQ29tcGFyZVRvWyBrIF0sIGFyZ3VtZW50c0ZvckNvbmRpdGlvbmFsc1sgayBdICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly9pZiB0aGUgY29uZGl0aW9uYWwgaXMgc3RpbGwgdmFsaWQgYWZ0ZXJcblx0XHRcdC8vYWxsIHRoZSB0ZXN0cyB0aGVuIHdlIHNob3VsZCBkbyBsYXlvdXQgd2l0aCB0aGlzIG90aGVyIG5vZGVcblx0XHRcdC8vaW5zdGVhZCBvZiBcInRoaXNcIiB3aGljaCBpcyBub3cgY29uc2lkZXJlZCB0aGUgZGVmYXVsdCB2YWx1ZVxuXHRcdFx0aWYoIGlzQ29uZGl0aW9uYWxWYWxpZCApIHtcblxuXHRcdFx0XHQvL2lmIHdlIHNpbXBseSBqdXN0IGRvIGEgY29uZGl0aW9uYWwgd2l0aCBhIGxpc3RlbmVyIHdlJ2xsIGhhdmUgbm8gbGF5b3V0Tm9kZVxuXHRcdFx0XHRpZiggbGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRcdGxheW91dE5vZGUuZG9MYXlvdXQoKTtcdFxuXHRcdFx0XHR9XG5cdFx0XHRcblx0XHRcdFx0Y29uZGl0aW9uYWxMYXllZE91dCA9IHRydWU7XG5cblx0XHRcdFx0aWYoIHRoaXMuY29uZGl0aW9uYWxMaXN0ZW5lcnNbIGkgXSApIHtcblxuXHRcdFx0XHRcdHRydWVDb25kaXRpb25hbHMucHVzaCggdGhpcy5jb25kaXRpb25hbExpc3RlbmVyc1sgaSBdICk7XHRcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vaWYgYWxsIG9mIHRoZSBhYm92ZSBldmFsdWF0ZWQgZmFsc2UgdGhlbiB3ZSdsbCBnZXQgaGVyZVxuXHRcdC8vaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGQgY2hlY2sgaWYgdGhlcmVzIGEgZGVmYXVsdFxuXHRcdGlmKCAhY29uZGl0aW9uYWxMYXllZE91dCAmJiB0aGlzLmxheW91dE5vZGVGb3JEZWZhdWx0ICkge1xuXG5cdFx0XHRpZiggdGhpcy5kZWZhdWx0Q29uZGl0aW9uYWxMaXN0ZW5lciApIHtcblxuXHRcdFx0XHR0cnVlQ29uZGl0aW9uYWxzLnB1c2goIHRoaXMuZGVmYXVsdENvbmRpdGlvbmFsTGlzdGVuZXIgKTtcdFxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiggdGhpcy5sYXlvdXROb2RlRm9yRGVmYXVsdCApIHtcblxuXHRcdFx0XHR0aGlzLmxheW91dE5vZGVGb3JEZWZhdWx0LmRvTGF5b3V0KCk7XHRcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvL0RvIHRoZSBhY3R1YWwgbGF5b3V0XG5cdHRoaXMuZG9MYXlvdXRXb3JrKCk7XG5cblxuXG5cdC8vTm93IGRvIHNlbGYgY29uZGl0aW9uYWxzXG5cdGZvciggdmFyIGkgPSAwLCBsZW5JID0gdGhpcy5zZWxmSXRlbXNUb0NvbXBhcmUubGVuZ3RoOyBpIDwgbGVuSTsgaSsrICkge1xuXG5cdFx0dmFyIGl0ZW1zVG9Db21wYXJlVG8gPSB0aGlzLnNlbGZJdGVtc1RvQ29tcGFyZVsgaSBdO1xuXHRcdHZhciBpc0NvbmRpdGlvbmFsVmFsaWQgPSB0cnVlO1xuXG5cdFx0Zm9yKCB2YXIgaiA9IDAsIGxlbkogPSBpdGVtc1RvQ29tcGFyZVRvLmxlbmd0aDsgaXNDb25kaXRpb25hbFZhbGlkICYmIGogPCBsZW5KOyBqKysgKSB7XG5cblx0XHRcdHZhciBjb25kaXRpb25hbHMgPSB0aGlzLnNlbGZDb25kaXRpb25hbHNGb3JJdGVtWyBpIF1bIGogXTtcblx0XHRcdHZhciBhcmd1bWVudHNGb3JDb25kaXRpb25hbHMgPSB0aGlzLnNlbGZDb25kaXRpb25hbEFyZ3VtZW50c0Zvckl0ZW1bIGkgXVsgaiBdO1xuXHRcdFx0XG5cdFx0XHRmb3IoIHZhciBrID0gMCwgbGVuSyA9IGNvbmRpdGlvbmFscy5sZW5ndGg7IGlzQ29uZGl0aW9uYWxWYWxpZCAmJiBrIDwgbGVuSzsgaysrICkge1xuXG5cdFx0XHRcdGlzQ29uZGl0aW9uYWxWYWxpZCA9IGNvbmRpdGlvbmFsc1sgayBdLmFwcGx5KCBpdGVtc1RvQ29tcGFyZVRvWyBrIF0sIGFyZ3VtZW50c0ZvckNvbmRpdGlvbmFsc1sgayBdICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCBpc0NvbmRpdGlvbmFsVmFsaWQgJiYgdGhpcy5zZWxmQ29uZGl0aW9uYWxMaXN0ZW5lcnNbIGkgXSApIHtcblxuXHRcdFx0XHR0cnVlQ29uZGl0aW9uYWxzLnB1c2goIHRoaXMuc2VsZkNvbmRpdGlvbmFsTGlzdGVuZXJzWyBpIF0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXG5cdC8vSWYgdGhpcyBsYXlveXQgbm9kZSBoYXMgc29tZXRoaW5nIHRvIHBvc2l0aW9uIGFuZCBzaXplIGFuZCBoYXMgYSBsYXlvdXQgZnVuY3Rpb24gcnVuIGl0XG5cdGlmKCB0aGlzLml0ZW0gJiYgdGhpcy5sYXlvdXRGdW5jdGlvbiApIHtcblx0XHRcblx0XHR0aGlzLmxheW91dEZ1bmN0aW9uKCB0aGlzLml0ZW0sIHRoaXMsIHRoaXMuZG9Ob3RSZWFkV2lkdGgsIHRoaXMuZG9Ob3RSZWFkSGVpZ2h0ICk7XG5cdH1cblxuXHQvL2lmIGEgY29uZGl0aW9uYWwgaGFzIGJlZW4gdmFsaWRhdGVkIGl0IHNob3VsZCBiZSBjYWxsZWQgbm93XG5cdGZvciggdmFyIGkgPSAwLCBsZW4gPSB0cnVlQ29uZGl0aW9uYWxzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXG5cdFx0dHJ1ZUNvbmRpdGlvbmFsc1sgaSBdKCk7XG5cdH1cbn07XG5cblxuLyoqXG5kb0xheW91dFdvcmsgd2lsbCBwZXJmb3JtIHRoZSBsYXlvdXQgd29yayBvZiB0aGlzIExheW91dE5vZGUuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIG5ldmVyIGJlIGNhbGxlZCBkaXJlY3RseSBidXQgYmUgY2FsbGVkIGJ5IGRvTGF5b3V0IGFmdGVyXG5hbGwgY29uZGl0aW9uYWxzIChpZiBhbnkpIGFyZSBldmFsdWF0ZWQuXG5cblRoaXMgZnVuY3Rpb24gZW5zdXJlcyBldmVyeXRoaW5nIGlzIGV2YWx1YXRlZCBpbiBjb3JyZWN0IG9yZGVyOlxuXG4xLiBTaXplIERlcGVuZGVuY2llc1xuMi4gUG9zaXRpb24gRGVwZW5kZW5jaWVzXG4zLiBTaXplIFJ1bGVzXG40LiBTaXplIEJvdW5kc1xuNS4gU2l6ZSBPZmZzZXRzXG42LiBTaXplIEJvdW5kcyAoYWdhaW4gYWZ0ZXIgc2l6ZSBvZmZzZXQpXG43LiBSZWFkaW5nIHdpZHRoLCBoZWlnaHQgaWYgdGhleSB3ZXJlIG5vdCBzZXRcbjguIFBvc2l0aW9uIHJ1bGVzXG45LiBQb3NpdGlvbmFsIEJvdW5kc1xuMTAuIFBvc2l0aW9uYWwgT2Zmc2V0c1xuMTEuIFBvc2l0aW9uYWwgQm91bmRzIChhZ2FpbiBhZnRlciBwb3NpdGlvbiBvZmZzZXQpXG5cblRoZSBiYXNpYyBydWxlIG9mIHRodW1iIGlzIHdlIGNhbid0IHBvc2l0aW9uIGFueXRoaW5nIHVudGlsIHdlIGtub3cgaXQncyBzaXplLiBCb3VuZHMgYXJlIHVzZWQgdG8gZW5zdXJlIHRoaW5ncyBkb24ndCBnbyBvZmYgc2NyZWVuLCBnZXQgdG9vIGJpZyBvciBzbWFsbC5cblxuQHByb3RlY3RlZFxuQG1ldGhvZCBkb0xheW91dFdvcmtcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuZG9MYXlvdXRXb3JrID0gZnVuY3Rpb24oKSB7XG5cblx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHRoaXMuc2l6ZURlcGVuZGVuY2llcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblxuXHRcdGlmKCAhdGhpcy5zaXplRGVwZW5kZW5jaWVzWyBpIF0uaGFzQmVlbkxheWVkT3V0ICkge1xuXG5cdFx0XHR0aGlzLnNpemVEZXBlbmRlbmNpZXNbIGkgXS5kb0xheW91dCgpO1xuXHRcdH1cblx0fVx0XG5cblx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHRoaXMucG9zaXRpb25EZXBlbmRlbmNpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHRpZiggIXRoaXMucG9zaXRpb25EZXBlbmRlbmNpZXNbIGkgXS5oYXNCZWVuTGF5ZWRPdXQgKSB7XG5cblx0XHRcdHRoaXMucG9zaXRpb25EZXBlbmRlbmNpZXNbIGkgXS5kb0xheW91dCgpO1xuXHRcdH1cblx0fVx0XG5cblxuXHQvL0hBTkRMRSBTSVpFXG5cdGZvciggdmFyIGkgPSAwLCBsZW4gPSB0aGlzLnJ1bGVzU2l6ZS5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblxuXHRcdHRoaXMucnVsZXNTaXplWyBpIF0uYXBwbHkoIHRoaXMsIHRoaXMucnVsZXNTaXplUHJvcFsgaSBdICk7XG5cblx0XHQvL0hBTkRMRSBCT1VORElORyBTSVpFXG5cdFx0Zm9yKCB2YXIgaiA9IDAsIGxlbkogPSB0aGlzLnJ1bGVzU2l6ZUJvdW5kLmxlbmd0aDsgaiA8IGxlbko7IGorKyApIHtcblxuXHRcdFx0dGhpcy5ydWxlc1NpemVCb3VuZFsgaiBdLmFwcGx5KCB0aGlzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcFsgaiBdICk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5fd2lkdGggKz0gdGhpcy5fb2ZmV2lkdGg7XG5cdHRoaXMuX2hlaWdodCArPSB0aGlzLl9vZmZIZWlnaHQ7XG5cblx0Zm9yKCB2YXIgaiA9IDAsIGxlbkogPSB0aGlzLnJ1bGVzU2l6ZUJvdW5kLmxlbmd0aDsgaiA8IGxlbko7IGorKyApIHtcblxuXHRcdHRoaXMucnVsZXNTaXplQm91bmRbIGogXS5hcHBseSggdGhpcywgdGhpcy5ydWxlc1NpemVCb3VuZFByb3BbIGogXSApO1xuXHR9XG5cblx0XG5cdC8vY2hlY2sgaWYgd2Ugc2hvdWxkIHJlYWQgaW4gYSBzaXplIGZvciBhbiBpdGVtXG5cdGlmKCB0aGlzLml0ZW0gKSB7XG5cblx0XHRpZiggdGhpcy5yZWFkRnVuY3Rpb24gKSB7XG5cblx0XHRcdGlmKCAhdGhpcy5kb05vdFJlYWRXaWR0aCAmJiAhdGhpcy5kb05vdFJlYWRXaWR0aCApIHtcblxuXHRcdFx0XHR0aGlzLl93aWR0aCA9IHRoaXMucmVhZEZ1bmN0aW9uKCB0aGlzLml0ZW0sICd3aWR0aCcgKTtcblx0XHRcdFx0dGhpcy5faGVpZ2h0ID0gdGhpcy5yZWFkRnVuY3Rpb24oIHRoaXMuaXRlbSwgJ2hlaWdodCcgKTtcblx0XHRcdH0gZWxzZSBpZiggIXRoaXMuZG9Ob3RSZWFkV2lkdGggKSB7XG5cblx0XHRcdFx0dGhpcy5fd2lkdGggPSB0aGlzLnJlYWRGdW5jdGlvbiggdGhpcy5pdGVtLCAnd2lkdGgnICk7XG5cdFx0XHR9IGVsc2UgaWYoICF0aGlzLmRvTm90UmVhZEhlaWdodCApIHtcblxuXHRcdFx0XHR0aGlzLl9oZWlnaHQgPSB0aGlzLnJlYWRGdW5jdGlvbiggdGhpcy5pdGVtLCAnaGVpZ2h0JyApO1xuXHRcdFx0fVxuXHRcdH1cdFxuXHR9XG5cblxuXG5cblx0Ly9IQU5ETEUgUE9TSVRJT05cblx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHRoaXMucnVsZXNQb3MubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHR0aGlzLnJ1bGVzUG9zWyBpIF0uYXBwbHkoIHRoaXMsIHRoaXMucnVsZXNQb3NQcm9wWyBpIF0gKTtcblxuXHRcdC8vSEFORExFIEJPVU5ESU5HIFBPU0lUSU9OXG5cdFx0Zm9yKCB2YXIgaiA9IDAsIGxlbkogPSB0aGlzLnJ1bGVzUG9zQm91bmQubGVuZ3RoOyBqIDwgbGVuSjsgaisrICkge1xuXG5cdFx0XHR0aGlzLnJ1bGVzUG9zQm91bmRbIGogXS5hcHBseSggdGhpcywgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcFsgaiBdICk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5feCArPSB0aGlzLl9vZmZYO1xuXHR0aGlzLl95ICs9IHRoaXMuX29mZlk7XG5cblx0Zm9yKCB2YXIgaiA9IDAsIGxlbkogPSB0aGlzLnJ1bGVzUG9zQm91bmQubGVuZ3RoOyBqIDwgbGVuSjsgaisrICkge1xuXG5cdFx0dGhpcy5ydWxlc1Bvc0JvdW5kWyBqIF0uYXBwbHkoIHRoaXMsIHRoaXMucnVsZXNQb3NCb3VuZFByb3BbIGogXSApO1xuXHR9XG5cblx0Ly9iZWNhdXNlIG90aGVyIGl0ZW1zIHdpbGwgYWN0dWFsbHkgcmVseSBvbiB0aGUgdmFsdWVzIG9mIHRoZVxuXHQvL3BhcmVudCBub2RlIG9mIGEgY29uZGl0aW9uYWwgbm9kZSB0aGVuIHdlIG5lZWQgdG8gc2V0IHRoZSBfeCwgX3ksIF93aWR0aCwgX2hlaWdodFxuXHQvL2ZvciB0aGUgcGFyZW50IGFsc29cblx0aWYoIHRoaXMuY29uZGl0aW9uYWxQYXJlbnQgIT0gbnVsbCApIHtcblxuXHRcdHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuX3ggKz0gdGhpcy5feDtcblx0XHR0aGlzLmNvbmRpdGlvbmFsUGFyZW50Ll95ICs9IHRoaXMuX3k7XG5cdFx0dGhpcy5jb25kaXRpb25hbFBhcmVudC5fd2lkdGggKz0gdGhpcy5fd2lkdGg7XG5cdFx0dGhpcy5jb25kaXRpb25hbFBhcmVudC5faGVpZ2h0ICs9IHRoaXMuX2hlaWdodDtcblx0fVxufTtcblxuLyoqXG5Vc2UgdGhpcyBmdW5jdGlvbiB0byBzZXQgdGhlIGxheW91dCBmdW5jdGlvbiBmb3IgdGhpcyBub2RlLiBMYXlvdXQgZnVuY3Rpb25zIHBlcmZvcm0gdGhlIGFjdHVhbCB3b3JrIHRvIG1vdmUgdGhpbmdzIG9uIHNjcmVlbi4gTGF5b3V0Tm9kZSdzIGFuZCBydWxlc1xub24gTGF5b3V0Tm9kZSdzIHBlcmZvcm0gdGhlIHZpcnR1YWwgcG9zaXRpb25pbmcgb2YgYW4gb2JqZWN0IHdoZXJlIHRoZSBsYXlvdXRGdW5jdGlvbiBwZXJmb3JtcyB0aGUgYWN0dWFsIHBoeXNpY2FsLlxuXG5Gb3IgaW5zdGFuY2UgaWYgeW91J3JlIHdvcmtpbmcgd2l0aCB0aGUgRE9NIHRoZSBsYXlvdXRGdW5jdGlvbiBjb3VsZCBzZXQgQ1NTIHdpZHRoIGFuZCBoZWlnaHQgcHJvcGVydGllcyBvciBzY2FsZS4gT3IgaWYgeW91IHJlYWxseSB3YW50ZWQgdG8gZ2V0IGZhbmN5XG5pdCBjb3VsZCBwZXJmb3JtIGFuIGFuaW1hdGlvbiB0byBwb3NpdGlvbiB0aGUgSFRNTCBlbGVtZW50LlxuXG5AbWV0aG9kIHNldExheW91dEZ1bmN0aW9uXG5AcGFyYW0gbGF5b3V0RnVuY3Rpb24ge2Z1bmN0aW9ufSBUaGlzIGlzIHRoZSBsYXlvdXQgZnVuY3Rpb24gdGhhdCB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZS5cblxuTGF5b3V0IGZ1bmN0aW9uJ3Mgc2hvdWxkIHRha2UgZm91ciBwcm9wZXJ0aWVzOiBpdGVtLCBub2RlLCBzZXRXaWR0aCwgc2V0SGVpZ2h0LiBcblxuKyBXaGVyZSBpdGVtIGlzIHRoZSBpdGVtIHRvIGxheW91dCAoRE9NIGVsZW1lbnQgb3IgUElYSSBEaXNwbGF5T2JqZWN0KVxuKyBub2RlIHdpbGwgYmUgYSBMYXlvdXROb2RlIGZyb20gd2hpY2ggeW91IGNhbiByZWFkIHgsIHksIHdpZHRoLCBoZWlnaHRcbisgc2V0V2lkdGggd2lsbCBiZSBhIGJvb2xlYW4gZm9yIHdoZXRoZXIgdGhlIGxheW91dCBmdW5jdGlvbiBzaG91bGQgc2V0IHRoZSB3aWR0aCBvZiB0aGUgaXRlbVxuKyBzZXRIZWlnaHQgd2lsbCBiZSBhIGJvb2xlYW4gZm9yIHdoZXRoZXIgdGhlIGxheW91dCBmdW5jdGlvbiBzaG91bGQgc2V0IHRoZSBoZWlnaHQgb2YgdGhlIGl0ZW1cbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuc2V0TGF5b3V0RnVuY3Rpb24gPSBmdW5jdGlvbiggbGF5b3V0RnVuY3Rpb24gKSB7XG5cblx0dGhpcy5sYXlvdXRGdW5jdGlvbiA9IGxheW91dEZ1bmN0aW9uO1xuXG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG5Zb3UgY2FuIHVzZSBhZGRDdXN0b21SdWxlIHRvIGRlZmluZSBuZXcgcnVsZXMgd2hpY2ggbWF5IG5vdCBiZSBkZWZpbmVkIGJ5IExheURvd24uIFRoaXMgY291bGQgYmUgaGFuZHkgZm9yIGluc3RhbmNlIGlmIHlvdSB3YW50ZWQgdG8gc2V0IHRoZVxuY29sb3VyIG9mIGEgRElWIGVsZW1lbnQgYmFzZWQgb24gaG93IGxhcmdlIGl0IGlzLiBSZWFsbHkgdGhlIHNreSBpcyB0aGUgbGltaXQgaGVyZS4gQWx0aG91Z2ggdG8gZW5zdXJlIHlvdXIgbmV3IHJ1bGUgaXMgcGVyZm9ybWVkIGNvcnJlY3RseSBhbmRcbmRvZXMgbm90IGludGVyZmVyZSB3aXRoIG90aGVyIHJ1bGVzIHlvdSBtdXN0IHBhc3MgaW4gYSBydWxlIHR5cGUuXG5cbkBtZXRob2QgYWRkQ3VzdG9tUnVsZVxuQHBhcmFtIHtmdW5jdGlvbn0gcnVsZUZ1bmN0aW9uIFRoaXMgYSBuZXcgcnVsZSB5b3UnZCBsaWtlIHRvIGFkZC4gVG8gc2VlIGhvdyBydWxlcyBhcmUgY29tcG9zZWQgd2Ugc3VnZ2VzdCBsb29raW5nIGF0IHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zXG5pbiB0aGUgc3JjIGZvbGRlci5cblxuIyMjIyMjIFNldHRpbmcgc2l6ZSAod2lkdGgsIGhlaWdodCk6XG4tIHNyYy9sYXlvdXRTaXplL3NpemVJcyAoaWYgeW91ciBydWxlIHdpbGwgYmUgc2V0dGluZyBib3RoIHdpZHRoIGFuZCBoZWlnaHQgYXQgdGhlIHNhbWUgdGltZSBmcm9tIHZhbHVlcylcbi0gc3JjL2xheW91dFNpemUvd2lkdGhJcyAoaWYgeW91ciBydWxlIHdpbGwgYmUgc2V0dGluZyBvbmx5IHRoZSB3aWR0aCBmcm9tIGEgdmFsdWUpXG4tIHNyYy9sYXlvdXRTaXplL2hlaWdodElzIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIG9ubHkgdGhlIGhlaWdodCBmcm9tIGEgdmFsdWUpXG4tIHNyYy9sYXlvdXRTaXplL21hdGNoZXNTaXplT2YgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IGZyb20gYW5vdGhlciBub2RlKVxuLSBzcmMvbGF5b3V0U2l6ZS9tYXRjaGVzV2lkdGhPZiAoaWYgeW91ciBydWxlIHdpbGwgYmUgc2V0dGluZyBib3RoIHdpZHRoIGZyb20gYW5vdGhlciBub2RlKVxuLSBzcmMvbGF5b3V0U2l6ZS9tYXRjaGVzSGVpZ2h0T2YgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgYm90aCBoZWlnaHQgZnJvbSBhbm90aGVyIG5vZGUpXG5cbiMjIyMjIyBTZXR0aW5nIHBvc2l0aW9uICh4LCB5KTpcbi0gc3JjL2xheW91dFBvc2l0aW9uL3Bvc2l0aW9uSXMgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgeCBhbmQgeSBmcm9tIGEgdmFsdWVzIGF0IHRoZSBzYW1lIHRpbWUpXG4tIHNyYy9sYXlvdXRQb3NpdGlvbi94SXMgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgeCBmcm9tIGEgdmFsdWUpXG4tIHNyYy9sYXlvdXRQb3NpdGlvbi95SXMgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgeSBmcm9tIGEgdmFsdWUpXG4tIHNyYy9sYXlvdXRQb3NpdGlvbi9hbGlnbmVkV2l0aCAoaWYgeW91ciBydWxlIHdpbGwgYmUgc2V0dGluZyB4IGFuZCB5IGJhc2VkIG9uIGFub3RoZXIgbm9kZSlcbi0gc3JjL2xheW91dFBvc2l0aW9uL2xlZnRBbGlnbmVkV2l0aCAoaWYgeW91ciBydWxlIHdpbGwgYmUgc2V0dGluZyB4IGJhc2VkIG9uIGFub3RoZXIgbm9kZSlcbi0gc3JjL2xheW91dFBvc2l0aW9uL3RvcEFsaWduZWRXaXRoIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIHkgYmFzZWQgb24gYW5vdGhlciBub2RlKVxuXG4jIyMjIyMgQm91bmRpbmcgc2l6ZSAod2lkdGgsIGhlaWdodCk6XG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbWF4U2l6ZSAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IGF0IHRoZSBzYW1lIHRpbWUpXG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbWF4V2lkdGggKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIHdpZHRoIG9ubHkpXG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbWF4SGVpZ2h0IChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBib3VuZGluZyBoZWlnaHQgb25seSlcbi0gc3JjL2xheW91dEJvdW5kU2l6ZS9tYXhTaXplRnJvbSAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgd2lkdGggYW5kIGhlaWdodCBiYXNlZCBvbiBhbm90aGVyIGl0ZW0pXG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbWF4V2lkdGhGcm9tIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBib3VuZGluZyB3aWR0aCBiYXNlZCBvbiBhbm90aGVyIGl0ZW0pXG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbWF4SGVpZ2h0RnJvbSAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgaGVpZ2h0IGJhc2VkIG9uIGFub3RoZXIgaXRlbSlcblxuIyMjIyMjIEJvdW5kaW5nIHBvc2l0aW9uICh4LCB5KTpcbi0gc3JjL2xheW91dEJvdW5kU2l6ZS9tYXhQb3NpdGlvbiAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgYm90aCB4IGFuZCB5IGF0IHRoZSBzYW1lIHRpbWUpXG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbGVmdE1heCAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgeCBvbmx5KVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL3RvcE1heCAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgeSBvbmx5KVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heFBvc2l0aW9uRnJvbSAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgeCBhbmQgeSBiYXNlZCBvbiBhbm90aGVyIGl0ZW0pXG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbGVmdE1heEZyb20gKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIHggYmFzZWQgb24gYW5vdGhlciBpdGVtKVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL3RvcE1heEZyb20gKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIHkgYmFzZWQgb24gYW5vdGhlciBpdGVtKVxuXG5AcGFyYW0ge1N0cmluZ30gcnVsZVR5cGUgaXMgYSBzdHJpbmcgd2hpY2ggZGVzY3JpYmVzIHdoYXQgdHlwZSBvZiBydWxlIHlvdSdyZSBkZWZpbmluZy4gRm9yIHV0aWxpdHkgeW91IGNhbiB1c2UgdGhlIHN0YXRpYyBjb25zdGFudHMgZGVmaW5lZFxub24gTGF5b3V0Tm9kZTpcblxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1NJWkVfTEFZT1VUOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvU0laRV9MQVlPVVQ6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cbi0ge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZS9TSVpFX0JPVU5EOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvU0laRV9XSURUSF9MQVlPVVQ6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cbi0ge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZS9TSVpFX1dJRFRIX0JPVU5EOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvU0laRV9IRUlHSFRfTEFZT1VUOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvU0laRV9IRUlHSFRfQk9VTkQ6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cbi0ge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZS9QT1NJVElPTl9MQVlPVVQ6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cbi0ge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZS9QT1NJVElPTl9CT1VORDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1BPU0lUSU9OX1hfTEFZT1VUOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvUE9TSVRJT05fWF9CT1VORDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1BPU0lUSU9OX1lfTEFZT1VUOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvUE9TSVRJT05fWV9CT1VORDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuXG5cbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuYWRkQ3VzdG9tUnVsZSA9IGZ1bmN0aW9uKCBydWxlRnVuY3Rpb24sIHJ1bGVUeXBlICkge1xuXG5cdGFyZ3VtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDIgKTtcblxuXHR2YXIgZWZmZWN0c1Byb3BlcnRpZXMgPSBudWxsO1xuXHR2YXIgcnVsZUFyciA9IG51bGw7XG5cdHZhciBydWxlUHJvcEFyciA9IG51bGw7XG5cblx0c3dpdGNoKCBydWxlVHlwZSApIHtcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5TSVpFX0xBWU9VVDpcblx0XHRcdGVmZmVjdHNQcm9wZXJ0aWVzID0gU0laRTtcblx0XHRcdHJ1bGVBcnIgPSB0aGlzLnJ1bGVzU2l6ZTtcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1NpemVQcm9wO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBMYXlvdXROb2RlLlNJWkVfQk9VTkQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFNJWkU7XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1NpemVCb3VuZDtcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1NpemVCb3VuZFByb3A7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIExheW91dE5vZGUuU0laRV9XSURUSF9MQVlPVVQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFNJWkVfV0lEVEg7XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1NpemU7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNTaXplUHJvcDtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5TSVpFX1dJRFRIX0JPVU5EOlxuXHRcdFx0ZWZmZWN0c1Byb3BlcnRpZXMgPSBTSVpFX1dJRFRIO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNTaXplQm91bmQ7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNTaXplQm91bmRQcm9wO1xuXHRcdGJyZWFrO1x0XHRcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5TSVpFX0hFSUdIVF9MQVlPVVQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFNJWkVfSEVJR0hUO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNTaXplO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzU2l6ZVByb3A7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIExheW91dE5vZGUuU0laRV9IRUlHSFRfQk9VTkQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFNJWkVfSEVJR0hUO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNTaXplQm91bmQ7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNTaXplQm91bmRQcm9wO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBMYXlvdXROb2RlLlBPU0lUSU9OX0xBWU9VVDpcblx0XHRcdGVmZmVjdHNQcm9wZXJ0aWVzID0gUE9TSVRJT047XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1Bvcztcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1Bvc1Byb3A7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIExheW91dE5vZGUuUE9TSVRJT05fQk9VTkQ6XG5cblx0XHRcdGVmZmVjdHNQcm9wZXJ0aWVzID0gUE9TSVRJT047XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1Bvc0JvdW5kO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBMYXlvdXROb2RlLlBPU0lUSU9OX1hfTEFZT1VUOlxuXHRcdFx0ZWZmZWN0c1Byb3BlcnRpZXMgPSBQT1NJVElPTl9YO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNQb3M7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNQb3NQcm9wO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBMYXlvdXROb2RlLlBPU0lUSU9OX1hfQk9VTkQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFBPU0lUSU9OX1g7XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1Bvc0JvdW5kO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wO1xuXHRcdGJyZWFrO1x0XHRcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5QT1NJVElPTl9ZX0xBWU9VVDpcblx0XHRcdGVmZmVjdHNQcm9wZXJ0aWVzID0gUE9TSVRJT05fWTtcblx0XHRcdHJ1bGVBcnIgPSB0aGlzLnJ1bGVzUG9zO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzUG9zUHJvcDtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5QT1NJVElPTl9ZX0JPVU5EOlxuXHRcdFx0ZWZmZWN0c1Byb3BlcnRpZXMgPSBQT1NJVElPTl9ZO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNQb3NCb3VuZDtcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcDtcblx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6IFxuXHRcdFx0dGhyb3cgJ1Vrbm93biBydWxlIHR5cGUnO1xuXHRcdGJyZWFrO1xuXHR9O1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHJ1bGVGdW5jdGlvbiwgYXJndW1lbnRzLCBydWxlQXJyLCBydWxlUHJvcEFyciwgZWZmZWN0c1Byb3BlcnRpZXMgKTtcbn07XG5cbkxheW91dE5vZGUucHJvdG90eXBlLmFkZERlcGVuZGVuY3kgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRzd2l0Y2goIHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgKSB7XG5cblx0XHRjYXNlIFNJWkU6XG5cdFx0Y2FzZSBCT1VORF9TSVpFOlxuXHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRjYXNlIEJPVU5EX1NJWkVfV0lEVEg6XG5cdFx0Y2FzZSBTSVpFX0hFSUdIVDpcblx0XHRjYXNlIEJPVU5EX1NJWkVfSEVJR0hUOlxuXG5cdFx0XHR0aGlzLnNpemVEZXBlbmRlbmNpZXMucHVzaCggaXRlbSApO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OOlxuXHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1g6XG5cdFx0Y2FzZSBQT1NJVElPTl9ZOlxuXHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWTpcblxuXHRcdFx0dGhpcy5wb3NpdGlvbkRlcGVuZGVuY2llcy5wdXNoKCBpdGVtICk7XG5cdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbkxheW91dE5vZGUucHJvdG90eXBlLnJlc2V0UnVsZXMgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLnJlc2V0U2l6ZVJ1bGVzKCk7XG5cdHRoaXMucmVzZXRQb3NpdGlvblJ1bGVzKCk7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5yZXNldFBvc2l0aW9uUnVsZXMgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkID0gbnVsbDtcblx0dGhpcy5wb3NpdGlvbkRlcGVuZGVuY2llcyA9IFtdO1xuXHR0aGlzLnJ1bGVzUG9zID0gW107XG5cdHRoaXMucnVsZXNQb3NQcm9wID0gW107XG5cdHRoaXMuX29mZlggPSB0aGlzLl9vZmZZID0gMDtcblxuXHRpZiggdGhpcy5oYXNCZWVuTGF5ZWRPdXQgKSB7XG5cdFx0XHRcblx0XHR0aGlzLmxheW91dC5ub2RlQ2hhbmdlZCggdGhpcyApO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5yZXNldFNpemVSdWxlcyA9IGZ1bmN0aW9uKCkge1xuXG5cdHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgPSBudWxsO1xuXHR0aGlzLnNpemVEZXBlbmRlbmNpZXMgPSBbXTtcblx0dGhpcy5ydWxlc1NpemUgPSBbXTtcblx0dGhpcy5ydWxlc1NpemVQcm9wID0gW107XG5cdHRoaXMuX29mZldpZHRoID0gdGhpcy5fb2ZmSGVpZ2h0ID0gMDtcblxuXHRpZiggdGhpcy5oYXNCZWVuTGF5ZWRPdXQgKSB7XG5cdFx0XHRcblx0XHR0aGlzLmxheW91dC5ub2RlQ2hhbmdlZCggdGhpcyApO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcblRoaXMgaXMgYSB1dGlsaXR5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBMYXlvdXROb2RlLiBJdCB3aWxsIHVzZSB0aGUgcGFyZW50IGxheW91dCAoTGF5RG93bikgb2YgdGhpcyBub2RlLlxuXG5UaGlzIGlzIGJhc2ljYWxseSBmb3IgdGhvc2UgcGVlcHMgd2hvIGxvdmVzIHRoZW0gY2hhaW5pbmdzLiAoZG9uJ3QgZ2V0IHRvbyBjcmF6eSB0aG91Z2gpXG5cbkBtZXRob2QgY3JlYXRlXG5AcGFyYW0gaXRlbVRvTGF5RG93biB7T2JqZWN0fSBUaGlzIGlzIGEgbmV3IGl0ZW0gdG8gYmUgbGFpZCBvdXQuIGVnLiBBIERPTSBlbGVtZW50IG9yIGEgRGl4aURpc3BsYXlPYmplY3Qgb3Igd2hhdGV2ZXJcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oIGl0ZW1Ub0xheURvd24gKSB7XG5cblx0cmV0dXJuIHRoaXMubGF5b3V0LmNyZWF0ZSggaXRlbVRvTGF5RG93biApO1xufTtcblxuLy9UaGlzIGlzIG5vdCBhIHBhcnQgb2YgcHJvdG90eXBlIGNhdXNlIGl0J3MgbW9yZSBqdXN0IGEgdXRpbGl0eSBmdW5jdGlvbiB0byBhZGQgcnVsZXMgcXVpY2tseVxuLy9kb24ndCB3YW50IHBlb3BsZSB0byBnZXQgY29uZnVzZWQgaWYgdGhlcmUncyBhbiBhZGQgcnVsZSBmdW5jdGlvbiBvbiB0aGUgcHJvdG9cbmZ1bmN0aW9uIGFkZFJ1bGUoIHJ1bGUsIHJ1bGVBcmd1bWVudHMsIHJ1bGVBcnIsIHJ1bGVQcm9wQXJyLCB0eXBlICkge1xuXG5cdC8vd2UgbmV2ZXIgd2FudCB0byBhbGxvdyBhZGRpbmcgcnVsZXMgdG8gYSBzZWxmIGNvbmRpdGlvbmFsXG5cdGlmKCB0aGlzLl9kb2luZ1NlbGZDb25kaXRpb25hbCApIHtcblxuXHRcdHRocm93ICdZb3UgY2Fubm90IGFkZCBsYXlvdXQgcnVsZXMgYWZ0ZXIgYWRkaW5nIGEgY29uZGl0aW9uYWwgdG8gdGhlIGl0ZW0gaXRzZWxmJztcblx0fVxuXG5cdGlmKCB0aGlzLmNvbmRpdGlvbmFsUGFyZW50ICkgeyBcblxuXHRcdC8vY2hlY2sgd2hldGVyIHdpZHRoIGlzIGJlaW5nIGVmZmVjdGVkXG5cdFx0dGhpcy5jb25kaXRpb25hbFBhcmVudC5kb05vdFJlYWRXaWR0aCA9IHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuZG9Ob3RSZWFkV2lkdGggfHwgXG5cdFx0dHlwZSA9PSBTSVpFIHx8XG5cdFx0dHlwZSA9PSBTSVpFX1dJRFRIO1xuXG5cdFx0dGhpcy5jb25kaXRpb25hbFBhcmVudC5kb05vdFJlYWRIZWlnaHQgPSB0aGlzLmNvbmRpdGlvbmFsUGFyZW50LmRvTm90UmVhZEhlaWdodCB8fCBcblx0XHR0eXBlID09IFNJWkUgfHxcblx0XHR0eXBlID09IFNJWkVfSEVJR0hUO1xuXG5cblx0XHQvL2lmIHdlJ3JlIGluIGEgY2hpbGQgY29uZGl0aW9uYWwgYW5kIHRoaXMgaXMgYSBib3VuZCBmdW5jdGlvbiBpdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHBhcmVudFxuXHRcdGlmKCB0eXBlID09IEJPVU5EX1NJWkUgfHxcblx0XHQgICAgdHlwZSA9PSBCT1VORF9TSVpFX1dJRFRIIHx8XG5cdFx0ICAgIHR5cGUgPT0gQk9VTkRfU0laRV9IRUlHSFQgKSB7XG5cblx0XHRcdHJ1bGVBcnIgPSB0aGlzLmNvbmRpdGlvbmFsUGFyZW50LnJ1bGVzU2l6ZUJvdW5kO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLmNvbmRpdGlvbmFsUGFyZW50LnJ1bGVzU2l6ZUJvdW5kUHJvcDtcblxuXHRcdC8vaWYgd2UncmUgaW4gYSBjaGlsZCBjb25kaXRpb25hbCBhbmQgdGhpcyBpcyBhIGJvdW5kIGZ1bmN0aW9uIGl0IHNob3VsZCBiZSBhZGRlZCB0byB0aGUgcGFyZW50XG5cdFx0fSBlbHNlIGlmKCB0eXBlID09IEJPVU5EX1BPU0lUSU9OIHx8XG5cdFx0XHRcdCAgIHR5cGUgPT0gQk9VTkRfUE9TSVRJT05fWCB8fFxuXHRcdFx0XHQgICB0eXBlID09IEJPVU5EX1BPU0lUSU9OX1kgKSB7XG5cblx0XHRcdHJ1bGVBcnIgPSB0aGlzLmNvbmRpdGlvbmFsUGFyZW50LnJ1bGVzUG9zQm91bmQ7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMuY29uZGl0aW9uYWxQYXJlbnQucnVsZXNQb3NCb3VuZFByb3A7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXG5cdFx0Ly9jaGVjayB3aGV0ZXIgd2lkdGggaXMgYmVpbmcgZWZmZWN0ZWRcblx0XHR0aGlzLmRvTm90UmVhZFdpZHRoID0gdGhpcy5kb05vdFJlYWRXaWR0aCB8fCBcblx0XHR0eXBlID09IFNJWkUgfHxcblx0XHR0eXBlID09IFNJWkVfV0lEVEg7XG5cblx0XHR0aGlzLmRvTm90UmVhZEhlaWdodCA9IHRoaXMuZG9Ob3RSZWFkSGVpZ2h0IHx8IFxuXHRcdHR5cGUgPT0gU0laRSB8fFxuXHRcdHR5cGUgPT0gU0laRV9IRUlHSFQ7XG5cdH1cblxuXG5cdC8vanVzdCBjaGVjayBpZiB3ZSd2ZSBzdGFydGVkIHdyaXRpbmcgYSBjb25kaXRpb25hbCBidXQgZGlkbnQgYWRkIGEgY2FzZVxuXHRpZiggdGhpcy5faXNEb2luZ1doZW4gJiYgIXRoaXMuX2hhc0NvbmRpdGlvbmFsICkge1xuXG5cdFx0dGhyb3cgJ1lvdSBzaG91bGQgYWRkIGEgY29uZGl0aW9uYWwgc3VjaCBhcyBcIndpZHRoR3JlYXRlclRoYW5cIiBiZWZvcmUgYWRkaW5nIGEgcnVsZSc7XG5cblx0Ly9pZiB0aGVzZSBhcmUgYm90aCB0cnVlIHRoZW4gd2hlbiBoYXMgYmVlbiBjYWxsZWQgYW5kIGEgY29uZGl0aW9uYWxcblx0Ly9oYXMgYmVlbiBhZGRlZCBzbyB3ZSBzaG91bGQgY3JlYXRlIGEgbmV3IExheW91dE5vZGUgZm9yIHRoZSBjb25kaXRpb25hbHNcblx0fSBlbHNlIGlmKCAoIHRoaXMuX2lzRG9pbmdXaGVuICYmIHRoaXMuX2hhc0NvbmRpdGlvbmFsICkgfHwgdGhpcy5faXNEb2luZ0RlZmF1bHQgKSB7XG5cblx0XHR2YXIgbk5vZGUgPSBuZXcgTGF5b3V0Tm9kZSggdGhpcy5sYXlvdXQgKTtcblx0XHRuTm9kZS5jb25kaXRpb25hbFBhcmVudCA9IHRoaXM7XG5cblx0XHRpZiggIXRoaXMuX2lzRG9pbmdEZWZhdWx0ICkge1xuXG5cdFx0XHR0aGlzLmxheW91dE5vZGVGb3JDb25kaXRpb25hbC5wdXNoKCBuTm9kZSApO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHRoaXMubGF5b3V0Tm9kZUZvckRlZmF1bHQgPSBuTm9kZTtcblx0XHR9XG5cblx0XHR0aGlzLl9pc0RvaW5nV2hlbiA9IGZhbHNlO1xuXHRcdHRoaXMuX2hhc0NvbmRpdGlvbmFsID0gZmFsc2U7XG5cdFx0dGhpcy5faXNEb2luZ0RlZmF1bHQgPSBmYWxzZTtcblxuXHRcdC8vbmVlZCB0byBmaWd1cmUgb3V0IHdoaWNoIHJ1bGVBcnIgYW5kIHJ1bGVQcm9wQXJyIHRvIHVzZVxuXHRcdHN3aXRjaCggdHlwZSApIHtcblxuXHRcdFx0Y2FzZSBTSVpFOlxuXHRcdFx0Y2FzZSBTSVpFX1dJRFRIOlxuXHRcdFx0Y2FzZSBTSVpFX0hFSUdIVDpcblxuXHRcdFx0XHRydWxlQXJyID0gbk5vZGUucnVsZXNTaXplO1xuXHRcdFx0XHRydWxlUHJvcEFyciA9IG5Ob2RlLnJ1bGVzU2l6ZVByb3A7XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRcdGNhc2UgUE9TSVRJT05fWTpcblxuXHRcdFx0XHRydWxlQXJyID0gbk5vZGUucnVsZXNQb3M7XG5cdFx0XHRcdHJ1bGVQcm9wQXJyICA9IG5Ob2RlLnJ1bGVzUG9zUHJvcDtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdC8vdGhpcyB3aWxsIHJldHVybiB0aGUgbmV3IG5vZGVcblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCBuTm9kZSwgcnVsZSwgcnVsZUFyZ3VtZW50cywgcnVsZUFyciwgcnVsZVByb3BBcnIsIHR5cGUgKTtcblx0fVxuXG5cdHJ1bGVBcnIucHVzaCggcnVsZSApO1xuXHRydWxlUHJvcEFyci5wdXNoKCBydWxlQXJndW1lbnRzICk7XG5cblx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IHR5cGU7XG5cblx0aWYoIHJ1bGVBcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHR0aGlzLmFkZERlcGVuZGVuY3koIHJ1bGVBcmd1bWVudHNbIDAgXSApO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59XG5cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS1QT1NJVElPTiBGVU5DVElPTlMtLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gYW4gaXRlbSBhdCB0aGUgY29yZGluYXRlIHBhc3NlZCBpbi5cblxuQG1ldGhvZCBwb3NpdGlvbklzXG5AcGFyYW0geCB7TnVtYmVyfSB4IGNvcmRpbmF0ZSB3aGVyZSB0aGUgaXRlbSBiZWluZyBwb3NpdGlvbmVkIHNob3VsZCBnb1xuQHBhcmFtIHkge051bWJlcn0geSBjb3JkaW5hdGUgd2hlcmUgdGhlIGl0ZW0gYmVpbmcgcG9zaXRpb25lZCBzaG91bGQgZ29cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucG9zaXRpb25JcyA9IGZ1bmN0aW9uKCB4LCB5ICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHBvc2l0aW9uSXMsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIGFuIGl0ZW0gYXQgdGhlIHggYW5kIHkgY2FsY3VsYXRlZCBieSB0YWtpbmcgdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluIHRpbWVzIHRoZVxucGVyY2VudGFnZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgcG9zaXRpb25Jc0FQZXJjZW50YWdlT2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSB0aGlzIExheW91dE5vZGUncyB3aWR0aCBhbmQgaGVpZ2h0IGlzIGdvaW5nIHRvIGJlIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBwb3NpdG9uIG9mIHRoaXMgTGF5b3V0Tm9kZVxuQHBhcmFtIHBlcmNlbnRhZ2Uge051bWJlcn0gdGhpcyBwZXJjZW50YWdlIHdpbGwgYmUgdXNlZCB0byB0aGUgY2FsY3VsYXRlIHRoZSB4IGFuZCB5IHBvc2l0aW9uIG9mIHRoaXMgTGF5b3V0Tm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5wb3NpdGlvbklzQVBlcmNlbnRhZ2VPZiA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHBvc2l0aW9uSXNBUGVyY2VudGFnZU9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiBhbiBpdGVtIGF0IHRoZSB4IGNvcmRpbmF0ZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgeElzXG5AcGFyYW0geCB7TnVtYmVyfSB4IGNvcmRpbmF0ZSB3aGVyZSB0aGUgaXRlbSBiZWluZyBwb3NpdGlvbmVkIHNob3VsZCBnb1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS54SXMgPSBmdW5jdGlvbiggeCApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB4SXMsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gYW4gaXRlbSBhdCB0aGUgeCBjYWxjdWxhdGVkIGJ5IHRha2luZyB0aGUgd2lkdGggb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluIHRpbWVzIHRoZVxucGVyY2VudGFnZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgeElzQVBlcmNlbnRhZ2VPZlxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IHRoaXMgTGF5b3V0Tm9kZSdzIHdpZHRoIGlzIGdvaW5nIHRvIGJlIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBwb3NpdG9uIG9mIHRoaXMgTGF5b3V0Tm9kZVxuQHBhcmFtIHBlcmNlbnRhZ2Uge051bWJlcn0gdGhpcyBwZXJjZW50YWdlIHdpbGwgYmUgdXNlZCB0byB0aGUgY2FsY3VsYXRlIHRoZSB4IHBvc2l0aW9uIG9mIHRoaXMgTGF5b3V0Tm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS54SXNBUGVyY2VudGFnZU9mID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgeElzQVBlcmNlbnRhZ2VPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiBhbiBpdGVtIGF0IHRoZSB5IGNvcmRpbmF0ZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgeUlzXG5AcGFyYW0geSB7TnVtYmVyfSB5IGNvcmRpbmF0ZSB3aGVyZSB0aGUgaXRlbSBiZWluZyBwb3NpdGlvbmVkIHNob3VsZCBnb1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS55SXMgPSBmdW5jdGlvbiggeSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB5SXMsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gYW4gaXRlbSBhdCB0aGUgeSBjYWxjdWxhdGVkIGJ5IHRha2luZyB0aGUgaGVpZ2h0IG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aW1lcyB0aGVcbnBlcmNlbnRhZ2UgcGFzc2VkIGluLlxuXG5AbWV0aG9kIHlJc0FQZXJjZW50YWdlT2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSB0aGlzIExheW91dE5vZGUncyBoZWlnaHQgaXMgZ29pbmcgdG8gYmUgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHBvc2l0b24gb2YgdGhpcyBMYXlvdXROb2RlXG5AcGFyYW0gcGVyY2VudGFnZSB7TnVtYmVyfSB0aGlzIHBlcmNlbnRhZ2Ugd2lsbCBiZSB1c2VkIHRvIHRoZSBjYWxjdWxhdGUgdGhlIHkgcG9zaXRpb24gb2YgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnlJc0FQZXJjZW50YWdlT2YgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB5SXNBUGVyY2VudGFnZU9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBiZWxvdyB0aGUgaXRlbSBwYXNzZWQuXG5cbkBtZXRob2QgYWxpZ25lZEJlbG93XG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgYmVsb3dcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuYWxpZ25lZEJlbG93ID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgYWxpZ25lZEJlbG93LCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBhYm92ZSB0aGUgaXRlbSBwYXNzZWQuXG5cbkBtZXRob2QgYWxpZ25lZEFib3ZlXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgYWJvdmVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuYWxpZ25lZEFib3ZlID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgYWxpZ25lZEFib3ZlLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG5cbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gdGhpcyBMYXlvdXROb2RlIGxlZnQgb2YgdGhlIGl0ZW0gcGFzc2VkLlxuXG5AbWV0aG9kIGFsaWduZWRMZWZ0T2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIHRoYXQgdGhpcyBMYXlvdXROb2RlIHNob3VsZCBiZSBsZWZ0IG9mXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmFsaWduZWRMZWZ0T2YgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBhbGlnbmVkTGVmdE9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSByaWdodCBvZiB0aGUgaXRlbSBwYXNzZWQuXG5cbkBtZXRob2QgYWxpZ25lZFJpZ2h0T2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIHRoYXQgdGhpcyBMYXlvdXROb2RlIHNob3VsZCBiZSByaWdodCBvZlxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5hbGlnbmVkUmlnaHRPZiA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGFsaWduZWRSaWdodE9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBzbyB0aGF0IGl0J3MgYWxpZ25lZCBmdWxseSAodG9wLCBsZWZ0KSB3aXRoIHRoZSBpdGVtIHBhc3NlZCBpbi5cblxuQG1ldGhvZCBhbGlnbmVkV2l0aFxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIGFsaWduIHRvXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmFsaWduZWRXaXRoID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgYWxpZ25lZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBzbyB0aGF0IGl0J3MgbGVmdCBhbGlnbmVkIHdpdGggdGhlIGl0ZW0gcGFzc2VkIGluLlxuXG5AbWV0aG9kIGxlZnRBbGlnbmVkV2l0aFxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIGxlZnQgYWxpZ24gdG9cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubGVmdEFsaWduZWRXaXRoID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbGVmdEFsaWduZWRXaXRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBzbyB0aGF0IGl0J3MgcmlnaHQgYWxpZ25lZCB3aXRoIHRoZSBpdGVtIHBhc3NlZCBpbi5cblxuQG1ldGhvZCByaWdodEFsaWduZWRXaXRoXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgcmlnaHQgYWxpZ24gdG9cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucmlnaHRBbGlnbmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHJpZ2h0QWxpZ25lZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gdGhpcyBMYXlvdXROb2RlIHNvIHRoYXQgaXQncyB0b3AgYWxpZ25lZCB3aXRoIHRoZSBpdGVtIHBhc3NlZCBpbi5cblxuQG1ldGhvZCB0b3BBbGlnbmVkV2l0aFxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIHRvcCBhbGlnbiB0b1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS50b3BBbGlnbmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHRvcEFsaWduZWRXaXRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBzbyB0aGF0IGl0J3MgYm90dG9tIGFsaWduZWQgd2l0aCB0aGUgaXRlbSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgYm90dG9tQWxpZ25lZFdpdGhcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIHRoYXQgdGhpcyBMYXlvdXROb2RlIHNob3VsZCBib3R0b20gYWxpZ24gdG9cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuYm90dG9tQWxpZ25lZFdpdGggPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBib3R0b21BbGlnbmVkV2l0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUgc28gdGhhdCBpdCdzIGNlbnRlciAoaG9yaXpvbnRhbGx5IGFuZCB2ZXJpY2FsbHkpIGFsaWduZWQgd2l0aCB0aGUgaXRlbSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgY2VudGVyZWRXaXRoXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgY2VudGVyIGFsaWduIHRvXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmNlbnRlcmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGNlbnRlcmVkV2l0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT04gKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gdGhpcyBMYXlvdXROb2RlIHNvIHRoYXQgaXQncyBob3Jpem9udGFsbHkgY2VudGVyZWQgd2l0aCB0aGUgaXRlbSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgaG9yaXpvbnRhbGx5Q2VudGVyZWRXaXRoXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgaG9yaXpvbnRhbGx5IGNlbnRlcmVkIHRvXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmhvcml6b250YWxseUNlbnRlcmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGhvcml6b250YWxseUNlbnRlcmVkV2l0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUgc28gdGhhdCBpdCdzIHZlcnRpY2FsbHkgY2VudGVyZWQgd2l0aCB0aGUgaXRlbSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgdmVydGljYWxseUNlbnRlcmVkV2l0aFxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIGJlIHZlcnRpY2FsbHkgY2VudGVyZWQgdG9cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUudmVydGljYWxseUNlbnRlcmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHZlcnRpY2FsbHlDZW50ZXJlZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS1TSVpFIEZVTkNUSU9OUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNpemUgYW4gaXRlbSB0byBiZSB0aGUgZXhhY3Qgc2l6ZSB2YWx1ZSAod2lkdGggYW5kIGhlaWdodCkgcGFzc2VkIGluXG5cbkBtZXRob2Qgc2l6ZUlzXG5AcGFyYW0gd2lkdGgge051bWJlcn0gd2lkdGggb2YgdGhpcyBMYXlvdXROb2RlXG5AcGFyYW0gaGVpZ2h0IHtOdW1iZXJ9IGhlaWdodCBvZiB0aGlzIExheW91dE5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuc2l6ZUlzID0gZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgc2l6ZUlzLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkUgKTtcbn1cblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBzZXQgdGhlIHdpZHRoIG9mIGFuIGl0ZW0gdG8gYmUgdGhlIGV4YWN0IHZhbHVlIHBhc3NlZCBpblxuXG5AbWV0aG9kIHdpZHRoSXNcbkBwYXJhbSB3aWR0aCB7TnVtYmVyfSB3aWR0aCBvZiB0aGlzIExheW91dE5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUud2lkdGhJcyA9IGZ1bmN0aW9uKCB3aWR0aCApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB3aWR0aElzLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfV0lEVEggKTtcbn1cblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBzZXQgdGhlIGhlaWdodCBvZiBhbiBpdGVtIHRvIGJlIHRoZSBleGFjdCB2YWx1ZSBwYXNzZWQgaW5cblxuQG1ldGhvZCBoZWlnaHRJc1xuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSBoZWlnaHQgb2YgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmhlaWdodElzID0gZnVuY3Rpb24oIGhlaWdodCApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBoZWlnaHRJcywgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xuXG59XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgc2V0IHRoZSB3aWR0aCBvciBoZWlnaHQgb2YgdGhpcyBMYXlvdXROb2RlIHRvIGJlIHByb3BvcnRpb25hbCBiYXNlZCBvbiB0aGUgb3JpZ2luYWwgd2lkdGggYW5kIGhlaWdodCBwYXNzZWQgaW4uXG5JdCBpcyBoYW5keSBmb3Igd2hlbiB5b3UgaGF2ZSBydWxlcyBhZGp1c3RpbmcgZWl0aGVyIHdpZHRoIG9yIGhlaWdodCBvbmx5IGFuZCB5ZXQgeW91IHdhbnQgdGhlIHVudG91Y2hlZCBwcm9wZXJ0eSB0byBiZVxucHJvcG9ydGlvbmFsLlxuXG5TbyBpZiB5b3UgaGF2ZSBhbiBpbWFnZSB0aGF0IGlzIDIwMHgxMDAgaWYgdGhlcmUgYXJlIHJ1bGVzIGFwcGxpZWQgdG8gdGhpcyBMYXlvdXROb2RlIHdoZXJlIHRoZSB3aWR0aCB3aWxsIGJlY29tZSA0MDBweFxudGhpcyBydWxlIHdpbGwgc2VlIHRoYXQgaGVpZ2h0IGhhcyBub3QgYmVlbiBlZmZlY3RlZCBhdCBhbGwgYW5kIHdpbGwgc2V0IHRoZSBoZWlnaHQgdG8gYmUgcHJvcG9ydGlvbmFsIHRvIHRoZSB3aWR0aCBiYXNlZCBvblxudGhlIG9yaWdpbmFsIGhlaWdodCBwYXNzZWQgaW4uIFNvIGluIHRoaXMgY2FzZSBvdXIgaW1hZ2UncyBzaXplIHdvdWxkIGJlIDQwMHgyMDAgd2hlcmUgdGhpcyBydWxlIHNldHMgdGhlIGhlaWdodCB0byBiZSAyMDBweFxudG8gc3RheSBpbiBwcm9wb3J0aW9uIHRvIHRoZSBvcmlnaW5hbCB3aWR0aC5cblxuQG1ldGhvZCBzaXplSXNQcm9wb3J0aW9uYWxcbkBwYXJhbSBvcmlnaW5hbFdpZHRoIHtOdW1iZXJ9IHRoZSBvcmlnaW5hbCB3aWR0aCBvZiB0aGUgaXRlbSBiZWluZyBsYXllZCBvdXQgYmVmb3JlIGFueSBsYXlvdXQgZnVuY3Rpb25zIGFyZSBhcHBsaWVkXG5AcGFyYW0gb3JpZ2luYWxIZWlnaHQge051bWJlcn0gdGhlIG9yaWdpbmFsIGhlaWdodCBvZiB0aGUgaXRlbSBiZWluZyBsYXllZCBvdXQgYmVmb3JlIGFueSBsYXlvdXQgZnVuY3Rpb25zIGFyZSBhcHBsaWVkXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnNpemVJc1Byb3BvcnRpb25hbCA9IGZ1bmN0aW9uKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBzaXplSXNQcm9wb3J0aW9uYWwsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgd2lkdGggb2YgdGhlIExheW91dE5vZGUgdG8gYmUgcHJvcG9ydGlvbmFsIHRvIHRoZSBoZWlnaHQgYmFzZWQgb24gdGhlIG9yaWdpbmFsV2lkdGggcGFzc2VkLlxuSXQgaXMgaGFuZHkgZm9yIHdoZW4geW91IGhhdmUgcnVsZXMgYWRqdXN0aW5nIGhlaWdodCBhbmQgd2lkdGggc2hvdWxkIHJlbWFpbiBwcm9wb3J0aW9uYWwgdG8gdGhlIGhlaWdodC5cblxuRm9yIGluc3RhbmNlIHlvdSBoYXZlIGFuIGltYWdlIHdoaWNoIGlzIDIwMHgxMDAuIE9uY2UgcnVsZXMgYXJlIGFwcGxpZWQgdG8gaXQgdGhlIGhlaWdodCBiZWNvbWVzIDIwMHB4LiBJZGVhbGx5IHdlJ2xsXG53YW50IHRoZSB3aWR0aCB0byBhbHNvIGJlIDJ4IGxhcmdlci4gU28gdGhpcyBydWxlIHdpbGwgc2V0IHRoZSB3aWR0aCB0byBiZSA0MDBweCBhbmQgb3VyIGZpbmFsIHJlc29sdXRpb24gaXMgNDAweDIwMC5cblxuQG1ldGhvZCB3aWR0aElzUHJvcG9ydGlvbmFsXG5AcGFyYW0gb3JpZ2luYWxXaWR0aCB7TnVtYmVyfSB0aGUgb3JpZ2luYWwgd2lkdGggb2YgdGhlIGl0ZW0gYmVpbmcgbGF5ZWQgb3V0IGJlZm9yZSBhbnkgbGF5b3V0IGZ1bmN0aW9ucyBhcmUgYXBwbGllZFxuQHBhcmFtIG9yaWdpbmFsSGVpZ2h0IHtOdW1iZXJ9IHRoZSBvcmlnaW5hbCBoZWlnaHQgb2YgdGhlIGl0ZW0gYmVpbmcgbGF5ZWQgb3V0IGJlZm9yZSBhbnkgbGF5b3V0IGZ1bmN0aW9ucyBhcmUgYXBwbGllZFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS53aWR0aElzUHJvcG9ydGlvbmFsID0gZnVuY3Rpb24oIG9yaWdpbmFsV2lkdGgsIG9yaWdpbmFsSGVpZ2h0ICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHdpZHRoSXNQcm9wb3J0aW9uYWwsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgaGVpZ2h0IG9mIHRoZSBMYXlvdXROb2RlIHRvIGJlIHByb3BvcnRpb25hbCB0byB0aGUgd2lkdGggYmFzZWQgb24gdGhlIG9yaWdpbmFsSGVpZ2h0IHBhc3NlZC5cbkl0IGlzIGhhbmR5IGZvciB3aGVuIHlvdSBoYXZlIHJ1bGVzIGFkanVzdGluZyB3aWR0aCBhbmQgaGVpZ2h0IHNob3VsZCByZW1haW4gcHJvcG9ydGlvbmFsIHRvIHRoZSB3aWR0aC5cblxuRm9yIGluc3RhbmNlIHlvdSBoYXZlIGFuIGltYWdlIHdoaWNoIGlzIDIwMHgxMDAuIE9uY2UgcnVsZXMgYXJlIGFwcGxpZWQgdG8gaXQgdGhlIHdpZHRoIGJlY29tZXMgNDAwcHguIElkZWFsbHkgd2UnbGxcbndhbnQgdGhlIGhlaWdodCB0byBhbHNvIGJlIDJ4IGxhcmdlci4gU28gdGhpcyBydWxlIHdpbGwgc2V0IHRoZSBoZWlnaHQgdG8gYmUgMjAwcHggYW5kIG91ciBmaW5hbCByZXNvbHV0aW9uIGlzIDQwMHgyMDAuXG5cbkBtZXRob2QgaGVpZ2h0SXNQcm9wb3J0aW9uYWxcbkBwYXJhbSBvcmlnaW5hbFdpZHRoIHtOdW1iZXJ9IHRoZSBvcmlnaW5hbCB3aWR0aCBvZiB0aGUgaXRlbSBiZWluZyBsYXllZCBvdXQgYmVmb3JlIGFueSBsYXlvdXQgZnVuY3Rpb25zIGFyZSBhcHBsaWVkXG5AcGFyYW0gb3JpZ2luYWxIZWlnaHQge051bWJlcn0gdGhlIG9yaWdpbmFsIGhlaWdodCBvZiB0aGUgaXRlbSBiZWluZyBsYXllZCBvdXQgYmVmb3JlIGFueSBsYXlvdXQgZnVuY3Rpb25zIGFyZSBhcHBsaWVkXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmhlaWdodElzUHJvcG9ydGlvbmFsID0gZnVuY3Rpb24oIG9yaWdpbmFsV2lkdGgsIG9yaWdpbmFsSGVpZ2h0ICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGhlaWdodElzUHJvcG9ydGlvbmFsLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfSEVJR0hUICk7XG59XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgc2V0IHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoaXMgTGF5b3V0Tm9kZSB0byBtYXRjaCB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgbWF0Y2hlc1NpemVPZlxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gaXMgYSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbWF0Y2ggaW4gc2l6ZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXRjaGVzU2l6ZU9mID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF0Y2hlc1NpemVPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XG59XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgc2V0IHRoZSB3aWR0aCBvZiB0aGlzIExheW91dE5vZGUgdG8gbWF0Y2ggdGhlIHdpZHRoIG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbi5cblxuQG1ldGhvZCBtYXRjaGVzV2lkdGhPZlxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gaXMgYSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbWF0Y2ggaW4gd2lkdGhcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF0Y2hlc1dpZHRoT2YgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXRjaGVzV2lkdGhPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX1dJRFRIICk7XG59XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgc2V0IHRoZSBoZWlnaHQgb2YgdGhpcyBMYXlvdXROb2RlIHRvIG1hdGNoIHRoZSBoZWlnaHQgb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluLlxuXG5AbWV0aG9kIG1hdGNoZXNIZWlnaHRPZlxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gaXMgYSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbWF0Y2ggaW4gaGVpZ2h0XG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1hdGNoZXNIZWlnaHRPZiA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1hdGNoZXNIZWlnaHRPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGlzIExheW91dE5vZGUgdG8gYmUgYSBwZXJjZW50YWdlIG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbi5cblxuU28gZm9yIGluc3RhbmNlIGlmIHRoZSBMYXlvdXROb2RlIHdlJ3JlIHBhc3NpbmcgaW4gaXMgNDAweDIwMCBhZnRlciBhbGwgcnVsZXMgaGF2ZSBiZWVuIGFwcGxpZWQgYW5kIFxud2Ugc2F5IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgMC41IG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aGlzIExheW91dE5vZGUncyBzaXplIHdpbGwgYmUgMjAweDEwMCBvciA1MCUgb2YgNDAweDIwMC5cblxuQG1ldGhvZCBzaXplSXNBUGVyY2VudGFnZU9mXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gdGhlIExheW91dE5vZGUgdGhhdCB0aGlzIExheW91dE5vZGUgd2lsbCBzZXQgaXQncyB3aWR0aCBhbmQgaGVpZ2h0IGZyb21cbkBwYXJhbSBwZXJjZW50YWdlIHtOdW1iZXJ9IGEgcGVyY2VudGFnZSB2YWx1ZSBpbiBkZWNpbWFsIHRoYXQgc3RhdGVzIGhvdyBiaWcgdGhpcyBMYXlvdXROb2RlIHNob3VsZCBiZSBiYXNlZCBvbiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuc2l6ZUlzQVBlcmNlbnRhZ2VPZiA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHNpemVJc0FQZXJjZW50YWdlT2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgd2lkdGggb2YgdGhpcyBMYXlvdXROb2RlIHRvIGJlIGEgcGVyY2VudGFnZSBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4uXG5cblNvIGZvciBpbnN0YW5jZSBpZiB0aGUgTGF5b3V0Tm9kZSB3ZSdyZSBwYXNzaW5nIGluIGlzIDQwMHgyMDAgYWZ0ZXIgYWxsIHJ1bGVzIGhhdmUgYmVlbiBhcHBsaWVkIGFuZCBcbndlIHNheSB0aGlzIExheW91dE5vZGUncyB3aWR0aCBzaG91bGQgYmUgMC41IG9mIHRoZSB3aWR0aCBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4uIFRoaXMgTGF5b3V0Tm9kZSdzIHdpZHRoIHdpbGwgYmUgXG4yMDBweCBvciA1MCUgb2YgNDAwcHguXG5cbkBtZXRob2Qgd2lkdGhJc0FQZXJjZW50YWdlT2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSB0aGUgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIHNldCBpdCdzIHdpZHRoIGZyb21cbkBwYXJhbSBwZXJjZW50YWdlIHtOdW1iZXJ9IGEgcGVyY2VudGFnZSB2YWx1ZSBpbiBkZWNpbWFsIHRoYXQgc3RhdGVzIGhvdyB3aWRlIHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgYmFzZWQgb24gdGhlIExheW91dE5vZGUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLndpZHRoSXNBUGVyY2VudGFnZU9mID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgd2lkdGhJc0FQZXJjZW50YWdlT2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgaGVpZ2h0IG9mIHRoaXMgTGF5b3V0Tm9kZSB0byBiZSBhIHBlcmNlbnRhZ2Ugb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluLlxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgdGhlIExheW91dE5vZGUgd2UncmUgcGFzc2luZyBpbiBpcyA0MDB4MjAwIGFmdGVyIGFsbCBydWxlcyBoYXZlIGJlZW4gYXBwbGllZCBhbmQgXG53ZSBzYXkgdGhpcyBMYXlvdXROb2RlJ3MgaGVpZ2h0IHNob3VsZCBiZSAwLjUgb2YgdGhlIGhlaWdodCBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4uIFRoaXMgTGF5b3V0Tm9kZSdzIGhlaWdodCB3aWxsIGJlIFxuMTAwcHggb3IgNTAlIG9mIDIwMHB4LlxuXG5AbWV0aG9kIGhlaWdodElzQVBlcmNlbnRhZ2VPZlxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IHRoZSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgc2V0IGl0J3MgaGVpZ2h0IGZyb21cbkBwYXJhbSBwZXJjZW50YWdlIHtOdW1iZXJ9IGEgcGVyY2VudGFnZSB2YWx1ZSBpbiBkZWNpbWFsIHRoYXQgc3RhdGVzIGhvdyB0YWxsIHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgYmFzZWQgb24gdGhlIExheW91dE5vZGUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmhlaWdodElzQVBlcmNlbnRhZ2VPZiA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGhlaWdodElzQVBlcmNlbnRhZ2VPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xufVxuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLU9GRlNFVCBGVU5DVElPTlMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKipcbnBsdXMgaXMgYW4gb2Zmc2V0IGZ1bmN0aW9uLiBPZmZzZXQgZnVuY3Rpb25zIHdpbGwgb2Zmc2V0IHRoZSBwcm9wZXJ0eSBwcmV2aW91c2x5IGVmZmVjdGVkLlxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgd2UgZGlkOlxuXG5cdG5vZGUud2lkdGhJcyggMjAwICkucGx1cyggMTAgKTtcblxuVGhlbiB0aGUgd2lkdGggb2YgdGhpcyBMYXlvdXROb2RlIHdvdWxkIGJlIDIxMHB4LiBIb3dldmVyIGlmIHdlIGRvOlxuXG5cdG5vZGUueUlzKCAxMDAgKS5wbHVzKCAzMCApO1xuXG5UaGVuIHRoZSB5IHBvc2l0aW9uIG9mIHRoaXMgTGF5b3V0Tm9kZSB3b3VsZCBiZSBhdCAxMzBweC5cblxuQXMgeW91IGNhbiBzZWUgcGx1cycgY29udGV4dCB3aWxsIGNoYW5nZSBiYXNlZCBvbiB0aGUgdHlwZSBvZiBydWxlIGFwcGxpZWQgcHJldmlvdXNseS5cblxuUGx1cyBpcyBoYW5keSBmb3Igd2hlbiBhIGRlc2lnbmVyIHNhaXMgXCJDYW4geW91IG1vdmUgdGhpcyBvdmVyIGJ5IFggcGl4ZWxzXCIuXG5cbkBtZXRob2QgcGx1c1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5wbHVzID0gZnVuY3Rpb24oKSB7XG5cblx0c3dpdGNoKCB0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkICkge1xuXG5cdFx0Y2FzZSBTSVpFOlxuXHRcdGNhc2UgQk9VTkRfU0laRTpcblxuXHRcdFx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcblxuXHRcdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzU2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XHRcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdlBsdXNTaXplLCBbIGFyZ3VtZW50c1sgMCBdLCBhcmd1bWVudHNbIDAgXSBdLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XHRcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDIgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2UGx1c1NpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1x0XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRoaXMuZG9Ob3RSZWFkV2lkdGggPSB0cnVlO1xuXHRcdFx0dGhpcy5kb05vdFJlYWRIZWlnaHQgPSB0cnVlO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTSVpFX1dJRFRIOlxuXHRcdGNhc2UgQk9VTkRfU0laRV9XSURUSDpcblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzV2lkdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZQbHVzV2lkdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRvTm90UmVhZFdpZHRoID0gdHJ1ZTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgU0laRV9IRUlHSFQ6XG5cdFx0Y2FzZSBCT1VORF9TSVpFX0hFSUdIVDpcblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzSGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfSEVJR0hUICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdlBsdXNIZWlnaHQsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9IRUlHSFQgKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kb05vdFJlYWRIZWlnaHQgPSB0cnVlO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OOlxuXHRcdFx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcblxuXHRcdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzUG9zaXRpb24sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZQbHVzUG9zaXRpb24sIFsgYXJndW1lbnRzWyAwIF0sIGFyZ3VtZW50c1sgMCBdIF0sIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMiApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZQbHVzUG9zaXRpb24sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRicmVhaztcblxuXHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1g6XG5cdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c1gsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2UGx1c1gsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcblx0XHRcdH1cblx0XHRicmVhaztcblxuXHRcdGNhc2UgUE9TSVRJT05fWTpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1k6XG5cdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c1ksIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2UGx1c1ksIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcblx0XHRcdH1cblx0XHRicmVhaztcblxuXHRcdGNhc2UgbnVsbDpcblxuXHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHBsdXNTaXplLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkUgKTtcblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzUG9zaXRpb24sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgPSBudWxsO1xuXHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbm1pbnVzIGlzIGFuIG9mZnNldCBmdW5jdGlvbi4gT2Zmc2V0IGZ1bmN0aW9ucyB3aWxsIG9mZnNldCB0aGUgcHJvcGVydHkgcHJldmlvdXNseSBlZmZlY3RlZC5cblxuU28gZm9yIGluc3RhbmNlIGlmIHdlIGRpZDpcblxuXHRub2RlLndpZHRoSXMoIDIwMCApLm1pbnVzKCAxMCApO1xuXG5UaGVuIHRoZSB3aWR0aCBvZiB0aGlzIExheW91dE5vZGUgd291bGQgYmUgMTkwcHguIEhvd2V2ZXIgaWYgd2UgZG86XG5cblx0bm9kZS55SXMoIDEwMCApLm1pbnVzKCAzMCApO1xuXG5UaGVuIHRoZSB5IHBvc2l0aW9uIG9mIHRoaXMgTGF5b3V0Tm9kZSB3b3VsZCBiZSBhdCA3MHB4LlxuXG5BcyB5b3UgY2FuIHNlZSBtaW51cycgY29udGV4dCB3aWxsIGNoYW5nZSBiYXNlZCBvbiB0aGUgdHlwZSBvZiBydWxlIGFwcGxpZWQgcHJldmlvdXNseS5cblxuTWludXMgaXMgaGFuZHkgZm9yIHdoZW4gYSBkZXNpZ25lciBzYWlzIFwiQ2FuIHlvdSBtb3ZlIHRoaXMgb3ZlciBieSBYIHBpeGVsc1wiLlxuXG5AbWV0aG9kIG1pbnVzXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1pbnVzID0gZnVuY3Rpb24oKSB7XG5cblx0c3dpdGNoKCB0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkICkge1xuXG5cdFx0Y2FzZSBTSVpFOlxuXHRcdGNhc2UgQk9VTkRfU0laRTpcblxuXHRcdFx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcblxuXHRcdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtaW51c1NpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2TWludXNTaXplLCBbIGFyZ3VtZW50c1sgMCBdLCBhcmd1bWVudHNbIDAgXSBdLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiggYXJndW1lbnRzLmxlbmd0aCA9PSAyICkge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdk1pbnVzU2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRoaXMuZG9Ob3RSZWFkV2lkdGggPSB0cnVlO1xuXHRcdFx0dGhpcy5kb05vdFJlYWRIZWlnaHQgPSB0cnVlO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTSVpFX1dJRFRIOlxuXHRcdGNhc2UgQk9VTkRfU0laRV9XSURUSDpcblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtaW51c1dpZHRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfV0lEVEggKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2TWludXNXaWR0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX1dJRFRIICk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZG9Ob3RSZWFkV2lkdGggPSB0cnVlO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTSVpFX0hFSUdIVDpcblx0XHRjYXNlIEJPVU5EX1NJWkVfSEVJR0hUOlxuXHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbnVzSGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfSEVJR0hUICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdk1pbnVzSGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfSEVJR0hUICk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmRvTm90UmVhZEhlaWdodCA9IHRydWU7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFBPU0lUSU9OOlxuXHRcdGNhc2UgQk9VTkRfUE9TSVRJT046XG5cblx0XHRcdGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDEgKSB7XG5cblx0XHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWludXNQb3NpdGlvbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT04gKTtcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdk1pbnVzUG9zaXRpb24sIFsgYXJndW1lbnRzWyAwIF0sIGFyZ3VtZW50c1sgMCBdIF0sIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMiApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZNaW51c1Bvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xuXHRcdFx0fVxuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTl9YOlxuXHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWDpcblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtaW51c1gsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2TWludXNYLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFBPU0lUSU9OX1k6XG5cdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9ZOlxuXHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbnVzWSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZNaW51c1ksIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcblx0XHRcdH1cblx0XHRicmVhaztcblxuXHRcdGNhc2UgbnVsbDpcblxuXHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbnVzU2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWludXNQb3NpdGlvbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT04gKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IG51bGw7XG5cdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tQk9VTkQgRlVOQ1RJT05TLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKipcbm1heFNpemUgaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHRocmVlIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhTaXplLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTEuc2l6ZUlzKCAyMDAsIDEwMCApO1xuXHRub2RlMi5zaXplSXMoIDMwMCwgMzAwICkubWF4U2l6ZSggbm9kZTEgKTtcblxuV2hlbiBydW4gbm9kZTIncyB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgMjAweDEwMCBub3QgMzAweDMwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuXG5ub2RlMS5cblxuQG1ldGhvZCBtYXhTaXplXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gdGhpcyBMYXlvdXROb2RlIHdpbGwgYWx3YXlzIGJlIGxhcmdlciBvciB0aGUgc2FtZSBzaXplIGFzIHRoZSBMYXlvdXROb2RlIHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uXG5AY2hhaW5hYmxlXG4qKi9cblxuLyoqXG5tYXhTaXplIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWF4U2l6ZS4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiB3aWR0aCBhbmQgaGVpZ2h0IHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMi5zaXplSXMoIDMwMCwgMzAwICkubWF4U2l6ZSggMjAwLCAxMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgMjAweDEwMCBub3QgMzAweDMwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuXG4yMDB4MTAwLlxuXG5AbWV0aG9kIG1heFNpemVcbkBwYXJhbSB3aWR0aCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIHdpZHRoIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIGhlaWdodCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1heFNpemUgaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHRocmVlIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhTaXplLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgc2l6ZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIuc2l6ZUlzKCAzMDAsIDMwMCApLm1heFNpemUoIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHdpZHRoIGFuZCBoZWlnaHQgd2lsbCBiZSAyMDB4MjAwIG5vdCAzMDB4MzAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbjIwMHgyMDAuXG5cbkBtZXRob2QgbWF4U2l6ZVxuQHBhcmFtIHNpemUge051bWJlcn0gdGhlIExheW91dE5vZGUncyB3aWR0aCBhbmQgaGVpZ2h0IHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXhTaXplID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFNpemVGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XHRcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFNpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkUgKTtcblx0fVxufTtcblxuXG5cblxuLyoqXG5tYXhXaWR0aCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhXaWR0aC4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgdGhhdCB0aGlzIExheW91dE5vZGUncyB3aWR0aCB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTEud2lkdGhJcyggMjAwICk7XG5cdG5vZGUyLndpZHRoSXMoIDMwMCApLm1heFdpZHRoKCBub2RlMSApO1xuXG5XaGVuIHJ1biBpbiB0aGUgZW5kIG5vZGUyJ3Mgd2lkdGggd2lsbCBiZSAyMDBweCBub3QgMzAwcHggYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgdGhhblxubm9kZTEuXG5cbkBtZXRob2QgbWF4V2lkdGhcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSB0aGlzIExheW91dE5vZGUgd2lsbCBhbHdheXMgYmUgbGFyZ2VyIG9yIHRoZSBzYW1lIHNpemUgYXMgdGhlIExheW91dE5vZGUgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb25cbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1heFdpZHRoIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1heFdpZHRoLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIHdpZHRoIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMi53aWR0aElzKCAzMDAgKS5tYXhXaWR0aCggMjAwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3Mgd2lkdGggd2lsbCBiZSAyMDBweCBub3QgMzAwcHggYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgdGhhblxuMjAwcHguXG5cbkBtZXRob2QgbWF4V2lkdGhcbkBwYXJhbSB3aWR0aCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIHdpZHRoIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIGhlaWdodCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF4V2lkdGggPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4V2lkdGhGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XHRcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFdpZHRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XHRcblx0fVxufTtcblxuXG5cblxuLyoqXG5tYXhIZWlnaHQgaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWF4SGVpZ2h0LiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSdzIHdpZHRoIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMS5oZWlnaHRJcyggMjAwICk7XG5cdG5vZGUyLmhlaWdodElzKCAzMDAgKS5tYXhIZWlnaHQoIG5vZGUxICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgaGVpZ2h0IHdpbGwgYmUgMjAwcHggbm90IDMwMHB4IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbm5vZGUxLlxuXG5AbWV0aG9kIG1heEhlaWdodFxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIGFsd2F5cyBiZSBsYXJnZXIgb3IgdGhlIHNhbWUgc2l6ZSBhcyB0aGUgTGF5b3V0Tm9kZSB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvblxuQGNoYWluYWJsZVxuKiovXG5cbi8qKlxubWF4SGVpZ2h0IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1heEhlaWdodC4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiB3aWR0aCB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIuaGVpZ2h0SXMoIDMwMCApLm1heEhlaWdodCggMjAwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgaGVpZ2h0IHdpbGwgYmUgMjAwcHggbm90IDMwMHB4IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbjIwMHB4LlxuXG5AbWV0aG9kIG1heEhlaWdodFxuQHBhcmFtIHdpZHRoIHtOdW1iZXJ9IHRoZSBMYXlvdXROb2RlJ3Mgd2lkdGggdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuIHRoaXMgdmFsdWUgcGFzc2VkIGluXG5AcGFyYW0gaGVpZ2h0IHtOdW1iZXJ9IHRoZSBMYXlvdXROb2RlJ3MgaGVpZ2h0IHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXhIZWlnaHQgPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4SGVpZ2h0RnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9IRUlHSFQgKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heEhlaWdodCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9IRUlHSFQgKTtcblx0fVxufTtcblxuXG5cbi8qKlxubWluU2l6ZSBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdGhyZWUgZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pblNpemUuIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMS5zaXplSXMoIDIwMCwgMTAwICk7XG5cdG5vZGUyLnNpemVJcyggNTAsIDUwICkubWluU2l6ZSggbm9kZTEgKTtcblxuV2hlbiBydW4gbm9kZTIncyB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgMjAweDEwMCBub3QgNTB4NTAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgdGhhblxubm9kZTEuXG5cbkBtZXRob2QgbWluU2l6ZVxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IHRoaXMgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgcnVsZSBpcyBhcHBsaWVkIHRvIHdpbGwgbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoYW4gdGhpcyBMYXlvdXROb2RlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5cbi8qKlxubWluU2l6ZSBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdGhyZWUgZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pblNpemUuIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gd2lkdGggYW5kIGhlaWdodCB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIuc2l6ZUlzKCA1MCwgNTAgKS5taW5TaXplKCAyMDAsIDEwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHdpZHRoIGFuZCBoZWlnaHQgd2lsbCBiZSAyMDB4MTAwIG5vdCAzMDB4MzAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbjIwMHgxMDAuXG5cbkBtZXRob2QgbWluU2l6ZVxuQHBhcmFtIHdpZHRoIHtOdW1iZXJ9IHRoZSBMYXlvdXROb2RlJ3Mgd2lkdGggdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIGhlaWdodCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoaXMgdmFsdWUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cblxuLyoqXG5taW5TaXplIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWluU2l6ZS4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIHNpemUgdGhhdCB0aGlzIExheW91dE5vZGUgd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUyLnNpemVJcyggMTAwLCA1MCApLm1pblNpemUoIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHdpZHRoIGFuZCBoZWlnaHQgd2lsbCBiZSAyMDB4MjAwIG5vdCAxMDB4NTAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBzbWFsbGVyIHRoYW5cbjIwMHgyMDAuXG5cbkBtZXRob2QgbWluU2l6ZVxuQHBhcmFtIHNpemUge051bWJlcn0gdGhlIExheW91dE5vZGUncyB3aWR0aCBhbmQgaGVpZ2h0IHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBzbWFsbGVyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWluU2l6ZSA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5TaXplRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRSApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluU2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRSApO1xuXHR9XG59O1xuXG5cblxuXG4vKipcbm1pbldpZHRoIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pbldpZHRoLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSdzIHdpZHRoIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMS53aWR0aElzKCAyMDAgKTtcblx0bm9kZTIud2lkdGhJcyggNTAgKS5taW5XaWR0aCggbm9kZTEgKTtcblxuV2hlbiBydW4gbm9kZTIncyB3aWR0aCB3aWxsIGJlIDIwMHB4IG5vdCA1MHB4IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW4gbm9kZTEuXG5cbkBtZXRob2QgbWluV2lkdGhcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSB0aGUgd2lkdGggb2YgdGhlIG5vZGUgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuIHRoZSB3aWR0aCBvZiB0aGlzIG5vZGUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbi8qKlxubWluV2lkdGggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWluV2lkdGguIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSB3aWR0aCB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIud2lkdGhJcyggMTAwICkubWluV2lkdGgoIDUwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3Mgd2lkdGggd2lsbCBiZSA1MHB4IG5vdCAxMDBweCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuIDUwcHguXG5cbkBtZXRob2QgbWluV2lkdGhcbkBwYXJhbSBzaXplIHtOdW1iZXJ9IHRoZSBMYXlvdXROb2RlJ3Mgd2lkdGggdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5taW5XaWR0aCA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5XaWR0aEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfV0lEVEggKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbldpZHRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XG5cdH1cbn07XG5cblxuXG5cbi8qKlxubWluSGVpZ2h0IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pbkhlaWdodC4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgdGhhdCB0aGlzIExheW91dE5vZGUncyBoZWlnaHQgd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUxLmhlaWdodElzKCAyMDAgKTtcblx0bm9kZTIuaGVpZ2h0SXMoIDUwICkubWluSGVpZ2h0KCBub2RlMSApO1xuXG5XaGVuIHJ1biBub2RlMidzIGhlaWdodCB3aWxsIGJlIDIwMHB4IG5vdCA1MHB4IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW4gbm9kZTEuXG5cbkBtZXRob2QgbWluSGVpZ2h0XG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gdGhlIGhlaWdodCBvZiB0aGUgbm9kZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhlIGhlaWdodCBvZiB0aGlzIG5vZGUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbi8qKlxubWluSGVpZ2h0IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pbkhlaWdodC4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIGhlaWdodCB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIuaGVpZ2h0SXMoIDEwMCApLm1pbkhlaWdodCggNTAgKTtcblxuV2hlbiBydW4gbm9kZTIncyBoZWlnaHQgd2lsbCBiZSA1MHB4IG5vdCAxMDBweCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuIDUwcHguXG5cbkBtZXRob2QgbWluSGVpZ2h0XG5AcGFyYW0gc2l6ZSB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIGhlaWdodCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoaXMgdmFsdWUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1pbkhlaWdodCA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5IZWlnaHRGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX0hFSUdIVCApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluSGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX0hFSUdIVCApO1xuXHR9XG59O1xuXG5cblxuXG5cbi8qKlxubWF4UG9zaXRpb24gaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHRocmVlIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhQb3NpdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUuIFRoaXMgTGF5b3V0Tm9kZSdzIHBvc2l0aW9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhlIHBvc2l0aW9uIG9mIHRoZSBwYXNzZWQgbm9kZS5cblxuXHRub2RlMS5wb3NpdGlvbklzKCAzMDAsIDIwMCApO1xuXHRub2RlMi5wb3NpdGlvbklzKCA0MDAsIDQwMCApLm1heFBvc2l0aW9uKCBub2RlMSApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggYW5kIHkgd2lsbCBiZSAyMDAgYW5kIDEwMCBub3QgeCAzMDAgYW5kIHkgMjAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB4IGFuZCB5IHRvIG5vdCBiZSBsYXJnZXIgdGhhblxubm9kZTEncyB4IGFuZCB5LlxuXG5AbWV0aG9kIG1heFBvc2l0aW9uXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gdGhpcyBwYXNzZWQgaW4gTGF5b3V0Tm9kZSdzIHggYW5kIHkgcG9zaXRpb24gd2lsbCBiZSBiZSB0aGUgbWF4aW11bSB4IGFuZCB5IHBvc2l0aW9uIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1heFBvc2l0aW9uIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWF4UG9zaXRpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBtYXhpbXVtIHggYW5kIHkgcG9zaXRpb24gZm9yIHRoaXMgbm9kZS5cblxuXHRub2RlMi5wb3NpdGlvbklzKCAzMDAsIDMwMCApLm1heFBvc2l0aW9uKCAyMDAsIDEwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggYW5kIHkgd2lsbCBiZSB4IDIwMCBhbmQgeSAxMDAgbm90IHggMzAwIGFuZCB5IDMwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgeCBhbmQgeSB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbnggMjAwIGFuZCB5IDEwMC5cblxuQG1ldGhvZCBtYXhQb3NpdGlvblxuQHBhcmFtIHgge051bWJlcn0gdGhlIG1heGltdW0geCB2YWx1ZSBmb3IgdGhpcyBub2RlJ3MgeCB2YWx1ZVxuQHBhcmFtIHkge051bWJlcn0gdGhlIG1heGltdW0geSB2YWx1ZSBmb3IgdGhpcyBub2RlJ3MgeSB2YWx1ZVxuQGNoYWluYWJsZVxuKiovXG5cbi8qKlxubWF4UG9zaXRpb24gaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHRocmVlIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhQb3NpdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIHZhbHVlIHRoYXQgdGhpcyBMYXlvdXROb2RlJ3MgeCBhbmQgeSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIucG9zaXRpb25JcyggMzAwLCA0MDAgKS5tYXhQb3NpdGlvbiggMjAwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3Mgd2lkdGggYW5kIGhlaWdodCB3aWxsIGJlIDIwMHgyMDAgbm90IDMwMHg0MDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgeFxuMjAwIGFuZCB5IDIwMC5cblxuQG1ldGhvZCBtYXhQb3NpdGlvblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IHRoZSBtYXhpbXVtIHggYW5kIHkgdmFsdWUgZm9yIHRoaXMgbm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXhQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhQb3NpdGlvbkZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4UG9zaXRpb24sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9XG59O1xuXG5cblxuXG4vKipcbmxlZnRNYXggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSBmcm9tIHdoaWNoIHRoaXMgbm9kZSdzIG1heGltdW0geCB2YWx1ZSB3aWxsIGJlIHJlYWQgZnJvbS5cblxuXHRub2RlMS54SXMoIDIwMCApO1xuXHRub2RlMi54SXMoIDQwMCApLmxlZnRNYXgoIG5vZGUxICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgeCB2YWx1ZSB3aWxsIGJlIDIwMCBhbmQgbm90IDQwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm9kZTEncyB4IHZhbHVlLlxuXG5AbWV0aG9kIGxlZnRNYXhcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSBUaGUgTGF5b3V0Tm9kZSB3aG9zZSB4IHZhbHVlIHdpbGwgYmUgdGhlIG1heGltdW0geCB2YWx1ZSBmb3IgdGhpcyBub2RlXG5AY2hhaW5hYmxlXG4qKi9cbi8qKlxubGVmdE1heCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIHBvc3NpYmxlIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYW4geCB2YWx1ZSBmcm9tIHdoaWNoIHRoaXMgbm9kZSdzIG1heGltdW0geCB2YWx1ZSB3aWxsIGJlIHNldC5cblxuXHRub2RlMi54SXMoIDQwMCApLmxlZnRNYXgoIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggdmFsdWUgd2lsbCBiZSAyMDAgYW5kIG5vdCA0MDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIHRoZSB4IHZhbHVlIDIwMC5cblxuQG1ldGhvZCBsZWZ0TWF4XG5AcGFyYW0geCB7TnVtYmVyfSBUaGUgbWF4aW11bSB4IHZhbHVlIGZvciB0aGlzIExheW91dE5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubGVmdE1heCA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBsZWZ0TWF4RnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBsZWZ0TWF4LCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fVxufTtcblxuXG5cblxuXG4vKipcbnRvcE1heCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIHBvc3NpYmxlIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBMYXlvdXROb2RlIGZyb20gd2hpY2ggdGhpcyBub2RlJ3MgbWF4aW11bSB5IHZhbHVlIHdpbGwgYmUgcmVhZCBmcm9tLlxuXG5cdG5vZGUxLnlJcyggMjAwICk7XG5cdG5vZGUyLnlJcyggNDAwICkudG9wTWF4KCBub2RlMSApO1xuXG5XaGVuIHJ1biBub2RlMidzIHkgdmFsdWUgd2lsbCBiZSAyMDAgYW5kIG5vdCA0MDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vZGUxJ3MgeSB2YWx1ZS5cblxuQG1ldGhvZCB0b3BNYXhcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSBUaGUgTGF5b3V0Tm9kZSB3aG9zZSB5IHZhbHVlIHdpbGwgYmUgdGhlIG1heGltdW0geSB2YWx1ZSBmb3IgdGhpcyBub2RlXG5AY2hhaW5hYmxlXG4qKi9cbi8qKlxudG9wTWF4IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhbiB5IHZhbHVlIGZyb20gd2hpY2ggdGhpcyBub2RlJ3MgbWF4aW11bSB5IHZhbHVlIHdpbGwgYmUgc2V0LlxuXG5cdG5vZGUyLnlJcyggNDAwICkudG9wTWF4KCAyMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB4IHZhbHVlIHdpbGwgYmUgMjAwIGFuZCBub3QgNDAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byB0aGUgeSB2YWx1ZSAyMDAuXG5cbkBtZXRob2QgdG9wTWF4XG5AcGFyYW0geSB7TnVtYmVyfSBUaGUgbWF4aW11bSB5IHZhbHVlIGZvciB0aGlzIExheW91dE5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUudG9wTWF4ID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHRvcE1heEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgdG9wTWF4LCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fVxufTtcblxuXG5cblxuXG4vKipcbm1pblBvc2l0aW9uIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWluUG9zaXRpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBMYXlvdXROb2RlLiBUaGlzIExheW91dE5vZGUncyBwb3NpdGlvbiB3aWxsIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGUgcG9zaXRpb24gb2YgdGhlIHBhc3NlZCBub2RlLlxuXG5cdG5vZGUxLnBvc2l0aW9uSXMoIDMwMCwgMjAwICk7XG5cdG5vZGUyLnBvc2l0aW9uSXMoIDEwMCwgMTAwICkubWluUG9zaXRpb24oIG5vZGUxICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgeCBhbmQgeSB3aWxsIGJlIDMwMCBhbmQgMjAwIG5vdCB4IDEwMCBhbmQgeSAxMDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHggYW5kIHkgdG8gbm90IGJlIHNtYWxsZXIgdGhhblxubm9kZTEncyB4IGFuZCB5LlxuXG5AbWV0aG9kIG1pblBvc2l0aW9uXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gdGhpcyBwYXNzZWQgaW4gTGF5b3V0Tm9kZSdzIHggYW5kIHkgcG9zaXRpb24gd2lsbCBiZSBiZSB0aGUgbWluaW11bSB4IGFuZCB5IHBvc2l0aW9uIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1pblBvc2l0aW9uIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWluUG9zaXRpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBtaW5pbXVtIHggYW5kIHkgcG9zaXRpb24gZm9yIHRoaXMgbm9kZS5cblxuXHRub2RlMi5wb3NpdGlvbklzKCAxMDAsIDEwMCApLm1pblBvc2l0aW9uKCAyMDAsIDEwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggYW5kIHkgd2lsbCBiZSB4IDIwMCBhbmQgeSAxMDAgbm90IHggMTAwIGFuZCB5IDEwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgeCBhbmQgeSB0byBub3QgYmUgc21hbGxlciB0aGFuXG54IDIwMCBhbmQgeSAxMDAuXG5cbkBtZXRob2QgbWluUG9zaXRpb25cbkBwYXJhbSB4IHtOdW1iZXJ9IHRoZSBtaW5pbXVtIHggdmFsdWUgZm9yIHRoaXMgbm9kZSdzIHggdmFsdWVcbkBwYXJhbSB5IHtOdW1iZXJ9IHRoZSBtaW5pbXVtIHkgdmFsdWUgZm9yIHRoaXMgbm9kZSdzIHkgdmFsdWVcbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1pblBvc2l0aW9uIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWluUG9zaXRpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSB2YWx1ZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSdzIHggYW5kIHkgd2lsbCBuZXZlciBiZSBzbWFsbGVyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMi5wb3NpdGlvbklzKCAxMDAsIDUwICkubWluUG9zaXRpb24oIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggYW5kIHkgd2lsbCBiZSB4IDIwMCBhbmQgeSAyMDAgbm90IDEwMCB4IGFuZCA1MCB5IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgc21hbGxlciB0aGFuIHhcbjIwMCBhbmQgeSAyMDAuXG5cbkBtZXRob2QgbWluUG9zaXRpb25cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSB0aGUgbWluaW11bSB4IGFuZCB5IHZhbHVlIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWluUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluUG9zaXRpb25Gcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pblBvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fVxufTtcblxuXG5cblxuLyoqXG5sZWZ0TWluIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgZnJvbSB3aGljaCB0aGlzIG5vZGUncyBtaW5pbXVtIHggdmFsdWUgd2lsbCBiZSByZWFkIGZyb20uXG5cblx0bm9kZTEueElzKCAyMDAgKTtcblx0bm9kZTIueElzKCAxMDAgKS5sZWZ0TWluKCBub2RlMSApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggdmFsdWUgd2lsbCBiZSAyMDAgYW5kIG5vdCAxMDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vZGUxJ3MgeCB2YWx1ZS5cblxuQG1ldGhvZCBsZWZ0TWluXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gVGhlIExheW91dE5vZGUgd2hvc2UgeCB2YWx1ZSB3aWxsIGJlIHRoZSBtaW5pbXVtIHggdmFsdWUgZm9yIHRoaXMgbm9kZVxuQGNoYWluYWJsZVxuKiovXG4vKipcbmxlZnRNaW4gaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGFuIHggdmFsdWUgZnJvbSB3aGljaCB0aGlzIG5vZGUncyBtaW5pbXVtIHggdmFsdWUgd2lsbCBiZSBzZXQuXG5cblx0bm9kZTIueElzKCAxMDAgKS5sZWZ0TWluKCAyMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB4IHZhbHVlIHdpbGwgYmUgMjAwIGFuZCBub3QgMTAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byB0aGUgeCB2YWx1ZSAyMDAuXG5cbkBtZXRob2QgbGVmdE1pblxuQHBhcmFtIHgge051bWJlcn0gVGhlIG1pbmltdW0geCB2YWx1ZSBmb3IgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmxlZnRNaW4gPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbGVmdE1pbkZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbGVmdE1pbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH1cbn07XG5cblxuXG5cblxuLyoqXG50b3BNaW4gaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSBmcm9tIHdoaWNoIHRoaXMgbm9kZSdzIG1pbmltdW0geSB2YWx1ZSB3aWxsIGJlIHJlYWQgZnJvbS5cblxuXHRub2RlMS55SXMoIDIwMCApO1xuXHRub2RlMi55SXMoIDEwMCApLnRvcE1pbiggbm9kZTEgKTtcblxuV2hlbiBydW4gbm9kZTIncyB5IHZhbHVlIHdpbGwgYmUgMjAwIGFuZCBub3QgMTAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub2RlMSdzIHkgdmFsdWUuXG5cbkBtZXRob2QgdG9wTWluXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gVGhlIExheW91dE5vZGUgd2hvc2UgeSB2YWx1ZSB3aWxsIGJlIHRoZSBtaW5pbXVtIHkgdmFsdWUgZm9yIHRoaXMgbm9kZVxuQGNoYWluYWJsZVxuKiovXG4vKipcbnRvcE1pbiBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIHBvc3NpYmxlIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYW4geSB2YWx1ZSBmcm9tIHdoaWNoIHRoaXMgbm9kZSdzIG1pbmltdW0geSB2YWx1ZSB3aWxsIGJlIHNldC5cblxuXHRub2RlMi55SXMoIDEwMCApLnRvcE1pbiggMjAwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgeSB2YWx1ZSB3aWxsIGJlIDIwMCBhbmQgbm90IDEwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gdGhlIHkgdmFsdWUgMjAwLlxuXG5AbWV0aG9kIHRvcE1pblxuQHBhcmFtIHkge051bWJlcn0gVGhlIG1pbmltdW0geSB2YWx1ZSBmb3IgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnRvcE1pbiA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB0b3BNaW5Gcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHRvcE1pbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH1cbn07XG5cblxuLyoqXG5ib3R0b21NYXggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuSGVyZSBpcyBhbiBleGFtcGxlIHVzYWdlIG9mIGJvdHRvbU1heDpcblxuXHRub2RlMS5oZWlnaHRJcyggMTAwICkueUlzKCA1MCApO1xuXHRub2RlMi5oZWlnaHRJcyggMTAwICkueUlzKCAxMDAgKS5ib3R0b21NYXgoIG5vZGUxICk7XG5cbklmIHdlIGV2YWx1YXRlZCB0aGUgYWJvdmUgbm9kZTIncyB5IHZhbHVlIHdvdWxkIGJlIDUwIGFuZCBub3QgMTAwLiBUaGlzIGlzIGJlY2F1c2UgdGhlIG1heGltdW0gdmFsdWUgZm9yIHRoZSBib3R0b20gb2Zcbm5vZGUyIGlzIHRoZSB5IHBvc2l0aW9uIG9mIG5vZGUxIHBsdXMgaXRzIGhlaWdodCAobm9kZTEueSArIG5vZGUxLmhlaWdodCkuXG5cblxuQG1ldGhvZCBib3R0b21NYXhcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSBUaGUgTGF5b3V0Tm9kZSB3aG9zZSBib3R0b20gKCB5ICsgaGVpZ2h0ICkgdmFsdWUgd2lsbCBiZSB0aGUgbWF4aW11bSBib3R0b20gdmFsdWUgZm9yIHRoaXMgbm9kZVxuQGNoYWluYWJsZVxuKiovXG4vKipcbmJvdHRvbU1heCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIHBvc3NpYmxlIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5IZXJlIGlzIGFuIGV4YW1wbGUgdXNhZ2Ugb2YgYm90dG9tTWF4OlxuXG5cdG5vZGUyLmhlaWdodElzKCAxMDAgKS55SXMoIDIwMCApLmJvdHRvbU1heCggMjAwICk7XG5cbklmIHdlIGV2YWx1YXRlZCB0aGUgYWJvdmUgbm9kZTIncyB5IHZhbHVlIHdvdWxkIGJlIDEwMCBhbmQgbm90IDIwMC4gVGhpcyBpcyBiZWNhdXNlIHRoZSBtYXhpbXVtIHZhbHVlIGZvciB0aGUgYm90dG9tIG9mXG5ub2RlMiBpcyAyMDAuIEJvdHRvbSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbSB5ICsgaGVpZ2h0LlxuXG5cbkBtZXRob2QgYm90dG9tTWF4XG5AcGFyYW0gbWF4Qm90dG9tIHtOdW1iZXJ9IFRoZSBtYXhpbXVtIGJvdHRvbSAoIHkgKyBoZWlnaHQgKSB2YWx1ZSBmb3IgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmJvdHRvbU1heCA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBib3R0b21NYXhGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGJvdHRvbU1heCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH1cbn07XG5cblxuLyoqXG5ib3R0b21NaW4gaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuSGVyZSBpcyBhbiBleGFtcGxlIHVzYWdlIG9mIGJvdHRvbU1pbjpcblxuXHRub2RlMS5oZWlnaHRJcyggMTAwICkueUlzKCA1MCApO1xuXHRub2RlMi5oZWlnaHRJcyggMTAwICkueUlzKCAyMCApLmJvdHRvbU1pbiggbm9kZTEgKTtcblxuSWYgd2UgZXZhbHVhdGVkIHRoZSBhYm92ZSBub2RlMidzIHkgdmFsdWUgd291bGQgYmUgNTAgYW5kIG5vdCAyMC4gVGhpcyBpcyBiZWNhdXNlIHRoZSBtaW5pbXVtIHZhbHVlIGZvciB0aGUgYm90dG9tIG9mXG5ub2RlMiBpcyB0aGUgeSBwb3NpdGlvbiBvZiBub2RlMSBwbHVzIGl0cyBoZWlnaHQgKG5vZGUxLnkgKyBub2RlMS5oZWlnaHQpLlxuXG5cbkBtZXRob2QgYm90dG9tTWluXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gVGhlIExheW91dE5vZGUgd2hvc2UgYm90dG9tICggeSArIGhlaWdodCApIHZhbHVlIHdpbGwgYmUgdGhlIG1pbmltdW0gYm90dG9tIHZhbHVlIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuLyoqXG5ib3R0b21NaW4gaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuSGVyZSBpcyBhbiBleGFtcGxlIHVzYWdlIG9mIGJvdHRvbU1pbjpcblxuXHRub2RlMi5oZWlnaHRJcyggMTAwICkueUlzKCA1MCApLmJvdHRvbU1pbiggMjAwICk7XG5cbklmIHdlIGV2YWx1YXRlZCB0aGUgYWJvdmUgbm9kZTIncyB5IHZhbHVlIHdvdWxkIGJlIDEwMCBhbmQgbm90IDUwLiBUaGlzIGlzIGJlY2F1c2UgdGhlIG1pbmltdW0gdmFsdWUgZm9yIHRoZSBib3R0b20gb2Zcbm5vZGUyIGlzIDIwMC4gQm90dG9tIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tIHkgKyBoZWlnaHQuXG5cblxuQG1ldGhvZCBib3R0b21NaW5cbkBwYXJhbSB5IHtOdW1iZXJ9IFRoZSBtaW5pbXVtIGJvdHRvbSAoIHkgKyBoZWlnaHQgKSB2YWx1ZSBmb3IgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmJvdHRvbU1pbiA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBib3R0b21NaW5Gcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGJvdHRvbU1pbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH1cbn07XG5cblxuLyoqXG5yaWdodE1heCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIHBvc3NpYmxlIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5IZXJlIGlzIGFuIGV4YW1wbGUgdXNhZ2Ugb2YgcmlnaHRNYXg6XG5cblx0bm9kZTEud2lkdGhJcyggMTAwICkueElzKCA1MCApO1xuXHRub2RlMi53aWR0aElzKCAxMDAgKS54SXMoIDEwMCApLnJpZ2h0TWF4KCBub2RlMSApO1xuXG5JZiB3ZSBldmFsdWF0ZWQgdGhlIGFib3ZlIG5vZGUyJ3MgeCB2YWx1ZSB3b3VsZCBiZSA1MCBhbmQgbm90IDEwMC4gVGhpcyBpcyBiZWNhdXNlIHRoZSBtYXhpbXVtIHZhbHVlIGZvciB0aGUgcmlnaHQgc2lkZSBvZlxubm9kZTIgaXMgdGhlIHggcG9zaXRpb24gb2Ygbm9kZTEgcGx1cyBpdHMgaGVpZ2h0IChub2RlMS54ICsgbm9kZTEud2lkdGgpLlxuXG5cbkBtZXRob2QgcmlnaHRNYXhcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSBUaGUgTGF5b3V0Tm9kZSB3aG9zZSByaWdodCAoeCArIHdpZHRoKSB2YWx1ZSB3aWxsIGJlIHRoZSBtYXhpbXVtIHJpZ2h0IHZhbHVlIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuLyoqXG5yaWdodE1heCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIHBvc3NpYmxlIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5IZXJlIGlzIGFuIGV4YW1wbGUgdXNhZ2Ugb2YgcmlnaHRNYXg6XG5cblx0bm9kZTIud2lkdGhJcyggMTAwICkueElzKCAyMDAgKS5yaWdodE1heCggMjAwICk7XG5cbklmIHdlIGV2YWx1YXRlZCB0aGUgYWJvdmUgbm9kZTIncyB4IHZhbHVlIHdvdWxkIGJlIDEwMCBhbmQgbm90IDIwMC4gVGhpcyBpcyBiZWNhdXNlIHRoZSBtYXhpbXVtIHZhbHVlIGZvciB0aGUgcmlnaHQgc2lkZSBvZlxubm9kZTIgaXMgMjAwLiBCb3R0b20gdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20geCArIHdpZHRoLlxuXG5cbkBtZXRob2QgcmlnaHRNYXhcbkBwYXJhbSBtYXhSaWdodCB7TnVtYmVyfSBUaGUgbWF4aW11bSByaWdodCB2YWx1ZSBmb3IgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnJpZ2h0TWF4ID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHJpZ2h0TWF4RnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCByaWdodE1heCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH1cbn07XG5cblxuXG4vKipcbnJpZ2h0TWluIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbkhlcmUgaXMgYW4gZXhhbXBsZSB1c2FnZSBvZiByaWdodE1pbjpcblxuXHRub2RlMS53aWR0aElzKCAxMDAgKS54SXMoIDEwMCApO1xuXHRub2RlMi53aWR0aElzKCAxMDAgKS54SXMoIDUwICkucmlnaHRNaW4oIG5vZGUxICk7XG5cbklmIHdlIGV2YWx1YXRlZCB0aGUgYWJvdmUgbm9kZTIncyB4IHZhbHVlIHdvdWxkIGJlIDEwMCBhbmQgbm90IDUwLiBUaGlzIGlzIGJlY2F1c2UgdGhlIG1pbmltdW0gdmFsdWUgZm9yIHRoZSByaWdodCBzaWRlIG9mXG5ub2RlMiBpcyB0aGUgeCBwb3NpdGlvbiBvZiBub2RlMSBwbHVzIGl0cyBoZWlnaHQgKG5vZGUxLnggKyBub2RlMS53aWR0aCkuXG5cblxuQG1ldGhvZCByaWdodE1pblxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IFRoZSBMYXlvdXROb2RlIHdob3NlIHggdmFsdWUgd2lsbCBiZSB0aGUgbWluaW11bSByaWdodCB2YWx1ZSBmb3IgdGhpcyBub2RlXG5AY2hhaW5hYmxlXG4qKi9cbi8qKlxucmlnaHRNaW4gaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuSGVyZSBpcyBhbiBleGFtcGxlIHVzYWdlIG9mIHJpZ2h0TWluOlxuXG5cdG5vZGUyLndpZHRoSXMoIDEwMCApLnhJcyggNTAgKS5yaWdodE1pbiggMjAwICk7XG5cbklmIHdlIGV2YWx1YXRlZCB0aGUgYWJvdmUgbm9kZTIncyB4IHZhbHVlIHdvdWxkIGJlIDEwMCBhbmQgbm90IDUwLiBUaGlzIGlzIGJlY2F1c2UgdGhlIG1pbmltdW0gdmFsdWUgZm9yIHRoZSByaWdodCBzaWRlIG9mXG5ub2RlMiBpcyAyMDAuIEJvdHRvbSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbSB4ICsgd2lkdGguXG5cblxuQG1ldGhvZCByaWdodE1pblxuQHBhcmFtIG1pblJpZ2h0IHtOdW1iZXJ9IFRoZSBtaW5pbXVtIFwicmlnaHRcIiAoIHggKyB3aWR0aCApIHZhbHVlIGZvciB0aGlzIExheW91dE5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucmlnaHRNaW4gPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgcmlnaHRNaW5Gcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHJpZ2h0TWluLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fVxufTtcblxuXG5cblxuLyoqXG5tYXggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuSXQncyBhIGdlbmVyYWwgYm91bmRpbmcgZnVuY3Rpb24gd2hpY2ggZGVyaXZlcyBpdCdzIGNvbnRleHQgZnJvbSB0aGUgcHJldmlvdXMgcnVsZSBhZGRlZC5cblxuU28gYmFzaWNhbGx5OlxuXG5cdG5vZGUueElzKCAyMDAgKS5tYXgoIDEwMCApO1xuXG5UaGUgeCB2YWx1ZSBvZiB0aGUgbm9kZSB3b3VsZCBlbmQgdXAgYmVpbmcgMTAwLlxuXG5Bbm90aGVyIGV4YW1wbGU6XG5cblx0bm9kZS53aWR0aElzKCAyNDAgKS5tYXgoIDQwICk7XG5cblRoZSB3aWR0aCB2YWx1ZSBvZiB0aGUgbm9kZSB3b3VsZCBlbmQgdXAgYmVpbmcgYmVpbmcgNDAuXG5cblNvIGFzIHlvdSBjYW4gc2VlIGFjdCdzIGxpa2UgYWxsIHRoZSBvdGhlciBtYXggZnVuY3Rpb25zLiBGb3IgcmVmZXJlbmNlIGxvb2sgYXQ6XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvbWF4V2lkdGg6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvbWF4UG9zaXRpb246bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvdG9wTWF4Om1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuXG5AbWV0aG9kIG1heFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0dGhpcy5hZGREZXBlbmRlbmN5KCBhcmd1bWVudHNbIDAgXSApO1xuXG5cdFx0c3dpdGNoKCB0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkICkge1xuXG5cdFx0XHRjYXNlIFNJWkU6XG5cdFx0XHRjYXNlIEJPVU5EX1NJWkU6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFNpemVGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBTSVpFX1dJRFRIOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFX1dJRFRIOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhXaWR0aEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfV0lEVEggKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFNJWkVfSEVJR0hUOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFX0hFSUdIVDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4SGVpZ2h0RnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9IRUlHSFQgKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFBPU0lUSU9OOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTjpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4UG9zaXRpb25Gcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFBPU0lUSU9OX1g6XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1g6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGxlZnRNYXhGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT05fWCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT05fWTpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWTpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgdG9wTWF4RnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OX1kgKTtcblx0XHRcdFxuXHRcdH1cblx0fSBlbHNlIHtcblxuXHRcdHN3aXRjaCggdGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCApIHtcblxuXHRcdFx0Y2FzZSBTSVpFOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhTaXplLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBTSVpFX1dJRFRIOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFX1dJRFRIOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhXaWR0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9XSURUSCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgU0laRV9IRUlHSFQ6XG5cdFx0XHRjYXNlIEJPVU5EX1NJWkVfSEVJR0hUOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhIZWlnaHQsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfSEVJR0hUICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT046XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFBvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFBPU0lUSU9OX1g6XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1g6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGxlZnRNYXgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTl9YICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTl9ZOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9ZOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB0b3BNYXgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTl9ZICk7XG5cdFx0XHRcblx0XHR9XG5cdH1cbn07XG5cblxuXG5cbi8qKlxubWluIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cbkl0J3MgYSBnZW5lcmFsIGJvdW5kaW5nIGZ1bmN0aW9uIHdoaWNoIGRlcml2ZXMgaXQncyBjb250ZXh0IGZyb20gdGhlIHByZXZpb3VzIHJ1bGUgYWRkZWQuXG5cblNvIGJhc2ljYWxseTpcblxuXHRub2RlLnhJcyggNTAgKS5taW4oIDEwMCApO1xuXG5UaGUgeCB2YWx1ZSBvZiB0aGUgbm9kZSB3b3VsZCBlbmQgdXAgYmVpbmcgMTAwLlxuXG5Bbm90aGVyIGV4YW1wbGU6XG5cblx0bm9kZS53aWR0aElzKCAtNDAwICkubWluKCAtNDAgKTtcblxuVGhlIHdpZHRoIHZhbHVlIG9mIHRoZSBub2RlIHdvdWxkIGVuZCB1cCBiZWluZyBiZWluZyAtNDAuXG5cblNvIGFzIHlvdSBjYW4gc2VlIGFjdCdzIGxpa2UgYWxsIHRoZSBvdGhlciBtYXggZnVuY3Rpb25zLiBGb3IgcmVmZXJlbmNlIGxvb2sgYXQ6XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvbWluV2lkdGg6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvbWluUG9zaXRpb246bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvdG9wTWluOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuXG5AbWV0aG9kIG1pblxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0dGhpcy5hZGREZXBlbmRlbmN5KCBhcmd1bWVudHNbIDAgXSApO1xuXG5cdFx0c3dpdGNoKCB0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkICkge1xuXG5cdFx0XHRjYXNlIFNJWkU6XG5cdFx0XHRjYXNlIEJPVU5EX1NJWkU6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pblNpemVGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBTSVpFX1dJRFRIOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFX1dJRFRIOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5XaWR0aEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfV0lEVEggKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFNJWkVfSEVJR0hUOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFX0hFSUdIVDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluSGVpZ2h0RnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9IRUlHSFQgKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFBPU0lUSU9OOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTjpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluUG9zaXRpb25Gcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFBPU0lUSU9OX1g6XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1g6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGxlZnRNaW5Gcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT05fWCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT05fWTpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWTpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgdG9wTWluRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OX1kgKTtcblx0XHRcdFxuXHRcdH1cdFx0XG5cdH0gZWxzZSB7XG5cblx0XHRzd2l0Y2goIHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgKSB7XG5cblx0XHRcdGNhc2UgU0laRTpcblx0XHRcdGNhc2UgQk9VTkRfU0laRTpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluU2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRSApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRcdGNhc2UgQk9VTkRfU0laRV9XSURUSDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluV2lkdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfV0lEVEggKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFNJWkVfSEVJR0hUOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFX0hFSUdIVDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluSGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX0hFSUdIVCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT046XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5Qb3NpdGlvbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTl9YOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9YOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBsZWZ0TWluLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT05fWCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT05fWTpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWTpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgdG9wTWluLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT05fWSApO1xuXHRcdFx0XG5cdFx0fVxuXHR9XG59O1xuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLUNPTkRJVElPTkFMUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZnVuY3Rpb24gYWRkQ29uZGl0aW9uYWwoIGNGdW5jdGlvbiwgY0FyZ3VtZW50cyApIHtcblxuXHRpZiggIXRoaXMuX2lzRG9pbmdXaGVuICkge1xuXG5cdFx0dGhyb3cgJ0JlZm9yZSBhZGRpbmcgYSBjb25kaXRpb25hbCBzdWNoIGFzIFwid2lkdGhHcmVhdGVyVGhhblwiIHlvdSBzaG91bGQgY2FsbCB0aGUgXCJ3aGVuXCIgZnVuY3Rpb24gdG8gZGVjbGFyZSB3aGljaCBpdGVtIHdlXFwnbGwgYmUgY29tcGFyaW5nIHRvJztcblx0fVxuXG5cdHRoaXMuX2hhc0NvbmRpdGlvbmFsID0gdHJ1ZTtcblxuXHQvL2lmIHdlJ3JlIG5vdCBkb2luZyBhIHNlbGYgY29uZGl0aW9uYWwgdGhlbiBkbyB0aGlzXG5cdGlmKCAhdGhpcy5fZG9pbmdTZWxmQ29uZGl0aW9uYWwgKSB7XG5cblx0XHR2YXIgaWR4MSA9IHRoaXMuaXRlbXNUb0NvbXBhcmUubGVuZ3RoIC0gMTtcblxuXHRcdC8vd2UgZG9uJ3QgaGFzIG1hbnkgY29uZGl0aW9uYWxzIHRvIGNvbXBhcmUgYWdhaW5zdCBhcyB3ZSBoYXZlIGl0ZW1zIHRvIGNvbXBhcmUgYWdhaW5zdFxuXHRcdGlmKCB0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXSA9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdHRoaXMuY29uZGl0aW9uYWxzRm9ySXRlbVsgaWR4MSBdID0gW107XG5cdFx0XHR0aGlzLmNvbmRpdGlvbmFsc0FyZ3VtZW50c0Zvckl0ZW1bIGlkeDEgXSA9IFtdO1xuXG5cdFx0XHR0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXS5wdXNoKCBbXSApO1xuXHRcdFx0dGhpcy5jb25kaXRpb25hbHNBcmd1bWVudHNGb3JJdGVtWyBpZHgxIF0ucHVzaCggW10gKTtcblxuXHRcdH0gZWxzZSBpZiggdGhpcy5pdGVtc1RvQ29tcGFyZVsgaWR4MSBdLmxlbmd0aCAhPSB0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXS5sZW5ndGggKSB7XG5cblx0XHRcdHRoaXMuY29uZGl0aW9uYWxzRm9ySXRlbVsgaWR4MSBdLnB1c2goIFtdICk7XG5cdFx0XHR0aGlzLmNvbmRpdGlvbmFsc0FyZ3VtZW50c0Zvckl0ZW1bIGlkeDEgXS5wdXNoKCBbXSApO1xuXHRcdH1cblxuXG5cdFx0dmFyIGlkeDIgPSB0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXS5sZW5ndGggLSAxO1xuXG5cdFx0dGhpcy5jb25kaXRpb25hbHNGb3JJdGVtWyBpZHgxIF1bIGlkeDIgXS5wdXNoKCBjRnVuY3Rpb24gKTtcblx0XHR0aGlzLmNvbmRpdGlvbmFsc0FyZ3VtZW50c0Zvckl0ZW1bIGlkeDEgXVsgaWR4MiBdLnB1c2goIGNBcmd1bWVudHMgKTtcblx0fSBlbHNlIHtcblxuXHRcdFxuXHRcdHZhciBpZHgxID0gdGhpcy5zZWxmSXRlbXNUb0NvbXBhcmUubGVuZ3RoIC0gMTtcblxuXHRcdC8vd2UgZG9uJ3QgaGFzIG1hbnkgY29uZGl0aW9uYWxzIHRvIGNvbXBhcmUgYWdhaW5zdCBhcyB3ZSBoYXZlIGl0ZW1zIHRvIGNvbXBhcmUgYWdhaW5zdFxuXHRcdGlmKCB0aGlzLnNlbGZDb25kaXRpb25hbHNGb3JJdGVtWyBpZHgxIF0gPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHR0aGlzLnNlbGZDb25kaXRpb25hbHNGb3JJdGVtWyBpZHgxIF0gPSBbXTtcblx0XHRcdHRoaXMuc2VsZkNvbmRpdGlvbmFsQXJndW1lbnRzRm9ySXRlbVsgaWR4MSBdID0gW107XG5cblx0XHRcdHRoaXMuc2VsZkNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXS5wdXNoKCBbXSApO1xuXHRcdFx0dGhpcy5zZWxmQ29uZGl0aW9uYWxBcmd1bWVudHNGb3JJdGVtWyBpZHgxIF0ucHVzaCggW10gKTtcblxuXHRcdH0gZWxzZSBpZiggdGhpcy5zZWxmSXRlbXNUb0NvbXBhcmVbIGlkeDEgXS5sZW5ndGggIT0gdGhpcy5zZWxmQ29uZGl0aW9uYWxzRm9ySXRlbVsgaWR4MSBdLmxlbmd0aCApIHtcblxuXHRcdFx0dGhpcy5zZWxmQ29uZGl0aW9uYWxzRm9ySXRlbVsgaWR4MSBdLnB1c2goIFtdICk7XG5cdFx0XHR0aGlzLnNlbGZDb25kaXRpb25hbEFyZ3VtZW50c0Zvckl0ZW1bIGlkeDEgXS5wdXNoKCBbXSApO1xuXHRcdH1cblxuXG5cdFx0dmFyIGlkeDIgPSB0aGlzLnNlbGZDb25kaXRpb25hbHNGb3JJdGVtWyBpZHgxIF0ubGVuZ3RoIC0gMTtcblxuXHRcdHRoaXMuc2VsZkNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXVsgaWR4MiBdLnB1c2goIGNGdW5jdGlvbiApO1xuXHRcdHRoaXMuc2VsZkNvbmRpdGlvbmFsQXJndW1lbnRzRm9ySXRlbVsgaWR4MSBdWyBpZHgyIF0ucHVzaCggY0FyZ3VtZW50cyApO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuVXNpbmcgdGhlIHdoZW4gZnVuY3Rpb24geW91IGNhbiBjcmVhdGUgY29uZGl0aW9uYWxzLiBJdCBpcyB0aGUgZmlyc3QgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIGNyZWF0aW5nIGEgY29uZGl0b25hbC4gXG5JdCBzcGVjaWZpZXMgd2hhdCBMYXlvdXROb2RlIHdpbGwgYmUgdXNlZCB3aGVuIGV2YWx1YXRpbmcgYSBjb25kaXRpb25hbCBzdGF0ZW1lbnQgdGhhdCBmb2xsb3dzLlxuXG5Gb3IgaW5zdGFuY2U6XG5cblx0bm9kZTEud2hlbiggbm9kZTIgKS53aWR0aEdyZWF0ZXJUaGFuKCAyMDAgKS53aWR0aElzKCAxMDAgKTtcblxuQmFzaWNhbGx5IHdoYXQgdGhpcyBzdGF0ZW1lbnQgc2FpcyBpcyBcIndoZW4gbm9kZTIncyB3aWR0aCBpcyBncmVhdGVyIHRoYW4gMjAwcHggbm9kZTEncyB3aWR0aCBpcyAxMDBweFwiLlxuXG5BIGNvbmRpdGlvbmFsIHN0YXRlbWVudCBtdXN0IGFsd2F5cyBmb2xsb3cgYWZ0ZXIgYSB3aGVuIHN0YXRlbWVudC5cblxuQG1ldGhvZCB3aGVuXG5AcGFyYW0gbm9kZSB7TGF5b3V0Tm9kZX0gdGhlIExheW91dE5vZGUgd2hpY2ggZm9sbG93aW5nIGNvbmRpdGlvbmFscyB3aWxsIGJlIGV2YWx1YXRlZCBhZ2FpbnN0XG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLndoZW4gPSBmdW5jdGlvbiggbm9kZSApIHtcblxuXHQvL0NoZWNrIGlmIHRoZXkndmUgY2FsbGVkIHdoZW4gYW5kIHRyaWVkIHRvIGNhbGwgaXQgYWdhaW5cblx0aWYoIHRoaXMuX2lzRG9pbmdXaGVuICYmICF0aGlzLl9oYXNDb25kaXRpb25hbCApIHtcblxuXHRcdHRocm93ICdZb3Ugc2hvdWxkIGNhbGwgd2hlbiBvciBhbmRXaGVuIGFmdGVyIGFkZGluZyBjb25kaXRpb25hbHMgc3VjaCBcIndpZHRoR3JlYXRlclRoYW5cIic7XG5cdH1cblxuXHQvL3dlJ3JlIGNoZWNraW5nIG9mIHRoaXMgaXMgTGF5b3V0Tm9kZSBjcmVhdGVkIGJhc2VkIG9uIGNvbmRpdGlvbmFsc1xuXHQvL2lmIHdoZW4gaXMgY2FsbGVkIHdlIHNob3VsZCBraWNrIGJhY2sgdG8gdGhlIHBhcmVudCBub2RlcyB3aGVuIGZ1bmN0aW9uIGFuZCBjYWxsIHdoZW4gdGhlcmVcblx0aWYoIHRoaXMuY29uZGl0aW9uYWxQYXJlbnQgIT09IG51bGwgKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5jb25kaXRpb25hbFBhcmVudC53aGVuKCBub2RlICk7XG5cdH1cblxuXHQvL3Jlc2V0IGxhc3RDb25kaXRpb25hbExpc3RlbmVySXNEZWZhdWx0IHRvIGZhbHNlXG5cdHRoaXMuX2lzRG9pbmdXaGVuID0gdHJ1ZTtcblx0dGhpcy5sYXN0Q29uZGl0aW9uYWxMaXN0ZW5lcklzRGVmYXVsdCA9IGZhbHNlO1xuXHR0aGlzLl9kb2luZ1NlbGZDb25kaXRpb25hbCA9IGZhbHNlO1xuXG5cdGlmKCBub2RlICE9IHRoaXMgKSB7XG5cblx0XHR0aGlzLml0ZW1zVG9Db21wYXJlLnB1c2goIFsgbm9kZSBdICk7XG5cblx0XHR0aGlzLmNvbmRpdGlvbmFsTGlzdGVuZXJzLnB1c2goIG51bGwgKTtcblx0XHR0aGlzLmxhc3RDb25kaXRpb25hbExpc3RuZXJJZHggPSB0aGlzLmNvbmRpdGlvbmFsTGlzdGVuZXJzLmxlbmd0aCAtIDE7XG5cdH0gZWxzZSB7XG5cblx0XHR0aGlzLl9kb2luZ1NlbGZDb25kaXRpb25hbCA9IHRydWU7XG5cblx0XHR0aGlzLnNlbGZJdGVtc1RvQ29tcGFyZS5wdXNoKCBbIG5vZGUgXSApOyAvL2FkZCB0aGlzIHRvIHRoZSBzZWxmIGxpc3Rcblx0XHR0aGlzLnNlbGZDb25kaXRpb25hbExpc3RlbmVycy5wdXNoKCBudWxsICk7XG5cdFx0dGhpcy5sYXN0U2VsZkNvbmRpdGlvbmFsTGlzdGVuZXJJZHggPSB0aGlzLnNlbGZDb25kaXRpb25hbExpc3RlbmVycy5sZW5ndGggLSAxO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcblRoZSBhbmRXaGVuIGZ1bmN0aW9uIGluIGVzc2VuY2UgaXMgdGhlIHNhbWUgYXMgYW4gJiYgb3BlcmF0b3IuIGFuZFdoZW4gc3RhdGVtZW50cyBtdXN0IGZvbGxvdyBhZnRlciBhbm90aGVyIGNvbmRpdGlvbmFsLlxuXG5Gb3IgZXhhbXBsZTpcblxuXHRub2RlMS53aGVuKCBub2RlMiApLndpZHRoR3JlYXRlclRoYW4oIDEwMCApLmFuZFdoZW4oIG5vZGUyICkud2lkdGhMZXNzVGhhbiggMjAwICkud2lkdGhJcyggMTAwICk7XG5cbldoYXQgdGhlIGFib3ZlIGlzIHNheWluZyBpcyBcIldoZW4gbm9kZTIncyB3aWR0aCBpcyBncmVhdGVyIHRoYW4gMTAwcHggYW5kIHdoZW4gbm9kZTIncyB3aWR0aCBpcyBsZXNzIHRoYW4gMjAwcHggdGhlbiBub2RlMSdzIHdpZHRoIGlzXG4xMDBweFwiXG5cbmFuZFdoZW4gc3RhdGVtZW50cyBtdXN0IGZvbGxvdyBhZnRlciBhIGNvbmRpdGlvbmFsIHN0YXRlbWVudC5cblxuQG1ldGhvZCBhbmRXaGVuXG5AcGFyYW0gbm9kZSB7TGF5b3V0Tm9kZX0gdGhlIExheW91dE5vZGUgd2hpY2ggZm9sbG93aW5nIGNvbmRpdGlvbmFscyB3aWxsIGJlIGV2YWx1YXRlZCBhZ2FpbnN0XG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmFuZFdoZW4gPSBmdW5jdGlvbiggbm9kZSApIHtcblxuXHRpZiggIXRoaXMuX2lzRG9pbmdXaGVuICkge1xuXG5cdFx0dGhyb3cgJ1lvdSBzaG91bGQgY2FsbCB3aGVuIGJlZm9yZSBjYWxsaW5nIGFuZFdoZW4nO1x0XHRcblx0fSBlbHNlIGlmKCB0aGlzLmNvbmRpdGlvbmFsUGFyZW50ICkge1xuXG5cdFx0dGhyb3cgJ1lvdSBzaG91bGQgY2FsbCB3aGVuIGJlZm9yZSBjYWxsaW5nIGFuZFdoZW4nO1xuXHR9XG5cblx0Ly9pZiBhbmRXaGVuIHdhcyBjYWxsZWQgdGhlbiBhbmQgd2UncmUgbm90IGRvaW5nIGEgc2VsZiBjb25kaXRpb25hbFxuXHQvL3dlIHdhbnQgdG8gZ3JhYiB0aGUgcmVndWxhciBjb25kaXRpb25hbHMgYW5kIHB1c2ggdGhlbSB0byB0aGUgc2VsZiBjb25kaXRpb25hbCBhcnJheVxuXHRpZiggbm9kZSA9PSB0aGlzICYmICF0aGlzLl9kb2luZ1NlbGZDb25kaXRpb25hbCApIHtcblxuXHRcdHRoaXMuX2RvaW5nU2VsZkNvbmRpdGlvbmFsID0gdHJ1ZTtcblxuXHRcdC8vcmVtb3ZlIHRoZSBhcnJheSB0aGF0IHdhcyBhZGRlZCB0byBtYWtlIHRoaXMgYSBzZWxmIGNvbmRpdGlvbmFsXG5cdFx0dGhpcy5zZWxmSXRlbXNUb0NvbXBhcmUucHVzaCggdGhpcy5pdGVtc1RvQ29tcGFyZS5wb3AoKSApO1xuXHRcdC8vYWRkIHRoaXMgbm9kZSBpblxuXHRcdHRoaXMuc2VsZkl0ZW1zVG9Db21wYXJlWyB0aGlzLnNlbGZJdGVtc1RvQ29tcGFyZS5sZW5ndGggLSAxIF0ucHVzaCggbm9kZSApO1xuXHRcdC8vcmV2ZXJzZSB3aGF0cyBiZWVuIGFkZGVkIGZvciBsaXN0ZW5lcnNcblx0XHR0aGlzLmNvbmRpdGlvbmFsTGlzdGVuZXJzLnBvcCgpO1xuXHRcdC8vc2V0IHRoaXMgYmFjayB0byAtMSBzbyB0aGF0IG9uIGNhbnQgYmUgY2FsbGVkIGZvciByZWd1bGFyIGxpc3RlbmVyc1xuXHRcdHRoaXMubGFzdENvbmRpdGlvbmFsTGlzdG5lcklkeCA9IC0xO1xuXG5cdC8vd2UncmUgZG9pbmcgYSBzZWxmIGNvbmRpdGlvbmFsIGFuZCBhbm90aGVyIGl0ZW0gdG8gY29tcGFyZVxuXHR9IGVsc2UgaWYoIHRoaXMuX2RvaW5nU2VsZkNvbmRpdGlvbmFsICkge1xuXG5cdFx0dGhpcy5zZWxmSXRlbXNUb0NvbXBhcmUucHVzaCggbm9kZSApO1xuXHQvL3RoaXMgaXMganVzdCBhIHJlZ3VsYXIgb2xkIGFuZCB3aGVuIHN0YXRlbWVudCBzbyBhZGQgdGhlIG5vZGUgdG8gaXRlbXMgdG8gY29tcGFyZVxuXHR9IGVsc2Uge1xuXG5cdFx0dmFyIGlkeCA9IHRoaXMuaXRlbXNUb0NvbXBhcmUubGVuZ3RoIC0gMTtcblx0XHR0aGlzLml0ZW1zVG9Db21wYXJlWyBpZHggXS5wdXNoKCBub2RlICk7XG5cdH1cblx0XG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG5UaGUgZGVmYXVsdCBzdGF0ZW1lbnQgaXMgdGhlIGVxdWl2YWxlbnQgdG8gYW4gZWxzZSBzdGF0ZW1lbnQuXG5cbkZvciBpbnN0YW5jZSBpZiB3ZSBoYXZlIHRoZSBmb2xsb3dpbmcgc3RhdGVtZW50OlxuXG5cdG5vZGUxXG5cdC53aGVuKCBub2RlMiApLndpZHRoR3JlYXRlclRoYW4oIDEwMCApLndpZHRoSXMoIDEwMCApXG5cdC5kZWZhdWx0KCkud2lkdGhJcyggNTAgKTtcblxuV2hhdCB0aGUgYWJvdmUgbWVhbnMgaXMgXCJXaGVuIG5vZGUyJ3Mgd2lkdGggaXMgZ3JlYXRlciB0aGFuIDEwMHB4IHRoZSB3aWR0aCBvZiBub2RlMSBpcyAxMDBweC4gT3RoZXJ3aXNlIGlmIHRoZSB3aWR0aCBvZiBub2RlMiBpcyBub3RcbmdyZWF0ZXIgdGhhbiAxMDBweCB0aGVuIHRoZSB3aWR0aCBvZiBub2RlMSBpcyA1MHB4XCJcblxuU29tZXRoaW5nIHRvIG5vdGUgaXMgdGhhdCB5b3UgY2FuIGFsc28gYWRkIHJ1bGVzIHdoaWNoIHdpbGwgYWx3YXlzIGV2YWx1YXRlIGJ5IGRvaW5nIHRoZSBmb2xsb3dpbmc6XG5cblx0bm9kZTFcblx0LmhlaWdodElzKCAyMDAgKVxuXHQud2hlbiggbm9kZTIgKS53aWR0aEdyZWF0ZXJUaGFuKCAxMDAgKS53aWR0aElzKCAxMDAgKVxuXHQuZGVmYXVsdCgpLndpZHRoSXMoIDUwICk7XG5cbkJhc2ljYWxseSByZWdhcmRsZXNzIG9mIHRoZSB3aWR0aCBvZiBub2RlMiB0aGUgaGVpZ2h0IG9mIG5vZGUxIHdpbGwgYmUgMjAwcHguIFRoaXMgY2xlYXJseSBkaWZmZXJzIGZyb20gdGhlIFwiZGVmYXVsdFwiIHN0YXRlbWVudC5cblxuQG1ldGhvZCBkZWZhdWx0XG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmRlZmF1bHQgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLl9pc0RvaW5nRGVmYXVsdCA9IHRydWU7XG5cblx0aWYoIHRoaXMuY29uZGl0aW9uYWxQYXJlbnQgKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5jb25kaXRpb25hbFBhcmVudC5kZWZhdWx0KCk7XG5cdH1cblxuXHR0aGlzLmxhc3RDb25kaXRpb25hbExpc3RuZXJJZHggPSAtMTtcblx0dGhpcy5sYXN0U2VsZkNvbmRpdGlvbmFsTGlzdGVuZXJJZHggPSAtMTtcblx0dGhpcy5sYXN0Q29uZGl0aW9uYWxMaXN0ZW5lcklzRGVmYXVsdCA9IHRydWU7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbllvdSBjYW4gdXNlIHRoaXMgbWV0aG9kIHRvIGFkZCBjYWxsYmFja3MgZm9yIHdoZW4gY29uZGl0aW9uYWxzIGV2YWx1YXRlLlxuXG5TbyBsZXQncyBzYXkgd2UgZG86XG5cblx0bm9kZTEud2hlbiggbm9kZTIgKS5oZWlnaHRMZXNzVGhhbiggMzAwICkubWF0Y2hlc0hlaWdodE9mKCBub2RlMiApLm9uKCBmdW5jdGlvbiggaXNUcnVlICkge1xuXHRcdFxuXHRcdGNvbnNvbGUubG9nKCBcIklzIHRoZSBoZWlnaHQgb2Ygbm9kZTIgc21hbGxlciB0aGFuIDMwMD9cIiwgaXNUcnVlICk7XG5cdH0pO1xuXG5FdmVyeXRpbWUgdGhlIGxheW91dCBpcyB1cGRhdGVkIHRoZSBjYWxsIGJhY2sgd2lsbCBmaXJlIHdpdGggYSBib29sZWFuIHdoaWNoIGlzIHdoZXRoZXIgdGhlIGNvbmRpdGlvbmFsIGlzXG50cnVlIG9yIGZhbHNlLlxuXG5UaGUgb24gZnVuY3Rpb24gd2lsbCBvbmx5IGJlIGFwcGxpZWQgdG8gdGhlIHByZXZpb3VzIFwid2hlblwiIG9yIFwiZGVmYXVsdFwiIHN0YXRlbWVudCBwcmVjZWRpbmcgdGhlIG9uIHN0YXRlbWVudC5cblxuQG1ldGhvZCBvblxuQHBhcmFtIGxpc3RlbmVyIHtGdW5jdGlvbn0gVGhpcyBpcyB0aGUgbGlzdGVuZXIgZm9yIHRoZSBjYWxsIGJhY2sgd2hlbiB0aGlzIGNvbmRpdGlvbmFsIGV2YWx1YXRlc1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKCBsaXN0ZW5lciApIHtcblxuXG5cdGlmKCB0aGlzLmNvbmRpdGlvbmFsUGFyZW50ICkge1xuXG5cdFx0dGhpcy5jb25kaXRpb25hbFBhcmVudC5vbiggbGlzdGVuZXIgKTtcblx0fSBlbHNlIGlmKCB0aGlzLl9kb2luZ1NlbGZDb25kaXRpb25hbCApIHtcblxuXHRcdGlmKCB0aGlzLmxhc3RTZWxmQ29uZGl0aW9uYWxMaXN0ZW5lcklkeCA+IC0xICkge1xuXG5cdFx0XHR0aGlzLnNlbGZDb25kaXRpb25hbExpc3RlbmVyc1sgdGhpcy5sYXN0U2VsZkNvbmRpdGlvbmFsTGlzdGVuZXJJZHggXSA9IGxpc3RlbmVyO1xuXHRcdH1cblx0fSBlbHNlIHtcblxuXHRcdC8vYXJlIHdlIGRvaW5nIHRoZSBkZWZhdWx0IGxpc3RlbmVyXG5cdFx0aWYoICF0aGlzLmxhc3RDb25kaXRpb25hbExpc3RlbmVySXNEZWZhdWx0ICkge1xuXG5cdFx0XHQvL2lmIHdlIGhhdmUgYSBjb25kaXRpb25hbCBsaXN0ZW5lciBpZHggKHdoZW4gY2FsbGVkKVxuXHRcdFx0aWYoIHRoaXMubGFzdENvbmRpdGlvbmFsTGlzdG5lcklkeCA+IC0xICkge1xuXG5cdFx0XHRcdHRoaXMuY29uZGl0aW9uYWxMaXN0ZW5lcnNbIHRoaXMubGFzdENvbmRpdGlvbmFsTGlzdG5lcklkeCBdID0gbGlzdGVuZXI7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHRocm93ICdZb3UgbXVzdCBjYWxsIHRoZSB3aGVuIGZ1bmN0aW9uIGJlZm9yZSB0cnlpbmcgdG8gYWRkIGEgbGlzdGVuZXInO1xuXHRcdFx0fVxuXHRcdC8vd2UgYXJlIGRvaW5nIHRoZSBkZWZhdWx0IGxpc3RlbmVyXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0dGhpcy5kZWZhdWx0Q29uZGl0aW9uYWxMaXN0ZW5lciA9IGxpc3RlbmVyO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcblxuXG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkud2lkdGhHcmVhdGVyVGhhbiggMzAwICkubWF0Y2hlc0hlaWdodE9mKCBub2RlMiApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIHdpZHRoIG9mIG5vZGUyIGlzIGdyZWF0ZXIgdGhhbiAzMDBweCBub2RlMSBzaG91bGQgbWF0Y2ggdGhlIGhlaWdodCBvZiBub2RlMlwiLlxuXG5AbWV0aG9kIHdpZHRoR3JlYXRlclRoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBUaGlzIHZhbHVlIHN0YXRlcyB0aGUgd2lkdGggdGhhdCB0aGUgTGF5b3V0Tm9kZSdzIHdpZHRoIHNob3VsZCBiZSBldmFsdWF0ZWQgYWdhaW5zdFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS53aWR0aEdyZWF0ZXJUaGFuID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiBhZGRDb25kaXRpb25hbC5jYWxsKCB0aGlzLCB3aWR0aEdyZWF0ZXJUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLmhlaWdodEdyZWF0ZXJUaGFuKCAzMDAgKS5tYXRjaGVzSGVpZ2h0T2YoIG5vZGUyICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgaGVpZ2h0IG9mIG5vZGUyIGlzIGdyZWF0ZXIgdGhhbiAzMDBweCBub2RlMSBzaG91bGQgbWF0Y2ggdGhlIGhlaWdodCBvZiBub2RlMlwiLlxuXG5AbWV0aG9kIGhlaWdodEdyZWF0ZXJUaGFuXG5AcGFyYW0gdmFsdWUge051bWJlcn0gVGhpcyB2YWx1ZSBzdGF0ZXMgdGhlIGhlaWdodCB0aGF0IHRoZSBMYXlvdXROb2RlJ3MgaGVpZ2h0IHNob3VsZCBiZSBldmFsdWF0ZWQgYWdhaW5zdFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5oZWlnaHRHcmVhdGVyVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgaGVpZ2h0R3JlYXRlclRoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkud2lkdGhMZXNzVGhhbiggMzAwICkubWF0Y2hlc0hlaWdodE9mKCBub2RlMiApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIHdpZHRoIG9mIG5vZGUyIGlzIGxlc3MgdGhhbiAzMDBweCBub2RlMSBzaG91bGQgbWF0Y2ggdGhlIGhlaWdodCBvZiBub2RlMlwiLlxuXG5AbWV0aG9kIHdpZHRoTGVzc1RoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBUaGlzIHZhbHVlIHN0YXRlcyB0aGUgd2lkdGggdGhhdCB0aGUgTGF5b3V0Tm9kZSdzIHdpZHRoIHNob3VsZCBiZSBldmFsdWF0ZWQgYWdhaW5zdFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS53aWR0aExlc3NUaGFuID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiBhZGRDb25kaXRpb25hbC5jYWxsKCB0aGlzLCB3aWR0aExlc3NUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLmhlaWdodExlc3NUaGFuKCAzMDAgKS5tYXRjaGVzSGVpZ2h0T2YoIG5vZGUyICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgaGVpZ2h0IG9mIG5vZGUyIGlzIGxlc3MgdGhhbiAzMDBweCBub2RlMSBzaG91bGQgbWF0Y2ggdGhlIGhlaWdodCBvZiBub2RlMlwiLlxuXG5AbWV0aG9kIGhlaWdodExlc3NUaGFuXG5AcGFyYW0gdmFsdWUge051bWJlcn0gVGhpcyB2YWx1ZSBzdGF0ZXMgdGhlIGhlaWdodCB0aGF0IHRoZSBMYXlvdXROb2RlJ3MgaGVpZ2h0IHNob3VsZCBiZSBldmFsdWF0ZWQgYWdhaW5zdFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5oZWlnaHRMZXNzVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgaGVpZ2h0TGVzc1RoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG4vKipcblRoaXMgZnVuY3Rpb24gaXMgYSBjb25kaXRpb25hbC4gSXQgbXVzdCBmb2xsb3cgYWZ0ZXIgYSBcIndoZW5cIiBvciBcImFuZFdoZW5cIiBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS5sZWZ0R3JlYXRlclRoYW4oIDQwMCApLnhJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgdGhlIGxlZnQgc2lkZSAobm9kZTIueCBwb3NpdGlvbikgb2Ygbm9kZTIgaXMgZ3JlYXRlciB0aGFuIDQwMCBub2RlMSdzIHggd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCBsZWZ0R3JlYXRlclRoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBXaGVuIHRoZSB4IHZhbHVlIG9mIExheW91dE5vZGUgcGFzc2VkIGluIHRoZSB3aGVuIHN0YXRlbWVudCBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSB0aGUgXG5jb25kaXRpb25hbHMgbGF5b3V0IHJ1bGVzIHdpbGwgYmUgcnVuXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmxlZnRHcmVhdGVyVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgbGVmdEdyZWF0ZXJUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLmxlZnRMZXNzVGhhbiggNDAwICkueElzKCA0MDAgKTtcblxuVGhlIGFib3ZlIGlzIHN0YXRpbmcgXCJ3aGVuIHRoZSB0aGUgbGVmdCBzaWRlIChub2RlMi54IHBvc2l0aW9uKSBvZiBub2RlMiBpcyBsZXNzIHRoYW4gNDAwIG5vZGUxJ3MgeCB3aWxsIGJlIDQwMFwiLlxuXG5AbWV0aG9kIGxlZnRMZXNzVGhhblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IFdoZW4gdGhlIHggdmFsdWUgb2YgTGF5b3V0Tm9kZSBwYXNzZWQgaW4gdGhlIHdoZW4gc3RhdGVtZW50IGlzIGxlc3MgdGhhbiB0aGlzIHZhbHVlIHRoZSBcbmNvbmRpdGlvbmFscyBsYXlvdXQgcnVsZXMgd2lsbCBiZSBydW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubGVmdExlc3NUaGFuID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiBhZGRDb25kaXRpb25hbC5jYWxsKCB0aGlzLCBsZWZ0TGVzc1RoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkucmlnaHRHcmVhdGVyVGhhbiggNDAwICkueElzKCA0MDAgKTtcblxuVGhlIGFib3ZlIGlzIHN0YXRpbmcgXCJ3aGVuIHRoZSB0aGUgcmlnaHQgc2lkZSAobm9kZTIueCArIG5vZGUyLndpZHRoKSBvZiBub2RlMiBpcyBncmVhdGVyIHRoYW4gNDAwIG5vZGUxJ3MgeCB3aWxsIGJlIDQwMFwiLlxuXG5AbWV0aG9kIHJpZ2h0R3JlYXRlclRoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBXaGVuIHggKyB3aWR0aCB2YWx1ZSBvZiBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aGUgd2hlbiBzdGF0ZW1lbnQgaXMgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUgdGhlIFxuY29uZGl0aW9uYWxzIGxheW91dCBydWxlcyB3aWxsIGJlIHJ1blxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5yaWdodEdyZWF0ZXJUaGFuID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiBhZGRDb25kaXRpb25hbC5jYWxsKCB0aGlzLCByaWdodEdyZWF0ZXJUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLnJpZ2h0TGVzc1RoYW4oIDQwMCApLnhJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgdGhlIHJpZ2h0IHNpZGUgKG5vZGUyLnggKyBub2RlMi53aWR0aCkgb2Ygbm9kZTIgaXMgbGVzcyB0aGFuIDQwMCBub2RlMSdzIHggd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCByaWdodExlc3NUaGFuXG5AcGFyYW0gdmFsdWUge051bWJlcn0gV2hlbiB4ICsgd2lkdGggdmFsdWUgb2YgTGF5b3V0Tm9kZSBwYXNzZWQgaW4gdGhlIHdoZW4gc3RhdGVtZW50IGlzIGxlc3MgdGhhbiB0aGlzIHZhbHVlIHRoZSBcbmNvbmRpdGlvbmFscyBsYXlvdXQgcnVsZXMgd2lsbCBiZSBydW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucmlnaHRMZXNzVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgcmlnaHRMZXNzVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkudG9wR3JlYXRlclRoYW4oIDQwMCApLnlJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgdGhlIGxlZnQgc2lkZSAobm9kZTIueSBwb3NpdGlvbikgb2Ygbm9kZTIgaXMgZ3JlYXRlciB0aGFuIDQwMCBub2RlMSdzIHkgd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCB0b3BHcmVhdGVyVGhhblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IFdoZW4gdGhlIHkgdmFsdWUgb2YgTGF5b3V0Tm9kZSBwYXNzZWQgaW4gdGhlIHdoZW4gc3RhdGVtZW50IGlzIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlIHRoZSBcbmNvbmRpdGlvbmFscyBsYXlvdXQgcnVsZXMgd2lsbCBiZSBydW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUudG9wR3JlYXRlclRoYW4gPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIGFkZENvbmRpdGlvbmFsLmNhbGwoIHRoaXMsIHRvcEdyZWF0ZXJUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLnRvcExlc3NUaGFuKCA0MDAgKS55SXMoIDQwMCApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIHRoZSBsZWZ0IHNpZGUgKG5vZGUyLnkgcG9zaXRpb24pIG9mIG5vZGUyIGlzIGxlc3MgdGhhbiA0MDAgbm9kZTEncyB5IHdpbGwgYmUgNDAwXCIuXG5cbkBtZXRob2QgdG9wTGVzc1RoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBXaGVuIHRoZSB5IHZhbHVlIG9mIExheW91dE5vZGUgcGFzc2VkIGluIHRoZSB3aGVuIHN0YXRlbWVudCBpcyBsZXNzIHRoYW4gdGhpcyB2YWx1ZSB0aGUgXG5jb25kaXRpb25hbHMgbGF5b3V0IHJ1bGVzIHdpbGwgYmUgcnVuXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnRvcExlc3NUaGFuID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiBhZGRDb25kaXRpb25hbC5jYWxsKCB0aGlzLCB0b3BMZXNzVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cblxuXG4vKipcblRoaXMgZnVuY3Rpb24gaXMgYSBjb25kaXRpb25hbC4gSXQgbXVzdCBmb2xsb3cgYWZ0ZXIgYSBcIndoZW5cIiBvciBcImFuZFdoZW5cIiBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS5ib3R0b21HcmVhdGVyVGhhbiggNDAwICkueUlzKCA0MDAgKTtcblxuVGhlIGFib3ZlIGlzIHN0YXRpbmcgXCJ3aGVuIHRoZSB0aGUgcmlnaHQgc2lkZSAobm9kZTIueSArIG5vZGUyLmhlaWdodCkgb2Ygbm9kZTIgaXMgZ3JlYXRlciB0aGFuIDQwMCBub2RlMSdzIHkgd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCBib3R0b21HcmVhdGVyVGhhblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IFdoZW4geSArIGhlaWdodCB2YWx1ZSBvZiBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aGUgd2hlbiBzdGF0ZW1lbnQgaXMgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUgdGhlIFxuY29uZGl0aW9uYWxzIGxheW91dCBydWxlcyB3aWxsIGJlIHJ1blxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5ib3R0b21HcmVhdGVyVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgYm90dG9tR3JlYXRlclRoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkuYm90dG9tTGVzc1RoYW4oIDQwMCApLnlJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgdGhlIHJpZ2h0IHNpZGUgKG5vZGUyLnkgKyBub2RlMi53aWR0aCkgb2Ygbm9kZTIgaXMgbGVzcyB0aGFuIDQwMCBub2RlMSdzIHkgd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCBib3R0b21MZXNzVGhhblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IFdoZW4geSArIHdpZHRoIHZhbHVlIG9mIExheW91dE5vZGUgcGFzc2VkIGluIHRoZSB3aGVuIHN0YXRlbWVudCBpcyBsZXNzIHRoYW4gdGhpcyB2YWx1ZSB0aGUgXG5jb25kaXRpb25hbHMgbGF5b3V0IHJ1bGVzIHdpbGwgYmUgcnVuXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmJvdHRvbUxlc3NUaGFuID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiBhZGRDb25kaXRpb25hbC5jYWxsKCB0aGlzLCBib3R0b21MZXNzVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cblxuLyoqXG5UaGVyZSBhcmUgdHdvIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24gYm90aCBhcmUgZG9jdW1lbnRlZC5cblxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLmlzSW5zaWRlKCBub2RlMSApLnlJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiBhbnkgcGFydCBvZiBub2RlMSBpcyBpbnNpZGUgbm9kZSB5IGlzIDQwMFwiLlxuXG5AbWV0aG9kIGlzSW5zaWRlXG5AcGFyYW0gbm9kZSB7TGF5b3V0Tm9kZX0gaWYgdGhlIGxheW91dCBub2RlIHdoaWNoIGlzSW5zaWRlIGlzIGNhbGxlZCBvbiBpcyBpbnNpZGUgdGhpcyBwYXNzZWQgTGF5b3V0Tm9kZSB0aGVuIHRoaXMgY29uZGl0aW9uYWxcbndpbGwgZXZhbHVhdGUgdHJ1ZVxuQGNoYWluYWJsZVxuKiovXG4vKipcblRoZXJlIGFyZSB0d28gd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbiBib3RoIGFyZSBkb2N1bWVudGVkLlxuXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkuaXNJbnNpZGUoIDAsIDAsIDEwMCwgMTAwICkueUlzKCA0MDAgKTtcblxuVGhlIGFib3ZlIGlzIHN0YXRpbmcgXCJ3aGVuIGFueSBwYXJ0IG9mIG5vZGUxIGlzIGluc2lkZSB0aGUgcmVjdGFuZ2xlIDAsIDAsIDEwMCwgMTAwIHRoZW4gdGhlIHkgdmFsdWUgb2Ygbm9kZTEgd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCBpc0luc2lkZVxuQHBhcmFtIHgge051bWJlcn0geCBwb3NpdGlvbiBvZiByZWN0YW5ndWxhciBhcmVhIHRvIGNoZWNrXG5AcGFyYW0geSB7TnVtYmVyfSB5IHBvc2l0aW9uIG9mIHJlY3Rhbmd1bGFyIGFyZWEgdG8gY2hlY2tcbkBwYXJhbSB3aWR0aCB7TnVtYmVyfSB3aWR0aCBvZiByZWN0YW5ndWxhciBhcmVhIHRvIGNoZWNrXG5AcGFyYW0gaGVpZ2h0IHtOdW1iZXJ9IGhlaWdodCBvZiByZWN0YW5ndWxhciBhcmVhIHRvIGNoZWNrXG53aWxsIGV2YWx1YXRlIHRydWVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuaXNJbnNpZGUgPSBmdW5jdGlvbigpIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgaXNJbnNpZGUsIGFyZ3VtZW50cyApO1xufTtcblxuXG4vKipcblRoZXJlIGFyZSB0d28gd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbiBib3RoIGFyZSBkb2N1bWVudGVkLlxuXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkuaXNPdXRzaWRlKCBub2RlMSApLnlJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiBub2RlMSBpcyBmdWxseSBvdXRzaWRlIG5vZGUyIChubyBwYXJ0IG9mIG5vZGUxIGlzIGluc2lkZSBub2RlMikgbm9kZTEgeSBpcyA0MDBcIi5cblxuQG1ldGhvZCBpc091dHNpZGVcbkBwYXJhbSBub2RlIHtMYXlvdXROb2RlfSBpZiB0aGUgbGF5b3V0IG5vZGUgd2hpY2ggaXNPdXRzaWRlIGlzIGNhbGxlZCBvbiBpcyBpbnNpZGUgdGhpcyBwYXNzZWQgTGF5b3V0Tm9kZSB0aGVuIHRoaXMgY29uZGl0aW9uYWxcbndpbGwgZXZhbHVhdGUgdHJ1ZVxuQGNoYWluYWJsZVxuKiovXG4vKipcblRoZXJlIGFyZSB0d28gd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbiBib3RoIGFyZSBkb2N1bWVudGVkLlxuXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkuaXNPdXRzaWRlKCAwLCAwLCAxMDAsIDEwMCApLnlJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiBubyBwYXJ0IG9mIG5vZGUxIGlzIGluc2lkZSB0aGUgcmVjdGFuZ2xlIDAsIDAsIDEwMCwgMTAwIHRoZW4gdGhlIHkgdmFsdWUgb2Ygbm9kZTEgd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCBpc091dHNpZGVcbkBwYXJhbSB4IHtOdW1iZXJ9IHggcG9zaXRpb24gb2YgcmVjdGFuZ3VsYXIgYXJlYSB0byBjaGVja1xuQHBhcmFtIHkge051bWJlcn0geSBwb3NpdGlvbiBvZiByZWN0YW5ndWxhciBhcmVhIHRvIGNoZWNrXG5AcGFyYW0gd2lkdGgge051bWJlcn0gd2lkdGggb2YgcmVjdGFuZ3VsYXIgYXJlYSB0byBjaGVja1xuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSBoZWlnaHQgb2YgcmVjdGFuZ3VsYXIgYXJlYSB0byBjaGVja1xud2lsbCBldmFsdWF0ZSB0cnVlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmlzT3V0c2lkZSA9IGZ1bmN0aW9uKCkge1xuXG5cdHJldHVybiBhZGRDb25kaXRpb25hbC5jYWxsKCB0aGlzLCBpc091dHNpZGUsIGFyZ3VtZW50cyApO1xufTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBMYXlvdXROb2RlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdGlmKCB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgKSB7XG5cblx0XHRyZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQgPiB2YWx1ZTtcdFxuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0ID4gdmFsdWUueSArIHZhbHVlLmhlaWdodDtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRpZiggdHlwZW9mIHZhbHVlID09ICdudW1iZXInICkge1xuXG5cdFx0cmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IDwgdmFsdWU7XHRcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiB0aGlzLnkgKyB0aGlzLmhlaWdodCA8IHZhbHVlLnkgKyB2YWx1ZS5oZWlnaHQ7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIHRoaXMuaGVpZ2h0ID4gdmFsdWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiB0aGlzLmhlaWdodCA8IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG5cdHZhciBsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b207XG5cblx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gNCApIHtcblxuXHRcdGxlZnQgPSBhcmd1bWVudHNbIDAgXTtcblx0XHR0b3AgPSBhcmd1bWVudHNbIDEgXTtcblx0XHRyaWdodCA9IGFyZ3VtZW50c1sgMiBdICsgbGVmdDtcblx0XHRib3R0b20gPSBhcmd1bWVudHNbIDMgXSArIHRvcDtcblx0fSBlbHNlIHtcblxuXHRcdGxlZnQgPSBhcmd1bWVudHNbIDAgXS54O1xuXHRcdHRvcCA9IGFyZ3VtZW50c1sgMCBdLnk7XG5cdFx0cmlnaHQgPSBhcmd1bWVudHNbIDAgXS53aWR0aCArIGxlZnQ7XG5cdFx0Ym90dG9tID0gYXJndW1lbnRzWyAwIF0uaGVpZ2h0ICsgdG9wO1xuXHR9XG5cblx0dmFyIG15TGVmdCA9IHRoaXMueDtcblx0dmFyIG15VG9wID0gdGhpcy55O1xuXHR2YXIgbXlSaWdodCA9IHRoaXMueCArIHRoaXMud2lkdGg7XG5cdHZhciBteUJvdHRvbSA9IHRoaXMueSArIHRoaXMuaGVpZ2h0O1xuXG5cdHJldHVybiAoIG15TGVmdCA+IGxlZnQgJiYgbXlMZWZ0IDwgcmlnaHQgJiYgbXlUb3AgPiB0b3AgJiYgbXlUb3AgPCBib3R0b20gKSB8fCAvL3RvcCBsZWZ0IGNvcm5lciBpcyBpbnNpZGVcblx0XHQgICAoIG15UmlnaHQgPiBsZWZ0ICYmIG15UmlnaHQgPCByaWdodCAmJiBteVRvcCA+IHRvcCAmJiBteVRvcCA8IGJvdHRvbSApIHx8IC8vdG9wIHJpZ2h0IGNvcm5lciBpcyBpbnNpZGVcblx0XHQgICAoIG15UmlnaHQgPiBsZWZ0ICYmIG15UmlnaHQgPCByaWdodCAmJiBteUJvdHRvbSA+IHRvcCAmJiBteUJvdHRvbSA8IGJvdHRvbSApIHx8IC8vYm90dG9tIHJpZ2h0IGNvcm5lciBpcyBpbnNpZGVcblx0XHQgICAoIG15TGVmdCA+IGxlZnQgJiYgbXlMZWZ0IDwgcmlnaHQgJiYgbXlCb3R0b20gPiB0b3AgJiYgbXlCb3R0b20gPCBib3R0b20gKTsgLy9ib3R0b20gbGVmdCBjb3JuZXIgaXMgaW5zaWRlXG59OyIsInZhciBpc0luc2lkZSA9IHJlcXVpcmUoICcuL2lzSW5zaWRlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG5cdHJldHVybiAhaXNJbnNpZGUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiB0aGlzLnggPiB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0aWYoIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyApIHtcblxuXHRcdHJldHVybiB0aGlzLnggPCB2YWx1ZTtcdFxuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIHRoaXMueCA8IHZhbHVlLng7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0aWYoIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyApIHtcblxuXHRcdHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoID4gdmFsdWU7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aCA+IHZhbHVlLnggKyB2YWx1ZS53aWR0aDtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aCA8IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRpZiggdHlwZW9mIHZhbHVlID09ICdudW1iZXInICkge1xuXG5cdFx0cmV0dXJuIHRoaXMueSA+IHZhbHVlO1x0XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gdGhpcy55ID4gdmFsdWUueTtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRpZiggdHlwZW9mIHZhbHVlID09ICdudW1iZXInICkge1xuXG5cdFx0cmV0dXJuIHRoaXMueSA8IHZhbHVlO1x0XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gdGhpcy55IDwgdmFsdWUueTtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gdGhpcy53aWR0aCA+IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gdGhpcy53aWR0aCA8IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl95ID0gTWF0aC5taW4oIHRoaXMuX3ksIHZhbHVlIC0gdGhpcy5faGVpZ2h0ICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feSA9IE1hdGgubWluKCB0aGlzLl95LCBpdGVtLnkgKyBpdGVtLmhlaWdodCAtIHRoaXMuX2hlaWdodCApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl95ID0gTWF0aC5tYXgoIHRoaXMuX3ksIHZhbHVlIC0gdGhpcy5faGVpZ2h0ICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feSA9IE1hdGgubWF4KCB0aGlzLl95LCBpdGVtLnkgKyBpdGVtLmhlaWdodCAtIHRoaXMuX2hlaWdodCApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl94ID0gTWF0aC5taW4oIHRoaXMuX3gsIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCA9IE1hdGgubWluKCB0aGlzLl94LCBpdGVtLnggKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feCA9IE1hdGgubWF4KCB0aGlzLl94LCB2YWx1ZSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggPSBNYXRoLm1heCggdGhpcy5feCwgaXRlbS54ICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcblxuXHRcdHRoaXMuX3ggPSBNYXRoLm1pbiggdGhpcy5feCwgYXJndW1lbnRzWyAwIF0gKTtcblx0XHR0aGlzLl95ID0gTWF0aC5taW4oIHRoaXMuX3ksIGFyZ3VtZW50c1sgMCBdICk7XG5cdH0gZWxzZSB7XG5cblx0XHR0aGlzLl94ID0gTWF0aC5taW4oIHRoaXMuX3gsIGFyZ3VtZW50c1sgMCBdICk7XG5cdFx0dGhpcy5feSA9IE1hdGgubWluKCB0aGlzLl95LCBhcmd1bWVudHNbIDEgXSApO1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCA9IE1hdGgubWluKCB0aGlzLl94LCBpdGVtLnggKTtcblx0dGhpcy5feSA9IE1hdGgubWluKCB0aGlzLl95LCBpdGVtLnkgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzLmxlbmd0aCA9PSAxICkge1xuXG5cdFx0dGhpcy5feCA9IE1hdGgubWF4KCB0aGlzLl94LCBhcmd1bWVudHNbIDAgXSApO1xuXHRcdHRoaXMuX3kgPSBNYXRoLm1heCggdGhpcy5feSwgYXJndW1lbnRzWyAwIF0gKTtcblx0fSBlbHNlIHtcblxuXHRcdHRoaXMuX3ggPSBNYXRoLm1heCggdGhpcy5feCwgYXJndW1lbnRzWyAwIF0gKTtcblx0XHR0aGlzLl95ID0gTWF0aC5tYXgoIHRoaXMuX3ksIGFyZ3VtZW50c1sgMSBdICk7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ID0gTWF0aC5tYXgoIHRoaXMuX3gsIGl0ZW0ueCApO1xuXHR0aGlzLl95ID0gTWF0aC5tYXgoIHRoaXMuX3ksIGl0ZW0ueSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl94ID0gTWF0aC5taW4oIHRoaXMuX3gsIHZhbHVlIC0gdGhpcy5fd2lkdGggKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ID0gTWF0aC5taW4oIHRoaXMuX3gsIGl0ZW0ueCAtIHRoaXMuX2hlaWdodCApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl94ID0gTWF0aC5tYXgoIHRoaXMuX3gsIHZhbHVlIC0gdGhpcy5fd2lkdGggKTtcbn07IiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgzMikiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl95ID0gTWF0aC5taW4oIHRoaXMuX3ksIHZhbHVlICk7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl95ID0gTWF0aC5taW4oIHRoaXMuX3ksIGl0ZW0ueSArIGl0ZW0uaGVpZ2h0IC0gdGhpcy5faGVpZ2h0ICk7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feSA9IE1hdGgubWF4KCB0aGlzLl95LCB2YWx1ZSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3kgPSBNYXRoLm1heCggdGhpcy5feSwgaXRlbS55ICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX2hlaWdodCA9IE1hdGgubWluKCB0aGlzLl9oZWlnaHQsIHZhbHVlICk7XG59OyIsImV4cG9ydHMubW9kdWxlID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5faGVpZ2h0ID0gTWF0aC5taW4oIHRoaXMuX2hlaWdodCwgaXRlbS5oZWlnaHQgKTsgXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcblxuXHRcdHRoaXMuX3dpZHRoID0gTWF0aC5taW4oIHRoaXMuX3dpZHRoLCBhcmd1bWVudHNbIDAgXSApO1xuXHRcdHRoaXMuX2hlaWdodCA9IE1hdGgubWluKCB0aGlzLl9oZWlnaHQsIGFyZ3VtZW50c1sgMCBdICk7XG5cdH0gZWxzZSB7XG5cblx0XHR0aGlzLl93aWR0aCA9IE1hdGgubWluKCB0aGlzLl93aWR0aCwgYXJndW1lbnRzWyAwIF0gKTtcblx0XHR0aGlzLl9oZWlnaHQgPSBNYXRoLm1pbiggdGhpcy5faGVpZ2h0LCBhcmd1bWVudHNbIDEgXSApO1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cblx0dGhpcy5fd2lkdGggPSBNYXRoLm1pbiggdGhpcy5fd2lkdGgsIGl0ZW0ud2lkdGggKTtcblx0dGhpcy5faGVpZ2h0ID0gTWF0aC5taW4oIHRoaXMuX2hlaWdodCwgaXRlbS5oZWlnaHQgKTsgXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX3dpZHRoID0gTWF0aC5taW4oIHRoaXMuX3dpZHRoLCB2YWx1ZSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3dpZHRoID0gTWF0aC5taW4oIHRoaXMuX3dpZHRoLCBpdGVtLndpZHRoICk7IFxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl9oZWlnaHQgPSBNYXRoLm1heCggdGhpcy5faGVpZ2h0LCB2YWx1ZSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX2hlaWdodCA9IE1hdGgubWF4KCB0aGlzLl9oZWlnaHQsIGl0ZW0uaGVpZ2h0ICk7IFxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDEgKSB7XG5cblx0XHR0aGlzLl93aWR0aCA9IE1hdGgubWF4KCB0aGlzLl93aWR0aCwgYXJndW1lbnRzWyAwIF0gKTtcblx0XHR0aGlzLl9oZWlnaHQgPSBNYXRoLm1heCggdGhpcy5faGVpZ2h0LCBhcmd1bWVudHNbIDAgXSApO1xuXHR9IGVsc2Uge1xuXG5cdFx0dGhpcy5fd2lkdGggPSBNYXRoLm1heCggdGhpcy5fd2lkdGgsIGFyZ3VtZW50c1sgMCBdICk7XG5cdFx0dGhpcy5faGVpZ2h0ID0gTWF0aC5tYXgoIHRoaXMuX2hlaWdodCwgYXJndW1lbnRzWyAxIF0gKTtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3dpZHRoID0gTWF0aC5tYXgoIHRoaXMuX3dpZHRoLCBpdGVtLndpZHRoICk7XG5cdHRoaXMuX2hlaWdodCA9IE1hdGgubWF4KCB0aGlzLl9oZWlnaHQsIGl0ZW0uaGVpZ2h0ICk7IFxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl93aWR0aCA9IE1hdGgubWF4KCB0aGlzLl93aWR0aCwgdmFsdWUgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl93aWR0aCA9IE1hdGgubWF4KCB0aGlzLl93aWR0aCwgaXRlbS53aWR0aCApOyBcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl95ICs9IGl0ZW0ueSAtIHRoaXMuX2hlaWdodDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl95ICs9IGl0ZW0ueSArIGl0ZW0uaGVpZ2h0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggKz0gaXRlbS54IC0gdGhpcy5fd2lkdGg7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCArPSBpdGVtLnggKyBpdGVtLndpZHRoO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggKz0gaXRlbS54O1xuXHR0aGlzLl95ICs9IGl0ZW0ueTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl95ICs9IGl0ZW0ueSArIGl0ZW0uaGVpZ2h0IC0gdGhpcy5faGVpZ2h0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggKz0gaXRlbS54ICsgKCBpdGVtLndpZHRoIC0gdGhpcy5fd2lkdGggKSAqIDAuNTtcdFxuXHR0aGlzLl95ICs9IGl0ZW0ueSArICggaXRlbS5oZWlnaHQgLSB0aGlzLl9oZWlnaHQgKSAqIDAuNTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ICs9IGl0ZW0ueCArICggaXRlbS53aWR0aCAtIHRoaXMuX3dpZHRoICkgKiAwLjU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCArPSBpdGVtLng7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHgsIHkgKSB7XG5cblx0dGhpcy5feCArPSB4O1xuXHR0aGlzLl95ICs9IHk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0dGhpcy5feCArPSBpdGVtLndpZHRoICogcGVyY2VudGFnZTtcblx0dGhpcy5feSArPSBpdGVtLmhlaWdodCAqIHBlcmNlbnRhZ2U7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCArPSBpdGVtLnggKyBpdGVtLndpZHRoIC0gdGhpcy5fd2lkdGg7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feSArPSBpdGVtLnk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feSArPSBpdGVtLnkgKyAoIGl0ZW0uaGVpZ2h0IC0gdGhpcy5faGVpZ2h0ICkgKiAwLjU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHggKSB7XG5cblx0dGhpcy5feCArPSB4O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHRoaXMuX3ggKz0gaXRlbS53aWR0aCAqIHBlcmNlbnRhZ2U7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHkgKSB7XG5cblx0dGhpcy5feSArPSB5O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHRoaXMuX3kgKz0gaXRlbS5oZWlnaHQgKiBwZXJjZW50YWdlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBoZWlnaHQgKSB7XG5cblx0dGhpcy5faGVpZ2h0ICs9IGhlaWdodDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHR0aGlzLl9oZWlnaHQgKz0gaXRlbS5oZWlnaHQgKiBwZXJjZW50YWdlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHR0aGlzLl9oZWlnaHQgKz0gdGhpcy5fd2lkdGggLyBvcmlnaW5hbFdpZHRoICogb3JpZ2luYWxIZWlnaHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5faGVpZ2h0ICs9IGl0ZW0uaGVpZ2h0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3dpZHRoICs9IGl0ZW0ud2lkdGg7XG5cdHRoaXMuX2hlaWdodCArPSBpdGVtLmhlaWdodDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl93aWR0aCArPSBpdGVtLndpZHRoO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xuXG5cdGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDEgKSB7XG5cblx0XHR0aGlzLl93aWR0aCArPSBhcmd1bWVudHNbIDAgXTtcblx0XHR0aGlzLl9oZWlnaHQgKz0gYXJndW1lbnRzWyAwIF07XG5cdH0gZWxzZSB7XG5cblx0XHR0aGlzLl93aWR0aCArPSBhcmd1bWVudHNbIDAgXTtcblx0XHR0aGlzLl9oZWlnaHQgKz0gYXJndW1lbnRzWyAxIF07XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHR0aGlzLl93aWR0aCArPSBpdGVtLndpZHRoICogcGVyY2VudGFnZTtcdFxuXHR0aGlzLl9oZWlnaHQgKz0gaXRlbS5oZWlnaHQgKiBwZXJjZW50YWdlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHRpZiggdGhpcy5fd2lkdGggPT0gMCApIHtcblxuXHRcdHRoaXMuX3dpZHRoICs9IHRoaXMuX2hlaWdodCAvIG9yaWdpbmFsSGVpZ2h0ICogb3JpZ2luYWxXaWR0aDtcblx0fSBlbHNlIGlmKCB0aGlzLl9oZWlnaHQgPT0gMCApIHtcblxuXHRcdHRoaXMuX2hlaWdodCArPSB0aGlzLl93aWR0aCAvIG9yaWdpbmFsV2lkdGggKiBvcmlnaW5hbEhlaWdodDtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB3aWR0aCApIHtcblxuXHR0aGlzLl93aWR0aCArPSB3aWR0aDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHR0aGlzLl93aWR0aCArPSBpdGVtLndpZHRoICogcGVyY2VudGFnZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggb3JpZ2luYWxXaWR0aCwgb3JpZ2luYWxIZWlnaHQgKSB7XG5cblx0dGhpcy5fd2lkdGggKz0gdGhpcy5faGVpZ2h0IC8gb3JpZ2luYWxIZWlnaHQgKiBvcmlnaW5hbFdpZHRoO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5faGVpZ2h0IC09IGl0ZW0uaGVpZ2h0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggLT0gaXRlbS54O1xuXHR0aGlzLl95IC09IGl0ZW0ueTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl93aWR0aCAtPSBpdGVtLndpZHRoO1xuXHR0aGlzLl9oZWlnaHQgLT0gaXRlbS5oZWlnaHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5fd2lkdGggLT0gaXRlbS53aWR0aDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94IC09IGl0ZW0ueDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl95IC09IGl0ZW0ueTtcbn07IiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSg3MSkiLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDU0KSIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoNzIpIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSg3MykiLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDU4KSIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoNjIpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5faGVpZ2h0IC09IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB4LCB5ICkge1xuXG5cdHRoaXMuX3ggLT0geDtcblx0dGhpcy5feSAtPSB5O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xuXG5cdHRoaXMuX3dpZHRoIC09IHdpZHRoO1xuXHR0aGlzLl9oZWlnaHQgLT0gaGVpZ2h0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl93aWR0aCAtPSB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feCAtPSB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feSAtPSB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5faGVpZ2h0ICs9IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDU5KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKSB7XG5cblx0dGhpcy5fd2lkdGggKz0gd2lkdGg7XG5cdHRoaXMuX2hlaWdodCArPSBoZWlnaHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX3dpZHRoICs9IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl94ICs9IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl95ICs9IHZhbHVlO1xufTsiXX0=
;