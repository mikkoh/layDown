;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LayDown = require( '../../src/LayDown' );

console.log( 'HEY THERE SUNSHINE' );

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




var layout = new LayDown( layoutFunction, readFunction, createFunction );

var logo = layout.create( document.getElementById( 'logo' ) );

var menu = layout.create();
var menu1 = layout.create( document.getElementById( 'menu1' ) );
var menu2 = layout.create( document.getElementById( 'menu2' ) );
var menu3 = layout.create( document.getElementById( 'menu3' ) );
var imageContainer = layout.create( document.getElementById( 'imageContainer' ) );
var content1 = layout.create( document.getElementById( 'content1' ) );
var content2 = layout.create( document.getElementById( 'content2' ) );

logo.name = 'logo';
menu.name = 'menu';
menu1.name = 'menu1';
menu2.name = 'menu2';
menu3.name = 'menu3';
content1.name = 'content1';
content2.name = 'content2';
imageContainer.name= 'imageContainer';
imageContainer.inner.name = 'imageContainerInner';

logo.horizontallyCenteredWith( layout ).topAlignedWith( layout )
.when( layout ).heightLessThan( 342 ).matchesHeightOf( layout ).minus( 60 ).widthIsProportional( 200, 282 )
.default().sizeIs( 200, 282 );

menu.matchesWidthOf( layout ).horizontallyCenteredWith( layout ).alignedBelow( logo ).plus( 20 );

menu1.alignedWith( menu )
.when( menu ).widthLessThan( 600 ).matchesWidthOf( menu )
.default().widthIsAPercentageOf( menu, 0.33333 ).minus( 1 );

menu2.matchesSizeOf( menu1 )
.when( menu ).widthLessThan( 600 ).alignedBelow( menu1 ).plus( 3 ).leftAlignedWith( menu1 ).on( onMenu2SmallerThan600 )
.default().topAlignedWith( menu ).alignedRightOf( menu1 ).plus( 3 ).on( onMenu2GreaterThan600 );

menu3.matchesSizeOf( menu1 )
.when( menu ).widthLessThan( 600 ).alignedBelow( menu2 ).plus( 3 ).leftAlignedWith( menu1 )
.default().topAlignedWith( menu ).alignedRightOf( menu2 ).plus( 3 );

imageContainer.matchesWidthOf( menu ).heightIsProportional( 2700, 652 ).alignedBelow( menu3 ).plus( 3 );

content1.matchesWidthOf( imageContainer.inner ).min( 900 ).heightIsProportional( 2700, 652 ).centeredWith( imageContainer.inner );

content2.matchesWidthOf( menu ).heightIs( 200 ).alignedBelow( imageContainer ).plus( 3 );



onResize();
window.onresize = onResize;

function onResize() {

	layout.resizeAndPosition( 0, 0, window.innerWidth, window.innerHeight );
}

function onMenu2SmallerThan600( isSmaller ) {

	//console.log( 'MENU2 IS SMALLER', isSmaller );
}

function onMenu2GreaterThan600( isGreaterThan ) {

	//console.log( 'MENU2 IS GREATER', isGreaterThan );
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vZXhhbXBsZS9wYWdlL21haW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL0xheURvd24uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL0xheW91dE5vZGUuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2NvbmRpdGlvbmFscy9ib3R0b21HcmVhdGVyVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL2JvdHRvbUxlc3NUaGFuLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvaGVpZ2h0R3JlYXRlclRoYW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2NvbmRpdGlvbmFscy9oZWlnaHRMZXNzVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL2lzSW5zaWRlLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvaXNPdXRzaWRlLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvbGVmdEdyZWF0ZXJUaGFuLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvbGVmdExlc3NUaGFuLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvcmlnaHRHcmVhdGVyVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL3JpZ2h0TGVzc1RoYW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2NvbmRpdGlvbmFscy90b3BHcmVhdGVyVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL3RvcExlc3NUaGFuLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvd2lkdGhHcmVhdGVyVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL3dpZHRoTGVzc1RoYW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vYm90dG9tTWF4LmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL2JvdHRvbU1heEZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vYm90dG9tTWluLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL2JvdHRvbU1pbkZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vbGVmdE1heC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi9sZWZ0TWF4RnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi9sZWZ0TWluLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL2xlZnRNaW5Gcm9tLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFBvc2l0aW9uLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFBvc2l0aW9uRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5Qb3NpdGlvbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5Qb3NpdGlvbkZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vcmlnaHRNYXguanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vcmlnaHRNYXhGcm9tLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL3JpZ2h0TWluLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL3JpZ2h0TWluRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi90b3BNYXguanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vdG9wTWF4RnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi90b3BNaW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vdG9wTWluRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21heEhlaWdodC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21heEhlaWdodEZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9tYXhTaXplLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFNpemUvbWF4U2l6ZUZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9tYXhXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21heFdpZHRoRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21pbkhlaWdodC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21pbkhlaWdodEZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9taW5TaXplLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFNpemUvbWluU2l6ZUZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9taW5XaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21pbldpZHRoRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vYWxpZ25lZEFib3ZlLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9hbGlnbmVkQmVsb3cuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL2FsaWduZWRMZWZ0T2YuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL2FsaWduZWRSaWdodE9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9hbGlnbmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vYm90dG9tQWxpZ25lZFdpdGguanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL2NlbnRlcmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vaG9yaXpvbnRhbGx5Q2VudGVyZWRXaXRoLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9sZWZ0QWxpZ25lZFdpdGguanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL3Bvc2l0aW9uSXMuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL3Bvc2l0aW9uSXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9yaWdodEFsaWduZWRXaXRoLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi90b3BBbGlnbmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vdmVydGljYWxseUNlbnRlcmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24veElzLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi94SXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi95SXMuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL3lJc0FQZXJjZW50YWdlT2YuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFNpemUvaGVpZ2h0SXMuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFNpemUvaGVpZ2h0SXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL2hlaWdodElzUHJvcG9ydGlvbmFsLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL21hdGNoZXNIZWlnaHRPZi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0U2l6ZS9tYXRjaGVzU2l6ZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL21hdGNoZXNXaWR0aE9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3NpemVJcy5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0U2l6ZS9zaXplSXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3NpemVJc1Byb3BvcnRpb25hbC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0U2l6ZS93aWR0aElzLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3dpZHRoSXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3dpZHRoSXNQcm9wb3J0aW9uYWwuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNQb3NpdGlvbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9taW51c1NpemUuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9taW51c1guanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNZLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3BsdXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvcGx1c1Bvc2l0aW9uLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3BsdXNTaXplLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3BsdXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9wbHVzWC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9wbHVzWS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92TWludXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdk1pbnVzUG9zaXRpb24uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdk1pbnVzU2l6ZS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92TWludXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92TWludXNYLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3ZNaW51c1kuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNQb3NpdGlvbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92UGx1c1NpemUuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92UGx1c1guanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNZLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbInZhciBMYXlEb3duID0gcmVxdWlyZSggJy4uLy4uL3NyYy9MYXlEb3duJyApO1xuXG5jb25zb2xlLmxvZyggJ0hFWSBUSEVSRSBTVU5TSElORScgKTtcblxuZnVuY3Rpb24gbGF5b3V0RnVuY3Rpb24oIGl0ZW0sIG5vZGUsIHNldFdpZHRoLCBzZXRIZWlnaHQgKSB7IFxuXG5cdGl0ZW0uc3R5bGUubGVmdCA9IE1hdGguZmxvb3IoIG5vZGUueCApICsgJ3B4Jztcblx0aXRlbS5zdHlsZS50b3AgPSBNYXRoLmZsb29yKCBub2RlLnkgKSArICdweCc7XG5cblx0aWYoIHNldFdpZHRoICkge1xuXG5cdFx0aXRlbS5zdHlsZS53aWR0aCA9IE1hdGguZmxvb3IoIG5vZGUud2lkdGggKSArICdweCc7XG5cdH1cblxuXHRpZiggc2V0SGVpZ2h0ICkge1xuXG5cdFx0aXRlbS5zdHlsZS5oZWlnaHQgPSBNYXRoLmZsb29yKCBub2RlLmhlaWdodCApICsgJ3B4Jztcblx0fVxufVxuXG5mdW5jdGlvbiByZWFkRnVuY3Rpb24oIGl0ZW0sIG5hbWUgKSB7XG5cblx0aWYoIG5hbWUgPT0gJ3dpZHRoJyApIHtcblxuXHRcdHJldHVybiBpdGVtLmNsaWVudFdpZHRoO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGl0ZW0uY2xpZW50SGVpZ2h0O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdGl0ZW0uc3R5bGVbICdib3gtc2l6aW5nJyBdID0gJ2JvcmRlci1ib3gnO1xuXHRpdGVtLnN0eWxlWyAnLW1vei1ib3gtc2l6aW5nJyBdID0gJ2JvcmRlci1ib3gnO1xuXHRpdGVtLnN0eWxlWyAnLXdlYmtpdC1ib3gtc2l6aW5nJyBdID0gJ2JvcmRlci1ib3gnO1xuXG5cdGl0ZW0uc3R5bGVbICdwb3NpdGlvbicgXSA9ICdhYnNvbHV0ZSc7XG59XG5cblxuXG5cbnZhciBsYXlvdXQgPSBuZXcgTGF5RG93biggbGF5b3V0RnVuY3Rpb24sIHJlYWRGdW5jdGlvbiwgY3JlYXRlRnVuY3Rpb24gKTtcblxudmFyIGxvZ28gPSBsYXlvdXQuY3JlYXRlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ2xvZ28nICkgKTtcblxudmFyIG1lbnUgPSBsYXlvdXQuY3JlYXRlKCk7XG52YXIgbWVudTEgPSBsYXlvdXQuY3JlYXRlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ21lbnUxJyApICk7XG52YXIgbWVudTIgPSBsYXlvdXQuY3JlYXRlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ21lbnUyJyApICk7XG52YXIgbWVudTMgPSBsYXlvdXQuY3JlYXRlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ21lbnUzJyApICk7XG52YXIgaW1hZ2VDb250YWluZXIgPSBsYXlvdXQuY3JlYXRlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ2ltYWdlQ29udGFpbmVyJyApICk7XG52YXIgY29udGVudDEgPSBsYXlvdXQuY3JlYXRlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ2NvbnRlbnQxJyApICk7XG52YXIgY29udGVudDIgPSBsYXlvdXQuY3JlYXRlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ2NvbnRlbnQyJyApICk7XG5cbmxvZ28ubmFtZSA9ICdsb2dvJztcbm1lbnUubmFtZSA9ICdtZW51Jztcbm1lbnUxLm5hbWUgPSAnbWVudTEnO1xubWVudTIubmFtZSA9ICdtZW51Mic7XG5tZW51My5uYW1lID0gJ21lbnUzJztcbmNvbnRlbnQxLm5hbWUgPSAnY29udGVudDEnO1xuY29udGVudDIubmFtZSA9ICdjb250ZW50Mic7XG5pbWFnZUNvbnRhaW5lci5uYW1lPSAnaW1hZ2VDb250YWluZXInO1xuaW1hZ2VDb250YWluZXIuaW5uZXIubmFtZSA9ICdpbWFnZUNvbnRhaW5lcklubmVyJztcblxubG9nby5ob3Jpem9udGFsbHlDZW50ZXJlZFdpdGgoIGxheW91dCApLnRvcEFsaWduZWRXaXRoKCBsYXlvdXQgKVxuLndoZW4oIGxheW91dCApLmhlaWdodExlc3NUaGFuKCAzNDIgKS5tYXRjaGVzSGVpZ2h0T2YoIGxheW91dCApLm1pbnVzKCA2MCApLndpZHRoSXNQcm9wb3J0aW9uYWwoIDIwMCwgMjgyIClcbi5kZWZhdWx0KCkuc2l6ZUlzKCAyMDAsIDI4MiApO1xuXG5tZW51Lm1hdGNoZXNXaWR0aE9mKCBsYXlvdXQgKS5ob3Jpem9udGFsbHlDZW50ZXJlZFdpdGgoIGxheW91dCApLmFsaWduZWRCZWxvdyggbG9nbyApLnBsdXMoIDIwICk7XG5cbm1lbnUxLmFsaWduZWRXaXRoKCBtZW51IClcbi53aGVuKCBtZW51ICkud2lkdGhMZXNzVGhhbiggNjAwICkubWF0Y2hlc1dpZHRoT2YoIG1lbnUgKVxuLmRlZmF1bHQoKS53aWR0aElzQVBlcmNlbnRhZ2VPZiggbWVudSwgMC4zMzMzMyApLm1pbnVzKCAxICk7XG5cbm1lbnUyLm1hdGNoZXNTaXplT2YoIG1lbnUxIClcbi53aGVuKCBtZW51ICkud2lkdGhMZXNzVGhhbiggNjAwICkuYWxpZ25lZEJlbG93KCBtZW51MSApLnBsdXMoIDMgKS5sZWZ0QWxpZ25lZFdpdGgoIG1lbnUxICkub24oIG9uTWVudTJTbWFsbGVyVGhhbjYwMCApXG4uZGVmYXVsdCgpLnRvcEFsaWduZWRXaXRoKCBtZW51ICkuYWxpZ25lZFJpZ2h0T2YoIG1lbnUxICkucGx1cyggMyApLm9uKCBvbk1lbnUyR3JlYXRlclRoYW42MDAgKTtcblxubWVudTMubWF0Y2hlc1NpemVPZiggbWVudTEgKVxuLndoZW4oIG1lbnUgKS53aWR0aExlc3NUaGFuKCA2MDAgKS5hbGlnbmVkQmVsb3coIG1lbnUyICkucGx1cyggMyApLmxlZnRBbGlnbmVkV2l0aCggbWVudTEgKVxuLmRlZmF1bHQoKS50b3BBbGlnbmVkV2l0aCggbWVudSApLmFsaWduZWRSaWdodE9mKCBtZW51MiApLnBsdXMoIDMgKTtcblxuaW1hZ2VDb250YWluZXIubWF0Y2hlc1dpZHRoT2YoIG1lbnUgKS5oZWlnaHRJc1Byb3BvcnRpb25hbCggMjcwMCwgNjUyICkuYWxpZ25lZEJlbG93KCBtZW51MyApLnBsdXMoIDMgKTtcblxuY29udGVudDEubWF0Y2hlc1dpZHRoT2YoIGltYWdlQ29udGFpbmVyLmlubmVyICkubWluKCA5MDAgKS5oZWlnaHRJc1Byb3BvcnRpb25hbCggMjcwMCwgNjUyICkuY2VudGVyZWRXaXRoKCBpbWFnZUNvbnRhaW5lci5pbm5lciApO1xuXG5jb250ZW50Mi5tYXRjaGVzV2lkdGhPZiggbWVudSApLmhlaWdodElzKCAyMDAgKS5hbGlnbmVkQmVsb3coIGltYWdlQ29udGFpbmVyICkucGx1cyggMyApO1xuXG5cblxub25SZXNpemUoKTtcbndpbmRvdy5vbnJlc2l6ZSA9IG9uUmVzaXplO1xuXG5mdW5jdGlvbiBvblJlc2l6ZSgpIHtcblxuXHRsYXlvdXQucmVzaXplQW5kUG9zaXRpb24oIDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcbn1cblxuZnVuY3Rpb24gb25NZW51MlNtYWxsZXJUaGFuNjAwKCBpc1NtYWxsZXIgKSB7XG5cblx0Ly9jb25zb2xlLmxvZyggJ01FTlUyIElTIFNNQUxMRVInLCBpc1NtYWxsZXIgKTtcbn1cblxuZnVuY3Rpb24gb25NZW51MkdyZWF0ZXJUaGFuNjAwKCBpc0dyZWF0ZXJUaGFuICkge1xuXG5cdC8vY29uc29sZS5sb2coICdNRU5VMiBJUyBHUkVBVEVSJywgaXNHcmVhdGVyVGhhbiApO1xufSIsInZhciBMYXlvdXROb2RlID0gcmVxdWlyZSggJy4vTGF5b3V0Tm9kZScgKTtcblxuLyoqXG5MYXlEb3duIGlzIHRoZSByb290IG9mIHRoZSBsYXlEb3duIGxpYnJhcnkuIEl0IGlzIGEgZmFjdG9yeSB0byBjcmVhdGUge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZVwifX17ey9jcm9zc0xpbmt9fSdzLlxuXG5BbiBpbnN0YW5jZSBvZiBMYXlEb3duIGlzIGVxdWl2YWxlbnQgdG8gc2F5aW5nIFwiYSBsYXlvdXRcIi4gU28gYSBMYXlEb3duIGlzIGEgbGF5b3V0IHRoYXQgeW91IGxheSBkb3duIGl0ZW1zIG9uLlxuXG5XaGVuIHlvdSBpbnN0YW50aWF0ZSBhIExheURvd24geW91IG11c3QgcGFzcyBpbiB0d28gZnVuY3Rpb25zLiBcblxuVGhlIGZpcnN0IG9uZSBpcyBhIGxheW91dCBmdW5jdGlvbiB3aGljaCB3aWxsIHBvc2l0aW9uIHRoaW5ncy4gXG5cbkFuIGV4YW1wbGUgbGF5b3V0IGZ1bmN0aW9uOlxuXG5cdGZ1bmN0aW9uIGxheW91dEZ1bmN0aW9uKCBpdGVtLCBub2RlLCBzZXRXaWR0aCwgc2V0SGVpZ2h0ICkgeyBcblxuXHRcdGl0ZW0uc3R5bGUubGVmdCA9IE1hdGguZmxvb3IoIG5vZGUueCApICsgJ3B4Jztcblx0XHRpdGVtLnN0eWxlLnRvcCA9IE1hdGguZmxvb3IoIG5vZGUueSApICsgJ3B4JztcblxuXHRcdGlmKCBzZXRXaWR0aCApIHtcblxuXHRcdFx0aXRlbS5zdHlsZS53aWR0aCA9IE1hdGguZmxvb3IoIG5vZGUud2lkdGggKSArICdweCc7XG5cdFx0fVxuXG5cdFx0aWYoIHNldEhlaWdodCApIHtcblxuXHRcdFx0aXRlbS5zdHlsZS5oZWlnaHQgPSBNYXRoLmZsb29yKCBub2RlLmhlaWdodCApICsgJ3B4Jztcblx0XHR9XG5cdH1cblxuXG5UaGUgc2Vjb25kIGlzIGEgcmVhZCBmdW5jdGlvbiB3aGljaCB3aWxsIHJlYWQgaW4gdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgYW4gaXRlbSBpZiBubyBydWxlcyBlZmZlY3RlZCB0aG9zZSBwcm9wZXJ0aWVzLiBcblxuSGVyZSBpcyBhbiBleGFtcGxlIHJlYWRGdW5jdGlvbjpcblxuXHRmdW5jdGlvbiByZWFkRnVuY3Rpb24oIGl0ZW0sIG5hbWUgKSB7XG5cblx0XHRpZiggbmFtZSA9PSAnd2lkdGgnICkge1xuXG5cdFx0XHRyZXR1cm4gaXRlbS5jbGllbnRXaWR0aDtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRyZXR1cm4gaXRlbS5jbGllbnRIZWlnaHQ7XG5cdFx0fVxuXHR9XG5cblRoZSB0aGlyZCBmdW5jdGlvbiB0aGF0IHlvdSBtYXkgcGFzcyBpbiBpcyBhIGNyZWF0ZSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIHJ1biBvbiBlYWNoIGl0ZW0gYmVmb3JlIGEgTGF5b3V0Tm9kZSBpcyBjcmVhdGVkLlxuXG5IZXJlIGlzIGFuIGV4YW1wbGUgY3JlYXRlRnVuY3Rpb246XG5cblx0ZnVuY3Rpb24gY3JlYXRlRnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0XHRpdGVtLnN0eWxlWyAnYm94LXNpemluZycgXSA9ICdib3JkZXItYm94Jztcblx0XHRpdGVtLnN0eWxlWyAnLW1vei1ib3gtc2l6aW5nJyBdID0gJ2JvcmRlci1ib3gnO1xuXHRcdGl0ZW0uc3R5bGVbICctd2Via2l0LWJveC1zaXppbmcnIF0gPSAnYm9yZGVyLWJveCc7XG5cblx0XHRpdGVtLnN0eWxlWyAncG9zaXRpb24nIF0gPSAnYWJzb2x1dGUnO1xuXHR9XG5cblxuXG5AY2xhc3MgTGF5RG93blxuQGNvbnN0cnVjdG9yXG5cbkBwYXJhbSBsYXlvdXRGdW5jdGlvbiB7RnVuY3Rpb259IFRoZSBsYXlvdXRGdW5jdGlvbiBmdW5jdGlvbiBpcyBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgdHJhbnNsYXRlIHRoZSB4LCB5LCB3aWR0aCwgYW5kIGhlaWdodCBwcm9wZXJ0aWVzIG9mIGFcbkxheW91dE5vZGUgaW50byBhY3R1YWwgcGh5c2ljYWwgc2NyZWVuIHBvc2l0aW9uLiAoc2VlIHRoZSBhYm92ZSBleGFtcGxlKVxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgd2UncmUgd29ya2luZyB3aXRoIHRoZSBET00gaXQgd291bGQgc2V0IENTUyBwcm9wZXJ0aWVzIG9uIHRoZSBcIml0ZW1cIiBwYXNzZWQgaW4gdG8gZW5zdXJlIHRoYXQgdGhlIGl0ZW0gaXMgb24gXG5zY3JlZW4gYXQgeCwgeSBhdCB0aGUgY29ycmVjdCBzaXplLiAoc2VlIHRoZSBhYm92ZSBleGFtcGxlKVxuXG5AcGFyYW0gcmVhZEZ1bmN0aW9uIHtmdW5jdGlvbn0gSWYgeW91IGRlZmluZSBubyBzaXppbmcgcnVsZXMgdG8gc2V0IHdpZHRoIGFuZCBoZWlnaHQgb2YgYW4gXCJpdGVtXCIvTGF5b3V0Tm9kZSB0aGVuIHdlIHdpbGwgbmVlZCB0byByZWFkIHRoZVxud2lkdGggYW5kIGhlaWdodCBvZiB0aGUgb2JqZWN0IHRvIGJlIGFibGUgdG8gcG9zaXRpb24gZGVwZW5kZW50IExheW91dE5vZGUncy5cblxuQHBhcmFtIGNyZWF0ZUZ1bmN0aW9uIHtmdW5jdGlvbn0gSXMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgcnVuIG9uIGV2ZXJ5IGV2ZXJ5IGl0ZW0gdG8gYmUgbGF5ZWQgb3V0IGJlZm9yZSBhIExheW91dE5vZGUgaXMgY3JlYXRlZC5cblxuTGV0J3Mgc2F5IHlvdSdyZSB3b3JraW5nIHdpdGggdGhlIERPTSB5b3UgbWF5IHdhbnQgdG8gZm9yIGluc3RhbmNlIHNldCB0aGUgQ1NTIHBvc2l0aW9uIHByb3BlcnR5IHRvIGJlIGFic29sdXRlIHdpdGhpbiB0aGlzIGZ1bmN0aW9uLiAoc2VlIHRoZSBhYm92ZSBleGFtcGxlKVxuXG4qKi9cbnZhciBMYXlEb3duID0gZnVuY3Rpb24oIGxheW91dEZ1bmN0aW9uLCByZWFkRnVuY3Rpb24sIGNyZWF0ZUZ1bmN0aW9uICkge1xuXG5cdHRoaXMubGF5b3V0RnVuY3Rpb24gPSBsYXlvdXRGdW5jdGlvbjtcblx0dGhpcy5yZWFkRnVuY3Rpb24gPSByZWFkRnVuY3Rpb247XG5cdHRoaXMuY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbiB8fCBudWxsO1xuXHR0aGlzLm5vZGVzID0gW107XG59O1xuXG4vKipcblRoaXMgaXMgdGhlIHggcG9zaXRpb24gb2YgdGhlIExheURvd24gb24gc2NyZWVuLiBJbml0aWFsbHkgdGhlIHZhbHVlIG9mIHggd2lsbCBiZSAwIHVudGlsIFxue3sjY3Jvc3NMaW5rIFwiTGF5RG93bi9yZXNpemVBbmRQb3NpdGlvbjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gaXMgY2FsbGVkLlxuXG5PbmNlIHt7I2Nyb3NzTGluayBcIkxheURvd24vcmVzaXplQW5kUG9zaXRpb246bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGhhcyBiZWVuIGNhbGxlZCB0aGUgeCB2YWx1ZSB3aWxsIGJlIHdoYXRldmVyIHdhcyBwYXNzZWRcbmluIGZvciB0aGUgeCBwYXJhbWV0ZXIuXG5cblRoaXMgcHJvcGVydHkgaXMgcmVhZCBvbmx5IGFuZCBzaG91bGQgbm90IGJlIHNldCBtYW51YWxseS5cblxuQHByb3BlcnR5IHhcbkB0eXBlIE51bWJlclxuQHJlYWRPbmx5XG4qKi9cbkxheURvd24ucHJvdG90eXBlLnggPSAwO1xuXG5cbi8qKlxuVGhpcyBpcyB0aGUgeSBwb3NpdGlvbiBvZiB0aGUgTGF5RG93biBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2YgeSB3aWxsIGJlIDAgdW50aWwgXG57eyNjcm9zc0xpbmsgXCJMYXlEb3duL3Jlc2l6ZUFuZFBvc2l0aW9uOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBpcyBjYWxsZWQuXG5cbk9uY2Uge3sjY3Jvc3NMaW5rIFwiTGF5RG93bi9yZXNpemVBbmRQb3NpdGlvbjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gaGFzIGJlZW4gY2FsbGVkIHRoZSB5IHZhbHVlIHdpbGwgYmUgd2hhdGV2ZXIgd2FzIHBhc3NlZFxuaW4gZm9yIHRoZSB5IHBhcmFtZXRlci5cblxuVGhpcyBwcm9wZXJ0eSBpcyByZWFkIG9ubHkgYW5kIHNob3VsZCBub3QgYmUgc2V0IG1hbnVhbGx5LlxuXG5AcHJvcGVydHkgeVxuQHR5cGUgTnVtYmVyXG5AcmVhZE9ubHlcbioqL1xuTGF5RG93bi5wcm90b3R5cGUueSA9IDA7XG5cblxuLyoqXG5UaGlzIGlzIHRoZSB3aWR0aCBwb3NpdGlvbiBvZiB0aGUgTGF5RG93biBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2Ygd2lkdGggd2lsbCBiZSAwIHVudGlsIFxue3sjY3Jvc3NMaW5rIFwiTGF5RG93bi9yZXNpemVBbmRQb3NpdGlvbjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gaXMgY2FsbGVkLlxuXG5PbmNlIHt7I2Nyb3NzTGluayBcIkxheURvd24vcmVzaXplQW5kUG9zaXRpb246bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGhhcyBiZWVuIGNhbGxlZCB0aGUgd2lkdGggdmFsdWUgd2lsbCBiZSB3aGF0ZXZlciB3YXMgcGFzc2VkXG5pbiBmb3IgdGhlIHdpZHRoIHBhcmFtZXRlci5cblxuVGhpcyBwcm9wZXJ0eSBpcyByZWFkIG9ubHkgYW5kIHNob3VsZCBub3QgYmUgc2V0IG1hbnVhbGx5LlxuXG5AcHJvcGVydHkgd2lkdGhcbkB0eXBlIE51bWJlclxuQHJlYWRPbmx5XG4qKi9cbkxheURvd24ucHJvdG90eXBlLndpZHRoID0gMDtcblxuXG4vKipcblRoaXMgaXMgdGhlIGhlaWdodCBwb3NpdGlvbiBvZiB0aGUgTGF5RG93biBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2YgaGVpZ2h0IHdpbGwgYmUgMCB1bnRpbCBcbnt7I2Nyb3NzTGluayBcIkxheURvd24vcmVzaXplQW5kUG9zaXRpb246bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGlzIGNhbGxlZC5cblxuT25jZSB7eyNjcm9zc0xpbmsgXCJMYXlEb3duL3Jlc2l6ZUFuZFBvc2l0aW9uOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBoYXMgYmVlbiBjYWxsZWQgdGhlIGhlaWdodCB2YWx1ZSB3aWxsIGJlIHdoYXRldmVyIHdhcyBwYXNzZWRcbmluIGZvciB0aGUgaGVpZ2h0IHBhcmFtZXRlci5cblxuVGhpcyBwcm9wZXJ0eSBpcyByZWFkIG9ubHkgYW5kIHNob3VsZCBub3QgYmUgc2V0IG1hbnVhbGx5LlxuXG5AcHJvcGVydHkgaGVpZ2h0XG5AdHlwZSBOdW1iZXJcbkByZWFkT25seVxuKiovXG5MYXlEb3duLnByb3RvdHlwZS5oZWlnaHQgPSAwO1xuXG4vKipcblRoaXMgaXMgdGhlIGxheW91dCBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIHVzZWQgYnkgZGVmYXVsdCBmb3IgYWxsIExheW91dE5vZGUncy4gVGhpcyB2YWx1ZSBpcyBzZXQgaW4gdGhlIGNvbnN0cnVjdG9yIGluaXRpYWxseS5cblxuQHByb3BlcnR5IGxheW91dEZ1bmN0aW9uXG5AdHlwZSBGdW5jdGlvblxuKiovXG5MYXlEb3duLnByb3RvdHlwZS5sYXlvdXRGdW5jdGlvbiA9IG51bGw7XG5cbi8qKlxuVGhpcyBpcyB0aGUgcmVhZCBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIHVzZWQgYnkgZGVmYXVsdCBmb3IgYWxsIExheW91dE5vZGUncy4gVGhpcyB2YWx1ZSBpcyBzZXQgaW4gdGhlIGNvbnN0cnVjdG9yIGluaXRpYWxseS5cblxuQHByb3BlcnR5IHJlYWRGdW5jdGlvblxuQHR5cGUgRnVuY3Rpb25cbioqL1xuTGF5RG93bi5wcm90b3R5cGUucmVhZEZ1bmN0aW9uID0gbnVsbDtcblxuLyoqXG5UaGlzIGlzIHRoZSBjcmVhdGUgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSB1c2VkIG9uIGFsbCBpdGVtcyBiZWluZyBsYXllZCBvdXQuIFRoaXMgdmFsdWUgaXMgc2V0IGluIHRoZSBjb25zdHJ1Y3RvciBpbml0aWFsbHkuXG5cbkBwcm9wZXJ0eSBjcmVhdGVGdW5jdGlvblxuQHR5cGUgRnVuY3Rpb25cbioqL1xuTGF5RG93bi5wcm90b3R5cGUuY3JlYXRlRnVuY3Rpb24gPSBudWxsO1xuTGF5RG93bi5wcm90b3R5cGUubm9kZXMgPSBudWxsO1xuXG4vKipcblRoZSBjcmVhdGUgbWV0aG9kIHdpbGwgY3JlYXRlIGEge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZVwifX17ey9jcm9zc0xpbmt9fSB3aGljaCBydWxlcyBjYW4gdGhlbiBiZSBhcHBsaWVkIHRvLlxuXG5AbWV0aG9kIGNyZWF0ZVxuQHBhcmFtIGl0ZW1Ub0xheURvd24ge09iamVjdH0gVGhpcyB3aWxsIGJlIHRoZSBpdGVtIHRoYXQgd2UnbGwgYmUgbGF5aW5nIGRvd24uIEZvciBpbnN0YW5jZSBpZiB3ZSB3ZXJlIHdvcmtpbmcgd2l0aCB0aGUgRE9NIGl0IGNvdWxkIGJlXG5hbiBpbWFnZSBodG1sIGVsZW1lbnQgb3IgYSBkaXYgZWxlbWVudCBvciB3aGF0ZXZlciB5b3UnZCBsaWtlLlxuXG5AcGFyYW0gY3JlYXRlRnVuY3Rpb24ge0Z1bmN0aW9ufSBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCBiZWZvcmUgY3JlYXRpbmcgdGhlIExheW91dE5vZGUgd2hlcmUgdGhpcyBpcyBoYW5keSBpcyBpZiB5b3Ugd2FudCB0byBvdmVycmlkZSB0aGUgXG5kZWZhdWx0IGNyZWF0ZSBmdW5jdGlvblxuKiovXG5MYXlEb3duLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiggaXRlbVRvTGF5RG93biwgY3JlYXRlRnVuY3Rpb24gKSB7XG5cblx0Y3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbiA9PT0gdW5kZWZpbmVkID8gdGhpcy5jcmVhdGVGdW5jdGlvbiA6IGNyZWF0ZUZ1bmN0aW9uO1xuXG5cdGlmKCBjcmVhdGVGdW5jdGlvbiAmJiBpdGVtVG9MYXlEb3duKSB7XG5cblx0XHR0aGlzLmNyZWF0ZUZ1bmN0aW9uKCBpdGVtVG9MYXlEb3duICk7XG5cdH1cblxuXHR2YXIgbk5vZGUgPSBuZXcgTGF5b3V0Tm9kZSggdGhpcywgaXRlbVRvTGF5RG93biwgdGhpcy5sYXlvdXRGdW5jdGlvbiwgdGhpcy5yZWFkRnVuY3Rpb24gKTtcdFxuXG5cdHRoaXMubm9kZXMucHVzaCggbk5vZGUgKTtcblxuXHRyZXR1cm4gbk5vZGU7XG59O1xuXG4vKipcbkNhbGwgcmVzaXplQW5kUG9zaXRpb24gd2hlbmV2ZXIgeW91J2QgbGlrZSB0byBsYXlvdXQgYWxsIHlvdXIgaXRlbXMuIEZvciBpbnN0YW5jZSB5b3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4gYSB3aW5kb3cgcmVzaXplcy5cblxuQG1ldGhvZCByZXNpemVBbmRQb3NpdGlvblxuQHBhcmFtIHgge051bWJlcn0gVGhpcyBpcyB0aGUgeCBwb3NpdGlvbiBvZiB3aGVyZSB0aGlzIGxheW91dCBzaG91bGQgYmVnaW4uIEZvciBpbnN0YW5jZSB4ID0gMCBjb3VsZCBiZSB0aGUgbGVmdCBzaWRlIG9mIHRoZSBzY3JlZW4uXG5AcGFyYW0geSB7TnVtYmVyfSBUaGlzIGlzIHRoZSB5IHBvc2l0aW9uIG9mIHdoZXJlIHRoaXMgbGF5b3V0IHNob3VsZCBiZWdpbi4gRm9yIGluc3RhbmNlIHkgPSAwIGNvdWxkIGJlIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIHNjcmVlbi5cbkBwYXJhbSB3aWR0aCB7TnVtYmVyfSBUaGlzIGlzIHRoZSB3aWR0aCBvZiB0aGUgbGF5b3V0LiBGb3IgaW5zdGFuY2UgdGhpcyBjb3VsZCBiZSB0aGUgd2lkdGggb2YgdGhlIHNjcmVlbi5cbkBwYXJhbSBoZWlnaHQge051bWJlcn0gVGhpcyBpcyB0aGUgaGVpZ2h0IG9mIHRoZSBsYXlvdXQuIEZvciBpbnN0YW5jZSB0aGlzIGNvdWxkIGJlIHRoZSBoZWlnaHQgb2YgdGhlIHNjcmVlbi5cbioqL1xuTGF5RG93bi5wcm90b3R5cGUucmVzaXplQW5kUG9zaXRpb24gPSBmdW5jdGlvbiggeCwgeSwgd2lkdGgsIGhlaWdodCApIHtcblxuXHR0aGlzLnggPSB4O1xuXHR0aGlzLnkgPSB5O1xuXHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXG5cdHRoaXMuZG9MYXlvdXQoKTtcbn07XG5cbkxheURvd24ucHJvdG90eXBlLm5vZGVDaGFuZ2VkID0gZnVuY3Rpb24oIG5vZGUgKSB7XG5cblx0dGhpcy5kb0xheW91dCgpO1xufTtcblxuTGF5RG93bi5wcm90b3R5cGUuZG9MYXlvdXQgPSBmdW5jdGlvbigpIHtcblxuXHQvL3dlIG5lZWQgdG8gcmVzZXQgYWxsIHRoZSBoYXNCZWVuTGF5ZWRPdXRcblx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHRoaXMubm9kZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHR0aGlzLm5vZGVzWyBpIF0uaGFzQmVlbkxheWVkT3V0ID0gZmFsc2U7XG5cdH1cblxuXHQvL25vdyBkb0xheURvd24gb24gYWxsIG9mIHRoZW0gdGhhdCBoYXZlbid0IGJlZW4gbGF5ZWQgb3V0XG5cdC8vdGhleSBjb3VsZCBiZWNvbWUgbGF5ZWRvdXQgaWYgb3RoZXIgbm9kZXMgaGF2ZSBkZXBlbmRlbmNpZXNcblx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHRoaXMubm9kZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHRpZiggIXRoaXMubm9kZXNbIGkgXS5oYXNCZWVuTGF5ZWRPdXQgKSB7XG5cblx0XHRcdHRoaXMubm9kZXNbIGkgXS5kb0xheW91dCgpO1xuXHRcdH1cblx0fVxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gTGF5RG93bjsiLCJcbi8vL1BPU0lUSU9OIEZVTkNUSU9OU1xudmFyIGFsaWduZWRBYm92ZSA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL2FsaWduZWRBYm92ZScgKTtcbnZhciBhbGlnbmVkQmVsb3cgPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi9hbGlnbmVkQmVsb3cnICk7XG52YXIgYWxpZ25lZExlZnRPZiA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL2FsaWduZWRMZWZ0T2YnICk7XG52YXIgYWxpZ25lZFJpZ2h0T2YgPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi9hbGlnbmVkUmlnaHRPZicgKTtcbnZhciBhbGlnbmVkV2l0aCA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL2FsaWduZWRXaXRoJyApO1xudmFyIGJvdHRvbUFsaWduZWRXaXRoID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vYm90dG9tQWxpZ25lZFdpdGgnICk7XG52YXIgY2VudGVyZWRXaXRoID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vY2VudGVyZWRXaXRoJyApO1xudmFyIGhvcml6b250YWxseUNlbnRlcmVkV2l0aCA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL2hvcml6b250YWxseUNlbnRlcmVkV2l0aCcgKTtcbnZhciBsZWZ0QWxpZ25lZFdpdGggPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi9sZWZ0QWxpZ25lZFdpdGgnICk7XG52YXIgcG9zaXRpb25JcyA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3Bvc2l0aW9uSXMnICk7XG52YXIgcG9zaXRpb25Jc0FQZXJjZW50YWdlT2YgPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi9wb3NpdGlvbklzQVBlcmNlbnRhZ2VPZicgKTtcbnZhciByaWdodEFsaWduZWRXaXRoID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vcmlnaHRBbGlnbmVkV2l0aCcgKTtcbnZhciB0b3BBbGlnbmVkV2l0aCA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3RvcEFsaWduZWRXaXRoJyApO1xudmFyIHZlcnRpY2FsbHlDZW50ZXJlZFdpdGggPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi92ZXJ0aWNhbGx5Q2VudGVyZWRXaXRoJyApO1xudmFyIHhJcyA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3hJcycgKTtcbnZhciB5SXMgPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi95SXMnICk7XG52YXIgeElzQVBlcmNlbnRhZ2VPZiA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3hJc0FQZXJjZW50YWdlT2YnICk7XG52YXIgeUlzQVBlcmNlbnRhZ2VPZiA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3lJc0FQZXJjZW50YWdlT2YnICk7XG5cbi8vUE9TSVRJT04gQk9VTkQgRlVOQ1RJT05TXG52YXIgYm90dG9tTWF4ID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9ib3R0b21NYXgnICk7XG52YXIgYm90dG9tTWF4RnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vYm90dG9tTWF4RnJvbScgKTtcbnZhciBib3R0b21NaW4gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL2JvdHRvbU1pbicgKTtcbnZhciBib3R0b21NaW5Gcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9ib3R0b21NaW5Gcm9tJyApO1xudmFyIGxlZnRNYXggPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL2xlZnRNYXgnICk7XG52YXIgbGVmdE1heEZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL2xlZnRNYXhGcm9tJyApO1xudmFyIGxlZnRNaW4gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL2xlZnRNaW4nICk7XG52YXIgbGVmdE1pbkZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL2xlZnRNaW5Gcm9tJyApO1xudmFyIG1heFBvc2l0aW9uID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9tYXhQb3NpdGlvbicgKTtcbnZhciBtYXhQb3NpdGlvbkZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFBvc2l0aW9uRnJvbScgKTtcbnZhciBtaW5Qb3NpdGlvbiA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vbWluUG9zaXRpb24nICk7XG52YXIgbWluUG9zaXRpb25Gcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5Qb3NpdGlvbkZyb20nICk7XG52YXIgcmlnaHRNYXggPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL3JpZ2h0TWF4JyApO1xudmFyIHJpZ2h0TWF4RnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vcmlnaHRNYXhGcm9tJyApO1xudmFyIHJpZ2h0TWluID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9yaWdodE1pbicgKTtcbnZhciByaWdodE1pbkZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL3JpZ2h0TWluRnJvbScgKTtcbnZhciB0b3BNYXggPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL3RvcE1heCcgKTtcbnZhciB0b3BNYXhGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi90b3BNYXhGcm9tJyApO1xudmFyIHRvcE1pbiA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vdG9wTWluJyApO1xudmFyIHRvcE1pbkZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL3RvcE1pbkZyb20nICk7XG5cbi8vL1NJWkUgRlVOQ1RJT05TXG52YXIgaGVpZ2h0SXMgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL2hlaWdodElzJyApO1xudmFyIGhlaWdodElzQVBlcmNlbnRhZ2VPZiA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvaGVpZ2h0SXNBUGVyY2VudGFnZU9mJyApO1xudmFyIGhlaWdodElzUHJvcG9ydGlvbmFsID0gcmVxdWlyZSggJy4vbGF5b3V0U2l6ZS9oZWlnaHRJc1Byb3BvcnRpb25hbCcgKTtcbnZhciBtYXRjaGVzSGVpZ2h0T2YgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL21hdGNoZXNIZWlnaHRPZicgKTtcbnZhciBtYXRjaGVzU2l6ZU9mID0gcmVxdWlyZSggJy4vbGF5b3V0U2l6ZS9tYXRjaGVzU2l6ZU9mJyApO1xudmFyIG1hdGNoZXNXaWR0aE9mID0gcmVxdWlyZSggJy4vbGF5b3V0U2l6ZS9tYXRjaGVzV2lkdGhPZicgKTtcbnZhciBzaXplSXMgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL3NpemVJcycgKTtcbnZhciBzaXplSXNBUGVyY2VudGFnZU9mID0gcmVxdWlyZSggJy4vbGF5b3V0U2l6ZS9zaXplSXNBUGVyY2VudGFnZU9mJyApO1xudmFyIHNpemVJc1Byb3BvcnRpb25hbCA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvc2l6ZUlzUHJvcG9ydGlvbmFsJyApO1xudmFyIHdpZHRoSXMgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL3dpZHRoSXMnICk7XG52YXIgd2lkdGhJc0FQZXJjZW50YWdlT2YgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL3dpZHRoSXNBUGVyY2VudGFnZU9mJyApO1xudmFyIHdpZHRoSXNQcm9wb3J0aW9uYWwgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL3dpZHRoSXNQcm9wb3J0aW9uYWwnICk7XG5cblxuLy9TSVpFIEJPVU5EIEZVTkNUSU9OU1xudmFyIG1heEhlaWdodCA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9tYXhIZWlnaHQnICk7XG52YXIgbWF4SGVpZ2h0RnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9tYXhIZWlnaHRGcm9tJyApO1xudmFyIG1heFNpemUgPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFNpemUvbWF4U2l6ZScgKTtcbnZhciBtYXhTaXplRnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9tYXhTaXplRnJvbScgKTtcbnZhciBtYXhXaWR0aCA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9tYXhXaWR0aCcgKTtcbnZhciBtYXhXaWR0aEZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFNpemUvbWF4V2lkdGhGcm9tJyApO1xudmFyIG1pbkhlaWdodCA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9taW5IZWlnaHQnICk7XG52YXIgbWluSGVpZ2h0RnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9taW5IZWlnaHRGcm9tJyApO1xudmFyIG1pblNpemUgPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFNpemUvbWluU2l6ZScgKTtcbnZhciBtaW5TaXplRnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9taW5TaXplRnJvbScgKTtcbnZhciBtaW5XaWR0aCA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9taW5XaWR0aCcgKTtcbnZhciBtaW5XaWR0aEZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFNpemUvbWluV2lkdGhGcm9tJyApO1xuXG4vL0NPTkRJVElPTkFMIEZVTkNUSU9OU1xudmFyIHdpZHRoR3JlYXRlclRoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvd2lkdGhHcmVhdGVyVGhhbicgKTtcbnZhciBoZWlnaHRHcmVhdGVyVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy9oZWlnaHRHcmVhdGVyVGhhbicgKTtcbnZhciB3aWR0aExlc3NUaGFuID0gcmVxdWlyZSggJy4vY29uZGl0aW9uYWxzL3dpZHRoTGVzc1RoYW4nICk7XG52YXIgaGVpZ2h0TGVzc1RoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvaGVpZ2h0TGVzc1RoYW4nICk7XG52YXIgbGVmdEdyZWF0ZXJUaGFuID0gcmVxdWlyZSggJy4vY29uZGl0aW9uYWxzL2xlZnRHcmVhdGVyVGhhbicgKTtcbnZhciByaWdodEdyZWF0ZXJUaGFuID0gcmVxdWlyZSggJy4vY29uZGl0aW9uYWxzL3JpZ2h0R3JlYXRlclRoYW4nICk7XG52YXIgbGVmdExlc3NUaGFuID0gcmVxdWlyZSggJy4vY29uZGl0aW9uYWxzL2xlZnRMZXNzVGhhbicgKTtcbnZhciByaWdodExlc3NUaGFuID0gcmVxdWlyZSggJy4vY29uZGl0aW9uYWxzL3JpZ2h0TGVzc1RoYW4nICk7XG52YXIgYm90dG9tR3JlYXRlclRoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvYm90dG9tR3JlYXRlclRoYW4nICk7XG52YXIgdG9wR3JlYXRlclRoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvdG9wR3JlYXRlclRoYW4nICk7XG52YXIgYm90dG9tTGVzc1RoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvYm90dG9tTGVzc1RoYW4nICk7XG52YXIgdG9wTGVzc1RoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvdG9wTGVzc1RoYW4nICk7XG52YXIgaXNJbnNpZGUgPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvaXNJbnNpZGUnICk7XG52YXIgaXNPdXRzaWRlID0gcmVxdWlyZSggJy4vY29uZGl0aW9uYWxzL2lzT3V0c2lkZScgKTtcblxuLy9PRkZTRVQgRlVOQ1RJT05TXG52YXIgbWludXNIZWlnaHQgPSByZXF1aXJlKCAnLi9vZmZzZXRzL21pbnVzSGVpZ2h0JyApO1xudmFyIG1pbnVzUG9zaXRpb24gPSByZXF1aXJlKCAnLi9vZmZzZXRzL21pbnVzUG9zaXRpb24nICk7XG52YXIgbWludXNTaXplID0gcmVxdWlyZSggJy4vb2Zmc2V0cy9taW51c1NpemUnICk7XG52YXIgbWludXNXaWR0aCA9IHJlcXVpcmUoICcuL29mZnNldHMvbWludXNXaWR0aCcgKTtcbnZhciBtaW51c1ggPSByZXF1aXJlKCAnLi9vZmZzZXRzL21pbnVzWCcgKTtcbnZhciBtaW51c1kgPSByZXF1aXJlKCAnLi9vZmZzZXRzL21pbnVzWScgKTtcbnZhciBwbHVzSGVpZ2h0ID0gcmVxdWlyZSggJy4vb2Zmc2V0cy9wbHVzSGVpZ2h0JyApO1xudmFyIHBsdXNQb3NpdGlvbiA9IHJlcXVpcmUoICcuL29mZnNldHMvcGx1c1Bvc2l0aW9uJyApO1xudmFyIHBsdXNTaXplID0gcmVxdWlyZSggJy4vb2Zmc2V0cy9wbHVzU2l6ZScgKTtcbnZhciBwbHVzV2lkdGggPSByZXF1aXJlKCAnLi9vZmZzZXRzL3BsdXNXaWR0aCcgKTtcbnZhciBwbHVzWCA9IHJlcXVpcmUoICcuL29mZnNldHMvcGx1c1gnICk7XG52YXIgcGx1c1kgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3BsdXNZJyApO1xudmFyIHZNaW51c0hlaWdodCA9IHJlcXVpcmUoICcuL29mZnNldHMvdk1pbnVzSGVpZ2h0JyApO1xudmFyIHZNaW51c1Bvc2l0aW9uID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92TWludXNQb3NpdGlvbicgKTtcbnZhciB2TWludXNTaXplID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92TWludXNTaXplJyApO1xudmFyIHZNaW51c1dpZHRoID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92TWludXNXaWR0aCcgKTtcbnZhciB2TWludXNYID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92TWludXNYJyApO1xudmFyIHZNaW51c1kgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZNaW51c1knICk7XG52YXIgdlBsdXNIZWlnaHQgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZQbHVzSGVpZ2h0JyApO1xudmFyIHZQbHVzUG9zaXRpb24gPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZQbHVzUG9zaXRpb24nICk7XG52YXIgdlBsdXNTaXplID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92UGx1c1NpemUnICk7XG52YXIgdlBsdXNXaWR0aCA9IHJlcXVpcmUoICcuL29mZnNldHMvdlBsdXNXaWR0aCcgKTtcbnZhciB2UGx1c1ggPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZQbHVzWCcgKTtcbnZhciB2UGx1c1kgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZQbHVzWScgKTtcblxuXG5cblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tUFJPUFMgVE8gRUZGRUNULS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbnZhciBTSVpFID0gJ1NJWkUnO1xudmFyIFNJWkVfV0lEVEggPSAnU0laRV9XSURUSCc7XG52YXIgU0laRV9IRUlHSFQgPSAnU0laRV9IRUlHSFQnO1xudmFyIFBPU0lUSU9OID0gJ1BPU0lUSU9OJztcbnZhciBQT1NJVElPTl9YID0gJ1BPU0lUSU9OX1gnO1xudmFyIFBPU0lUSU9OX1kgPSAnUE9TSVRJT05fWSc7XG5cbnZhciBCT1VORF9TSVpFID0gJ0JPVU5EX1NJWkUnO1xudmFyIEJPVU5EX1NJWkVfV0lEVEggPSAnQk9VTkRfU0laRV9XSURUSCc7XG52YXIgQk9VTkRfU0laRV9IRUlHSFQgPSAnQk9VTkRfU0laRV9IRUlHSFQnO1xudmFyIEJPVU5EX1BPU0lUSU9OID0gJ0JPVU5EX1BPU0lUSU9OJztcbnZhciBCT1VORF9QT1NJVElPTl9YID0gJ0JPVU5EX1BPU0lUSU9OX1gnO1xudmFyIEJPVU5EX1BPU0lUSU9OX1kgPSAnQk9VTkRfUE9TSVRJT05fWSc7XG5cblxuXG5cblxuLyoqXG5MYXlvdXROb2RlIGlzIHdoZXJlIGFsbCB0aGUgbWFnaWMgaGFwcGVucy4gTGF5b3V0Tm9kZSdzIGFyZSBjcmVhdGVkIGZyb20gTGF5RG93bi4gWW91IHdpbGwgbmV2ZXIgaW5zdGFudGlhdGUgTGF5b3V0Tm9kZXMgXG5kaXJlY3RseSBob3dldmVyIHlvdSB3aWxsIHVzZSB0aGUgTGF5RG93biBub2RlIHRvIGFsd2F5cyBpbnN0YW50aWF0ZSB0aGVtLlxuXG5MYXlvdXROb2RlJ3MgYWJzdHJhY3QgcG9zaXRpb25pbmcgZWxlbWVudHMgb24gc2NyZWVuIHVzaW5nIHJ1bGVzLlxuXG5CYXNpY2FsbHkgd2hhdCB0aGF0IG1lYW5zIGlzIGlmIHlvdSdyZSB1c2luZyB0aGUgRE9NLCBMYXlvdXROb2RlJ3Mgd2lsbCBzaXQgYmV0d2VlbiB0aGUgRE9NIGFuZCB0aGUgbG9naWNcbnRvIHBvc2l0aW9uIGFuZCByZXNpemUgdGhpbmdzIG9uIHNjcmVlbi5cblxuVG8gZG8gdGhpcyB5b3UgYWRkIFwicnVsZXNcIiB0byB0aGUgTGF5b3V0Tm9kZSdzIGJ5IGNhbGxpbmcgdGhlaXIgcnVsZSBmdW5jdGlvbnMuIEZvciBlYXNlIG9mIHVzZSBhbmQgdG8ga2VlcCBpbmxpbmUgd2l0aCB0aGVcbmxpYnJhcmllcyBnb2FsIG9mIGJlaW5nIHZlcnkgcmVhZGFibGUsIGhhbmR5IHRvIHRyYW5zbGF0ZSBkZXNpZ25lcnMgbmVlZHMsIGFsbCBydWxlcyBhcmUgY2hhaW5hYmxlIGFuZCBmb3JtIFwic2VudGVuY2VzXCIuXG5cbkZvciBleGFtcGxlIHRoZSBjb2RlOlxuXG5ub2RlLmxlZnRBbGlnbmVkV2l0aCggc29tZVVJICkuYWxpZ25lZEJlbG93KCBzb21lVUkgKS5wbHVzKCAzICk7XG5cbldvdWxkIHJlYWQgYXM6XG5cbk91ciBub2RlIHdpbGwgYmUgbGVmdCBhbGlnbmVkIHdpdGggU29tZSBVSSBhbmQgYWxpZ25lZCBiZWxvdyBTb21lIFVJIHBsdXMgMyBwaXhlbHMuXG5cbkBjbGFzcyBMYXlvdXROb2RlXG5AY29uc3RydWN0b3JcbkBwYXJhbSB7TGF5RG93bn0gbGF5b3V0IElzIHRoZSBwYXJlbnQgTGF5RG93biBvYmplY3QuIFRoZSBwYXJlbnQgTGF5RG93biBvYmplY3Qgd2lsbCBtYW5hZ2UgcmVsYXRpb25zaGlwcyBiZXR3ZWVuIGFsbCBMYXlvdXROb2RlJ3MgYW5kIHdpbGxcblx0XHRcdFx0XHRcdGhhbmRsZSBjaXJjdWxhciBkZXBlbmRlbmNpZXMgYW5kIGFsbCB0aGF0IGZ1biBzdHVmZi5cblxuQHBhcmFtIGl0ZW0ge09iamVjdH0gaXRlbSB3aWxsIGJlIHdoYXQgd2lsbCBiZSBwb3NpdGlvbmVkIG9uIHNjcmVlbi4gRm9yIGluc3RhbmNlIGFuIEhUTUwgRE9NIEVsZW1lbnQgb3IgYSBQSVhJIERpc3BsYXlPYmplY3QuIEl0J3Ncblx0XHRcdFx0d2hhdGV2ZXIgeW91IHdhbnQgdG8gbGF5b3V0IG9uIHNjcmVlbi5cblxuQHBhcmFtIGxheW91dEZ1bmN0aW9uIHtmdW5jdGlvbn0gVGhlIGxheW91dEZ1bmN0aW9uIGZ1bmN0aW9uIGlzIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCB0cmFuc2xhdGUgdGhlIHgsIHksIHdpZHRoLCBhbmQgaGVpZ2h0IHByb3BlcnRpZXMgb2YgYVxuTGF5b3V0Tm9kZSBpbnRvIGFjdHVhbCBwaHlzaWNhbCBzY3JlZW4gcG9zaXRpb24uIFNvIGZvciBpbnN0YW5jZSBpZiB3ZSdyZSB3b3JraW5nIHdpdGggdGhlIERPTSBpdCB3b3VsZCBzZXRcbkNTUyBwcm9wZXJ0aWVzIG9uIHRoZSBcIml0ZW1cIiBwYXNzZWQgaW4gdG8gZW5zdXJlIHRoYXQgdGhlIGl0ZW0gaXMgb24gc2NyZWVuIGF0IHgsIHkgYXQgdGhlIGNvcnJlY3Qgc2l6ZS5cblxuQHBhcmFtIHJlYWRGdW5jdGlvbiB7ZnVuY3Rpb259IElmIHlvdSBkZWZpbmUgbm8gc2l6aW5nIHJ1bGVzIHRvIHNldCB3aWR0aCBhbmQgaGVpZ2h0IG9mIGFuIFwiaXRlbVwiL0xheW91dE5vZGUgdGhlbiB3ZSB3aWxsIG5lZWQgdG8gcmVhZCB0aGVcbndpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIG9iamVjdCB0byBiZSBhYmxlIHRvIHBvc2l0aW9uIGRlcGVuZGVudCBMYXlvdXROb2RlJ3MuIFxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgd2UgaGF2ZSBMYXlvdXROb2RlIEJ1dHRvbiBhbmQgTGF5b3V0Tm9kZSBJbWFnZSBhbmQgd2Ugd2FudGVkIEltYWdlIHRvIGJlIGJlbG93IEJ1dHRvbiBhbmRcbkJ1dHRvbiBoYXMgbm8gbGF5b3V0IHJ1bGVzIGZvciBzZXR0aW5nIGl0J3MgaGVpZ2h0IHdlIHdpbGwgbmVlZCB0byBcInJlYWRcIiBpbiBCdXR0b25zIGhlaWdodCB0byBiZSBhYmxlIHRvIGNvcnJlY3RseVxucG9zaXRpb24gSW1hZ2UuIFNvIGlmIEJ1dHRvbiBpcyBhIERJViBlbGVtZW50IHdlIHdpbGwgcmVhZCBpbiBpdCdzIGhlaWdodCB0byBiZSBhYmxlIHRvIHBvc3Rpb24gSW1hZ2UgYmVsb3cgaXQuXG5cbioqL1xudmFyIExheW91dE5vZGUgPSBmdW5jdGlvbiggbGF5b3V0LCBpdGVtLCBsYXlvdXRGdW5jdGlvbiwgcmVhZEZ1bmN0aW9uICkge1xuXG5cdHRoaXMubGF5b3V0ID0gbGF5b3V0O1xuXHR0aGlzLml0ZW0gPSBpdGVtID09PSB1bmRlZmluZWQgPyBudWxsIDogaXRlbTtcblx0dGhpcy5sYXlvdXRGdW5jdGlvbiA9IGxheW91dEZ1bmN0aW9uID09PSB1bmRlZmluZWQgPyBudWxsIDogbGF5b3V0RnVuY3Rpb247XG5cdHRoaXMucmVhZEZ1bmN0aW9uID0gcmVhZEZ1bmN0aW9uID09PSB1bmRlZmluZWQgPyBudWxsIDogcmVhZEZ1bmN0aW9uO1xuXHR0aGlzLnNpemVEZXBlbmRlbmNpZXMgPSBbXTtcblx0dGhpcy5wb3NpdGlvbkRlcGVuZGVuY2llcyA9IFtdO1xuXHR0aGlzLnJ1bGVzUG9zID0gW107XG5cdHRoaXMucnVsZXNQb3NQcm9wID0gW107XG5cdHRoaXMucnVsZXNTaXplID0gW107XG5cdHRoaXMucnVsZXNTaXplUHJvcCA9IFtdO1xuXHR0aGlzLnJ1bGVzUG9zQm91bmQgPSBbXTtcblx0dGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCA9IFtdO1xuXHR0aGlzLnJ1bGVzU2l6ZUJvdW5kID0gW107XG5cdHRoaXMucnVsZXNTaXplQm91bmRQcm9wID0gW107XG5cdHRoaXMuaXRlbXNUb0NvbXBhcmUgPSBbXTtcblx0dGhpcy5jb25kaXRpb25hbHNGb3JJdGVtID0gW107XG5cdHRoaXMuY29uZGl0aW9uYWxzQXJndW1lbnRzRm9ySXRlbSA9IFtdO1xuXHR0aGlzLmxheW91dE5vZGVGb3JDb25kaXRpb25hbCA9IFtdO1xuXHR0aGlzLmNvbmRpdGlvbmFsTGlzdGVuZXJzID0gW107XG5cblx0dGhpcy5faW5uZXIgPSBudWxsO1xuXHR0aGlzLl94ID0gMDtcblx0dGhpcy5feSA9IDA7XG5cdHRoaXMuX3dpZHRoID0gMDtcblx0dGhpcy5faGVpZ2h0ID0gMDtcblx0dGhpcy5fb2ZmWCA9IDA7XG5cdHRoaXMuX29mZlkgPSAwO1xuXHR0aGlzLl9vZmZXaWR0aCA9IDA7XG5cdHRoaXMuX29mZkhlaWdodCA9IDA7XG5cdHRoaXMuX2lzRG9pbmdXaGVuID0gZmFsc2U7XG5cdHRoaXMuX2hhc0NvbmRpdGlvbmFsID0gZmFsc2U7XG5cdHRoaXMuX2lzRG9pbmdEZWZhdWx0ID0gZmFsc2U7XG5cdHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgPSBudWxsO1xuXHR0aGlzLmhhc0JlZW5MYXllZE91dCA9IGZhbHNlO1xuXG5cdHRoaXMubGF5b3V0Tm9kZUZvckRlZmF1bHQgPSBudWxsO1xuXHR0aGlzLmNvbmRpdGlvbmFsUGFyZW50ID0gbnVsbDsgLy90aGlzIGlzIHRoZSBwYXJlbnQgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgY29uZGl0aW9uYWwgTGF5b3V0Tm9kZSB3YXMgY3JlYXRlZCBmcm9tXG5cdHRoaXMuZGVmYXVsdENvbmRpdGlvbmFsTGlzdGVuZXIgPSBudWxsO1xuXHR0aGlzLmxhc3RDb25kaXRpb25hbExpc3RuZXJJZHggPSAtMTtcblx0dGhpcy5sYXN0Q29uZGl0aW9uYWxMaXN0ZW5lcklzRGVmYXVsdCA9IGZhbHNlO1xuXG5cdHRoaXMuX2RvaW5nU2VsZkNvbmRpdGlvbmFsID0gZmFsc2U7XG5cdHRoaXMuc2VsZkl0ZW1zVG9Db21wYXJlID0gW107XG5cdHRoaXMuc2VsZkNvbmRpdGlvbmFsc0Zvckl0ZW0gPSBbXTtcblx0dGhpcy5zZWxmQ29uZGl0aW9uYWxBcmd1bWVudHNGb3JJdGVtID0gW107XG5cdHRoaXMuc2VsZkNvbmRpdGlvbmFsTGlzdGVuZXJzID0gW107XG5cdHRoaXMubGFzdFNlbGZDb25kaXRpb25hbExpc3RlbmVySWR4ID0gLTE7XG5cblx0dGhpcy5kb05vdFJlYWRXaWR0aCA9IGZhbHNlO1xuXHR0aGlzLmRvTm90UmVhZEhlaWdodCA9IGZhbHNlO1xufTtcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3Igc2l6ZSBsYXlvdXQgcnVsZXMgd2hlcmUgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgZWZmZWN0ZWQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgU0laRV9MQVlPVVRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuU0laRV9MQVlPVVQgPSAnU0laRV9MQVlPVVQnO1xuXG4vKipcblRoaXMgY29uc3RhbnQgZGVzY3JpYmVzIG9yIGlzIGEga2V5IGZvciBzaXplIGJvdW5kIHJ1bGVzIHdoZXJlIGJvdGggd2lkdGggYW5kIGhlaWdodCB3aWxsIGJlIGJvdW5kLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFNJWkVfQk9VTkRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuU0laRV9CT1VORCA9ICdTSVpFX0JPVU5EJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3Igd2lkdGggbGF5b3V0IHJ1bGVzIHdoZXJlIHdpZHRoIHdpbGwgYmUgZWZmZWN0ZWQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgU0laRV9XSURUSF9MQVlPVVRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuU0laRV9XSURUSF9MQVlPVVQgPSAnU0laRV9XSURUSF9MQVlPVVQnO1xuXG4vKipcblRoaXMgY29uc3RhbnQgZGVzY3JpYmVzIG9yIGlzIGEga2V5IGZvciB3aWR0aCBib3VuZCBydWxlcyB3aGVyZSB3aWR0aCB3aWxsIGJlIGJvdW5kLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFNJWkVfV0lEVEhfQk9VTkRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuU0laRV9XSURUSF9CT1VORCA9ICdTSVpFX1dJRFRIX0JPVU5EJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3IgaGVpZ2h0IGxheW91dCBydWxlcyB3aGVyZSBoZWlnaHQgd2lsbCBiZSBlZmZlY3RlZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBTSVpFX0hFSUdIVF9MQVlPVVRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuU0laRV9IRUlHSFRfTEFZT1VUID0gJ1NJWkVfSEVJR0hUX0xBWU9VVCc7XG5cbi8qKlxuVGhpcyBjb25zdGFudCBkZXNjcmliZXMgb3IgaXMgYSBrZXkgZm9yIGhlaWdodCBib3VuZCBydWxlcyB3aGVyZSBoZWlnaHQgd2lsbCBiZSBib3VuZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBTSVpFX0hFSUdIVF9CT1VORFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5TSVpFX0hFSUdIVF9CT1VORCA9ICdTSVpFX0hFSUdIVF9CT1VORCc7XG5cbi8qKlxuVGhpcyBjb25zdGFudCBkZXNjcmliZXMgb3IgaXMgYSBrZXkgZm9yIHBvc2l0aW9uIGxheW91dCBydWxlcyB3aGVyZSB4IGFuZCB5IHdpbGwgYmUgZWZmZWN0ZWQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgUE9TSVRJT05fTEFZT1VUXG5AdHlwZSBTdHJpbmdcbkBzdGF0aWNcbkBmaW5hbFxuKiovXG5MYXlvdXROb2RlLlBPU0lUSU9OX0xBWU9VVCA9ICdQT1NJVElPTl9MQVlPVVQnO1xuXG4vKipcblRoaXMgY29uc3RhbnQgZGVzY3JpYmVzIG9yIGlzIGEga2V5IGZvciBwb3NpdGlvbiBib3VuZCBydWxlcyB3aGVyZSB4IGFuZCB5IHdpbGwgYmUgYm90aCBib3VuZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBQT1NJVElPTl9CT1VORFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5QT1NJVElPTl9CT1VORCA9ICdQT1NJVElPTl9CT1VORCc7XG5cbi8qKlxuVGhpcyBjb25zdGFudCBkZXNjcmliZXMgb3IgaXMgYSBrZXkgZm9yIHggbGF5b3V0IHJ1bGVzIHdoZXJlIHggd2lsbCBiZSBlZmZlY3RlZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBQT1NJVElPTl9YX0xBWU9VVFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5QT1NJVElPTl9YX0xBWU9VVCA9ICdQT1NJVElPTl9YX0xBWU9VVCc7XG5cbi8qKlxuVGhpcyBjb25zdGFudCBkZXNjcmliZXMgb3IgaXMgYSBrZXkgZm9yIHggYm91bmQgcnVsZXMgd2hlcmUgeCB3aWxsIGJlIGJvdW5kLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFBPU0lUSU9OX1hfQk9VTkRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuUE9TSVRJT05fWF9CT1VORCA9ICdQT1NJVElPTl9YX0JPVU5EJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3IgeSBsYXlvdXQgcnVsZXMgd2hlcmUgeSB3aWxsIGJlIGVmZmVjdGVkLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFBPU0lUSU9OX1lfTEFZT1VUXG5AdHlwZSBTdHJpbmdcbkBzdGF0aWNcbkBmaW5hbFxuKiovXG5MYXlvdXROb2RlLlBPU0lUSU9OX1lfTEFZT1VUID0gJ1BPU0lUSU9OX1lfTEFZT1VUJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3IgeSBib3VuZCBydWxlcyB3aGVyZSB5IHdpbGwgYmUgYm91bmQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgUE9TSVRJT05fWV9CT1VORFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5QT1NJVElPTl9ZX0JPVU5EID0gJ1BPU0lUSU9OX1lfQk9VTkQnO1xuXG5cbkxheW91dE5vZGUucHJvdG90eXBlLlNJWkVfTEFZT1VUID0gTGF5b3V0Tm9kZS5TSVpFX0xBWU9VVDtcbkxheW91dE5vZGUucHJvdG90eXBlLlNJWkVfQk9VTkQgPSBMYXlvdXROb2RlLlNJWkVfQk9VTkQ7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5TSVpFX1dJRFRIX0xBWU9VVCA9IExheW91dE5vZGUuU0laRV9XSURUSF9MQVlPVVQ7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5TSVpFX1dJRFRIX0JPVU5EID0gTGF5b3V0Tm9kZS5TSVpFX1dJRFRIX0JPVU5EO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuU0laRV9IRUlHSFRfTEFZT1VUID0gTGF5b3V0Tm9kZS5TSVpFX0hFSUdIVF9MQVlPVVQ7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5TSVpFX0hFSUdIVF9CT1VORCA9IExheW91dE5vZGUuU0laRV9IRUlHSFRfQk9VTkQ7XG5cbkxheW91dE5vZGUucHJvdG90eXBlLlBPU0lUSU9OX0xBWU9VVCA9IExheW91dE5vZGUuUE9TSVRJT05fTEFZT1VUO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuUE9TSVRJT05fQk9VTkQgPSBMYXlvdXROb2RlLlBPU0lUSU9OX0JPVU5EO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuUE9TSVRJT05fWF9MQVlPVVQgPSBMYXlvdXROb2RlLlBPU0lUSU9OX1hfTEFZT1VUO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuUE9TSVRJT05fWF9CT1VORCA9IExheW91dE5vZGUuUE9TSVRJT05fWF9CT1VORDtcbkxheW91dE5vZGUucHJvdG90eXBlLlBPU0lUSU9OX1lfTEFZT1VUID0gTGF5b3V0Tm9kZS5QT1NJVElPTl9ZX0xBWU9VVDtcbkxheW91dE5vZGUucHJvdG90eXBlLlBPU0lUSU9OX1lfQk9VTkQgPSBMYXlvdXROb2RlLlBPU0lUSU9OX1lfQk9VTkQ7XG5cbi8qKlxuVGhpcyBpcyB0aGUgeCBwb3NpdGlvbiBvZiB0aGUgTGF5b3V0Tm9kZSBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2YgeCB3aWxsIGJlIDAgdW50aWwgdGhpcyBub2RlIGhhcyBiZWVuIGxheWVkIG91dC5cblxuT25jZSB0aGlzIG5vZGUgaGFzIGJlZW4gbGF5ZWQgb3V0IHRoZSB4IHBvc2l0aW9uIHdpbGwgYmUgc2V0IGZyb20gYWxsIHRoZSBydWxlcyBhcHBsaWVkIHRvIHRoaXMgbm9kZS5cblxuWW91IGNhbiBhbHNvIHNldCB0aGUgeCBwb3NpdGlvbiBvZiBhIG5vZGUgYnkgc2ltcGx5IHNldHRpbmcgdGhlIHggdmFsdWU6XG5cblx0bm9kZS54ID0gMTA7XG5cbldoYXQgdGhpcyB3aWxsIGRvIGlzIGFkanVzdCBhbiBvZmZzZXQgaW4gdGhpcyBMYXlvdXROb2RlLiBTbyBpbiBwcmFjdGljZSB3aGF0IHRoaXMgbWVhbnMgaXMgdGhhdCB5b3UgY2FuIGZyZWVseSBtb3ZlIGFyb3VuZFxubm9kZXMgZm9yIGluc3RhbmNlIGJ5IGRyYWdnaW5nIGJ1dCBhbGwgZGVwZW5kZW50IG5vZGVzIHdpbGwgc3RpbGwgcG9zaXRpb24gdGhlbXNlbHZlcyBhY2NvcmRpbmcgdG8gdGhlIHJ1bGVzIHNldCBvbiB0aGVtLlxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgeW91IGhhZCBhbiBpbWFnZSB0aGF0IGlzIHJpZ2h0IGFsaWduZWQgdG8gYW5vdGhlciBpbWFnZS4gSWYgeW91IGdyYWIgdGhlIGltYWdlIG9uIHRoZSBsZWZ0IGFuZCBtb3ZlIGl0IGFyb3VuZCBcbnRoZSBpbWFnZSBvbiB0aGUgcmlnaHQgd2lsbCBmb2xsb3cuXG5cbkBwcm9wZXJ0eSB4XG5AdHlwZSBOdW1iZXJcbioqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KCBMYXlvdXROb2RlLnByb3RvdHlwZSwgJ3gnLCB7XG5cblx0Z2V0OiBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB0aGlzLl94O1xuXHR9LFxuXG5cdHNldDogZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdFx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IFBPU0lUSU9OX1g7XG5cblx0XHR0aGlzLl9vZmZYICs9IHZhbHVlIC0gdGhpcy5feDtcblx0XHRcblx0XHRpZiggdGhpcy5oYXNCZWVuTGF5ZWRPdXQgKSB7XG5cdFx0XHRcblx0XHRcdHRoaXMubGF5b3V0Lm5vZGVDaGFuZ2VkKCB0aGlzICk7XG5cdFx0fVxuXHR9XG59KTtcblxuLyoqXG5UaGlzIGlzIHRoZSB5IHBvc2l0aW9uIG9mIHRoZSBMYXlvdXROb2RlIG9uIHNjcmVlbi4gSW5pdGlhbGx5IHRoZSB2YWx1ZSBvZiB5IHdpbGwgYmUgMCB1bnRpbCB0aGlzIG5vZGUgaGFzIGJlZW4gbGF5ZWQgb3V0LlxuXG5PbmNlIHRoaXMgbm9kZSBoYXMgYmVlbiBsYXllZCBvdXQgdGhlIHkgcG9zaXRpb24gd2lsbCBiZSBzZXQgZnJvbSBhbGwgdGhlIHJ1bGVzIGFwcGxpZWQgdG8gdGhpcyBub2RlLlxuXG5Zb3UgY2FuIGFsc28gc2V0IHRoZSB5IHBvc2l0aW9uIG9mIGEgbm9kZSBieSBzaW1wbHkgc2V0dGluZyB0aGUgeSB2YWx1ZTpcblxuXHRub2RlLnkgPSAxMDtcblxuV2hhdCB0aGlzIHdpbGwgZG8gaXMgYWRqdXN0IGFuIG9mZnNldCBpbiB0aGlzIExheW91dE5vZGUuIFNvIGluIHByYWN0aWNlIHdoYXQgdGhpcyBtZWFucyBpcyB0aGF0IHlvdSBjYW4gZnJlZWx5IG1vdmUgYXJvdW5kXG5ub2RlcyBmb3IgaW5zdGFuY2UgYnkgZHJhZ2dpbmcgYnV0IGFsbCBkZXBlbmRlbnQgbm9kZXMgd2lsbCBzdGlsbCBwb3NpdGlvbiB0aGVtc2VsdmVzIGFjY29yZGluZyB0byB0aGUgcnVsZXMgc2V0IG9uIHRoZW0uXG5cblNvIGZvciBpbnN0YW5jZSBpZiB5b3UgaGFkIGFuIGltYWdlIHRoYXQgaXMgcmlnaHQgYWxpZ25lZCB0byBhbm90aGVyIGltYWdlLiBJZiB5b3UgZ3JhYiB0aGUgaW1hZ2Ugb24gdGhlIGxlZnQgYW5kIG1vdmUgaXQgYXJvdW5kIFxudGhlIGltYWdlIG9uIHRoZSByaWdodCB3aWxsIGZvbGxvdy5cblxuQHByb3BlcnR5IHlcbkB0eXBlIE51bWJlclxuKiovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoIExheW91dE5vZGUucHJvdG90eXBlLCAneScsIHtcblxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuX3k7XG5cdH0sXG5cblx0c2V0OiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0XHR0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkID0gUE9TSVRJT05fWTtcblx0XHRcblx0XHR0aGlzLl9vZmZZICs9IHZhbHVlIC0gdGhpcy5feTtcblxuXHRcdGlmKCB0aGlzLmhhc0JlZW5MYXllZE91dCApIHtcblxuXHRcdFx0dGhpcy5sYXlvdXQubm9kZUNoYW5nZWQoIHRoaXMgKTtcblx0XHR9XG5cdH1cbn0pO1xuXG4vKipcblRoaXMgaXMgdGhlIHdpZHRoIG9mIGEgTGF5b3V0Tm9kZSBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2Ygd2lkdGggd2lsbCBiZSAwIHVudGlsIHRoaXMgbm9kZSBoYXMgYmVlbiBsYXllZCBvdXQuXG5cbk9uY2UgdGhpcyBub2RlIGhhcyBiZWVuIGxheWVkIG91dCB0aGUgd2lkdGggd2lsbCBiZSBzZXQgZnJvbSBhbGwgdGhlIHJ1bGVzIGFwcGxpZWQgdG8gdGhpcyBub2RlIG9yIHJlYWQgaW4gYnkgdGhlIHJlYWQgZnVuY3Rpb24uXG5cbllvdSBjYW4gYWxzbyBzZXQgdGhlIHdpZHRoIG9mIGEgbm9kZSBieSBzaW1wbHkgc2V0dGluZyB0aGUgd2lkdGggdmFsdWU6XG5cblx0bm9kZS53aWR0aCA9IDIwMDtcblxuV2hhdCB0aGlzIHdpbGwgZG8gaXMgYWRqdXN0IGFuIG9mZnNldCBpbiB0aGlzIExheW91dE5vZGUuIFNvIGluIHByYWN0aWNlIHdoYXQgdGhpcyBtZWFucyBpcyB0aGF0IHlvdSBjYW4gc2V0IHRoZSBzaXplcyBvZiBub2Rlc1xuYW5kIHN0aWxsIGFsbCBkZXBlbmRlbnQgbm9kZXMgd2lsbCBmb2xsb3cgdGhlaXIgZGVwZW5kZW5jeSBydWxlcy5cblxuU28gbGV0J3Mgc2F5IHlvdSBoYWQgYW4gaW1hZ2UgY2FsbGVkIGltYWdlMSB3aGljaCB5b3Ugd2FudGVkIHRvIHNjYWxlIHVwIGhvd2V2ZXIgYW5vdGhlciBpbWFnZSBjYWxsZWQgaW1hZ2UyIGFsaWduZWQgbGVmdCBvZiBpbWFnZTEuXG5Zb3UgY2FuIHN0aWxsIHNldCBpbWFnZTEud2lkdGggdG8gYmUgd2hhdGV2ZXIgdmFsdWUgeW91IHdhbnRlZCBhbmQgaW1hZ2UyIHdvdWxkIGFsaWduIGxlZnQgb2YgaW1hZ2UxLlxuXG5AcHJvcGVydHkgd2lkdGhcbkB0eXBlIE51bWJlclxuKiovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoIExheW91dE5vZGUucHJvdG90eXBlLCAnd2lkdGgnLCB7XG5cblx0Z2V0OiBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB0aGlzLl93aWR0aDtcblx0fSxcblxuXHRzZXQ6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRcdHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgPSBTSVpFX1dJRFRIO1xuXG5cdFx0dGhpcy5fb2ZmV2lkdGggKz0gdmFsdWUgLSB0aGlzLl93aWR0aDtcblxuXHRcdGlmKCB0aGlzLmhhc0JlZW5MYXllZE91dCApIHtcblx0XHRcdFxuXHRcdFx0dGhpcy5sYXlvdXQubm9kZUNoYW5nZWQoIHRoaXMgKTtcblx0XHR9XG5cdH1cbn0pO1xuXG4vKipcblRoaXMgaXMgdGhlIGhlaWdodCBvZiBhIExheW91dE5vZGUgb24gc2NyZWVuLiBJbml0aWFsbHkgdGhlIHZhbHVlIG9mIGhlaWdodCB3aWxsIGJlIDAgdW50aWwgdGhpcyBub2RlIGhhcyBiZWVuIGxheWVkIG91dC5cblxuT25jZSB0aGlzIG5vZGUgaGFzIGJlZW4gbGF5ZWQgb3V0IHRoZSBoZWlnaHQgd2lsbCBiZSBzZXQgZnJvbSBhbGwgdGhlIHJ1bGVzIGFwcGxpZWQgdG8gdGhpcyBub2RlIG9yIHJlYWQgaW4gYnkgdGhlIHJlYWQgZnVuY3Rpb24uXG5cbllvdSBjYW4gYWxzbyBzZXQgdGhlIGhlaWdodCBvZiBhIG5vZGUgYnkgc2ltcGx5IHNldHRpbmcgdGhlIGhlaWdodCB2YWx1ZTpcblxuXHRub2RlLmhlaWdodCA9IDMzMztcblxuV2hhdCB0aGlzIHdpbGwgZG8gaXMgYWRqdXN0IGFuIG9mZnNldCBpbiB0aGlzIExheW91dE5vZGUuIFNvIGluIHByYWN0aWNlIHdoYXQgdGhpcyBtZWFucyBpcyB0aGF0IHlvdSBjYW4gc2V0IHRoZSBzaXplcyBvZiBub2Rlc1xuYW5kIHN0aWxsIGFsbCBkZXBlbmRlbnQgbm9kZXMgd2lsbCBmb2xsb3cgdGhlaXIgZGVwZW5kZW5jeSBydWxlcy5cblxuU28gbGV0J3Mgc2F5IHlvdSBoYWQgYW4gaW1hZ2UgY2FsbGVkIGltYWdlMSB3aGljaCB5b3Ugd2FudGVkIHRvIHNjYWxlIHVwIGhvd2V2ZXIgYW5vdGhlciBpbWFnZSBjYWxsZWQgaW1hZ2UyIGFsaWduZWQgYmVsb3cgaW1hZ2UxLlxuWW91IGNhbiBzdGlsbCBzZXQgaW1hZ2UxLmhlaWdodCB0byBiZSB3aGF0ZXZlciB2YWx1ZSB5b3Ugd2FudGVkIGFuZCBpbWFnZTIgd291bGQgYWxpZ24gYmVsb3cgaW1hZ2UxLlxuXG5AcHJvcGVydHkgd2lkdGhcbkB0eXBlIE51bWJlclxuKiovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoIExheW91dE5vZGUucHJvdG90eXBlLCAnaGVpZ2h0Jywge1xuXG5cdGdldDogZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5faGVpZ2h0O1xuXHR9LFxuXG5cdHNldDogZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdFx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IFNJWkVfSEVJR0hUO1xuXG5cdFx0dGhpcy5fb2ZmSGVpZ2h0ICs9IHZhbHVlIC0gdGhpcy5faGVpZ2h0O1xuXG5cdFx0aWYoIHRoaXMuaGFzQmVlbkxheWVkT3V0ICkge1xuXHRcdFx0XG5cdFx0XHR0aGlzLmxheW91dC5ub2RlQ2hhbmdlZCggdGhpcyApO1xuXHRcdH1cblx0fVxufSk7XG5cblxuLyoqXG5Jbm5lciBpcyBhIExheW91dE5vZGUgdGhhdCBpcyBjb250YWluZWQgYnkgdGhpcyBMYXlvdXROb2RlLiBJbm5lciB3aWxsIG1hdGNoIHRoZSBzaXplIG9mIHRoaXMgbm9kZSBidXQgd2lsbCBoYXZlIG5vIHBvc2l0b25hbCB2YWx1ZXMuXG5cbkl0IGlzIHVzZWZ1bCB3aGVuIHdvcmtpbmcgd2l0aCB0aGUgRE9NIHRvIGhhbmRsZSBuZXN0ZWQgY29udGVudCBpbnNpZGUgaHRtbCBlbGVtZW50cy4gRm9yIGluc3RhbmNlIGlmIHdlIGhhdmUgYSBkaXYgd2l0aCBhbiBpbWFnZSBpbnNpZGUuIFlvdSBjYW5cbmNhbiBhcHBseSBhIExheW91dE5vZGUgdG8gdGhlIGRpdiBhbmQgdXNlIHRoZSBpbm5lciBhdHRyaWJ1dGUgdG8gY2VudGVyIHRoZSBpbWFnZSBpbnNpZGUuXG5cblx0dmFyIG91ckRpdiA9IGxheW91dC5jcmVhdGUoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnb3VyRGl2JyApICk7XG5cdHZhciBvdXJJbWFnZUluc2lkZURpdiA9IGxheW91dC5jcmVhdGUoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnb3VySW1hZ2VJbnNpZGVEaXYnICkgKTtcblxuXHRvdXJEaXYubWF0Y2hlc1NpemVPZiggbGF5b3V0ICk7XG5cdG91ckltYWdlSW5zaWRlRGl2Lm1hdGNoZXNXaWR0aE9mKCBvdXJEaXYuaW5uZXIgKS5oZWlnaHRJc1Byb3BvcnRpb25hbCggNDAwLCAzMDAgKS5jZW50ZXJlZFdpdGgoIG91ckRpdi5pbm5lciApO1xuXG5AcHJvcGVydHkgaW5uZXJcbkB0eXBlIExheW91dE5vZGVcbioqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KCBMYXlvdXROb2RlLnByb3RvdHlwZSwgJ2lubmVyJywge1xuXG5cdGdldDogZnVuY3Rpb24oKSB7XG5cblx0XHRpZiggdGhpcy5faW5uZXIgPT09IG51bGwgKSB7XG5cblx0XHRcdHRoaXMuX2lubmVyID0gdGhpcy5sYXlvdXQuY3JlYXRlKCk7XG5cdFx0XHR0aGlzLl9pbm5lci5tYXRjaGVzU2l6ZU9mKCB0aGlzICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX2lubmVyO1xuXHR9XG59KTtcblxuLyoqXG5kb0xheW91dCB3aWxsIHBlcmZvcm0gdGhlIGxheW91dCBvZiB0aGlzIExheW91dE5vZGUuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIG5ldmVyIGJlIGNhbGxlZCBkaXJlY3RseSBidXQgYmUgY2FsbGVkIGJ5IHRoZSBMYXlEb3duIGxheW91dC5cblRoaXMgd2F5IGRlcGVuZGVuY2llcyB3aWxsIGJlIGhhbmRsZWQgY29ycmVjdGx5LlxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgeW91IGhhdmUgb25lIExheW91dE5vZGUgd2hpY2ggc2V0cyBpdCdzIHNpemUgYWNjb3JkaW5nIHRvIGFub3RoZXIgbm9kZSBjYWxsaW5nIGRvTGF5b3V0IG1hbnVhbGx5IGNvdWxkIHBvdGVudGlhbGx5IGJlXG5kZXN0cnVjdGl2ZS5cblxuQWx0aG91Z2ggdGhpcyBpcyB0aGUgZW50cnkgcG9pbnQgdG8gcGVyZm9ybSBsYXlvdXRzIHRoZSBhY3R1YWwgZ3J1bnQgd29yayBpcyBwZXJmb3JtZWQgaW4gdGhlIFwiZG9MYXlvdXRXb3JrXCIgZnVuY3Rpb24uIFRoaXMgZnVuY3Rpb24gd2lsbFxuZXZhbHVhdGUgY29uZGl0aW9uYWxzIChpZiB0aGVyZSBhcmUgYW55KSBhbmQgZ3JhYiB0aGUgYXBwcm9wcmlhdGUgcnVsZSBzZXRzIHRvIHVzZS4gQWZ0ZXIgdGhlIHJ1bGUgc2V0cyBhcmUgZGV0ZXJtaW5lZCBieSB0aGUgY29uZGl0aW9uYWxzXG5kb0xheW91dFdvcmsgaXMgY2FsbGVkLlxuXG5AcHJvdGVjdGVkXG5AbWV0aG9kIGRvTGF5b3V0XG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmRvTGF5b3V0ID0gZnVuY3Rpb24oKSB7XG5cblx0dGhpcy5oYXNCZWVuTGF5ZWRPdXQgPSB0cnVlO1xuXG5cdHRoaXMuX3ggPSB0aGlzLl95ID0gdGhpcy5fd2lkdGggPSB0aGlzLl9oZWlnaHQgPSAwO1xuXG5cdC8vdGhpcyBpcyB0aGUgbGlzdGVuZXIgYWRkZWQgd2hlbiBhbiBvbiBmdW5jdGlvbiB3YXMgY2FsbGVkIGFmdGVyIGNyZWF0aW5nIGEgY29uZGl0aW9uYWxcblx0dmFyIHRydWVDb25kaXRpb25hbHMgPSBbXTtcblxuXHRpZiggdGhpcy5pdGVtc1RvQ29tcGFyZS5sZW5ndGggPiAwICkge1xuXG5cdFx0dmFyIGNvbmRpdGlvbmFsTGF5ZWRPdXQgPSBmYWxzZTtcblxuXHRcdGZvciggdmFyIGkgPSAwLCBsZW5JID0gdGhpcy5pdGVtc1RvQ29tcGFyZS5sZW5ndGg7IGkgPCBsZW5JOyBpKysgKSB7XG5cblx0XHRcdHZhciBsYXlvdXROb2RlID0gdGhpcy5sYXlvdXROb2RlRm9yQ29uZGl0aW9uYWxbIGkgXTtcblx0XHRcdHZhciBpdGVtc1RvQ29tcGFyZVRvID0gdGhpcy5pdGVtc1RvQ29tcGFyZVsgaSBdO1xuXHRcdFx0dmFyIGlzQ29uZGl0aW9uYWxWYWxpZCA9IHRydWU7XG5cblx0XHRcdGZvciggdmFyIGogPSAwLCBsZW5KID0gaXRlbXNUb0NvbXBhcmVUby5sZW5ndGg7IGlzQ29uZGl0aW9uYWxWYWxpZCAmJiBqIDwgbGVuSjsgaisrICkge1xuXG5cdFx0XHRcdHZhciBjb25kaXRpb25hbHMgPSB0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW1bIGkgXVsgaiBdO1xuXHRcdFx0XHR2YXIgYXJndW1lbnRzRm9yQ29uZGl0aW9uYWxzID0gdGhpcy5jb25kaXRpb25hbHNBcmd1bWVudHNGb3JJdGVtWyBpIF1bIGogXTtcblx0XHRcdFx0XG5cdFx0XHRcdGZvciggdmFyIGsgPSAwLCBsZW5LID0gY29uZGl0aW9uYWxzLmxlbmd0aDsgaXNDb25kaXRpb25hbFZhbGlkICYmIGsgPCBsZW5LOyBrKysgKSB7XG5cblx0XHRcdFx0XHRpc0NvbmRpdGlvbmFsVmFsaWQgPSBjb25kaXRpb25hbHNbIGsgXS5hcHBseSggaXRlbXNUb0NvbXBhcmVUb1sgayBdLCBhcmd1bWVudHNGb3JDb25kaXRpb25hbHNbIGsgXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vaWYgdGhlIGNvbmRpdGlvbmFsIGlzIHN0aWxsIHZhbGlkIGFmdGVyXG5cdFx0XHQvL2FsbCB0aGUgdGVzdHMgdGhlbiB3ZSBzaG91bGQgZG8gbGF5b3V0IHdpdGggdGhpcyBvdGhlciBub2RlXG5cdFx0XHQvL2luc3RlYWQgb2YgXCJ0aGlzXCIgd2hpY2ggaXMgbm93IGNvbnNpZGVyZWQgdGhlIGRlZmF1bHQgdmFsdWVcblx0XHRcdGlmKCBpc0NvbmRpdGlvbmFsVmFsaWQgKSB7XG5cblx0XHRcdFx0Ly9pZiB3ZSBzaW1wbHkganVzdCBkbyBhIGNvbmRpdGlvbmFsIHdpdGggYSBsaXN0ZW5lciB3ZSdsbCBoYXZlIG5vIGxheW91dE5vZGVcblx0XHRcdFx0aWYoIGxheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0XHRsYXlvdXROb2RlLmRvTGF5b3V0KCk7XHRcblx0XHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRcdGNvbmRpdGlvbmFsTGF5ZWRPdXQgPSB0cnVlO1xuXG5cdFx0XHRcdGlmKCB0aGlzLmNvbmRpdGlvbmFsTGlzdGVuZXJzWyBpIF0gKSB7XG5cblx0XHRcdFx0XHR0cnVlQ29uZGl0aW9uYWxzLnB1c2goIHRoaXMuY29uZGl0aW9uYWxMaXN0ZW5lcnNbIGkgXSApO1x0XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvL2lmIGFsbCBvZiB0aGUgYWJvdmUgZXZhbHVhdGVkIGZhbHNlIHRoZW4gd2UnbGwgZ2V0IGhlcmVcblx0XHQvL2luIHdoaWNoIGNhc2Ugd2Ugc2hvdWxkIGNoZWNrIGlmIHRoZXJlcyBhIGRlZmF1bHRcblx0XHRpZiggIWNvbmRpdGlvbmFsTGF5ZWRPdXQgJiYgdGhpcy5sYXlvdXROb2RlRm9yRGVmYXVsdCApIHtcblxuXHRcdFx0aWYoIHRoaXMuZGVmYXVsdENvbmRpdGlvbmFsTGlzdGVuZXIgKSB7XG5cblx0XHRcdFx0dHJ1ZUNvbmRpdGlvbmFscy5wdXNoKCB0aGlzLmRlZmF1bHRDb25kaXRpb25hbExpc3RlbmVyICk7XHRcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYoIHRoaXMubGF5b3V0Tm9kZUZvckRlZmF1bHQgKSB7XG5cblx0XHRcdFx0dGhpcy5sYXlvdXROb2RlRm9yRGVmYXVsdC5kb0xheW91dCgpO1x0XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly9EbyB0aGUgYWN0dWFsIGxheW91dFxuXHR0aGlzLmRvTGF5b3V0V29yaygpO1xuXG5cblxuXHQvL05vdyBkbyBzZWxmIGNvbmRpdGlvbmFsc1xuXHRmb3IoIHZhciBpID0gMCwgbGVuSSA9IHRoaXMuc2VsZkl0ZW1zVG9Db21wYXJlLmxlbmd0aDsgaSA8IGxlbkk7IGkrKyApIHtcblxuXHRcdHZhciBpdGVtc1RvQ29tcGFyZVRvID0gdGhpcy5zZWxmSXRlbXNUb0NvbXBhcmVbIGkgXTtcblx0XHR2YXIgaXNDb25kaXRpb25hbFZhbGlkID0gdHJ1ZTtcblxuXHRcdGZvciggdmFyIGogPSAwLCBsZW5KID0gaXRlbXNUb0NvbXBhcmVUby5sZW5ndGg7IGlzQ29uZGl0aW9uYWxWYWxpZCAmJiBqIDwgbGVuSjsgaisrICkge1xuXG5cdFx0XHR2YXIgY29uZGl0aW9uYWxzID0gdGhpcy5zZWxmQ29uZGl0aW9uYWxzRm9ySXRlbVsgaSBdWyBqIF07XG5cdFx0XHR2YXIgYXJndW1lbnRzRm9yQ29uZGl0aW9uYWxzID0gdGhpcy5zZWxmQ29uZGl0aW9uYWxBcmd1bWVudHNGb3JJdGVtWyBpIF1bIGogXTtcblx0XHRcdFxuXHRcdFx0Zm9yKCB2YXIgayA9IDAsIGxlbksgPSBjb25kaXRpb25hbHMubGVuZ3RoOyBpc0NvbmRpdGlvbmFsVmFsaWQgJiYgayA8IGxlbks7IGsrKyApIHtcblxuXHRcdFx0XHRpc0NvbmRpdGlvbmFsVmFsaWQgPSBjb25kaXRpb25hbHNbIGsgXS5hcHBseSggaXRlbXNUb0NvbXBhcmVUb1sgayBdLCBhcmd1bWVudHNGb3JDb25kaXRpb25hbHNbIGsgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiggaXNDb25kaXRpb25hbFZhbGlkICYmIHRoaXMuc2VsZkNvbmRpdGlvbmFsTGlzdGVuZXJzWyBpIF0gKSB7XG5cblx0XHRcdFx0dHJ1ZUNvbmRpdGlvbmFscy5wdXNoKCB0aGlzLnNlbGZDb25kaXRpb25hbExpc3RlbmVyc1sgaSBdICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblxuXHQvL0lmIHRoaXMgbGF5b3l0IG5vZGUgaGFzIHNvbWV0aGluZyB0byBwb3NpdGlvbiBhbmQgc2l6ZSBhbmQgaGFzIGEgbGF5b3V0IGZ1bmN0aW9uIHJ1biBpdFxuXHRpZiggdGhpcy5pdGVtICYmIHRoaXMubGF5b3V0RnVuY3Rpb24gKSB7XG5cdFx0XG5cdFx0dGhpcy5sYXlvdXRGdW5jdGlvbiggdGhpcy5pdGVtLCB0aGlzLCB0aGlzLmRvTm90UmVhZFdpZHRoLCB0aGlzLmRvTm90UmVhZEhlaWdodCApO1xuXHR9XG5cblx0Ly9pZiBhIGNvbmRpdGlvbmFsIGhhcyBiZWVuIHZhbGlkYXRlZCBpdCBzaG91bGQgYmUgY2FsbGVkIG5vd1xuXHRmb3IoIHZhciBpID0gMCwgbGVuID0gdHJ1ZUNvbmRpdGlvbmFscy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblxuXHRcdHRydWVDb25kaXRpb25hbHNbIGkgXSgpO1xuXHR9XG59O1xuXG5cbi8qKlxuZG9MYXlvdXRXb3JrIHdpbGwgcGVyZm9ybSB0aGUgbGF5b3V0IHdvcmsgb2YgdGhpcyBMYXlvdXROb2RlLiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBuZXZlciBiZSBjYWxsZWQgZGlyZWN0bHkgYnV0IGJlIGNhbGxlZCBieSBkb0xheW91dCBhZnRlclxuYWxsIGNvbmRpdGlvbmFscyAoaWYgYW55KSBhcmUgZXZhbHVhdGVkLlxuXG5UaGlzIGZ1bmN0aW9uIGVuc3VyZXMgZXZlcnl0aGluZyBpcyBldmFsdWF0ZWQgaW4gY29ycmVjdCBvcmRlcjpcblxuMS4gU2l6ZSBEZXBlbmRlbmNpZXNcbjIuIFBvc2l0aW9uIERlcGVuZGVuY2llc1xuMy4gU2l6ZSBSdWxlc1xuNC4gU2l6ZSBCb3VuZHNcbjUuIFNpemUgT2Zmc2V0c1xuNi4gU2l6ZSBCb3VuZHMgKGFnYWluIGFmdGVyIHNpemUgb2Zmc2V0KVxuNy4gUmVhZGluZyB3aWR0aCwgaGVpZ2h0IGlmIHRoZXkgd2VyZSBub3Qgc2V0XG44LiBQb3NpdGlvbiBydWxlc1xuOS4gUG9zaXRpb25hbCBCb3VuZHNcbjEwLiBQb3NpdGlvbmFsIE9mZnNldHNcbjExLiBQb3NpdGlvbmFsIEJvdW5kcyAoYWdhaW4gYWZ0ZXIgcG9zaXRpb24gb2Zmc2V0KVxuXG5UaGUgYmFzaWMgcnVsZSBvZiB0aHVtYiBpcyB3ZSBjYW4ndCBwb3NpdGlvbiBhbnl0aGluZyB1bnRpbCB3ZSBrbm93IGl0J3Mgc2l6ZS4gQm91bmRzIGFyZSB1c2VkIHRvIGVuc3VyZSB0aGluZ3MgZG9uJ3QgZ28gb2ZmIHNjcmVlbiwgZ2V0IHRvbyBiaWcgb3Igc21hbGwuXG5cbkBwcm90ZWN0ZWRcbkBtZXRob2QgZG9MYXlvdXRXb3JrXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmRvTGF5b3V0V29yayA9IGZ1bmN0aW9uKCkge1xuXG5cdGZvciggdmFyIGkgPSAwLCBsZW4gPSB0aGlzLnNpemVEZXBlbmRlbmNpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHRpZiggIXRoaXMuc2l6ZURlcGVuZGVuY2llc1sgaSBdLmhhc0JlZW5MYXllZE91dCApIHtcblxuXHRcdFx0dGhpcy5zaXplRGVwZW5kZW5jaWVzWyBpIF0uZG9MYXlvdXQoKTtcblx0XHR9XG5cdH1cdFxuXG5cdGZvciggdmFyIGkgPSAwLCBsZW4gPSB0aGlzLnBvc2l0aW9uRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXG5cdFx0aWYoICF0aGlzLnBvc2l0aW9uRGVwZW5kZW5jaWVzWyBpIF0uaGFzQmVlbkxheWVkT3V0ICkge1xuXG5cdFx0XHR0aGlzLnBvc2l0aW9uRGVwZW5kZW5jaWVzWyBpIF0uZG9MYXlvdXQoKTtcblx0XHR9XG5cdH1cdFxuXG5cblx0Ly9IQU5ETEUgU0laRVxuXHRmb3IoIHZhciBpID0gMCwgbGVuID0gdGhpcy5ydWxlc1NpemUubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHR0aGlzLnJ1bGVzU2l6ZVsgaSBdLmFwcGx5KCB0aGlzLCB0aGlzLnJ1bGVzU2l6ZVByb3BbIGkgXSApO1xuXG5cdFx0Ly9IQU5ETEUgQk9VTkRJTkcgU0laRVxuXHRcdGZvciggdmFyIGogPSAwLCBsZW5KID0gdGhpcy5ydWxlc1NpemVCb3VuZC5sZW5ndGg7IGogPCBsZW5KOyBqKysgKSB7XG5cblx0XHRcdHRoaXMucnVsZXNTaXplQm91bmRbIGogXS5hcHBseSggdGhpcywgdGhpcy5ydWxlc1NpemVCb3VuZFByb3BbIGogXSApO1xuXHRcdH1cblx0fVxuXG5cdHRoaXMuX3dpZHRoICs9IHRoaXMuX29mZldpZHRoO1xuXHR0aGlzLl9oZWlnaHQgKz0gdGhpcy5fb2ZmSGVpZ2h0O1xuXG5cdGZvciggdmFyIGogPSAwLCBsZW5KID0gdGhpcy5ydWxlc1NpemVCb3VuZC5sZW5ndGg7IGogPCBsZW5KOyBqKysgKSB7XG5cblx0XHR0aGlzLnJ1bGVzU2l6ZUJvdW5kWyBqIF0uYXBwbHkoIHRoaXMsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wWyBqIF0gKTtcblx0fVxuXG5cdFxuXHQvL2NoZWNrIGlmIHdlIHNob3VsZCByZWFkIGluIGEgc2l6ZSBmb3IgYW4gaXRlbVxuXHRpZiggdGhpcy5pdGVtICkge1xuXG5cdFx0aWYoIHRoaXMucmVhZEZ1bmN0aW9uICkge1xuXG5cdFx0XHRpZiggIXRoaXMuZG9Ob3RSZWFkV2lkdGggJiYgIXRoaXMuZG9Ob3RSZWFkV2lkdGggKSB7XG5cblx0XHRcdFx0dGhpcy5fd2lkdGggPSB0aGlzLnJlYWRGdW5jdGlvbiggdGhpcy5pdGVtLCAnd2lkdGgnICk7XG5cdFx0XHRcdHRoaXMuX2hlaWdodCA9IHRoaXMucmVhZEZ1bmN0aW9uKCB0aGlzLml0ZW0sICdoZWlnaHQnICk7XG5cdFx0XHR9IGVsc2UgaWYoICF0aGlzLmRvTm90UmVhZFdpZHRoICkge1xuXG5cdFx0XHRcdHRoaXMuX3dpZHRoID0gdGhpcy5yZWFkRnVuY3Rpb24oIHRoaXMuaXRlbSwgJ3dpZHRoJyApO1xuXHRcdFx0fSBlbHNlIGlmKCAhdGhpcy5kb05vdFJlYWRIZWlnaHQgKSB7XG5cblx0XHRcdFx0dGhpcy5faGVpZ2h0ID0gdGhpcy5yZWFkRnVuY3Rpb24oIHRoaXMuaXRlbSwgJ2hlaWdodCcgKTtcblx0XHRcdH1cblx0XHR9XHRcblx0fVxuXG5cblxuXG5cdC8vSEFORExFIFBPU0lUSU9OXG5cdGZvciggdmFyIGkgPSAwLCBsZW4gPSB0aGlzLnJ1bGVzUG9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXG5cdFx0dGhpcy5ydWxlc1Bvc1sgaSBdLmFwcGx5KCB0aGlzLCB0aGlzLnJ1bGVzUG9zUHJvcFsgaSBdICk7XG5cblx0XHQvL0hBTkRMRSBCT1VORElORyBQT1NJVElPTlxuXHRcdGZvciggdmFyIGogPSAwLCBsZW5KID0gdGhpcy5ydWxlc1Bvc0JvdW5kLmxlbmd0aDsgaiA8IGxlbko7IGorKyApIHtcblxuXHRcdFx0dGhpcy5ydWxlc1Bvc0JvdW5kWyBqIF0uYXBwbHkoIHRoaXMsIHRoaXMucnVsZXNQb3NCb3VuZFByb3BbIGogXSApO1xuXHRcdH1cblx0fVxuXG5cdHRoaXMuX3ggKz0gdGhpcy5fb2ZmWDtcblx0dGhpcy5feSArPSB0aGlzLl9vZmZZO1xuXG5cdGZvciggdmFyIGogPSAwLCBsZW5KID0gdGhpcy5ydWxlc1Bvc0JvdW5kLmxlbmd0aDsgaiA8IGxlbko7IGorKyApIHtcblxuXHRcdHRoaXMucnVsZXNQb3NCb3VuZFsgaiBdLmFwcGx5KCB0aGlzLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wWyBqIF0gKTtcblx0fVxuXG5cdC8vYmVjYXVzZSBvdGhlciBpdGVtcyB3aWxsIGFjdHVhbGx5IHJlbHkgb24gdGhlIHZhbHVlcyBvZiB0aGVcblx0Ly9wYXJlbnQgbm9kZSBvZiBhIGNvbmRpdGlvbmFsIG5vZGUgdGhlbiB3ZSBuZWVkIHRvIHNldCB0aGUgX3gsIF95LCBfd2lkdGgsIF9oZWlnaHRcblx0Ly9mb3IgdGhlIHBhcmVudCBhbHNvXG5cdGlmKCB0aGlzLmNvbmRpdGlvbmFsUGFyZW50ICE9IG51bGwgKSB7XG5cblx0XHR0aGlzLmNvbmRpdGlvbmFsUGFyZW50Ll94ICs9IHRoaXMuX3g7XG5cdFx0dGhpcy5jb25kaXRpb25hbFBhcmVudC5feSArPSB0aGlzLl95O1xuXHRcdHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuX3dpZHRoICs9IHRoaXMuX3dpZHRoO1xuXHRcdHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuX2hlaWdodCArPSB0aGlzLl9oZWlnaHQ7XG5cdH1cbn07XG5cbi8qKlxuVXNlIHRoaXMgZnVuY3Rpb24gdG8gc2V0IHRoZSBsYXlvdXQgZnVuY3Rpb24gZm9yIHRoaXMgbm9kZS4gTGF5b3V0IGZ1bmN0aW9ucyBwZXJmb3JtIHRoZSBhY3R1YWwgd29yayB0byBtb3ZlIHRoaW5ncyBvbiBzY3JlZW4uIExheW91dE5vZGUncyBhbmQgcnVsZXNcbm9uIExheW91dE5vZGUncyBwZXJmb3JtIHRoZSB2aXJ0dWFsIHBvc2l0aW9uaW5nIG9mIGFuIG9iamVjdCB3aGVyZSB0aGUgbGF5b3V0RnVuY3Rpb24gcGVyZm9ybXMgdGhlIGFjdHVhbCBwaHlzaWNhbC5cblxuRm9yIGluc3RhbmNlIGlmIHlvdSdyZSB3b3JraW5nIHdpdGggdGhlIERPTSB0aGUgbGF5b3V0RnVuY3Rpb24gY291bGQgc2V0IENTUyB3aWR0aCBhbmQgaGVpZ2h0IHByb3BlcnRpZXMgb3Igc2NhbGUuIE9yIGlmIHlvdSByZWFsbHkgd2FudGVkIHRvIGdldCBmYW5jeVxuaXQgY291bGQgcGVyZm9ybSBhbiBhbmltYXRpb24gdG8gcG9zaXRpb24gdGhlIEhUTUwgZWxlbWVudC5cblxuQG1ldGhvZCBzZXRMYXlvdXRGdW5jdGlvblxuQHBhcmFtIGxheW91dEZ1bmN0aW9uIHtmdW5jdGlvbn0gVGhpcyBpcyB0aGUgbGF5b3V0IGZ1bmN0aW9uIHRoYXQgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUuXG5cbkxheW91dCBmdW5jdGlvbidzIHNob3VsZCB0YWtlIGZvdXIgcHJvcGVydGllczogaXRlbSwgbm9kZSwgc2V0V2lkdGgsIHNldEhlaWdodC4gXG5cbisgV2hlcmUgaXRlbSBpcyB0aGUgaXRlbSB0byBsYXlvdXQgKERPTSBlbGVtZW50IG9yIFBJWEkgRGlzcGxheU9iamVjdClcbisgbm9kZSB3aWxsIGJlIGEgTGF5b3V0Tm9kZSBmcm9tIHdoaWNoIHlvdSBjYW4gcmVhZCB4LCB5LCB3aWR0aCwgaGVpZ2h0XG4rIHNldFdpZHRoIHdpbGwgYmUgYSBib29sZWFuIGZvciB3aGV0aGVyIHRoZSBsYXlvdXQgZnVuY3Rpb24gc2hvdWxkIHNldCB0aGUgd2lkdGggb2YgdGhlIGl0ZW1cbisgc2V0SGVpZ2h0IHdpbGwgYmUgYSBib29sZWFuIGZvciB3aGV0aGVyIHRoZSBsYXlvdXQgZnVuY3Rpb24gc2hvdWxkIHNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpdGVtXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnNldExheW91dEZ1bmN0aW9uID0gZnVuY3Rpb24oIGxheW91dEZ1bmN0aW9uICkge1xuXG5cdHRoaXMubGF5b3V0RnVuY3Rpb24gPSBsYXlvdXRGdW5jdGlvbjtcblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuWW91IGNhbiB1c2UgYWRkQ3VzdG9tUnVsZSB0byBkZWZpbmUgbmV3IHJ1bGVzIHdoaWNoIG1heSBub3QgYmUgZGVmaW5lZCBieSBMYXlEb3duLiBUaGlzIGNvdWxkIGJlIGhhbmR5IGZvciBpbnN0YW5jZSBpZiB5b3Ugd2FudGVkIHRvIHNldCB0aGVcbmNvbG91ciBvZiBhIERJViBlbGVtZW50IGJhc2VkIG9uIGhvdyBsYXJnZSBpdCBpcy4gUmVhbGx5IHRoZSBza3kgaXMgdGhlIGxpbWl0IGhlcmUuIEFsdGhvdWdoIHRvIGVuc3VyZSB5b3VyIG5ldyBydWxlIGlzIHBlcmZvcm1lZCBjb3JyZWN0bHkgYW5kXG5kb2VzIG5vdCBpbnRlcmZlcmUgd2l0aCBvdGhlciBydWxlcyB5b3UgbXVzdCBwYXNzIGluIGEgcnVsZSB0eXBlLlxuXG5AbWV0aG9kIGFkZEN1c3RvbVJ1bGVcbkBwYXJhbSB7ZnVuY3Rpb259IHJ1bGVGdW5jdGlvbiBUaGlzIGEgbmV3IHJ1bGUgeW91J2QgbGlrZSB0byBhZGQuIFRvIHNlZSBob3cgcnVsZXMgYXJlIGNvbXBvc2VkIHdlIHN1Z2dlc3QgbG9va2luZyBhdCB0aGUgZm9sbG93aW5nIGZ1bmN0aW9uc1xuaW4gdGhlIHNyYyBmb2xkZXIuXG5cbiMjIyMjIyBTZXR0aW5nIHNpemUgKHdpZHRoLCBoZWlnaHQpOlxuLSBzcmMvbGF5b3V0U2l6ZS9zaXplSXMgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IGF0IHRoZSBzYW1lIHRpbWUgZnJvbSB2YWx1ZXMpXG4tIHNyYy9sYXlvdXRTaXplL3dpZHRoSXMgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgb25seSB0aGUgd2lkdGggZnJvbSBhIHZhbHVlKVxuLSBzcmMvbGF5b3V0U2l6ZS9oZWlnaHRJcyAoaWYgeW91ciBydWxlIHdpbGwgYmUgc2V0dGluZyBvbmx5IHRoZSBoZWlnaHQgZnJvbSBhIHZhbHVlKVxuLSBzcmMvbGF5b3V0U2l6ZS9tYXRjaGVzU2l6ZU9mIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIGJvdGggd2lkdGggYW5kIGhlaWdodCBmcm9tIGFub3RoZXIgbm9kZSlcbi0gc3JjL2xheW91dFNpemUvbWF0Y2hlc1dpZHRoT2YgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgYm90aCB3aWR0aCBmcm9tIGFub3RoZXIgbm9kZSlcbi0gc3JjL2xheW91dFNpemUvbWF0Y2hlc0hlaWdodE9mIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIGJvdGggaGVpZ2h0IGZyb20gYW5vdGhlciBub2RlKVxuXG4jIyMjIyMgU2V0dGluZyBwb3NpdGlvbiAoeCwgeSk6XG4tIHNyYy9sYXlvdXRQb3NpdGlvbi9wb3NpdGlvbklzIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIHggYW5kIHkgZnJvbSBhIHZhbHVlcyBhdCB0aGUgc2FtZSB0aW1lKVxuLSBzcmMvbGF5b3V0UG9zaXRpb24veElzIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIHggZnJvbSBhIHZhbHVlKVxuLSBzcmMvbGF5b3V0UG9zaXRpb24veUlzIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIHkgZnJvbSBhIHZhbHVlKVxuLSBzcmMvbGF5b3V0UG9zaXRpb24vYWxpZ25lZFdpdGggKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgeCBhbmQgeSBiYXNlZCBvbiBhbm90aGVyIG5vZGUpXG4tIHNyYy9sYXlvdXRQb3NpdGlvbi9sZWZ0QWxpZ25lZFdpdGggKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgeCBiYXNlZCBvbiBhbm90aGVyIG5vZGUpXG4tIHNyYy9sYXlvdXRQb3NpdGlvbi90b3BBbGlnbmVkV2l0aCAoaWYgeW91ciBydWxlIHdpbGwgYmUgc2V0dGluZyB5IGJhc2VkIG9uIGFub3RoZXIgbm9kZSlcblxuIyMjIyMjIEJvdW5kaW5nIHNpemUgKHdpZHRoLCBoZWlnaHQpOlxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heFNpemUgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIGJvdGggd2lkdGggYW5kIGhlaWdodCBhdCB0aGUgc2FtZSB0aW1lKVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heFdpZHRoIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBib3VuZGluZyB3aWR0aCBvbmx5KVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heEhlaWdodCAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgaGVpZ2h0IG9ubHkpXG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbWF4U2l6ZUZyb20gKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIHdpZHRoIGFuZCBoZWlnaHQgYmFzZWQgb24gYW5vdGhlciBpdGVtKVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heFdpZHRoRnJvbSAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgd2lkdGggYmFzZWQgb24gYW5vdGhlciBpdGVtKVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heEhlaWdodEZyb20gKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIGhlaWdodCBiYXNlZCBvbiBhbm90aGVyIGl0ZW0pXG5cbiMjIyMjIyBCb3VuZGluZyBwb3NpdGlvbiAoeCwgeSk6XG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbWF4UG9zaXRpb24gKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIGJvdGggeCBhbmQgeSBhdCB0aGUgc2FtZSB0aW1lKVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL2xlZnRNYXggKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIHggb25seSlcbi0gc3JjL2xheW91dEJvdW5kU2l6ZS90b3BNYXggKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIHkgb25seSlcbi0gc3JjL2xheW91dEJvdW5kU2l6ZS9tYXhQb3NpdGlvbkZyb20gKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIHggYW5kIHkgYmFzZWQgb24gYW5vdGhlciBpdGVtKVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL2xlZnRNYXhGcm9tIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBib3VuZGluZyB4IGJhc2VkIG9uIGFub3RoZXIgaXRlbSlcbi0gc3JjL2xheW91dEJvdW5kU2l6ZS90b3BNYXhGcm9tIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBib3VuZGluZyB5IGJhc2VkIG9uIGFub3RoZXIgaXRlbSlcblxuQHBhcmFtIHtTdHJpbmd9IHJ1bGVUeXBlIGlzIGEgc3RyaW5nIHdoaWNoIGRlc2NyaWJlcyB3aGF0IHR5cGUgb2YgcnVsZSB5b3UncmUgZGVmaW5pbmcuIEZvciB1dGlsaXR5IHlvdSBjYW4gdXNlIHRoZSBzdGF0aWMgY29uc3RhbnRzIGRlZmluZWRcbm9uIExheW91dE5vZGU6XG5cbi0ge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZS9TSVpFX0xBWU9VVDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1NJWkVfTEFZT1VUOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvU0laRV9CT1VORDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1NJWkVfV0lEVEhfTEFZT1VUOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvU0laRV9XSURUSF9CT1VORDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1NJWkVfSEVJR0hUX0xBWU9VVDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1NJWkVfSEVJR0hUX0JPVU5EOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvUE9TSVRJT05fTEFZT1VUOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvUE9TSVRJT05fQk9VTkQ6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cbi0ge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZS9QT1NJVElPTl9YX0xBWU9VVDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1BPU0lUSU9OX1hfQk9VTkQ6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cbi0ge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZS9QT1NJVElPTl9ZX0xBWU9VVDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1BPU0lUSU9OX1lfQk9VTkQ6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cblxuXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmFkZEN1c3RvbVJ1bGUgPSBmdW5jdGlvbiggcnVsZUZ1bmN0aW9uLCBydWxlVHlwZSApIHtcblxuXHRhcmd1bWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAyICk7XG5cblx0dmFyIGVmZmVjdHNQcm9wZXJ0aWVzID0gbnVsbDtcblx0dmFyIHJ1bGVBcnIgPSBudWxsO1xuXHR2YXIgcnVsZVByb3BBcnIgPSBudWxsO1xuXG5cdHN3aXRjaCggcnVsZVR5cGUgKSB7XG5cblx0XHRjYXNlIExheW91dE5vZGUuU0laRV9MQVlPVVQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFNJWkU7XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1NpemU7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNTaXplUHJvcDtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5TSVpFX0JPVU5EOlxuXHRcdFx0ZWZmZWN0c1Byb3BlcnRpZXMgPSBTSVpFO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNTaXplQm91bmQ7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNTaXplQm91bmRQcm9wO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBMYXlvdXROb2RlLlNJWkVfV0lEVEhfTEFZT1VUOlxuXHRcdFx0ZWZmZWN0c1Byb3BlcnRpZXMgPSBTSVpFX1dJRFRIO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNTaXplO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzU2l6ZVByb3A7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIExheW91dE5vZGUuU0laRV9XSURUSF9CT1VORDpcblx0XHRcdGVmZmVjdHNQcm9wZXJ0aWVzID0gU0laRV9XSURUSDtcblx0XHRcdHJ1bGVBcnIgPSB0aGlzLnJ1bGVzU2l6ZUJvdW5kO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcDtcblx0XHRicmVhaztcdFx0XG5cblx0XHRjYXNlIExheW91dE5vZGUuU0laRV9IRUlHSFRfTEFZT1VUOlxuXHRcdFx0ZWZmZWN0c1Byb3BlcnRpZXMgPSBTSVpFX0hFSUdIVDtcblx0XHRcdHJ1bGVBcnIgPSB0aGlzLnJ1bGVzU2l6ZTtcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1NpemVQcm9wO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBMYXlvdXROb2RlLlNJWkVfSEVJR0hUX0JPVU5EOlxuXHRcdFx0ZWZmZWN0c1Byb3BlcnRpZXMgPSBTSVpFX0hFSUdIVDtcblx0XHRcdHJ1bGVBcnIgPSB0aGlzLnJ1bGVzU2l6ZUJvdW5kO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcDtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5QT1NJVElPTl9MQVlPVVQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFBPU0lUSU9OO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNQb3M7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNQb3NQcm9wO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBMYXlvdXROb2RlLlBPU0lUSU9OX0JPVU5EOlxuXG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFBPU0lUSU9OO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNQb3NCb3VuZDtcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcDtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5QT1NJVElPTl9YX0xBWU9VVDpcblx0XHRcdGVmZmVjdHNQcm9wZXJ0aWVzID0gUE9TSVRJT05fWDtcblx0XHRcdHJ1bGVBcnIgPSB0aGlzLnJ1bGVzUG9zO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzUG9zUHJvcDtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5QT1NJVElPTl9YX0JPVU5EOlxuXHRcdFx0ZWZmZWN0c1Byb3BlcnRpZXMgPSBQT1NJVElPTl9YO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNQb3NCb3VuZDtcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcDtcblx0XHRicmVhaztcdFx0XG5cblx0XHRjYXNlIExheW91dE5vZGUuUE9TSVRJT05fWV9MQVlPVVQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFBPU0lUSU9OX1k7XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1Bvcztcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1Bvc1Byb3A7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIExheW91dE5vZGUuUE9TSVRJT05fWV9CT1VORDpcblx0XHRcdGVmZmVjdHNQcm9wZXJ0aWVzID0gUE9TSVRJT05fWTtcblx0XHRcdHJ1bGVBcnIgPSB0aGlzLnJ1bGVzUG9zQm91bmQ7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNQb3NCb3VuZFByb3A7XG5cdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OiBcblx0XHRcdHRocm93ICdVa25vd24gcnVsZSB0eXBlJztcblx0XHRicmVhaztcblx0fTtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBydWxlRnVuY3Rpb24sIGFyZ3VtZW50cywgcnVsZUFyciwgcnVsZVByb3BBcnIsIGVmZmVjdHNQcm9wZXJ0aWVzICk7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5hZGREZXBlbmRlbmN5ID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0c3dpdGNoKCB0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkICkge1xuXG5cdFx0Y2FzZSBTSVpFOlxuXHRcdGNhc2UgQk9VTkRfU0laRTpcblx0XHRjYXNlIFNJWkVfV0lEVEg6XG5cdFx0Y2FzZSBCT1VORF9TSVpFX1dJRFRIOlxuXHRcdGNhc2UgU0laRV9IRUlHSFQ6XG5cdFx0Y2FzZSBCT1VORF9TSVpFX0hFSUdIVDpcblxuXHRcdFx0dGhpcy5zaXplRGVwZW5kZW5jaWVzLnB1c2goIGl0ZW0gKTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgUE9TSVRJT046XG5cdFx0Y2FzZSBCT1VORF9QT1NJVElPTjpcblx0XHRjYXNlIFBPU0lUSU9OX1g6XG5cdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9YOlxuXHRcdGNhc2UgUE9TSVRJT05fWTpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1k6XG5cblx0XHRcdHRoaXMucG9zaXRpb25EZXBlbmRlbmNpZXMucHVzaCggaXRlbSApO1xuXHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5yZXNldFJ1bGVzID0gZnVuY3Rpb24oKSB7XG5cblx0dGhpcy5yZXNldFNpemVSdWxlcygpO1xuXHR0aGlzLnJlc2V0UG9zaXRpb25SdWxlcygpO1xuXG5cdHJldHVybiB0aGlzO1xufTtcblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUucmVzZXRQb3NpdGlvblJ1bGVzID0gZnVuY3Rpb24oKSB7XG5cblx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IG51bGw7XG5cdHRoaXMucG9zaXRpb25EZXBlbmRlbmNpZXMgPSBbXTtcblx0dGhpcy5ydWxlc1BvcyA9IFtdO1xuXHR0aGlzLnJ1bGVzUG9zUHJvcCA9IFtdO1xuXHR0aGlzLl9vZmZYID0gdGhpcy5fb2ZmWSA9IDA7XG5cblx0aWYoIHRoaXMuaGFzQmVlbkxheWVkT3V0ICkge1xuXHRcdFx0XG5cdFx0dGhpcy5sYXlvdXQubm9kZUNoYW5nZWQoIHRoaXMgKTtcblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUucmVzZXRTaXplUnVsZXMgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkID0gbnVsbDtcblx0dGhpcy5zaXplRGVwZW5kZW5jaWVzID0gW107XG5cdHRoaXMucnVsZXNTaXplID0gW107XG5cdHRoaXMucnVsZXNTaXplUHJvcCA9IFtdO1xuXHR0aGlzLl9vZmZXaWR0aCA9IHRoaXMuX29mZkhlaWdodCA9IDA7XG5cblx0aWYoIHRoaXMuaGFzQmVlbkxheWVkT3V0ICkge1xuXHRcdFx0XG5cdFx0dGhpcy5sYXlvdXQubm9kZUNoYW5nZWQoIHRoaXMgKTtcblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG5UaGlzIGlzIGEgdXRpbGl0eSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgTGF5b3V0Tm9kZS4gSXQgd2lsbCB1c2UgdGhlIHBhcmVudCBsYXlvdXQgKExheURvd24pIG9mIHRoaXMgbm9kZS5cblxuVGhpcyBpcyBiYXNpY2FsbHkgZm9yIHRob3NlIHBlZXBzIHdobyBsb3ZlcyB0aGVtIGNoYWluaW5ncy4gKGRvbid0IGdldCB0b28gY3JhenkgdGhvdWdoKVxuXG5AbWV0aG9kIGNyZWF0ZVxuQHBhcmFtIGl0ZW1Ub0xheURvd24ge09iamVjdH0gVGhpcyBpcyBhIG5ldyBpdGVtIHRvIGJlIGxhaWQgb3V0LiBlZy4gQSBET00gZWxlbWVudCBvciBhIERpeGlEaXNwbGF5T2JqZWN0IG9yIHdoYXRldmVyXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKCBpdGVtVG9MYXlEb3duICkge1xuXG5cdHJldHVybiB0aGlzLmxheW91dC5jcmVhdGUoIGl0ZW1Ub0xheURvd24gKTtcbn07XG5cbi8vVGhpcyBpcyBub3QgYSBwYXJ0IG9mIHByb3RvdHlwZSBjYXVzZSBpdCdzIG1vcmUganVzdCBhIHV0aWxpdHkgZnVuY3Rpb24gdG8gYWRkIHJ1bGVzIHF1aWNrbHlcbi8vZG9uJ3Qgd2FudCBwZW9wbGUgdG8gZ2V0IGNvbmZ1c2VkIGlmIHRoZXJlJ3MgYW4gYWRkIHJ1bGUgZnVuY3Rpb24gb24gdGhlIHByb3RvXG5mdW5jdGlvbiBhZGRSdWxlKCBydWxlLCBydWxlQXJndW1lbnRzLCBydWxlQXJyLCBydWxlUHJvcEFyciwgdHlwZSApIHtcblxuXHQvL3dlIG5ldmVyIHdhbnQgdG8gYWxsb3cgYWRkaW5nIHJ1bGVzIHRvIGEgc2VsZiBjb25kaXRpb25hbFxuXHRpZiggdGhpcy5fZG9pbmdTZWxmQ29uZGl0aW9uYWwgKSB7XG5cblx0XHR0aHJvdyAnWW91IGNhbm5vdCBhZGQgbGF5b3V0IHJ1bGVzIGFmdGVyIGFkZGluZyBhIGNvbmRpdGlvbmFsIHRvIHRoZSBpdGVtIGl0c2VsZic7XG5cdH1cblxuXHRpZiggdGhpcy5jb25kaXRpb25hbFBhcmVudCApIHsgXG5cblx0XHQvL2NoZWNrIHdoZXRlciB3aWR0aCBpcyBiZWluZyBlZmZlY3RlZFxuXHRcdHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuZG9Ob3RSZWFkV2lkdGggPSB0aGlzLmNvbmRpdGlvbmFsUGFyZW50LmRvTm90UmVhZFdpZHRoIHx8IFxuXHRcdHR5cGUgPT0gU0laRSB8fFxuXHRcdHR5cGUgPT0gU0laRV9XSURUSDtcblxuXHRcdHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuZG9Ob3RSZWFkSGVpZ2h0ID0gdGhpcy5jb25kaXRpb25hbFBhcmVudC5kb05vdFJlYWRIZWlnaHQgfHwgXG5cdFx0dHlwZSA9PSBTSVpFIHx8XG5cdFx0dHlwZSA9PSBTSVpFX0hFSUdIVDtcblxuXG5cdFx0Ly9pZiB3ZSdyZSBpbiBhIGNoaWxkIGNvbmRpdGlvbmFsIGFuZCB0aGlzIGlzIGEgYm91bmQgZnVuY3Rpb24gaXQgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBwYXJlbnRcblx0XHRpZiggdHlwZSA9PSBCT1VORF9TSVpFIHx8XG5cdFx0ICAgIHR5cGUgPT0gQk9VTkRfU0laRV9XSURUSCB8fFxuXHRcdCAgICB0eXBlID09IEJPVU5EX1NJWkVfSEVJR0hUICkge1xuXG5cdFx0XHRydWxlQXJyID0gdGhpcy5jb25kaXRpb25hbFBhcmVudC5ydWxlc1NpemVCb3VuZDtcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5jb25kaXRpb25hbFBhcmVudC5ydWxlc1NpemVCb3VuZFByb3A7XG5cblx0XHQvL2lmIHdlJ3JlIGluIGEgY2hpbGQgY29uZGl0aW9uYWwgYW5kIHRoaXMgaXMgYSBib3VuZCBmdW5jdGlvbiBpdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHBhcmVudFxuXHRcdH0gZWxzZSBpZiggdHlwZSA9PSBCT1VORF9QT1NJVElPTiB8fFxuXHRcdFx0XHQgICB0eXBlID09IEJPVU5EX1BPU0lUSU9OX1ggfHxcblx0XHRcdFx0ICAgdHlwZSA9PSBCT1VORF9QT1NJVElPTl9ZICkge1xuXG5cdFx0XHRydWxlQXJyID0gdGhpcy5jb25kaXRpb25hbFBhcmVudC5ydWxlc1Bvc0JvdW5kO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLmNvbmRpdGlvbmFsUGFyZW50LnJ1bGVzUG9zQm91bmRQcm9wO1xuXHRcdH1cblx0fSBlbHNlIHtcblxuXHRcdC8vY2hlY2sgd2hldGVyIHdpZHRoIGlzIGJlaW5nIGVmZmVjdGVkXG5cdFx0dGhpcy5kb05vdFJlYWRXaWR0aCA9IHRoaXMuZG9Ob3RSZWFkV2lkdGggfHwgXG5cdFx0dHlwZSA9PSBTSVpFIHx8XG5cdFx0dHlwZSA9PSBTSVpFX1dJRFRIO1xuXG5cdFx0dGhpcy5kb05vdFJlYWRIZWlnaHQgPSB0aGlzLmRvTm90UmVhZEhlaWdodCB8fCBcblx0XHR0eXBlID09IFNJWkUgfHxcblx0XHR0eXBlID09IFNJWkVfSEVJR0hUO1xuXHR9XG5cblxuXHQvL2p1c3QgY2hlY2sgaWYgd2UndmUgc3RhcnRlZCB3cml0aW5nIGEgY29uZGl0aW9uYWwgYnV0IGRpZG50IGFkZCBhIGNhc2Vcblx0aWYoIHRoaXMuX2lzRG9pbmdXaGVuICYmICF0aGlzLl9oYXNDb25kaXRpb25hbCApIHtcblxuXHRcdHRocm93ICdZb3Ugc2hvdWxkIGFkZCBhIGNvbmRpdGlvbmFsIHN1Y2ggYXMgXCJ3aWR0aEdyZWF0ZXJUaGFuXCIgYmVmb3JlIGFkZGluZyBhIHJ1bGUnO1xuXG5cdC8vaWYgdGhlc2UgYXJlIGJvdGggdHJ1ZSB0aGVuIHdoZW4gaGFzIGJlZW4gY2FsbGVkIGFuZCBhIGNvbmRpdGlvbmFsXG5cdC8vaGFzIGJlZW4gYWRkZWQgc28gd2Ugc2hvdWxkIGNyZWF0ZSBhIG5ldyBMYXlvdXROb2RlIGZvciB0aGUgY29uZGl0aW9uYWxzXG5cdH0gZWxzZSBpZiggKCB0aGlzLl9pc0RvaW5nV2hlbiAmJiB0aGlzLl9oYXNDb25kaXRpb25hbCApIHx8IHRoaXMuX2lzRG9pbmdEZWZhdWx0ICkge1xuXG5cdFx0dmFyIG5Ob2RlID0gbmV3IExheW91dE5vZGUoIHRoaXMubGF5b3V0ICk7XG5cdFx0bk5vZGUuY29uZGl0aW9uYWxQYXJlbnQgPSB0aGlzO1xuXG5cdFx0aWYoICF0aGlzLl9pc0RvaW5nRGVmYXVsdCApIHtcblxuXHRcdFx0dGhpcy5sYXlvdXROb2RlRm9yQ29uZGl0aW9uYWwucHVzaCggbk5vZGUgKTtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR0aGlzLmxheW91dE5vZGVGb3JEZWZhdWx0ID0gbk5vZGU7XG5cdFx0fVxuXG5cdFx0dGhpcy5faXNEb2luZ1doZW4gPSBmYWxzZTtcblx0XHR0aGlzLl9oYXNDb25kaXRpb25hbCA9IGZhbHNlO1xuXHRcdHRoaXMuX2lzRG9pbmdEZWZhdWx0ID0gZmFsc2U7XG5cblx0XHQvL25lZWQgdG8gZmlndXJlIG91dCB3aGljaCBydWxlQXJyIGFuZCBydWxlUHJvcEFyciB0byB1c2Vcblx0XHRzd2l0Y2goIHR5cGUgKSB7XG5cblx0XHRcdGNhc2UgU0laRTpcblx0XHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRcdGNhc2UgU0laRV9IRUlHSFQ6XG5cblx0XHRcdFx0cnVsZUFyciA9IG5Ob2RlLnJ1bGVzU2l6ZTtcblx0XHRcdFx0cnVsZVByb3BBcnIgPSBuTm9kZS5ydWxlc1NpemVQcm9wO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgUE9TSVRJT046XG5cdFx0XHRjYXNlIFBPU0lUSU9OX1g6XG5cdFx0XHRjYXNlIFBPU0lUSU9OX1k6XG5cblx0XHRcdFx0cnVsZUFyciA9IG5Ob2RlLnJ1bGVzUG9zO1xuXHRcdFx0XHRydWxlUHJvcEFyciAgPSBuTm9kZS5ydWxlc1Bvc1Byb3A7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHQvL3RoaXMgd2lsbCByZXR1cm4gdGhlIG5ldyBub2RlXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggbk5vZGUsIHJ1bGUsIHJ1bGVBcmd1bWVudHMsIHJ1bGVBcnIsIHJ1bGVQcm9wQXJyLCB0eXBlICk7XG5cdH1cblxuXHRydWxlQXJyLnB1c2goIHJ1bGUgKTtcblx0cnVsZVByb3BBcnIucHVzaCggcnVsZUFyZ3VtZW50cyApO1xuXG5cdHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgPSB0eXBlO1xuXG5cdGlmKCBydWxlQXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0dGhpcy5hZGREZXBlbmRlbmN5KCBydWxlQXJndW1lbnRzWyAwIF0gKTtcblx0fVxuXG5cdHJldHVybiB0aGlzO1xufVxuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tUE9TSVRJT04gRlVOQ1RJT05TLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIGFuIGl0ZW0gYXQgdGhlIGNvcmRpbmF0ZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgcG9zaXRpb25Jc1xuQHBhcmFtIHgge051bWJlcn0geCBjb3JkaW5hdGUgd2hlcmUgdGhlIGl0ZW0gYmVpbmcgcG9zaXRpb25lZCBzaG91bGQgZ29cbkBwYXJhbSB5IHtOdW1iZXJ9IHkgY29yZGluYXRlIHdoZXJlIHRoZSBpdGVtIGJlaW5nIHBvc2l0aW9uZWQgc2hvdWxkIGdvXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnBvc2l0aW9uSXMgPSBmdW5jdGlvbiggeCwgeSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBwb3NpdGlvbklzLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiBhbiBpdGVtIGF0IHRoZSB4IGFuZCB5IGNhbGN1bGF0ZWQgYnkgdGFraW5nIHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aW1lcyB0aGVcbnBlcmNlbnRhZ2UgcGFzc2VkIGluLlxuXG5AbWV0aG9kIHBvc2l0aW9uSXNBUGVyY2VudGFnZU9mXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gdGhpcyBMYXlvdXROb2RlJ3Mgd2lkdGggYW5kIGhlaWdodCBpcyBnb2luZyB0byBiZSB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcG9zaXRvbiBvZiB0aGlzIExheW91dE5vZGVcbkBwYXJhbSBwZXJjZW50YWdlIHtOdW1iZXJ9IHRoaXMgcGVyY2VudGFnZSB3aWxsIGJlIHVzZWQgdG8gdGhlIGNhbGN1bGF0ZSB0aGUgeCBhbmQgeSBwb3NpdGlvbiBvZiB0aGlzIExheW91dE5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucG9zaXRpb25Jc0FQZXJjZW50YWdlT2YgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBwb3NpdGlvbklzQVBlcmNlbnRhZ2VPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT04gKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gYW4gaXRlbSBhdCB0aGUgeCBjb3JkaW5hdGUgcGFzc2VkIGluLlxuXG5AbWV0aG9kIHhJc1xuQHBhcmFtIHgge051bWJlcn0geCBjb3JkaW5hdGUgd2hlcmUgdGhlIGl0ZW0gYmVpbmcgcG9zaXRpb25lZCBzaG91bGQgZ29cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUueElzID0gZnVuY3Rpb24oIHggKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgeElzLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIGFuIGl0ZW0gYXQgdGhlIHggY2FsY3VsYXRlZCBieSB0YWtpbmcgdGhlIHdpZHRoIG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aW1lcyB0aGVcbnBlcmNlbnRhZ2UgcGFzc2VkIGluLlxuXG5AbWV0aG9kIHhJc0FQZXJjZW50YWdlT2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSB0aGlzIExheW91dE5vZGUncyB3aWR0aCBpcyBnb2luZyB0byBiZSB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgcG9zaXRvbiBvZiB0aGlzIExheW91dE5vZGVcbkBwYXJhbSBwZXJjZW50YWdlIHtOdW1iZXJ9IHRoaXMgcGVyY2VudGFnZSB3aWxsIGJlIHVzZWQgdG8gdGhlIGNhbGN1bGF0ZSB0aGUgeCBwb3NpdGlvbiBvZiB0aGlzIExheW91dE5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUueElzQVBlcmNlbnRhZ2VPZiA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHhJc0FQZXJjZW50YWdlT2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gYW4gaXRlbSBhdCB0aGUgeSBjb3JkaW5hdGUgcGFzc2VkIGluLlxuXG5AbWV0aG9kIHlJc1xuQHBhcmFtIHkge051bWJlcn0geSBjb3JkaW5hdGUgd2hlcmUgdGhlIGl0ZW0gYmVpbmcgcG9zaXRpb25lZCBzaG91bGQgZ29cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUueUlzID0gZnVuY3Rpb24oIHkgKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgeUlzLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIGFuIGl0ZW0gYXQgdGhlIHkgY2FsY3VsYXRlZCBieSB0YWtpbmcgdGhlIGhlaWdodCBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4gdGltZXMgdGhlXG5wZXJjZW50YWdlIHBhc3NlZCBpbi5cblxuQG1ldGhvZCB5SXNBUGVyY2VudGFnZU9mXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gdGhpcyBMYXlvdXROb2RlJ3MgaGVpZ2h0IGlzIGdvaW5nIHRvIGJlIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBwb3NpdG9uIG9mIHRoaXMgTGF5b3V0Tm9kZVxuQHBhcmFtIHBlcmNlbnRhZ2Uge051bWJlcn0gdGhpcyBwZXJjZW50YWdlIHdpbGwgYmUgdXNlZCB0byB0aGUgY2FsY3VsYXRlIHRoZSB5IHBvc2l0aW9uIG9mIHRoaXMgTGF5b3V0Tm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS55SXNBUGVyY2VudGFnZU9mID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgeUlzQVBlcmNlbnRhZ2VPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUgYmVsb3cgdGhlIGl0ZW0gcGFzc2VkLlxuXG5AbWV0aG9kIGFsaWduZWRCZWxvd1xuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIGJlIGJlbG93XG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmFsaWduZWRCZWxvdyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGFsaWduZWRCZWxvdywgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUgYWJvdmUgdGhlIGl0ZW0gcGFzc2VkLlxuXG5AbWV0aG9kIGFsaWduZWRBYm92ZVxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIGJlIGFib3ZlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmFsaWduZWRBYm92ZSA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGFsaWduZWRBYm92ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xuXG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBsZWZ0IG9mIHRoZSBpdGVtIHBhc3NlZC5cblxuQG1ldGhvZCBhbGlnbmVkTGVmdE9mXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgbGVmdCBvZlxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5hbGlnbmVkTGVmdE9mID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgYWxpZ25lZExlZnRPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUgcmlnaHQgb2YgdGhlIGl0ZW0gcGFzc2VkLlxuXG5AbWV0aG9kIGFsaWduZWRSaWdodE9mXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgcmlnaHQgb2ZcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuYWxpZ25lZFJpZ2h0T2YgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBhbGlnbmVkUmlnaHRPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUgc28gdGhhdCBpdCdzIGFsaWduZWQgZnVsbHkgKHRvcCwgbGVmdCkgd2l0aCB0aGUgaXRlbSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgYWxpZ25lZFdpdGhcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIHRoYXQgdGhpcyBMYXlvdXROb2RlIHNob3VsZCBhbGlnbiB0b1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5hbGlnbmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGFsaWduZWRXaXRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUgc28gdGhhdCBpdCdzIGxlZnQgYWxpZ25lZCB3aXRoIHRoZSBpdGVtIHBhc3NlZCBpbi5cblxuQG1ldGhvZCBsZWZ0QWxpZ25lZFdpdGhcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIHRoYXQgdGhpcyBMYXlvdXROb2RlIHNob3VsZCBsZWZ0IGFsaWduIHRvXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmxlZnRBbGlnbmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGxlZnRBbGlnbmVkV2l0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUgc28gdGhhdCBpdCdzIHJpZ2h0IGFsaWduZWQgd2l0aCB0aGUgaXRlbSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgcmlnaHRBbGlnbmVkV2l0aFxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIHJpZ2h0IGFsaWduIHRvXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnJpZ2h0QWxpZ25lZFdpdGggPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCByaWdodEFsaWduZWRXaXRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBzbyB0aGF0IGl0J3MgdG9wIGFsaWduZWQgd2l0aCB0aGUgaXRlbSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgdG9wQWxpZ25lZFdpdGhcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIHRoYXQgdGhpcyBMYXlvdXROb2RlIHNob3VsZCB0b3AgYWxpZ24gdG9cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUudG9wQWxpZ25lZFdpdGggPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB0b3BBbGlnbmVkV2l0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUgc28gdGhhdCBpdCdzIGJvdHRvbSBhbGlnbmVkIHdpdGggdGhlIGl0ZW0gcGFzc2VkIGluLlxuXG5AbWV0aG9kIGJvdHRvbUFsaWduZWRXaXRoXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYm90dG9tIGFsaWduIHRvXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmJvdHRvbUFsaWduZWRXaXRoID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgYm90dG9tQWxpZ25lZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gdGhpcyBMYXlvdXROb2RlIHNvIHRoYXQgaXQncyBjZW50ZXIgKGhvcml6b250YWxseSBhbmQgdmVyaWNhbGx5KSBhbGlnbmVkIHdpdGggdGhlIGl0ZW0gcGFzc2VkIGluLlxuXG5AbWV0aG9kIGNlbnRlcmVkV2l0aFxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIGNlbnRlciBhbGlnbiB0b1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5jZW50ZXJlZFdpdGggPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBjZW50ZXJlZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBzbyB0aGF0IGl0J3MgaG9yaXpvbnRhbGx5IGNlbnRlcmVkIHdpdGggdGhlIGl0ZW0gcGFzc2VkIGluLlxuXG5AbWV0aG9kIGhvcml6b250YWxseUNlbnRlcmVkV2l0aFxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIGJlIGhvcml6b250YWxseSBjZW50ZXJlZCB0b1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5ob3Jpem9udGFsbHlDZW50ZXJlZFdpdGggPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBob3Jpem9udGFsbHlDZW50ZXJlZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gdGhpcyBMYXlvdXROb2RlIHNvIHRoYXQgaXQncyB2ZXJ0aWNhbGx5IGNlbnRlcmVkIHdpdGggdGhlIGl0ZW0gcGFzc2VkIGluLlxuXG5AbWV0aG9kIHZlcnRpY2FsbHlDZW50ZXJlZFdpdGhcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIHRoYXQgdGhpcyBMYXlvdXROb2RlIHNob3VsZCBiZSB2ZXJ0aWNhbGx5IGNlbnRlcmVkIHRvXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnZlcnRpY2FsbHlDZW50ZXJlZFdpdGggPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB2ZXJ0aWNhbGx5Q2VudGVyZWRXaXRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tU0laRSBGVU5DVElPTlMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBzaXplIGFuIGl0ZW0gdG8gYmUgdGhlIGV4YWN0IHNpemUgdmFsdWUgKHdpZHRoIGFuZCBoZWlnaHQpIHBhc3NlZCBpblxuXG5AbWV0aG9kIHNpemVJc1xuQHBhcmFtIHdpZHRoIHtOdW1iZXJ9IHdpZHRoIG9mIHRoaXMgTGF5b3V0Tm9kZVxuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSBoZWlnaHQgb2YgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnNpemVJcyA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHNpemVJcywgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XG59XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgc2V0IHRoZSB3aWR0aCBvZiBhbiBpdGVtIHRvIGJlIHRoZSBleGFjdCB2YWx1ZSBwYXNzZWQgaW5cblxuQG1ldGhvZCB3aWR0aElzXG5AcGFyYW0gd2lkdGgge051bWJlcn0gd2lkdGggb2YgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLndpZHRoSXMgPSBmdW5jdGlvbiggd2lkdGggKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgd2lkdGhJcywgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX1dJRFRIICk7XG59XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgc2V0IHRoZSBoZWlnaHQgb2YgYW4gaXRlbSB0byBiZSB0aGUgZXhhY3QgdmFsdWUgcGFzc2VkIGluXG5cbkBtZXRob2QgaGVpZ2h0SXNcbkBwYXJhbSBoZWlnaHQge051bWJlcn0gaGVpZ2h0IG9mIHRoaXMgTGF5b3V0Tm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5oZWlnaHRJcyA9IGZ1bmN0aW9uKCBoZWlnaHQgKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgaGVpZ2h0SXMsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9IRUlHSFQgKTtcblxufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgd2lkdGggb3IgaGVpZ2h0IG9mIHRoaXMgTGF5b3V0Tm9kZSB0byBiZSBwcm9wb3J0aW9uYWwgYmFzZWQgb24gdGhlIG9yaWdpbmFsIHdpZHRoIGFuZCBoZWlnaHQgcGFzc2VkIGluLlxuSXQgaXMgaGFuZHkgZm9yIHdoZW4geW91IGhhdmUgcnVsZXMgYWRqdXN0aW5nIGVpdGhlciB3aWR0aCBvciBoZWlnaHQgb25seSBhbmQgeWV0IHlvdSB3YW50IHRoZSB1bnRvdWNoZWQgcHJvcGVydHkgdG8gYmVcbnByb3BvcnRpb25hbC5cblxuU28gaWYgeW91IGhhdmUgYW4gaW1hZ2UgdGhhdCBpcyAyMDB4MTAwIGlmIHRoZXJlIGFyZSBydWxlcyBhcHBsaWVkIHRvIHRoaXMgTGF5b3V0Tm9kZSB3aGVyZSB0aGUgd2lkdGggd2lsbCBiZWNvbWUgNDAwcHhcbnRoaXMgcnVsZSB3aWxsIHNlZSB0aGF0IGhlaWdodCBoYXMgbm90IGJlZW4gZWZmZWN0ZWQgYXQgYWxsIGFuZCB3aWxsIHNldCB0aGUgaGVpZ2h0IHRvIGJlIHByb3BvcnRpb25hbCB0byB0aGUgd2lkdGggYmFzZWQgb25cbnRoZSBvcmlnaW5hbCBoZWlnaHQgcGFzc2VkIGluLiBTbyBpbiB0aGlzIGNhc2Ugb3VyIGltYWdlJ3Mgc2l6ZSB3b3VsZCBiZSA0MDB4MjAwIHdoZXJlIHRoaXMgcnVsZSBzZXRzIHRoZSBoZWlnaHQgdG8gYmUgMjAwcHhcbnRvIHN0YXkgaW4gcHJvcG9ydGlvbiB0byB0aGUgb3JpZ2luYWwgd2lkdGguXG5cbkBtZXRob2Qgc2l6ZUlzUHJvcG9ydGlvbmFsXG5AcGFyYW0gb3JpZ2luYWxXaWR0aCB7TnVtYmVyfSB0aGUgb3JpZ2luYWwgd2lkdGggb2YgdGhlIGl0ZW0gYmVpbmcgbGF5ZWQgb3V0IGJlZm9yZSBhbnkgbGF5b3V0IGZ1bmN0aW9ucyBhcmUgYXBwbGllZFxuQHBhcmFtIG9yaWdpbmFsSGVpZ2h0IHtOdW1iZXJ9IHRoZSBvcmlnaW5hbCBoZWlnaHQgb2YgdGhlIGl0ZW0gYmVpbmcgbGF5ZWQgb3V0IGJlZm9yZSBhbnkgbGF5b3V0IGZ1bmN0aW9ucyBhcmUgYXBwbGllZFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5zaXplSXNQcm9wb3J0aW9uYWwgPSBmdW5jdGlvbiggb3JpZ2luYWxXaWR0aCwgb3JpZ2luYWxIZWlnaHQgKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgc2l6ZUlzUHJvcG9ydGlvbmFsLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkUgKTtcbn1cblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBzZXQgdGhlIHdpZHRoIG9mIHRoZSBMYXlvdXROb2RlIHRvIGJlIHByb3BvcnRpb25hbCB0byB0aGUgaGVpZ2h0IGJhc2VkIG9uIHRoZSBvcmlnaW5hbFdpZHRoIHBhc3NlZC5cbkl0IGlzIGhhbmR5IGZvciB3aGVuIHlvdSBoYXZlIHJ1bGVzIGFkanVzdGluZyBoZWlnaHQgYW5kIHdpZHRoIHNob3VsZCByZW1haW4gcHJvcG9ydGlvbmFsIHRvIHRoZSBoZWlnaHQuXG5cbkZvciBpbnN0YW5jZSB5b3UgaGF2ZSBhbiBpbWFnZSB3aGljaCBpcyAyMDB4MTAwLiBPbmNlIHJ1bGVzIGFyZSBhcHBsaWVkIHRvIGl0IHRoZSBoZWlnaHQgYmVjb21lcyAyMDBweC4gSWRlYWxseSB3ZSdsbFxud2FudCB0aGUgd2lkdGggdG8gYWxzbyBiZSAyeCBsYXJnZXIuIFNvIHRoaXMgcnVsZSB3aWxsIHNldCB0aGUgd2lkdGggdG8gYmUgNDAwcHggYW5kIG91ciBmaW5hbCByZXNvbHV0aW9uIGlzIDQwMHgyMDAuXG5cbkBtZXRob2Qgd2lkdGhJc1Byb3BvcnRpb25hbFxuQHBhcmFtIG9yaWdpbmFsV2lkdGgge051bWJlcn0gdGhlIG9yaWdpbmFsIHdpZHRoIG9mIHRoZSBpdGVtIGJlaW5nIGxheWVkIG91dCBiZWZvcmUgYW55IGxheW91dCBmdW5jdGlvbnMgYXJlIGFwcGxpZWRcbkBwYXJhbSBvcmlnaW5hbEhlaWdodCB7TnVtYmVyfSB0aGUgb3JpZ2luYWwgaGVpZ2h0IG9mIHRoZSBpdGVtIGJlaW5nIGxheWVkIG91dCBiZWZvcmUgYW55IGxheW91dCBmdW5jdGlvbnMgYXJlIGFwcGxpZWRcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUud2lkdGhJc1Byb3BvcnRpb25hbCA9IGZ1bmN0aW9uKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB3aWR0aElzUHJvcG9ydGlvbmFsLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfV0lEVEggKTtcbn1cblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBzZXQgdGhlIGhlaWdodCBvZiB0aGUgTGF5b3V0Tm9kZSB0byBiZSBwcm9wb3J0aW9uYWwgdG8gdGhlIHdpZHRoIGJhc2VkIG9uIHRoZSBvcmlnaW5hbEhlaWdodCBwYXNzZWQuXG5JdCBpcyBoYW5keSBmb3Igd2hlbiB5b3UgaGF2ZSBydWxlcyBhZGp1c3Rpbmcgd2lkdGggYW5kIGhlaWdodCBzaG91bGQgcmVtYWluIHByb3BvcnRpb25hbCB0byB0aGUgd2lkdGguXG5cbkZvciBpbnN0YW5jZSB5b3UgaGF2ZSBhbiBpbWFnZSB3aGljaCBpcyAyMDB4MTAwLiBPbmNlIHJ1bGVzIGFyZSBhcHBsaWVkIHRvIGl0IHRoZSB3aWR0aCBiZWNvbWVzIDQwMHB4LiBJZGVhbGx5IHdlJ2xsXG53YW50IHRoZSBoZWlnaHQgdG8gYWxzbyBiZSAyeCBsYXJnZXIuIFNvIHRoaXMgcnVsZSB3aWxsIHNldCB0aGUgaGVpZ2h0IHRvIGJlIDIwMHB4IGFuZCBvdXIgZmluYWwgcmVzb2x1dGlvbiBpcyA0MDB4MjAwLlxuXG5AbWV0aG9kIGhlaWdodElzUHJvcG9ydGlvbmFsXG5AcGFyYW0gb3JpZ2luYWxXaWR0aCB7TnVtYmVyfSB0aGUgb3JpZ2luYWwgd2lkdGggb2YgdGhlIGl0ZW0gYmVpbmcgbGF5ZWQgb3V0IGJlZm9yZSBhbnkgbGF5b3V0IGZ1bmN0aW9ucyBhcmUgYXBwbGllZFxuQHBhcmFtIG9yaWdpbmFsSGVpZ2h0IHtOdW1iZXJ9IHRoZSBvcmlnaW5hbCBoZWlnaHQgb2YgdGhlIGl0ZW0gYmVpbmcgbGF5ZWQgb3V0IGJlZm9yZSBhbnkgbGF5b3V0IGZ1bmN0aW9ucyBhcmUgYXBwbGllZFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5oZWlnaHRJc1Byb3BvcnRpb25hbCA9IGZ1bmN0aW9uKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBoZWlnaHRJc1Byb3BvcnRpb25hbCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGlzIExheW91dE5vZGUgdG8gbWF0Y2ggdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluLlxuXG5AbWV0aG9kIG1hdGNoZXNTaXplT2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIGlzIGEgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG1hdGNoIGluIHNpemVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF0Y2hlc1NpemVPZiA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1hdGNoZXNTaXplT2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgd2lkdGggb2YgdGhpcyBMYXlvdXROb2RlIHRvIG1hdGNoIHRoZSB3aWR0aCBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgbWF0Y2hlc1dpZHRoT2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIGlzIGEgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG1hdGNoIGluIHdpZHRoXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1hdGNoZXNXaWR0aE9mID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF0Y2hlc1dpZHRoT2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgaGVpZ2h0IG9mIHRoaXMgTGF5b3V0Tm9kZSB0byBtYXRjaCB0aGUgaGVpZ2h0IG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbi5cblxuQG1ldGhvZCBtYXRjaGVzSGVpZ2h0T2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIGlzIGEgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG1hdGNoIGluIGhlaWdodFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXRjaGVzSGVpZ2h0T2YgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXRjaGVzSGVpZ2h0T2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9IRUlHSFQgKTtcbn1cblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBzZXQgdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhpcyBMYXlvdXROb2RlIHRvIGJlIGEgcGVyY2VudGFnZSBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4uXG5cblNvIGZvciBpbnN0YW5jZSBpZiB0aGUgTGF5b3V0Tm9kZSB3ZSdyZSBwYXNzaW5nIGluIGlzIDQwMHgyMDAgYWZ0ZXIgYWxsIHJ1bGVzIGhhdmUgYmVlbiBhcHBsaWVkIGFuZCBcbndlIHNheSB0aGlzIExheW91dE5vZGUgc2hvdWxkIGJlIDAuNSBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4gdGhpcyBMYXlvdXROb2RlJ3Mgc2l6ZSB3aWxsIGJlIDIwMHgxMDAgb3IgNTAlIG9mIDQwMHgyMDAuXG5cbkBtZXRob2Qgc2l6ZUlzQVBlcmNlbnRhZ2VPZlxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IHRoZSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgc2V0IGl0J3Mgd2lkdGggYW5kIGhlaWdodCBmcm9tXG5AcGFyYW0gcGVyY2VudGFnZSB7TnVtYmVyfSBhIHBlcmNlbnRhZ2UgdmFsdWUgaW4gZGVjaW1hbCB0aGF0IHN0YXRlcyBob3cgYmlnIHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgYmFzZWQgb24gdGhlIExheW91dE5vZGUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnNpemVJc0FQZXJjZW50YWdlT2YgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBzaXplSXNBUGVyY2VudGFnZU9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkUgKTtcbn1cblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBzZXQgdGhlIHdpZHRoIG9mIHRoaXMgTGF5b3V0Tm9kZSB0byBiZSBhIHBlcmNlbnRhZ2Ugb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluLlxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgdGhlIExheW91dE5vZGUgd2UncmUgcGFzc2luZyBpbiBpcyA0MDB4MjAwIGFmdGVyIGFsbCBydWxlcyBoYXZlIGJlZW4gYXBwbGllZCBhbmQgXG53ZSBzYXkgdGhpcyBMYXlvdXROb2RlJ3Mgd2lkdGggc2hvdWxkIGJlIDAuNSBvZiB0aGUgd2lkdGggb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluLiBUaGlzIExheW91dE5vZGUncyB3aWR0aCB3aWxsIGJlIFxuMjAwcHggb3IgNTAlIG9mIDQwMHB4LlxuXG5AbWV0aG9kIHdpZHRoSXNBUGVyY2VudGFnZU9mXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gdGhlIExheW91dE5vZGUgdGhhdCB0aGlzIExheW91dE5vZGUgd2lsbCBzZXQgaXQncyB3aWR0aCBmcm9tXG5AcGFyYW0gcGVyY2VudGFnZSB7TnVtYmVyfSBhIHBlcmNlbnRhZ2UgdmFsdWUgaW4gZGVjaW1hbCB0aGF0IHN0YXRlcyBob3cgd2lkZSB0aGlzIExheW91dE5vZGUgc2hvdWxkIGJlIGJhc2VkIG9uIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS53aWR0aElzQVBlcmNlbnRhZ2VPZiA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHdpZHRoSXNBUGVyY2VudGFnZU9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfV0lEVEggKTtcbn1cblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBzZXQgdGhlIGhlaWdodCBvZiB0aGlzIExheW91dE5vZGUgdG8gYmUgYSBwZXJjZW50YWdlIG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbi5cblxuU28gZm9yIGluc3RhbmNlIGlmIHRoZSBMYXlvdXROb2RlIHdlJ3JlIHBhc3NpbmcgaW4gaXMgNDAweDIwMCBhZnRlciBhbGwgcnVsZXMgaGF2ZSBiZWVuIGFwcGxpZWQgYW5kIFxud2Ugc2F5IHRoaXMgTGF5b3V0Tm9kZSdzIGhlaWdodCBzaG91bGQgYmUgMC41IG9mIHRoZSBoZWlnaHQgb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluLiBUaGlzIExheW91dE5vZGUncyBoZWlnaHQgd2lsbCBiZSBcbjEwMHB4IG9yIDUwJSBvZiAyMDBweC5cblxuQG1ldGhvZCBoZWlnaHRJc0FQZXJjZW50YWdlT2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSB0aGUgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIHNldCBpdCdzIGhlaWdodCBmcm9tXG5AcGFyYW0gcGVyY2VudGFnZSB7TnVtYmVyfSBhIHBlcmNlbnRhZ2UgdmFsdWUgaW4gZGVjaW1hbCB0aGF0IHN0YXRlcyBob3cgdGFsbCB0aGlzIExheW91dE5vZGUgc2hvdWxkIGJlIGJhc2VkIG9uIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5oZWlnaHRJc0FQZXJjZW50YWdlT2YgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBoZWlnaHRJc0FQZXJjZW50YWdlT2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9IRUlHSFQgKTtcbn1cblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS1PRkZTRVQgRlVOQ1RJT05TLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyoqXG5wbHVzIGlzIGFuIG9mZnNldCBmdW5jdGlvbi4gT2Zmc2V0IGZ1bmN0aW9ucyB3aWxsIG9mZnNldCB0aGUgcHJvcGVydHkgcHJldmlvdXNseSBlZmZlY3RlZC5cblxuU28gZm9yIGluc3RhbmNlIGlmIHdlIGRpZDpcblxuXHRub2RlLndpZHRoSXMoIDIwMCApLnBsdXMoIDEwICk7XG5cblRoZW4gdGhlIHdpZHRoIG9mIHRoaXMgTGF5b3V0Tm9kZSB3b3VsZCBiZSAyMTBweC4gSG93ZXZlciBpZiB3ZSBkbzpcblxuXHRub2RlLnlJcyggMTAwICkucGx1cyggMzAgKTtcblxuVGhlbiB0aGUgeSBwb3NpdGlvbiBvZiB0aGlzIExheW91dE5vZGUgd291bGQgYmUgYXQgMTMwcHguXG5cbkFzIHlvdSBjYW4gc2VlIHBsdXMnIGNvbnRleHQgd2lsbCBjaGFuZ2UgYmFzZWQgb24gdGhlIHR5cGUgb2YgcnVsZSBhcHBsaWVkIHByZXZpb3VzbHkuXG5cblBsdXMgaXMgaGFuZHkgZm9yIHdoZW4gYSBkZXNpZ25lciBzYWlzIFwiQ2FuIHlvdSBtb3ZlIHRoaXMgb3ZlciBieSBYIHBpeGVsc1wiLlxuXG5AbWV0aG9kIHBsdXNcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucGx1cyA9IGZ1bmN0aW9uKCkge1xuXG5cdHN3aXRjaCggdGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCApIHtcblxuXHRcdGNhc2UgU0laRTpcblx0XHRjYXNlIEJPVU5EX1NJWkU6XG5cblx0XHRcdGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDEgKSB7XG5cblx0XHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c1NpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1x0XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZQbHVzU2l6ZSwgWyBhcmd1bWVudHNbIDAgXSwgYXJndW1lbnRzWyAwIF0gXSwgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1x0XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiggYXJndW1lbnRzLmxlbmd0aCA9PSAyICkge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdlBsdXNTaXplLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkUgKTtcdFxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR0aGlzLmRvTm90UmVhZFdpZHRoID0gdHJ1ZTtcblx0XHRcdHRoaXMuZG9Ob3RSZWFkSGVpZ2h0ID0gdHJ1ZTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRjYXNlIEJPVU5EX1NJWkVfV0lEVEg6XG5cdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c1dpZHRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfV0lEVEggKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2UGx1c1dpZHRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfV0lEVEggKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kb05vdFJlYWRXaWR0aCA9IHRydWU7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFNJWkVfSEVJR0hUOlxuXHRcdGNhc2UgQk9VTkRfU0laRV9IRUlHSFQ6XG5cdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c0hlaWdodCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZQbHVzSGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfSEVJR0hUICk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZG9Ob3RSZWFkSGVpZ2h0ID0gdHJ1ZTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgUE9TSVRJT046XG5cdFx0Y2FzZSBCT1VORF9QT1NJVElPTjpcblx0XHRcdGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDEgKSB7XG5cblx0XHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c1Bvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2UGx1c1Bvc2l0aW9uLCBbIGFyZ3VtZW50c1sgMCBdLCBhcmd1bWVudHNbIDAgXSBdLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT04gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDIgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2UGx1c1Bvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFBPU0lUSU9OX1g6XG5cdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9YOlxuXHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHBsdXNYLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdlBsdXNYLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFBPU0lUSU9OX1k6XG5cdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9ZOlxuXHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHBsdXNZLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdlBsdXNZLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIG51bGw6XG5cblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzU2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c1Bvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkID0gbnVsbDtcblx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG5taW51cyBpcyBhbiBvZmZzZXQgZnVuY3Rpb24uIE9mZnNldCBmdW5jdGlvbnMgd2lsbCBvZmZzZXQgdGhlIHByb3BlcnR5IHByZXZpb3VzbHkgZWZmZWN0ZWQuXG5cblNvIGZvciBpbnN0YW5jZSBpZiB3ZSBkaWQ6XG5cblx0bm9kZS53aWR0aElzKCAyMDAgKS5taW51cyggMTAgKTtcblxuVGhlbiB0aGUgd2lkdGggb2YgdGhpcyBMYXlvdXROb2RlIHdvdWxkIGJlIDE5MHB4LiBIb3dldmVyIGlmIHdlIGRvOlxuXG5cdG5vZGUueUlzKCAxMDAgKS5taW51cyggMzAgKTtcblxuVGhlbiB0aGUgeSBwb3NpdGlvbiBvZiB0aGlzIExheW91dE5vZGUgd291bGQgYmUgYXQgNzBweC5cblxuQXMgeW91IGNhbiBzZWUgbWludXMnIGNvbnRleHQgd2lsbCBjaGFuZ2UgYmFzZWQgb24gdGhlIHR5cGUgb2YgcnVsZSBhcHBsaWVkIHByZXZpb3VzbHkuXG5cbk1pbnVzIGlzIGhhbmR5IGZvciB3aGVuIGEgZGVzaWduZXIgc2FpcyBcIkNhbiB5b3UgbW92ZSB0aGlzIG92ZXIgYnkgWCBwaXhlbHNcIi5cblxuQG1ldGhvZCBtaW51c1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5taW51cyA9IGZ1bmN0aW9uKCkge1xuXG5cdHN3aXRjaCggdGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCApIHtcblxuXHRcdGNhc2UgU0laRTpcblx0XHRjYXNlIEJPVU5EX1NJWkU6XG5cblx0XHRcdGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDEgKSB7XG5cblx0XHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWludXNTaXplLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdk1pbnVzU2l6ZSwgWyBhcmd1bWVudHNbIDAgXSwgYXJndW1lbnRzWyAwIF0gXSwgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMiApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZNaW51c1NpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR0aGlzLmRvTm90UmVhZFdpZHRoID0gdHJ1ZTtcblx0XHRcdHRoaXMuZG9Ob3RSZWFkSGVpZ2h0ID0gdHJ1ZTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRjYXNlIEJPVU5EX1NJWkVfV0lEVEg6XG5cdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWludXNXaWR0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX1dJRFRIICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdk1pbnVzV2lkdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRvTm90UmVhZFdpZHRoID0gdHJ1ZTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgU0laRV9IRUlHSFQ6XG5cdFx0Y2FzZSBCT1VORF9TSVpFX0hFSUdIVDpcblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtaW51c0hlaWdodCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZNaW51c0hlaWdodCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5kb05vdFJlYWRIZWlnaHQgPSB0cnVlO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OOlxuXG5cdFx0XHRpZiggYXJndW1lbnRzLmxlbmd0aCA9PSAxICkge1xuXG5cdFx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbnVzUG9zaXRpb24sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZNaW51c1Bvc2l0aW9uLCBbIGFyZ3VtZW50c1sgMCBdLCBhcmd1bWVudHNbIDAgXSBdLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT04gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDIgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2TWludXNQb3NpdGlvbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT04gKTtcblx0XHRcdH1cblx0XHRicmVhaztcblxuXHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1g6XG5cdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWludXNYLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdk1pbnVzWCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xuXHRcdFx0fVxuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTl9ZOlxuXHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWTpcblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtaW51c1ksIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2TWludXNZLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIG51bGw6XG5cblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtaW51c1NpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbnVzUG9zaXRpb24sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgPSBudWxsO1xuXHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLUJPVU5EIEZVTkNUSU9OUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyoqXG5tYXhTaXplIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWF4U2l6ZS4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgdGhhdCB0aGlzIExheW91dE5vZGUgd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUxLnNpemVJcyggMjAwLCAxMDAgKTtcblx0bm9kZTIuc2l6ZUlzKCAzMDAsIDMwMCApLm1heFNpemUoIG5vZGUxICk7XG5cbldoZW4gcnVuIG5vZGUyJ3Mgd2lkdGggYW5kIGhlaWdodCB3aWxsIGJlIDIwMHgxMDAgbm90IDMwMHgzMDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgdGhhblxubm9kZTEuXG5cbkBtZXRob2QgbWF4U2l6ZVxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIGFsd2F5cyBiZSBsYXJnZXIgb3IgdGhlIHNhbWUgc2l6ZSBhcyB0aGUgTGF5b3V0Tm9kZSB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvblxuQGNoYWluYWJsZVxuKiovXG5cbi8qKlxubWF4U2l6ZSBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdGhyZWUgZGlmZmVyZW50IHdheXMgdG8gdXNlIG1heFNpemUuIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gd2lkdGggYW5kIGhlaWdodCB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIuc2l6ZUlzKCAzMDAsIDMwMCApLm1heFNpemUoIDIwMCwgMTAwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3Mgd2lkdGggYW5kIGhlaWdodCB3aWxsIGJlIDIwMHgxMDAgbm90IDMwMHgzMDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgdGhhblxuMjAweDEwMC5cblxuQG1ldGhvZCBtYXhTaXplXG5AcGFyYW0gd2lkdGgge051bWJlcn0gdGhlIExheW91dE5vZGUncyB3aWR0aCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBwYXJhbSBoZWlnaHQge051bWJlcn0gdGhlIExheW91dE5vZGUncyBoZWlnaHQgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuIHRoaXMgdmFsdWUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cblxuLyoqXG5tYXhTaXplIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWF4U2l6ZS4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIHNpemUgdGhhdCB0aGlzIExheW91dE5vZGUgd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUyLnNpemVJcyggMzAwLCAzMDAgKS5tYXhTaXplKCAyMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgMjAweDIwMCBub3QgMzAweDMwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuXG4yMDB4MjAwLlxuXG5AbWV0aG9kIG1heFNpemVcbkBwYXJhbSBzaXplIHtOdW1iZXJ9IHRoZSBMYXlvdXROb2RlJ3Mgd2lkdGggYW5kIGhlaWdodCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF4U2l6ZSA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhTaXplRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9XSURUSCApO1x0XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhTaXplLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFICk7XG5cdH1cbn07XG5cblxuXG5cbi8qKlxubWF4V2lkdGggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWF4V2lkdGguIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlJ3Mgd2lkdGggd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUxLndpZHRoSXMoIDIwMCApO1xuXHRub2RlMi53aWR0aElzKCAzMDAgKS5tYXhXaWR0aCggbm9kZTEgKTtcblxuV2hlbiBydW4gaW4gdGhlIGVuZCBub2RlMidzIHdpZHRoIHdpbGwgYmUgMjAwcHggbm90IDMwMHB4IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbm5vZGUxLlxuXG5AbWV0aG9kIG1heFdpZHRoXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gdGhpcyBMYXlvdXROb2RlIHdpbGwgYWx3YXlzIGJlIGxhcmdlciBvciB0aGUgc2FtZSBzaXplIGFzIHRoZSBMYXlvdXROb2RlIHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uXG5AY2hhaW5hYmxlXG4qKi9cblxuLyoqXG5tYXhXaWR0aCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhXaWR0aC4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiB3aWR0aCB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIud2lkdGhJcyggMzAwICkubWF4V2lkdGgoIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHdpZHRoIHdpbGwgYmUgMjAwcHggbm90IDMwMHB4IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbjIwMHB4LlxuXG5AbWV0aG9kIG1heFdpZHRoXG5AcGFyYW0gd2lkdGgge051bWJlcn0gdGhlIExheW91dE5vZGUncyB3aWR0aCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBwYXJhbSBoZWlnaHQge051bWJlcn0gdGhlIExheW91dE5vZGUncyBoZWlnaHQgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuIHRoaXMgdmFsdWUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1heFdpZHRoID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFdpZHRoRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9XSURUSCApO1x0XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhXaWR0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9XSURUSCApO1x0XG5cdH1cbn07XG5cblxuXG5cbi8qKlxubWF4SGVpZ2h0IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1heEhlaWdodC4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgdGhhdCB0aGlzIExheW91dE5vZGUncyB3aWR0aCB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTEuaGVpZ2h0SXMoIDIwMCApO1xuXHRub2RlMi5oZWlnaHRJcyggMzAwICkubWF4SGVpZ2h0KCBub2RlMSApO1xuXG5XaGVuIHJ1biBub2RlMidzIGhlaWdodCB3aWxsIGJlIDIwMHB4IG5vdCAzMDBweCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuXG5ub2RlMS5cblxuQG1ldGhvZCBtYXhIZWlnaHRcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSB0aGlzIExheW91dE5vZGUgd2lsbCBhbHdheXMgYmUgbGFyZ2VyIG9yIHRoZSBzYW1lIHNpemUgYXMgdGhlIExheW91dE5vZGUgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb25cbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1heEhlaWdodCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhIZWlnaHQuIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gd2lkdGggdGhhdCB0aGlzIExheW91dE5vZGUgd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUyLmhlaWdodElzKCAzMDAgKS5tYXhIZWlnaHQoIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIGhlaWdodCB3aWxsIGJlIDIwMHB4IG5vdCAzMDBweCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuXG4yMDBweC5cblxuQG1ldGhvZCBtYXhIZWlnaHRcbkBwYXJhbSB3aWR0aCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIHdpZHRoIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIGhlaWdodCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF4SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heEhlaWdodEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfSEVJR0hUICk7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhIZWlnaHQsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfSEVJR0hUICk7XG5cdH1cbn07XG5cblxuXG4vKipcbm1pblNpemUgaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHRocmVlIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtaW5TaXplLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTEuc2l6ZUlzKCAyMDAsIDEwMCApO1xuXHRub2RlMi5zaXplSXMoIDUwLCA1MCApLm1pblNpemUoIG5vZGUxICk7XG5cbldoZW4gcnVuIG5vZGUyJ3Mgd2lkdGggYW5kIGhlaWdodCB3aWxsIGJlIDIwMHgxMDAgbm90IDUweDUwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbm5vZGUxLlxuXG5AbWV0aG9kIG1pblNpemVcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSB0aGlzIExheW91dE5vZGUgdGhhdCB0aGlzIHJ1bGUgaXMgYXBwbGllZCB0byB3aWxsIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGFuIHRoaXMgTGF5b3V0Tm9kZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1pblNpemUgaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHRocmVlIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtaW5TaXplLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIHdpZHRoIGFuZCBoZWlnaHQgdGhhdCB0aGlzIExheW91dE5vZGUgd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUyLnNpemVJcyggNTAsIDUwICkubWluU2l6ZSggMjAwLCAxMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgMjAweDEwMCBub3QgMzAweDMwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuXG4yMDB4MTAwLlxuXG5AbWV0aG9kIG1pblNpemVcbkBwYXJhbSB3aWR0aCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIHdpZHRoIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBzbWFsbGVyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBwYXJhbSBoZWlnaHQge051bWJlcn0gdGhlIExheW91dE5vZGUncyBoZWlnaHQgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5cbi8qKlxubWluU2l6ZSBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdGhyZWUgZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pblNpemUuIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBzaXplIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMi5zaXplSXMoIDEwMCwgNTAgKS5taW5TaXplKCAyMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgMjAweDIwMCBub3QgMTAweDUwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgc21hbGxlciB0aGFuXG4yMDB4MjAwLlxuXG5AbWV0aG9kIG1pblNpemVcbkBwYXJhbSBzaXplIHtOdW1iZXJ9IHRoZSBMYXlvdXROb2RlJ3Mgd2lkdGggYW5kIGhlaWdodCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoaXMgdmFsdWUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1pblNpemUgPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluU2l6ZUZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkUgKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pblNpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkUgKTtcblx0fVxufTtcblxuXG5cblxuLyoqXG5taW5XaWR0aCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtaW5XaWR0aC4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgdGhhdCB0aGlzIExheW91dE5vZGUncyB3aWR0aCB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTEud2lkdGhJcyggMjAwICk7XG5cdG5vZGUyLndpZHRoSXMoIDUwICkubWluV2lkdGgoIG5vZGUxICk7XG5cbldoZW4gcnVuIG5vZGUyJ3Mgd2lkdGggd2lsbCBiZSAyMDBweCBub3QgNTBweCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuIG5vZGUxLlxuXG5AbWV0aG9kIG1pbldpZHRoXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gdGhlIHdpZHRoIG9mIHRoZSBub2RlIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGUgd2lkdGggb2YgdGhpcyBub2RlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG4vKipcbm1pbldpZHRoIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pbldpZHRoLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgd2lkdGggdGhhdCB0aGlzIExheW91dE5vZGUgd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUyLndpZHRoSXMoIDEwMCApLm1pbldpZHRoKCA1MCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHdpZHRoIHdpbGwgYmUgNTBweCBub3QgMTAwcHggYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgdGhhbiA1MHB4LlxuXG5AbWV0aG9kIG1pbldpZHRoXG5AcGFyYW0gc2l6ZSB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIHdpZHRoIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBzbWFsbGVyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWluV2lkdGggPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluV2lkdGhGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5XaWR0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9XSURUSCApO1xuXHR9XG59O1xuXG5cblxuXG4vKipcbm1pbkhlaWdodCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtaW5IZWlnaHQuIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlJ3MgaGVpZ2h0IHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMS5oZWlnaHRJcyggMjAwICk7XG5cdG5vZGUyLmhlaWdodElzKCA1MCApLm1pbkhlaWdodCggbm9kZTEgKTtcblxuV2hlbiBydW4gbm9kZTIncyBoZWlnaHQgd2lsbCBiZSAyMDBweCBub3QgNTBweCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuIG5vZGUxLlxuXG5AbWV0aG9kIG1pbkhlaWdodFxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IHRoZSBoZWlnaHQgb2YgdGhlIG5vZGUgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuIHRoZSBoZWlnaHQgb2YgdGhpcyBub2RlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG4vKipcbm1pbkhlaWdodCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtaW5IZWlnaHQuIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBoZWlnaHQgdGhhdCB0aGlzIExheW91dE5vZGUgd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUyLmhlaWdodElzKCAxMDAgKS5taW5IZWlnaHQoIDUwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgaGVpZ2h0IHdpbGwgYmUgNTBweCBub3QgMTAwcHggYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgdGhhbiA1MHB4LlxuXG5AbWV0aG9kIG1pbkhlaWdodFxuQHBhcmFtIHNpemUge051bWJlcn0gdGhlIExheW91dE5vZGUncyBoZWlnaHQgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5taW5IZWlnaHQgPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluSGVpZ2h0RnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9IRUlHSFQgKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbkhlaWdodCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9IRUlHSFQgKTtcblx0fVxufTtcblxuXG5cblxuXG4vKipcbm1heFBvc2l0aW9uIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWF4UG9zaXRpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBMYXlvdXROb2RlLiBUaGlzIExheW91dE5vZGUncyBwb3NpdGlvbiB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuIHRoZSBwb3NpdGlvbiBvZiB0aGUgcGFzc2VkIG5vZGUuXG5cblx0bm9kZTEucG9zaXRpb25JcyggMzAwLCAyMDAgKTtcblx0bm9kZTIucG9zaXRpb25JcyggNDAwLCA0MDAgKS5tYXhQb3NpdGlvbiggbm9kZTEgKTtcblxuV2hlbiBydW4gbm9kZTIncyB4IGFuZCB5IHdpbGwgYmUgMjAwIGFuZCAxMDAgbm90IHggMzAwIGFuZCB5IDIwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgeCBhbmQgeSB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbm5vZGUxJ3MgeCBhbmQgeS5cblxuQG1ldGhvZCBtYXhQb3NpdGlvblxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IHRoaXMgcGFzc2VkIGluIExheW91dE5vZGUncyB4IGFuZCB5IHBvc2l0aW9uIHdpbGwgYmUgYmUgdGhlIG1heGltdW0geCBhbmQgeSBwb3NpdGlvbiBmb3IgdGhpcyBub2RlXG5AY2hhaW5hYmxlXG4qKi9cblxuLyoqXG5tYXhQb3NpdGlvbiBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdGhyZWUgZGlmZmVyZW50IHdheXMgdG8gdXNlIG1heFBvc2l0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgbWF4aW11bSB4IGFuZCB5IHBvc2l0aW9uIGZvciB0aGlzIG5vZGUuXG5cblx0bm9kZTIucG9zaXRpb25JcyggMzAwLCAzMDAgKS5tYXhQb3NpdGlvbiggMjAwLCAxMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB4IGFuZCB5IHdpbGwgYmUgeCAyMDAgYW5kIHkgMTAwIG5vdCB4IDMwMCBhbmQgeSAzMDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHggYW5kIHkgdG8gbm90IGJlIGxhcmdlciB0aGFuXG54IDIwMCBhbmQgeSAxMDAuXG5cbkBtZXRob2QgbWF4UG9zaXRpb25cbkBwYXJhbSB4IHtOdW1iZXJ9IHRoZSBtYXhpbXVtIHggdmFsdWUgZm9yIHRoaXMgbm9kZSdzIHggdmFsdWVcbkBwYXJhbSB5IHtOdW1iZXJ9IHRoZSBtYXhpbXVtIHkgdmFsdWUgZm9yIHRoaXMgbm9kZSdzIHkgdmFsdWVcbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1heFBvc2l0aW9uIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWF4UG9zaXRpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSB2YWx1ZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSdzIHggYW5kIHkgd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUyLnBvc2l0aW9uSXMoIDMwMCwgNDAwICkubWF4UG9zaXRpb24oIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHdpZHRoIGFuZCBoZWlnaHQgd2lsbCBiZSAyMDB4MjAwIG5vdCAzMDB4NDAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHhcbjIwMCBhbmQgeSAyMDAuXG5cbkBtZXRob2QgbWF4UG9zaXRpb25cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSB0aGUgbWF4aW11bSB4IGFuZCB5IHZhbHVlIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF4UG9zaXRpb24gPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4UG9zaXRpb25Gcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFBvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fVxufTtcblxuXG5cblxuLyoqXG5sZWZ0TWF4IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgZnJvbSB3aGljaCB0aGlzIG5vZGUncyBtYXhpbXVtIHggdmFsdWUgd2lsbCBiZSByZWFkIGZyb20uXG5cblx0bm9kZTEueElzKCAyMDAgKTtcblx0bm9kZTIueElzKCA0MDAgKS5sZWZ0TWF4KCBub2RlMSApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggdmFsdWUgd2lsbCBiZSAyMDAgYW5kIG5vdCA0MDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vZGUxJ3MgeCB2YWx1ZS5cblxuQG1ldGhvZCBsZWZ0TWF4XG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gVGhlIExheW91dE5vZGUgd2hvc2UgeCB2YWx1ZSB3aWxsIGJlIHRoZSBtYXhpbXVtIHggdmFsdWUgZm9yIHRoaXMgbm9kZVxuQGNoYWluYWJsZVxuKiovXG4vKipcbmxlZnRNYXggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGFuIHggdmFsdWUgZnJvbSB3aGljaCB0aGlzIG5vZGUncyBtYXhpbXVtIHggdmFsdWUgd2lsbCBiZSBzZXQuXG5cblx0bm9kZTIueElzKCA0MDAgKS5sZWZ0TWF4KCAyMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB4IHZhbHVlIHdpbGwgYmUgMjAwIGFuZCBub3QgNDAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byB0aGUgeCB2YWx1ZSAyMDAuXG5cbkBtZXRob2QgbGVmdE1heFxuQHBhcmFtIHgge051bWJlcn0gVGhlIG1heGltdW0geCB2YWx1ZSBmb3IgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmxlZnRNYXggPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbGVmdE1heEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbGVmdE1heCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH1cbn07XG5cblxuXG5cblxuLyoqXG50b3BNYXggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSBmcm9tIHdoaWNoIHRoaXMgbm9kZSdzIG1heGltdW0geSB2YWx1ZSB3aWxsIGJlIHJlYWQgZnJvbS5cblxuXHRub2RlMS55SXMoIDIwMCApO1xuXHRub2RlMi55SXMoIDQwMCApLnRvcE1heCggbm9kZTEgKTtcblxuV2hlbiBydW4gbm9kZTIncyB5IHZhbHVlIHdpbGwgYmUgMjAwIGFuZCBub3QgNDAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub2RlMSdzIHkgdmFsdWUuXG5cbkBtZXRob2QgdG9wTWF4XG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gVGhlIExheW91dE5vZGUgd2hvc2UgeSB2YWx1ZSB3aWxsIGJlIHRoZSBtYXhpbXVtIHkgdmFsdWUgZm9yIHRoaXMgbm9kZVxuQGNoYWluYWJsZVxuKiovXG4vKipcbnRvcE1heCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIHBvc3NpYmxlIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYW4geSB2YWx1ZSBmcm9tIHdoaWNoIHRoaXMgbm9kZSdzIG1heGltdW0geSB2YWx1ZSB3aWxsIGJlIHNldC5cblxuXHRub2RlMi55SXMoIDQwMCApLnRvcE1heCggMjAwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgeCB2YWx1ZSB3aWxsIGJlIDIwMCBhbmQgbm90IDQwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gdGhlIHkgdmFsdWUgMjAwLlxuXG5AbWV0aG9kIHRvcE1heFxuQHBhcmFtIHkge051bWJlcn0gVGhlIG1heGltdW0geSB2YWx1ZSBmb3IgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnRvcE1heCA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB0b3BNYXhGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHRvcE1heCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH1cbn07XG5cblxuXG5cblxuLyoqXG5taW5Qb3NpdGlvbiBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdGhyZWUgZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pblBvc2l0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZS4gVGhpcyBMYXlvdXROb2RlJ3MgcG9zaXRpb24gd2lsbCBuZXZlciBiZSBzbWFsbGVyIHRoYW4gdGhlIHBvc2l0aW9uIG9mIHRoZSBwYXNzZWQgbm9kZS5cblxuXHRub2RlMS5wb3NpdGlvbklzKCAzMDAsIDIwMCApO1xuXHRub2RlMi5wb3NpdGlvbklzKCAxMDAsIDEwMCApLm1pblBvc2l0aW9uKCBub2RlMSApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggYW5kIHkgd2lsbCBiZSAzMDAgYW5kIDIwMCBub3QgeCAxMDAgYW5kIHkgMTAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB4IGFuZCB5IHRvIG5vdCBiZSBzbWFsbGVyIHRoYW5cbm5vZGUxJ3MgeCBhbmQgeS5cblxuQG1ldGhvZCBtaW5Qb3NpdGlvblxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IHRoaXMgcGFzc2VkIGluIExheW91dE5vZGUncyB4IGFuZCB5IHBvc2l0aW9uIHdpbGwgYmUgYmUgdGhlIG1pbmltdW0geCBhbmQgeSBwb3NpdGlvbiBmb3IgdGhpcyBub2RlXG5AY2hhaW5hYmxlXG4qKi9cblxuLyoqXG5taW5Qb3NpdGlvbiBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdGhyZWUgZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pblBvc2l0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgbWluaW11bSB4IGFuZCB5IHBvc2l0aW9uIGZvciB0aGlzIG5vZGUuXG5cblx0bm9kZTIucG9zaXRpb25JcyggMTAwLCAxMDAgKS5taW5Qb3NpdGlvbiggMjAwLCAxMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB4IGFuZCB5IHdpbGwgYmUgeCAyMDAgYW5kIHkgMTAwIG5vdCB4IDEwMCBhbmQgeSAxMDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHggYW5kIHkgdG8gbm90IGJlIHNtYWxsZXIgdGhhblxueCAyMDAgYW5kIHkgMTAwLlxuXG5AbWV0aG9kIG1pblBvc2l0aW9uXG5AcGFyYW0geCB7TnVtYmVyfSB0aGUgbWluaW11bSB4IHZhbHVlIGZvciB0aGlzIG5vZGUncyB4IHZhbHVlXG5AcGFyYW0geSB7TnVtYmVyfSB0aGUgbWluaW11bSB5IHZhbHVlIGZvciB0aGlzIG5vZGUncyB5IHZhbHVlXG5AY2hhaW5hYmxlXG4qKi9cblxuLyoqXG5taW5Qb3NpdGlvbiBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdGhyZWUgZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pblBvc2l0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgdmFsdWUgdGhhdCB0aGlzIExheW91dE5vZGUncyB4IGFuZCB5IHdpbGwgbmV2ZXIgYmUgc21hbGxlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIucG9zaXRpb25JcyggMTAwLCA1MCApLm1pblBvc2l0aW9uKCAyMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB4IGFuZCB5IHdpbGwgYmUgeCAyMDAgYW5kIHkgMjAwIG5vdCAxMDAgeCBhbmQgNTAgeSBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIHNtYWxsZXIgdGhhbiB4XG4yMDAgYW5kIHkgMjAwLlxuXG5AbWV0aG9kIG1pblBvc2l0aW9uXG5AcGFyYW0gdmFsdWUge051bWJlcn0gdGhlIG1pbmltdW0geCBhbmQgeSB2YWx1ZSBmb3IgdGhpcyBub2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1pblBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pblBvc2l0aW9uRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5Qb3NpdGlvbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH1cbn07XG5cblxuXG5cbi8qKlxubGVmdE1pbiBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIHBvc3NpYmxlIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBMYXlvdXROb2RlIGZyb20gd2hpY2ggdGhpcyBub2RlJ3MgbWluaW11bSB4IHZhbHVlIHdpbGwgYmUgcmVhZCBmcm9tLlxuXG5cdG5vZGUxLnhJcyggMjAwICk7XG5cdG5vZGUyLnhJcyggMTAwICkubGVmdE1pbiggbm9kZTEgKTtcblxuV2hlbiBydW4gbm9kZTIncyB4IHZhbHVlIHdpbGwgYmUgMjAwIGFuZCBub3QgMTAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub2RlMSdzIHggdmFsdWUuXG5cbkBtZXRob2QgbGVmdE1pblxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IFRoZSBMYXlvdXROb2RlIHdob3NlIHggdmFsdWUgd2lsbCBiZSB0aGUgbWluaW11bSB4IHZhbHVlIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuLyoqXG5sZWZ0TWluIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhbiB4IHZhbHVlIGZyb20gd2hpY2ggdGhpcyBub2RlJ3MgbWluaW11bSB4IHZhbHVlIHdpbGwgYmUgc2V0LlxuXG5cdG5vZGUyLnhJcyggMTAwICkubGVmdE1pbiggMjAwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgeCB2YWx1ZSB3aWxsIGJlIDIwMCBhbmQgbm90IDEwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gdGhlIHggdmFsdWUgMjAwLlxuXG5AbWV0aG9kIGxlZnRNaW5cbkBwYXJhbSB4IHtOdW1iZXJ9IFRoZSBtaW5pbXVtIHggdmFsdWUgZm9yIHRoaXMgTGF5b3V0Tm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5sZWZ0TWluID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGxlZnRNaW5Gcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGxlZnRNaW4sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9XG59O1xuXG5cblxuXG5cbi8qKlxudG9wTWluIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgZnJvbSB3aGljaCB0aGlzIG5vZGUncyBtaW5pbXVtIHkgdmFsdWUgd2lsbCBiZSByZWFkIGZyb20uXG5cblx0bm9kZTEueUlzKCAyMDAgKTtcblx0bm9kZTIueUlzKCAxMDAgKS50b3BNaW4oIG5vZGUxICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgeSB2YWx1ZSB3aWxsIGJlIDIwMCBhbmQgbm90IDEwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm9kZTEncyB5IHZhbHVlLlxuXG5AbWV0aG9kIHRvcE1pblxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IFRoZSBMYXlvdXROb2RlIHdob3NlIHkgdmFsdWUgd2lsbCBiZSB0aGUgbWluaW11bSB5IHZhbHVlIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuLyoqXG50b3BNaW4gaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGFuIHkgdmFsdWUgZnJvbSB3aGljaCB0aGlzIG5vZGUncyBtaW5pbXVtIHkgdmFsdWUgd2lsbCBiZSBzZXQuXG5cblx0bm9kZTIueUlzKCAxMDAgKS50b3BNaW4oIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHkgdmFsdWUgd2lsbCBiZSAyMDAgYW5kIG5vdCAxMDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIHRoZSB5IHZhbHVlIDIwMC5cblxuQG1ldGhvZCB0b3BNaW5cbkBwYXJhbSB5IHtOdW1iZXJ9IFRoZSBtaW5pbXVtIHkgdmFsdWUgZm9yIHRoaXMgTGF5b3V0Tm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS50b3BNaW4gPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgdG9wTWluRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB0b3BNaW4sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9XG59O1xuXG5cbi8qKlxuYm90dG9tTWF4IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbkhlcmUgaXMgYW4gZXhhbXBsZSB1c2FnZSBvZiBib3R0b21NYXg6XG5cblx0bm9kZTEuaGVpZ2h0SXMoIDEwMCApLnlJcyggNTAgKTtcblx0bm9kZTIuaGVpZ2h0SXMoIDEwMCApLnlJcyggMTAwICkuYm90dG9tTWF4KCBub2RlMSApO1xuXG5JZiB3ZSBldmFsdWF0ZWQgdGhlIGFib3ZlIG5vZGUyJ3MgeSB2YWx1ZSB3b3VsZCBiZSA1MCBhbmQgbm90IDEwMC4gVGhpcyBpcyBiZWNhdXNlIHRoZSBtYXhpbXVtIHZhbHVlIGZvciB0aGUgYm90dG9tIG9mXG5ub2RlMiBpcyB0aGUgeSBwb3NpdGlvbiBvZiBub2RlMSBwbHVzIGl0cyBoZWlnaHQgKG5vZGUxLnkgKyBub2RlMS5oZWlnaHQpLlxuXG5cbkBtZXRob2QgYm90dG9tTWF4XG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gVGhlIExheW91dE5vZGUgd2hvc2UgYm90dG9tICggeSArIGhlaWdodCApIHZhbHVlIHdpbGwgYmUgdGhlIG1heGltdW0gYm90dG9tIHZhbHVlIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuLyoqXG5ib3R0b21NYXggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuSGVyZSBpcyBhbiBleGFtcGxlIHVzYWdlIG9mIGJvdHRvbU1heDpcblxuXHRub2RlMi5oZWlnaHRJcyggMTAwICkueUlzKCAyMDAgKS5ib3R0b21NYXgoIDIwMCApO1xuXG5JZiB3ZSBldmFsdWF0ZWQgdGhlIGFib3ZlIG5vZGUyJ3MgeSB2YWx1ZSB3b3VsZCBiZSAxMDAgYW5kIG5vdCAyMDAuIFRoaXMgaXMgYmVjYXVzZSB0aGUgbWF4aW11bSB2YWx1ZSBmb3IgdGhlIGJvdHRvbSBvZlxubm9kZTIgaXMgMjAwLiBCb3R0b20gdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20geSArIGhlaWdodC5cblxuXG5AbWV0aG9kIGJvdHRvbU1heFxuQHBhcmFtIG1heEJvdHRvbSB7TnVtYmVyfSBUaGUgbWF4aW11bSBib3R0b20gKCB5ICsgaGVpZ2h0ICkgdmFsdWUgZm9yIHRoaXMgTGF5b3V0Tm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5ib3R0b21NYXggPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgYm90dG9tTWF4RnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBib3R0b21NYXgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9XG59O1xuXG5cbi8qKlxuYm90dG9tTWluIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbkhlcmUgaXMgYW4gZXhhbXBsZSB1c2FnZSBvZiBib3R0b21NaW46XG5cblx0bm9kZTEuaGVpZ2h0SXMoIDEwMCApLnlJcyggNTAgKTtcblx0bm9kZTIuaGVpZ2h0SXMoIDEwMCApLnlJcyggMjAgKS5ib3R0b21NaW4oIG5vZGUxICk7XG5cbklmIHdlIGV2YWx1YXRlZCB0aGUgYWJvdmUgbm9kZTIncyB5IHZhbHVlIHdvdWxkIGJlIDUwIGFuZCBub3QgMjAuIFRoaXMgaXMgYmVjYXVzZSB0aGUgbWluaW11bSB2YWx1ZSBmb3IgdGhlIGJvdHRvbSBvZlxubm9kZTIgaXMgdGhlIHkgcG9zaXRpb24gb2Ygbm9kZTEgcGx1cyBpdHMgaGVpZ2h0IChub2RlMS55ICsgbm9kZTEuaGVpZ2h0KS5cblxuXG5AbWV0aG9kIGJvdHRvbU1pblxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IFRoZSBMYXlvdXROb2RlIHdob3NlIGJvdHRvbSAoIHkgKyBoZWlnaHQgKSB2YWx1ZSB3aWxsIGJlIHRoZSBtaW5pbXVtIGJvdHRvbSB2YWx1ZSBmb3IgdGhpcyBub2RlXG5AY2hhaW5hYmxlXG4qKi9cbi8qKlxuYm90dG9tTWluIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbkhlcmUgaXMgYW4gZXhhbXBsZSB1c2FnZSBvZiBib3R0b21NaW46XG5cblx0bm9kZTIuaGVpZ2h0SXMoIDEwMCApLnlJcyggNTAgKS5ib3R0b21NaW4oIDIwMCApO1xuXG5JZiB3ZSBldmFsdWF0ZWQgdGhlIGFib3ZlIG5vZGUyJ3MgeSB2YWx1ZSB3b3VsZCBiZSAxMDAgYW5kIG5vdCA1MC4gVGhpcyBpcyBiZWNhdXNlIHRoZSBtaW5pbXVtIHZhbHVlIGZvciB0aGUgYm90dG9tIG9mXG5ub2RlMiBpcyAyMDAuIEJvdHRvbSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbSB5ICsgaGVpZ2h0LlxuXG5cbkBtZXRob2QgYm90dG9tTWluXG5AcGFyYW0geSB7TnVtYmVyfSBUaGUgbWluaW11bSBib3R0b20gKCB5ICsgaGVpZ2h0ICkgdmFsdWUgZm9yIHRoaXMgTGF5b3V0Tm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5ib3R0b21NaW4gPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgYm90dG9tTWluRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBib3R0b21NaW4sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9XG59O1xuXG5cbi8qKlxucmlnaHRNYXggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuSGVyZSBpcyBhbiBleGFtcGxlIHVzYWdlIG9mIHJpZ2h0TWF4OlxuXG5cdG5vZGUxLndpZHRoSXMoIDEwMCApLnhJcyggNTAgKTtcblx0bm9kZTIud2lkdGhJcyggMTAwICkueElzKCAxMDAgKS5yaWdodE1heCggbm9kZTEgKTtcblxuSWYgd2UgZXZhbHVhdGVkIHRoZSBhYm92ZSBub2RlMidzIHggdmFsdWUgd291bGQgYmUgNTAgYW5kIG5vdCAxMDAuIFRoaXMgaXMgYmVjYXVzZSB0aGUgbWF4aW11bSB2YWx1ZSBmb3IgdGhlIHJpZ2h0IHNpZGUgb2Zcbm5vZGUyIGlzIHRoZSB4IHBvc2l0aW9uIG9mIG5vZGUxIHBsdXMgaXRzIGhlaWdodCAobm9kZTEueCArIG5vZGUxLndpZHRoKS5cblxuXG5AbWV0aG9kIHJpZ2h0TWF4XG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gVGhlIExheW91dE5vZGUgd2hvc2UgcmlnaHQgKHggKyB3aWR0aCkgdmFsdWUgd2lsbCBiZSB0aGUgbWF4aW11bSByaWdodCB2YWx1ZSBmb3IgdGhpcyBub2RlXG5AY2hhaW5hYmxlXG4qKi9cbi8qKlxucmlnaHRNYXggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuSGVyZSBpcyBhbiBleGFtcGxlIHVzYWdlIG9mIHJpZ2h0TWF4OlxuXG5cdG5vZGUyLndpZHRoSXMoIDEwMCApLnhJcyggMjAwICkucmlnaHRNYXgoIDIwMCApO1xuXG5JZiB3ZSBldmFsdWF0ZWQgdGhlIGFib3ZlIG5vZGUyJ3MgeCB2YWx1ZSB3b3VsZCBiZSAxMDAgYW5kIG5vdCAyMDAuIFRoaXMgaXMgYmVjYXVzZSB0aGUgbWF4aW11bSB2YWx1ZSBmb3IgdGhlIHJpZ2h0IHNpZGUgb2Zcbm5vZGUyIGlzIDIwMC4gQm90dG9tIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tIHggKyB3aWR0aC5cblxuXG5AbWV0aG9kIHJpZ2h0TWF4XG5AcGFyYW0gbWF4UmlnaHQge051bWJlcn0gVGhlIG1heGltdW0gcmlnaHQgdmFsdWUgZm9yIHRoaXMgTGF5b3V0Tm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5yaWdodE1heCA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCByaWdodE1heEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgcmlnaHRNYXgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9XG59O1xuXG5cblxuLyoqXG5yaWdodE1pbiBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIHBvc3NpYmxlIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5IZXJlIGlzIGFuIGV4YW1wbGUgdXNhZ2Ugb2YgcmlnaHRNaW46XG5cblx0bm9kZTEud2lkdGhJcyggMTAwICkueElzKCAxMDAgKTtcblx0bm9kZTIud2lkdGhJcyggMTAwICkueElzKCA1MCApLnJpZ2h0TWluKCBub2RlMSApO1xuXG5JZiB3ZSBldmFsdWF0ZWQgdGhlIGFib3ZlIG5vZGUyJ3MgeCB2YWx1ZSB3b3VsZCBiZSAxMDAgYW5kIG5vdCA1MC4gVGhpcyBpcyBiZWNhdXNlIHRoZSBtaW5pbXVtIHZhbHVlIGZvciB0aGUgcmlnaHQgc2lkZSBvZlxubm9kZTIgaXMgdGhlIHggcG9zaXRpb24gb2Ygbm9kZTEgcGx1cyBpdHMgaGVpZ2h0IChub2RlMS54ICsgbm9kZTEud2lkdGgpLlxuXG5cbkBtZXRob2QgcmlnaHRNaW5cbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSBUaGUgTGF5b3V0Tm9kZSB3aG9zZSB4IHZhbHVlIHdpbGwgYmUgdGhlIG1pbmltdW0gcmlnaHQgdmFsdWUgZm9yIHRoaXMgbm9kZVxuQGNoYWluYWJsZVxuKiovXG4vKipcbnJpZ2h0TWluIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbkhlcmUgaXMgYW4gZXhhbXBsZSB1c2FnZSBvZiByaWdodE1pbjpcblxuXHRub2RlMi53aWR0aElzKCAxMDAgKS54SXMoIDUwICkucmlnaHRNaW4oIDIwMCApO1xuXG5JZiB3ZSBldmFsdWF0ZWQgdGhlIGFib3ZlIG5vZGUyJ3MgeCB2YWx1ZSB3b3VsZCBiZSAxMDAgYW5kIG5vdCA1MC4gVGhpcyBpcyBiZWNhdXNlIHRoZSBtaW5pbXVtIHZhbHVlIGZvciB0aGUgcmlnaHQgc2lkZSBvZlxubm9kZTIgaXMgMjAwLiBCb3R0b20gdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20geCArIHdpZHRoLlxuXG5cbkBtZXRob2QgcmlnaHRNaW5cbkBwYXJhbSBtaW5SaWdodCB7TnVtYmVyfSBUaGUgbWluaW11bSBcInJpZ2h0XCIgKCB4ICsgd2lkdGggKSB2YWx1ZSBmb3IgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnJpZ2h0TWluID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHJpZ2h0TWluRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCByaWdodE1pbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH1cbn07XG5cblxuXG5cbi8qKlxubWF4IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cbkl0J3MgYSBnZW5lcmFsIGJvdW5kaW5nIGZ1bmN0aW9uIHdoaWNoIGRlcml2ZXMgaXQncyBjb250ZXh0IGZyb20gdGhlIHByZXZpb3VzIHJ1bGUgYWRkZWQuXG5cblNvIGJhc2ljYWxseTpcblxuXHRub2RlLnhJcyggMjAwICkubWF4KCAxMDAgKTtcblxuVGhlIHggdmFsdWUgb2YgdGhlIG5vZGUgd291bGQgZW5kIHVwIGJlaW5nIDEwMC5cblxuQW5vdGhlciBleGFtcGxlOlxuXG5cdG5vZGUud2lkdGhJcyggMjQwICkubWF4KCA0MCApO1xuXG5UaGUgd2lkdGggdmFsdWUgb2YgdGhlIG5vZGUgd291bGQgZW5kIHVwIGJlaW5nIGJlaW5nIDQwLlxuXG5TbyBhcyB5b3UgY2FuIHNlZSBhY3QncyBsaWtlIGFsbCB0aGUgb3RoZXIgbWF4IGZ1bmN0aW9ucy4gRm9yIHJlZmVyZW5jZSBsb29rIGF0OlxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL21heFdpZHRoOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL21heFBvc2l0aW9uOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL3RvcE1heDptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cblxuQG1ldGhvZCBtYXhcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdHRoaXMuYWRkRGVwZW5kZW5jeSggYXJndW1lbnRzWyAwIF0gKTtcblxuXHRcdHN3aXRjaCggdGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCApIHtcblxuXHRcdFx0Y2FzZSBTSVpFOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhTaXplRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRSApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRcdGNhc2UgQk9VTkRfU0laRV9XSURUSDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4V2lkdGhGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBTSVpFX0hFSUdIVDpcblx0XHRcdGNhc2UgQk9VTkRfU0laRV9IRUlHSFQ6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heEhlaWdodEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfSEVJR0hUICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT046XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFBvc2l0aW9uRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTl9YOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9YOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBsZWZ0TWF4RnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OX1ggKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFBPU0lUSU9OX1k6XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1k6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHRvcE1heEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTl9ZICk7XG5cdFx0XHRcblx0XHR9XG5cdH0gZWxzZSB7XG5cblx0XHRzd2l0Y2goIHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgKSB7XG5cblx0XHRcdGNhc2UgU0laRTpcblx0XHRcdGNhc2UgQk9VTkRfU0laRTpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4U2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRSApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRcdGNhc2UgQk9VTkRfU0laRV9XSURUSDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4V2lkdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfV0lEVEggKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFNJWkVfSEVJR0hUOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFX0hFSUdIVDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4SGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX0hFSUdIVCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT046XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhQb3NpdGlvbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTl9YOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9YOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBsZWZ0TWF4LCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT05fWCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT05fWTpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWTpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgdG9wTWF4LCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT05fWSApO1xuXHRcdFx0XG5cdFx0fVxuXHR9XG59O1xuXG5cblxuXG4vKipcbm1pbiBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5JdCdzIGEgZ2VuZXJhbCBib3VuZGluZyBmdW5jdGlvbiB3aGljaCBkZXJpdmVzIGl0J3MgY29udGV4dCBmcm9tIHRoZSBwcmV2aW91cyBydWxlIGFkZGVkLlxuXG5TbyBiYXNpY2FsbHk6XG5cblx0bm9kZS54SXMoIDUwICkubWluKCAxMDAgKTtcblxuVGhlIHggdmFsdWUgb2YgdGhlIG5vZGUgd291bGQgZW5kIHVwIGJlaW5nIDEwMC5cblxuQW5vdGhlciBleGFtcGxlOlxuXG5cdG5vZGUud2lkdGhJcyggLTQwMCApLm1pbiggLTQwICk7XG5cblRoZSB3aWR0aCB2YWx1ZSBvZiB0aGUgbm9kZSB3b3VsZCBlbmQgdXAgYmVpbmcgYmVpbmcgLTQwLlxuXG5TbyBhcyB5b3UgY2FuIHNlZSBhY3QncyBsaWtlIGFsbCB0aGUgb3RoZXIgbWF4IGZ1bmN0aW9ucy4gRm9yIHJlZmVyZW5jZSBsb29rIGF0OlxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL21pbldpZHRoOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL21pblBvc2l0aW9uOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL3RvcE1pbjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cblxuQG1ldGhvZCBtaW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdHRoaXMuYWRkRGVwZW5kZW5jeSggYXJndW1lbnRzWyAwIF0gKTtcblxuXHRcdHN3aXRjaCggdGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCApIHtcblxuXHRcdFx0Y2FzZSBTSVpFOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5TaXplRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRSApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRcdGNhc2UgQk9VTkRfU0laRV9XSURUSDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluV2lkdGhGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBTSVpFX0hFSUdIVDpcblx0XHRcdGNhc2UgQk9VTkRfU0laRV9IRUlHSFQ6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbkhlaWdodEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfSEVJR0hUICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT046XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pblBvc2l0aW9uRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTl9YOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9YOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBsZWZ0TWluRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OX1ggKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFBPU0lUSU9OX1k6XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1k6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHRvcE1pbkZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTl9ZICk7XG5cdFx0XHRcblx0XHR9XHRcdFxuXHR9IGVsc2Uge1xuXG5cdFx0c3dpdGNoKCB0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkICkge1xuXG5cdFx0XHRjYXNlIFNJWkU6XG5cdFx0XHRjYXNlIEJPVU5EX1NJWkU6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pblNpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkUgKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFNJWkVfV0lEVEg6XG5cdFx0XHRjYXNlIEJPVU5EX1NJWkVfV0lEVEg6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbldpZHRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBTSVpFX0hFSUdIVDpcblx0XHRcdGNhc2UgQk9VTkRfU0laRV9IRUlHSFQ6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbkhlaWdodCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9IRUlHSFQgKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFBPU0lUSU9OOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTjpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluUG9zaXRpb24sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbGVmdE1pbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OX1ggKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFBPU0lUSU9OX1k6XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1k6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHRvcE1pbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OX1kgKTtcblx0XHRcdFxuXHRcdH1cblx0fVxufTtcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS1DT05ESVRJT05BTFMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmZ1bmN0aW9uIGFkZENvbmRpdGlvbmFsKCBjRnVuY3Rpb24sIGNBcmd1bWVudHMgKSB7XG5cblx0aWYoICF0aGlzLl9pc0RvaW5nV2hlbiApIHtcblxuXHRcdHRocm93ICdCZWZvcmUgYWRkaW5nIGEgY29uZGl0aW9uYWwgc3VjaCBhcyBcIndpZHRoR3JlYXRlclRoYW5cIiB5b3Ugc2hvdWxkIGNhbGwgdGhlIFwid2hlblwiIGZ1bmN0aW9uIHRvIGRlY2xhcmUgd2hpY2ggaXRlbSB3ZVxcJ2xsIGJlIGNvbXBhcmluZyB0byc7XG5cdH1cblxuXHR0aGlzLl9oYXNDb25kaXRpb25hbCA9IHRydWU7XG5cblx0Ly9pZiB3ZSdyZSBub3QgZG9pbmcgYSBzZWxmIGNvbmRpdGlvbmFsIHRoZW4gZG8gdGhpc1xuXHRpZiggIXRoaXMuX2RvaW5nU2VsZkNvbmRpdGlvbmFsICkge1xuXG5cdFx0dmFyIGlkeDEgPSB0aGlzLml0ZW1zVG9Db21wYXJlLmxlbmd0aCAtIDE7XG5cblx0XHQvL3dlIGRvbid0IGhhcyBtYW55IGNvbmRpdGlvbmFscyB0byBjb21wYXJlIGFnYWluc3QgYXMgd2UgaGF2ZSBpdGVtcyB0byBjb21wYXJlIGFnYWluc3Rcblx0XHRpZiggdGhpcy5jb25kaXRpb25hbHNGb3JJdGVtWyBpZHgxIF0gPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHR0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXSA9IFtdO1xuXHRcdFx0dGhpcy5jb25kaXRpb25hbHNBcmd1bWVudHNGb3JJdGVtWyBpZHgxIF0gPSBbXTtcblxuXHRcdFx0dGhpcy5jb25kaXRpb25hbHNGb3JJdGVtWyBpZHgxIF0ucHVzaCggW10gKTtcblx0XHRcdHRoaXMuY29uZGl0aW9uYWxzQXJndW1lbnRzRm9ySXRlbVsgaWR4MSBdLnB1c2goIFtdICk7XG5cblx0XHR9IGVsc2UgaWYoIHRoaXMuaXRlbXNUb0NvbXBhcmVbIGlkeDEgXS5sZW5ndGggIT0gdGhpcy5jb25kaXRpb25hbHNGb3JJdGVtWyBpZHgxIF0ubGVuZ3RoICkge1xuXG5cdFx0XHR0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXS5wdXNoKCBbXSApO1xuXHRcdFx0dGhpcy5jb25kaXRpb25hbHNBcmd1bWVudHNGb3JJdGVtWyBpZHgxIF0ucHVzaCggW10gKTtcblx0XHR9XG5cblxuXHRcdHZhciBpZHgyID0gdGhpcy5jb25kaXRpb25hbHNGb3JJdGVtWyBpZHgxIF0ubGVuZ3RoIC0gMTtcblxuXHRcdHRoaXMuY29uZGl0aW9uYWxzRm9ySXRlbVsgaWR4MSBdWyBpZHgyIF0ucHVzaCggY0Z1bmN0aW9uICk7XG5cdFx0dGhpcy5jb25kaXRpb25hbHNBcmd1bWVudHNGb3JJdGVtWyBpZHgxIF1bIGlkeDIgXS5wdXNoKCBjQXJndW1lbnRzICk7XG5cdH0gZWxzZSB7XG5cblx0XHRcblx0XHR2YXIgaWR4MSA9IHRoaXMuc2VsZkl0ZW1zVG9Db21wYXJlLmxlbmd0aCAtIDE7XG5cblx0XHQvL3dlIGRvbid0IGhhcyBtYW55IGNvbmRpdGlvbmFscyB0byBjb21wYXJlIGFnYWluc3QgYXMgd2UgaGF2ZSBpdGVtcyB0byBjb21wYXJlIGFnYWluc3Rcblx0XHRpZiggdGhpcy5zZWxmQ29uZGl0aW9uYWxzRm9ySXRlbVsgaWR4MSBdID09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0dGhpcy5zZWxmQ29uZGl0aW9uYWxzRm9ySXRlbVsgaWR4MSBdID0gW107XG5cdFx0XHR0aGlzLnNlbGZDb25kaXRpb25hbEFyZ3VtZW50c0Zvckl0ZW1bIGlkeDEgXSA9IFtdO1xuXG5cdFx0XHR0aGlzLnNlbGZDb25kaXRpb25hbHNGb3JJdGVtWyBpZHgxIF0ucHVzaCggW10gKTtcblx0XHRcdHRoaXMuc2VsZkNvbmRpdGlvbmFsQXJndW1lbnRzRm9ySXRlbVsgaWR4MSBdLnB1c2goIFtdICk7XG5cblx0XHR9IGVsc2UgaWYoIHRoaXMuc2VsZkl0ZW1zVG9Db21wYXJlWyBpZHgxIF0ubGVuZ3RoICE9IHRoaXMuc2VsZkNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXS5sZW5ndGggKSB7XG5cblx0XHRcdHRoaXMuc2VsZkNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXS5wdXNoKCBbXSApO1xuXHRcdFx0dGhpcy5zZWxmQ29uZGl0aW9uYWxBcmd1bWVudHNGb3JJdGVtWyBpZHgxIF0ucHVzaCggW10gKTtcblx0XHR9XG5cblxuXHRcdHZhciBpZHgyID0gdGhpcy5zZWxmQ29uZGl0aW9uYWxzRm9ySXRlbVsgaWR4MSBdLmxlbmd0aCAtIDE7XG5cblx0XHR0aGlzLnNlbGZDb25kaXRpb25hbHNGb3JJdGVtWyBpZHgxIF1bIGlkeDIgXS5wdXNoKCBjRnVuY3Rpb24gKTtcblx0XHR0aGlzLnNlbGZDb25kaXRpb25hbEFyZ3VtZW50c0Zvckl0ZW1bIGlkeDEgXVsgaWR4MiBdLnB1c2goIGNBcmd1bWVudHMgKTtcblx0fVxuXG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcblVzaW5nIHRoZSB3aGVuIGZ1bmN0aW9uIHlvdSBjYW4gY3JlYXRlIGNvbmRpdGlvbmFscy4gSXQgaXMgdGhlIGZpcnN0IGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiBjcmVhdGluZyBhIGNvbmRpdG9uYWwuIFxuSXQgc3BlY2lmaWVzIHdoYXQgTGF5b3V0Tm9kZSB3aWxsIGJlIHVzZWQgd2hlbiBldmFsdWF0aW5nIGEgY29uZGl0aW9uYWwgc3RhdGVtZW50IHRoYXQgZm9sbG93cy5cblxuRm9yIGluc3RhbmNlOlxuXG5cdG5vZGUxLndoZW4oIG5vZGUyICkud2lkdGhHcmVhdGVyVGhhbiggMjAwICkud2lkdGhJcyggMTAwICk7XG5cbkJhc2ljYWxseSB3aGF0IHRoaXMgc3RhdGVtZW50IHNhaXMgaXMgXCJ3aGVuIG5vZGUyJ3Mgd2lkdGggaXMgZ3JlYXRlciB0aGFuIDIwMHB4IG5vZGUxJ3Mgd2lkdGggaXMgMTAwcHhcIi5cblxuQSBjb25kaXRpb25hbCBzdGF0ZW1lbnQgbXVzdCBhbHdheXMgZm9sbG93IGFmdGVyIGEgd2hlbiBzdGF0ZW1lbnQuXG5cbkBtZXRob2Qgd2hlblxuQHBhcmFtIG5vZGUge0xheW91dE5vZGV9IHRoZSBMYXlvdXROb2RlIHdoaWNoIGZvbGxvd2luZyBjb25kaXRpb25hbHMgd2lsbCBiZSBldmFsdWF0ZWQgYWdhaW5zdFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS53aGVuID0gZnVuY3Rpb24oIG5vZGUgKSB7XG5cblx0Ly9DaGVjayBpZiB0aGV5J3ZlIGNhbGxlZCB3aGVuIGFuZCB0cmllZCB0byBjYWxsIGl0IGFnYWluXG5cdGlmKCB0aGlzLl9pc0RvaW5nV2hlbiAmJiAhdGhpcy5faGFzQ29uZGl0aW9uYWwgKSB7XG5cblx0XHR0aHJvdyAnWW91IHNob3VsZCBjYWxsIHdoZW4gb3IgYW5kV2hlbiBhZnRlciBhZGRpbmcgY29uZGl0aW9uYWxzIHN1Y2ggXCJ3aWR0aEdyZWF0ZXJUaGFuXCInO1xuXHR9XG5cblx0Ly93ZSdyZSBjaGVja2luZyBvZiB0aGlzIGlzIExheW91dE5vZGUgY3JlYXRlZCBiYXNlZCBvbiBjb25kaXRpb25hbHNcblx0Ly9pZiB3aGVuIGlzIGNhbGxlZCB3ZSBzaG91bGQga2ljayBiYWNrIHRvIHRoZSBwYXJlbnQgbm9kZXMgd2hlbiBmdW5jdGlvbiBhbmQgY2FsbCB3aGVuIHRoZXJlXG5cdGlmKCB0aGlzLmNvbmRpdGlvbmFsUGFyZW50ICE9PSBudWxsICkge1xuXG5cdFx0cmV0dXJuIHRoaXMuY29uZGl0aW9uYWxQYXJlbnQud2hlbiggbm9kZSApO1xuXHR9XG5cblx0Ly9yZXNldCBsYXN0Q29uZGl0aW9uYWxMaXN0ZW5lcklzRGVmYXVsdCB0byBmYWxzZVxuXHR0aGlzLl9pc0RvaW5nV2hlbiA9IHRydWU7XG5cdHRoaXMubGFzdENvbmRpdGlvbmFsTGlzdGVuZXJJc0RlZmF1bHQgPSBmYWxzZTtcblx0dGhpcy5fZG9pbmdTZWxmQ29uZGl0aW9uYWwgPSBmYWxzZTtcblxuXHRpZiggbm9kZSAhPSB0aGlzICkge1xuXG5cdFx0dGhpcy5pdGVtc1RvQ29tcGFyZS5wdXNoKCBbIG5vZGUgXSApO1xuXG5cdFx0dGhpcy5jb25kaXRpb25hbExpc3RlbmVycy5wdXNoKCBudWxsICk7XG5cdFx0dGhpcy5sYXN0Q29uZGl0aW9uYWxMaXN0bmVySWR4ID0gdGhpcy5jb25kaXRpb25hbExpc3RlbmVycy5sZW5ndGggLSAxO1xuXHR9IGVsc2Uge1xuXG5cdFx0dGhpcy5fZG9pbmdTZWxmQ29uZGl0aW9uYWwgPSB0cnVlO1xuXG5cdFx0dGhpcy5zZWxmSXRlbXNUb0NvbXBhcmUucHVzaCggWyBub2RlIF0gKTsgLy9hZGQgdGhpcyB0byB0aGUgc2VsZiBsaXN0XG5cdFx0dGhpcy5zZWxmQ29uZGl0aW9uYWxMaXN0ZW5lcnMucHVzaCggbnVsbCApO1xuXHRcdHRoaXMubGFzdFNlbGZDb25kaXRpb25hbExpc3RlbmVySWR4ID0gdGhpcy5zZWxmQ29uZGl0aW9uYWxMaXN0ZW5lcnMubGVuZ3RoIC0gMTtcblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG5UaGUgYW5kV2hlbiBmdW5jdGlvbiBpbiBlc3NlbmNlIGlzIHRoZSBzYW1lIGFzIGFuICYmIG9wZXJhdG9yLiBhbmRXaGVuIHN0YXRlbWVudHMgbXVzdCBmb2xsb3cgYWZ0ZXIgYW5vdGhlciBjb25kaXRpb25hbC5cblxuRm9yIGV4YW1wbGU6XG5cblx0bm9kZTEud2hlbiggbm9kZTIgKS53aWR0aEdyZWF0ZXJUaGFuKCAxMDAgKS5hbmRXaGVuKCBub2RlMiApLndpZHRoTGVzc1RoYW4oIDIwMCApLndpZHRoSXMoIDEwMCApO1xuXG5XaGF0IHRoZSBhYm92ZSBpcyBzYXlpbmcgaXMgXCJXaGVuIG5vZGUyJ3Mgd2lkdGggaXMgZ3JlYXRlciB0aGFuIDEwMHB4IGFuZCB3aGVuIG5vZGUyJ3Mgd2lkdGggaXMgbGVzcyB0aGFuIDIwMHB4IHRoZW4gbm9kZTEncyB3aWR0aCBpc1xuMTAwcHhcIlxuXG5hbmRXaGVuIHN0YXRlbWVudHMgbXVzdCBmb2xsb3cgYWZ0ZXIgYSBjb25kaXRpb25hbCBzdGF0ZW1lbnQuXG5cbkBtZXRob2QgYW5kV2hlblxuQHBhcmFtIG5vZGUge0xheW91dE5vZGV9IHRoZSBMYXlvdXROb2RlIHdoaWNoIGZvbGxvd2luZyBjb25kaXRpb25hbHMgd2lsbCBiZSBldmFsdWF0ZWQgYWdhaW5zdFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5hbmRXaGVuID0gZnVuY3Rpb24oIG5vZGUgKSB7XG5cblx0aWYoICF0aGlzLl9pc0RvaW5nV2hlbiApIHtcblxuXHRcdHRocm93ICdZb3Ugc2hvdWxkIGNhbGwgd2hlbiBiZWZvcmUgY2FsbGluZyBhbmRXaGVuJztcdFx0XG5cdH0gZWxzZSBpZiggdGhpcy5jb25kaXRpb25hbFBhcmVudCApIHtcblxuXHRcdHRocm93ICdZb3Ugc2hvdWxkIGNhbGwgd2hlbiBiZWZvcmUgY2FsbGluZyBhbmRXaGVuJztcblx0fVxuXG5cdC8vaWYgYW5kV2hlbiB3YXMgY2FsbGVkIHRoZW4gYW5kIHdlJ3JlIG5vdCBkb2luZyBhIHNlbGYgY29uZGl0aW9uYWxcblx0Ly93ZSB3YW50IHRvIGdyYWIgdGhlIHJlZ3VsYXIgY29uZGl0aW9uYWxzIGFuZCBwdXNoIHRoZW0gdG8gdGhlIHNlbGYgY29uZGl0aW9uYWwgYXJyYXlcblx0aWYoIG5vZGUgPT0gdGhpcyAmJiAhdGhpcy5fZG9pbmdTZWxmQ29uZGl0aW9uYWwgKSB7XG5cblx0XHR0aGlzLl9kb2luZ1NlbGZDb25kaXRpb25hbCA9IHRydWU7XG5cblx0XHQvL3JlbW92ZSB0aGUgYXJyYXkgdGhhdCB3YXMgYWRkZWQgdG8gbWFrZSB0aGlzIGEgc2VsZiBjb25kaXRpb25hbFxuXHRcdHRoaXMuc2VsZkl0ZW1zVG9Db21wYXJlLnB1c2goIHRoaXMuaXRlbXNUb0NvbXBhcmUucG9wKCkgKTtcblx0XHQvL2FkZCB0aGlzIG5vZGUgaW5cblx0XHR0aGlzLnNlbGZJdGVtc1RvQ29tcGFyZVsgdGhpcy5zZWxmSXRlbXNUb0NvbXBhcmUubGVuZ3RoIC0gMSBdLnB1c2goIG5vZGUgKTtcblx0XHQvL3JldmVyc2Ugd2hhdHMgYmVlbiBhZGRlZCBmb3IgbGlzdGVuZXJzXG5cdFx0dGhpcy5jb25kaXRpb25hbExpc3RlbmVycy5wb3AoKTtcblx0XHQvL3NldCB0aGlzIGJhY2sgdG8gLTEgc28gdGhhdCBvbiBjYW50IGJlIGNhbGxlZCBmb3IgcmVndWxhciBsaXN0ZW5lcnNcblx0XHR0aGlzLmxhc3RDb25kaXRpb25hbExpc3RuZXJJZHggPSAtMTtcblxuXHQvL3dlJ3JlIGRvaW5nIGEgc2VsZiBjb25kaXRpb25hbCBhbmQgYW5vdGhlciBpdGVtIHRvIGNvbXBhcmVcblx0fSBlbHNlIGlmKCB0aGlzLl9kb2luZ1NlbGZDb25kaXRpb25hbCApIHtcblxuXHRcdHRoaXMuc2VsZkl0ZW1zVG9Db21wYXJlLnB1c2goIG5vZGUgKTtcblx0Ly90aGlzIGlzIGp1c3QgYSByZWd1bGFyIG9sZCBhbmQgd2hlbiBzdGF0ZW1lbnQgc28gYWRkIHRoZSBub2RlIHRvIGl0ZW1zIHRvIGNvbXBhcmVcblx0fSBlbHNlIHtcblxuXHRcdHZhciBpZHggPSB0aGlzLml0ZW1zVG9Db21wYXJlLmxlbmd0aCAtIDE7XG5cdFx0dGhpcy5pdGVtc1RvQ29tcGFyZVsgaWR4IF0ucHVzaCggbm9kZSApO1xuXHR9XG5cdFxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuVGhlIGRlZmF1bHQgc3RhdGVtZW50IGlzIHRoZSBlcXVpdmFsZW50IHRvIGFuIGVsc2Ugc3RhdGVtZW50LlxuXG5Gb3IgaW5zdGFuY2UgaWYgd2UgaGF2ZSB0aGUgZm9sbG93aW5nIHN0YXRlbWVudDpcblxuXHRub2RlMVxuXHQud2hlbiggbm9kZTIgKS53aWR0aEdyZWF0ZXJUaGFuKCAxMDAgKS53aWR0aElzKCAxMDAgKVxuXHQuZGVmYXVsdCgpLndpZHRoSXMoIDUwICk7XG5cbldoYXQgdGhlIGFib3ZlIG1lYW5zIGlzIFwiV2hlbiBub2RlMidzIHdpZHRoIGlzIGdyZWF0ZXIgdGhhbiAxMDBweCB0aGUgd2lkdGggb2Ygbm9kZTEgaXMgMTAwcHguIE90aGVyd2lzZSBpZiB0aGUgd2lkdGggb2Ygbm9kZTIgaXMgbm90XG5ncmVhdGVyIHRoYW4gMTAwcHggdGhlbiB0aGUgd2lkdGggb2Ygbm9kZTEgaXMgNTBweFwiXG5cblNvbWV0aGluZyB0byBub3RlIGlzIHRoYXQgeW91IGNhbiBhbHNvIGFkZCBydWxlcyB3aGljaCB3aWxsIGFsd2F5cyBldmFsdWF0ZSBieSBkb2luZyB0aGUgZm9sbG93aW5nOlxuXG5cdG5vZGUxXG5cdC5oZWlnaHRJcyggMjAwIClcblx0LndoZW4oIG5vZGUyICkud2lkdGhHcmVhdGVyVGhhbiggMTAwICkud2lkdGhJcyggMTAwIClcblx0LmRlZmF1bHQoKS53aWR0aElzKCA1MCApO1xuXG5CYXNpY2FsbHkgcmVnYXJkbGVzcyBvZiB0aGUgd2lkdGggb2Ygbm9kZTIgdGhlIGhlaWdodCBvZiBub2RlMSB3aWxsIGJlIDIwMHB4LiBUaGlzIGNsZWFybHkgZGlmZmVycyBmcm9tIHRoZSBcImRlZmF1bHRcIiBzdGF0ZW1lbnQuXG5cbkBtZXRob2QgZGVmYXVsdFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5kZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG5cblx0dGhpcy5faXNEb2luZ0RlZmF1bHQgPSB0cnVlO1xuXG5cdGlmKCB0aGlzLmNvbmRpdGlvbmFsUGFyZW50ICkge1xuXG5cdFx0cmV0dXJuIHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuZGVmYXVsdCgpO1xuXHR9XG5cblx0dGhpcy5sYXN0Q29uZGl0aW9uYWxMaXN0bmVySWR4ID0gLTE7XG5cdHRoaXMubGFzdFNlbGZDb25kaXRpb25hbExpc3RlbmVySWR4ID0gLTE7XG5cdHRoaXMubGFzdENvbmRpdGlvbmFsTGlzdGVuZXJJc0RlZmF1bHQgPSB0cnVlO1xuXG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG5Zb3UgY2FuIHVzZSB0aGlzIG1ldGhvZCB0byBhZGQgY2FsbGJhY2tzIGZvciB3aGVuIGNvbmRpdGlvbmFscyBldmFsdWF0ZS5cblxuU28gbGV0J3Mgc2F5IHdlIGRvOlxuXG5cdG5vZGUxLndoZW4oIG5vZGUyICkuaGVpZ2h0TGVzc1RoYW4oIDMwMCApLm1hdGNoZXNIZWlnaHRPZiggbm9kZTIgKS5vbiggZnVuY3Rpb24oIGlzVHJ1ZSApIHtcblx0XHRcblx0XHRjb25zb2xlLmxvZyggXCJJcyB0aGUgaGVpZ2h0IG9mIG5vZGUyIHNtYWxsZXIgdGhhbiAzMDA/XCIsIGlzVHJ1ZSApO1xuXHR9KTtcblxuRXZlcnl0aW1lIHRoZSBsYXlvdXQgaXMgdXBkYXRlZCB0aGUgY2FsbCBiYWNrIHdpbGwgZmlyZSB3aXRoIGEgYm9vbGVhbiB3aGljaCBpcyB3aGV0aGVyIHRoZSBjb25kaXRpb25hbCBpc1xudHJ1ZSBvciBmYWxzZS5cblxuVGhlIG9uIGZ1bmN0aW9uIHdpbGwgb25seSBiZSBhcHBsaWVkIHRvIHRoZSBwcmV2aW91cyBcIndoZW5cIiBvciBcImRlZmF1bHRcIiBzdGF0ZW1lbnQgcHJlY2VkaW5nIHRoZSBvbiBzdGF0ZW1lbnQuXG5cbkBtZXRob2Qgb25cbkBwYXJhbSBsaXN0ZW5lciB7RnVuY3Rpb259IFRoaXMgaXMgdGhlIGxpc3RlbmVyIGZvciB0aGUgY2FsbCBiYWNrIHdoZW4gdGhpcyBjb25kaXRpb25hbCBldmFsdWF0ZXNcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbiggbGlzdGVuZXIgKSB7XG5cblxuXHRpZiggdGhpcy5jb25kaXRpb25hbFBhcmVudCApIHtcblxuXHRcdHRoaXMuY29uZGl0aW9uYWxQYXJlbnQub24oIGxpc3RlbmVyICk7XG5cdH0gZWxzZSBpZiggdGhpcy5fZG9pbmdTZWxmQ29uZGl0aW9uYWwgKSB7XG5cblx0XHRpZiggdGhpcy5sYXN0U2VsZkNvbmRpdGlvbmFsTGlzdGVuZXJJZHggPiAtMSApIHtcblxuXHRcdFx0dGhpcy5zZWxmQ29uZGl0aW9uYWxMaXN0ZW5lcnNbIHRoaXMubGFzdFNlbGZDb25kaXRpb25hbExpc3RlbmVySWR4IF0gPSBsaXN0ZW5lcjtcblx0XHR9XG5cdH0gZWxzZSB7XG5cblx0XHQvL2FyZSB3ZSBkb2luZyB0aGUgZGVmYXVsdCBsaXN0ZW5lclxuXHRcdGlmKCAhdGhpcy5sYXN0Q29uZGl0aW9uYWxMaXN0ZW5lcklzRGVmYXVsdCApIHtcblxuXHRcdFx0Ly9pZiB3ZSBoYXZlIGEgY29uZGl0aW9uYWwgbGlzdGVuZXIgaWR4ICh3aGVuIGNhbGxlZClcblx0XHRcdGlmKCB0aGlzLmxhc3RDb25kaXRpb25hbExpc3RuZXJJZHggPiAtMSApIHtcblxuXHRcdFx0XHR0aGlzLmNvbmRpdGlvbmFsTGlzdGVuZXJzWyB0aGlzLmxhc3RDb25kaXRpb25hbExpc3RuZXJJZHggXSA9IGxpc3RlbmVyO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHR0aHJvdyAnWW91IG11c3QgY2FsbCB0aGUgd2hlbiBmdW5jdGlvbiBiZWZvcmUgdHJ5aW5nIHRvIGFkZCBhIGxpc3RlbmVyJztcblx0XHRcdH1cblx0XHQvL3dlIGFyZSBkb2luZyB0aGUgZGVmYXVsdCBsaXN0ZW5lclxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHRoaXMuZGVmYXVsdENvbmRpdGlvbmFsTGlzdGVuZXIgPSBsaXN0ZW5lcjtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLndpZHRoR3JlYXRlclRoYW4oIDMwMCApLm1hdGNoZXNIZWlnaHRPZiggbm9kZTIgKTtcblxuVGhlIGFib3ZlIGlzIHN0YXRpbmcgXCJ3aGVuIHRoZSB3aWR0aCBvZiBub2RlMiBpcyBncmVhdGVyIHRoYW4gMzAwcHggbm9kZTEgc2hvdWxkIG1hdGNoIHRoZSBoZWlnaHQgb2Ygbm9kZTJcIi5cblxuQG1ldGhvZCB3aWR0aEdyZWF0ZXJUaGFuXG5AcGFyYW0gdmFsdWUge051bWJlcn0gVGhpcyB2YWx1ZSBzdGF0ZXMgdGhlIHdpZHRoIHRoYXQgdGhlIExheW91dE5vZGUncyB3aWR0aCBzaG91bGQgYmUgZXZhbHVhdGVkIGFnYWluc3RcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUud2lkdGhHcmVhdGVyVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgd2lkdGhHcmVhdGVyVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cblxuXG4vKipcblRoaXMgZnVuY3Rpb24gaXMgYSBjb25kaXRpb25hbC4gSXQgbXVzdCBmb2xsb3cgYWZ0ZXIgYSBcIndoZW5cIiBvciBcImFuZFdoZW5cIiBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS5oZWlnaHRHcmVhdGVyVGhhbiggMzAwICkubWF0Y2hlc0hlaWdodE9mKCBub2RlMiApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIGhlaWdodCBvZiBub2RlMiBpcyBncmVhdGVyIHRoYW4gMzAwcHggbm9kZTEgc2hvdWxkIG1hdGNoIHRoZSBoZWlnaHQgb2Ygbm9kZTJcIi5cblxuQG1ldGhvZCBoZWlnaHRHcmVhdGVyVGhhblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IFRoaXMgdmFsdWUgc3RhdGVzIHRoZSBoZWlnaHQgdGhhdCB0aGUgTGF5b3V0Tm9kZSdzIGhlaWdodCBzaG91bGQgYmUgZXZhbHVhdGVkIGFnYWluc3RcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuaGVpZ2h0R3JlYXRlclRoYW4gPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIGFkZENvbmRpdGlvbmFsLmNhbGwoIHRoaXMsIGhlaWdodEdyZWF0ZXJUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLndpZHRoTGVzc1RoYW4oIDMwMCApLm1hdGNoZXNIZWlnaHRPZiggbm9kZTIgKTtcblxuVGhlIGFib3ZlIGlzIHN0YXRpbmcgXCJ3aGVuIHRoZSB3aWR0aCBvZiBub2RlMiBpcyBsZXNzIHRoYW4gMzAwcHggbm9kZTEgc2hvdWxkIG1hdGNoIHRoZSBoZWlnaHQgb2Ygbm9kZTJcIi5cblxuQG1ldGhvZCB3aWR0aExlc3NUaGFuXG5AcGFyYW0gdmFsdWUge051bWJlcn0gVGhpcyB2YWx1ZSBzdGF0ZXMgdGhlIHdpZHRoIHRoYXQgdGhlIExheW91dE5vZGUncyB3aWR0aCBzaG91bGQgYmUgZXZhbHVhdGVkIGFnYWluc3RcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUud2lkdGhMZXNzVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgd2lkdGhMZXNzVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cblxuXG4vKipcblRoaXMgZnVuY3Rpb24gaXMgYSBjb25kaXRpb25hbC4gSXQgbXVzdCBmb2xsb3cgYWZ0ZXIgYSBcIndoZW5cIiBvciBcImFuZFdoZW5cIiBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS5oZWlnaHRMZXNzVGhhbiggMzAwICkubWF0Y2hlc0hlaWdodE9mKCBub2RlMiApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIGhlaWdodCBvZiBub2RlMiBpcyBsZXNzIHRoYW4gMzAwcHggbm9kZTEgc2hvdWxkIG1hdGNoIHRoZSBoZWlnaHQgb2Ygbm9kZTJcIi5cblxuQG1ldGhvZCBoZWlnaHRMZXNzVGhhblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IFRoaXMgdmFsdWUgc3RhdGVzIHRoZSBoZWlnaHQgdGhhdCB0aGUgTGF5b3V0Tm9kZSdzIGhlaWdodCBzaG91bGQgYmUgZXZhbHVhdGVkIGFnYWluc3RcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuaGVpZ2h0TGVzc1RoYW4gPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIGFkZENvbmRpdGlvbmFsLmNhbGwoIHRoaXMsIGhlaWdodExlc3NUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkubGVmdEdyZWF0ZXJUaGFuKCA0MDAgKS54SXMoIDQwMCApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIHRoZSBsZWZ0IHNpZGUgKG5vZGUyLnggcG9zaXRpb24pIG9mIG5vZGUyIGlzIGdyZWF0ZXIgdGhhbiA0MDAgbm9kZTEncyB4IHdpbGwgYmUgNDAwXCIuXG5cbkBtZXRob2QgbGVmdEdyZWF0ZXJUaGFuXG5AcGFyYW0gdmFsdWUge051bWJlcn0gV2hlbiB0aGUgeCB2YWx1ZSBvZiBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aGUgd2hlbiBzdGF0ZW1lbnQgaXMgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUgdGhlIFxuY29uZGl0aW9uYWxzIGxheW91dCBydWxlcyB3aWxsIGJlIHJ1blxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5sZWZ0R3JlYXRlclRoYW4gPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIGFkZENvbmRpdGlvbmFsLmNhbGwoIHRoaXMsIGxlZnRHcmVhdGVyVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cblxuXG4vKipcblRoaXMgZnVuY3Rpb24gaXMgYSBjb25kaXRpb25hbC4gSXQgbXVzdCBmb2xsb3cgYWZ0ZXIgYSBcIndoZW5cIiBvciBcImFuZFdoZW5cIiBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS5sZWZ0TGVzc1RoYW4oIDQwMCApLnhJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgdGhlIGxlZnQgc2lkZSAobm9kZTIueCBwb3NpdGlvbikgb2Ygbm9kZTIgaXMgbGVzcyB0aGFuIDQwMCBub2RlMSdzIHggd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCBsZWZ0TGVzc1RoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBXaGVuIHRoZSB4IHZhbHVlIG9mIExheW91dE5vZGUgcGFzc2VkIGluIHRoZSB3aGVuIHN0YXRlbWVudCBpcyBsZXNzIHRoYW4gdGhpcyB2YWx1ZSB0aGUgXG5jb25kaXRpb25hbHMgbGF5b3V0IHJ1bGVzIHdpbGwgYmUgcnVuXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmxlZnRMZXNzVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgbGVmdExlc3NUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLnJpZ2h0R3JlYXRlclRoYW4oIDQwMCApLnhJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgdGhlIHJpZ2h0IHNpZGUgKG5vZGUyLnggKyBub2RlMi53aWR0aCkgb2Ygbm9kZTIgaXMgZ3JlYXRlciB0aGFuIDQwMCBub2RlMSdzIHggd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCByaWdodEdyZWF0ZXJUaGFuXG5AcGFyYW0gdmFsdWUge051bWJlcn0gV2hlbiB4ICsgd2lkdGggdmFsdWUgb2YgTGF5b3V0Tm9kZSBwYXNzZWQgaW4gdGhlIHdoZW4gc3RhdGVtZW50IGlzIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlIHRoZSBcbmNvbmRpdGlvbmFscyBsYXlvdXQgcnVsZXMgd2lsbCBiZSBydW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucmlnaHRHcmVhdGVyVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgcmlnaHRHcmVhdGVyVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cblxuXG4vKipcblRoaXMgZnVuY3Rpb24gaXMgYSBjb25kaXRpb25hbC4gSXQgbXVzdCBmb2xsb3cgYWZ0ZXIgYSBcIndoZW5cIiBvciBcImFuZFdoZW5cIiBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS5yaWdodExlc3NUaGFuKCA0MDAgKS54SXMoIDQwMCApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIHRoZSByaWdodCBzaWRlIChub2RlMi54ICsgbm9kZTIud2lkdGgpIG9mIG5vZGUyIGlzIGxlc3MgdGhhbiA0MDAgbm9kZTEncyB4IHdpbGwgYmUgNDAwXCIuXG5cbkBtZXRob2QgcmlnaHRMZXNzVGhhblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IFdoZW4geCArIHdpZHRoIHZhbHVlIG9mIExheW91dE5vZGUgcGFzc2VkIGluIHRoZSB3aGVuIHN0YXRlbWVudCBpcyBsZXNzIHRoYW4gdGhpcyB2YWx1ZSB0aGUgXG5jb25kaXRpb25hbHMgbGF5b3V0IHJ1bGVzIHdpbGwgYmUgcnVuXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnJpZ2h0TGVzc1RoYW4gPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIGFkZENvbmRpdGlvbmFsLmNhbGwoIHRoaXMsIHJpZ2h0TGVzc1RoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLnRvcEdyZWF0ZXJUaGFuKCA0MDAgKS55SXMoIDQwMCApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIHRoZSBsZWZ0IHNpZGUgKG5vZGUyLnkgcG9zaXRpb24pIG9mIG5vZGUyIGlzIGdyZWF0ZXIgdGhhbiA0MDAgbm9kZTEncyB5IHdpbGwgYmUgNDAwXCIuXG5cbkBtZXRob2QgdG9wR3JlYXRlclRoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBXaGVuIHRoZSB5IHZhbHVlIG9mIExheW91dE5vZGUgcGFzc2VkIGluIHRoZSB3aGVuIHN0YXRlbWVudCBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSB0aGUgXG5jb25kaXRpb25hbHMgbGF5b3V0IHJ1bGVzIHdpbGwgYmUgcnVuXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnRvcEdyZWF0ZXJUaGFuID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiBhZGRDb25kaXRpb25hbC5jYWxsKCB0aGlzLCB0b3BHcmVhdGVyVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cblxuXG4vKipcblRoaXMgZnVuY3Rpb24gaXMgYSBjb25kaXRpb25hbC4gSXQgbXVzdCBmb2xsb3cgYWZ0ZXIgYSBcIndoZW5cIiBvciBcImFuZFdoZW5cIiBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS50b3BMZXNzVGhhbiggNDAwICkueUlzKCA0MDAgKTtcblxuVGhlIGFib3ZlIGlzIHN0YXRpbmcgXCJ3aGVuIHRoZSB0aGUgbGVmdCBzaWRlIChub2RlMi55IHBvc2l0aW9uKSBvZiBub2RlMiBpcyBsZXNzIHRoYW4gNDAwIG5vZGUxJ3MgeSB3aWxsIGJlIDQwMFwiLlxuXG5AbWV0aG9kIHRvcExlc3NUaGFuXG5AcGFyYW0gdmFsdWUge051bWJlcn0gV2hlbiB0aGUgeSB2YWx1ZSBvZiBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aGUgd2hlbiBzdGF0ZW1lbnQgaXMgbGVzcyB0aGFuIHRoaXMgdmFsdWUgdGhlIFxuY29uZGl0aW9uYWxzIGxheW91dCBydWxlcyB3aWxsIGJlIHJ1blxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS50b3BMZXNzVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgdG9wTGVzc1RoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkuYm90dG9tR3JlYXRlclRoYW4oIDQwMCApLnlJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgdGhlIHJpZ2h0IHNpZGUgKG5vZGUyLnkgKyBub2RlMi5oZWlnaHQpIG9mIG5vZGUyIGlzIGdyZWF0ZXIgdGhhbiA0MDAgbm9kZTEncyB5IHdpbGwgYmUgNDAwXCIuXG5cbkBtZXRob2QgYm90dG9tR3JlYXRlclRoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBXaGVuIHkgKyBoZWlnaHQgdmFsdWUgb2YgTGF5b3V0Tm9kZSBwYXNzZWQgaW4gdGhlIHdoZW4gc3RhdGVtZW50IGlzIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlIHRoZSBcbmNvbmRpdGlvbmFscyBsYXlvdXQgcnVsZXMgd2lsbCBiZSBydW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuYm90dG9tR3JlYXRlclRoYW4gPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIGFkZENvbmRpdGlvbmFsLmNhbGwoIHRoaXMsIGJvdHRvbUdyZWF0ZXJUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLmJvdHRvbUxlc3NUaGFuKCA0MDAgKS55SXMoIDQwMCApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIHRoZSByaWdodCBzaWRlIChub2RlMi55ICsgbm9kZTIud2lkdGgpIG9mIG5vZGUyIGlzIGxlc3MgdGhhbiA0MDAgbm9kZTEncyB5IHdpbGwgYmUgNDAwXCIuXG5cbkBtZXRob2QgYm90dG9tTGVzc1RoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBXaGVuIHkgKyB3aWR0aCB2YWx1ZSBvZiBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aGUgd2hlbiBzdGF0ZW1lbnQgaXMgbGVzcyB0aGFuIHRoaXMgdmFsdWUgdGhlIFxuY29uZGl0aW9uYWxzIGxheW91dCBydWxlcyB3aWxsIGJlIHJ1blxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5ib3R0b21MZXNzVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgYm90dG9tTGVzc1RoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG5cbi8qKlxuVGhlcmUgYXJlIHR3byB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uIGJvdGggYXJlIGRvY3VtZW50ZWQuXG5cblRoaXMgZnVuY3Rpb24gaXMgYSBjb25kaXRpb25hbC4gSXQgbXVzdCBmb2xsb3cgYWZ0ZXIgYSBcIndoZW5cIiBvciBcImFuZFdoZW5cIiBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS5pc0luc2lkZSggbm9kZTEgKS55SXMoIDQwMCApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gYW55IHBhcnQgb2Ygbm9kZTEgaXMgaW5zaWRlIG5vZGUgeSBpcyA0MDBcIi5cblxuQG1ldGhvZCBpc0luc2lkZVxuQHBhcmFtIG5vZGUge0xheW91dE5vZGV9IGlmIHRoZSBsYXlvdXQgbm9kZSB3aGljaCBpc0luc2lkZSBpcyBjYWxsZWQgb24gaXMgaW5zaWRlIHRoaXMgcGFzc2VkIExheW91dE5vZGUgdGhlbiB0aGlzIGNvbmRpdGlvbmFsXG53aWxsIGV2YWx1YXRlIHRydWVcbkBjaGFpbmFibGVcbioqL1xuLyoqXG5UaGVyZSBhcmUgdHdvIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24gYm90aCBhcmUgZG9jdW1lbnRlZC5cblxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLmlzSW5zaWRlKCAwLCAwLCAxMDAsIDEwMCApLnlJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiBhbnkgcGFydCBvZiBub2RlMSBpcyBpbnNpZGUgdGhlIHJlY3RhbmdsZSAwLCAwLCAxMDAsIDEwMCB0aGVuIHRoZSB5IHZhbHVlIG9mIG5vZGUxIHdpbGwgYmUgNDAwXCIuXG5cbkBtZXRob2QgaXNJbnNpZGVcbkBwYXJhbSB4IHtOdW1iZXJ9IHggcG9zaXRpb24gb2YgcmVjdGFuZ3VsYXIgYXJlYSB0byBjaGVja1xuQHBhcmFtIHkge051bWJlcn0geSBwb3NpdGlvbiBvZiByZWN0YW5ndWxhciBhcmVhIHRvIGNoZWNrXG5AcGFyYW0gd2lkdGgge051bWJlcn0gd2lkdGggb2YgcmVjdGFuZ3VsYXIgYXJlYSB0byBjaGVja1xuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSBoZWlnaHQgb2YgcmVjdGFuZ3VsYXIgYXJlYSB0byBjaGVja1xud2lsbCBldmFsdWF0ZSB0cnVlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmlzSW5zaWRlID0gZnVuY3Rpb24oKSB7XG5cblx0cmV0dXJuIGFkZENvbmRpdGlvbmFsLmNhbGwoIHRoaXMsIGlzSW5zaWRlLCBhcmd1bWVudHMgKTtcbn07XG5cblxuLyoqXG5UaGVyZSBhcmUgdHdvIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24gYm90aCBhcmUgZG9jdW1lbnRlZC5cblxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLmlzT3V0c2lkZSggbm9kZTEgKS55SXMoIDQwMCApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gbm9kZTEgaXMgZnVsbHkgb3V0c2lkZSBub2RlMiAobm8gcGFydCBvZiBub2RlMSBpcyBpbnNpZGUgbm9kZTIpIG5vZGUxIHkgaXMgNDAwXCIuXG5cbkBtZXRob2QgaXNPdXRzaWRlXG5AcGFyYW0gbm9kZSB7TGF5b3V0Tm9kZX0gaWYgdGhlIGxheW91dCBub2RlIHdoaWNoIGlzT3V0c2lkZSBpcyBjYWxsZWQgb24gaXMgaW5zaWRlIHRoaXMgcGFzc2VkIExheW91dE5vZGUgdGhlbiB0aGlzIGNvbmRpdGlvbmFsXG53aWxsIGV2YWx1YXRlIHRydWVcbkBjaGFpbmFibGVcbioqL1xuLyoqXG5UaGVyZSBhcmUgdHdvIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24gYm90aCBhcmUgZG9jdW1lbnRlZC5cblxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLmlzT3V0c2lkZSggMCwgMCwgMTAwLCAxMDAgKS55SXMoIDQwMCApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gbm8gcGFydCBvZiBub2RlMSBpcyBpbnNpZGUgdGhlIHJlY3RhbmdsZSAwLCAwLCAxMDAsIDEwMCB0aGVuIHRoZSB5IHZhbHVlIG9mIG5vZGUxIHdpbGwgYmUgNDAwXCIuXG5cbkBtZXRob2QgaXNPdXRzaWRlXG5AcGFyYW0geCB7TnVtYmVyfSB4IHBvc2l0aW9uIG9mIHJlY3Rhbmd1bGFyIGFyZWEgdG8gY2hlY2tcbkBwYXJhbSB5IHtOdW1iZXJ9IHkgcG9zaXRpb24gb2YgcmVjdGFuZ3VsYXIgYXJlYSB0byBjaGVja1xuQHBhcmFtIHdpZHRoIHtOdW1iZXJ9IHdpZHRoIG9mIHJlY3Rhbmd1bGFyIGFyZWEgdG8gY2hlY2tcbkBwYXJhbSBoZWlnaHQge051bWJlcn0gaGVpZ2h0IG9mIHJlY3Rhbmd1bGFyIGFyZWEgdG8gY2hlY2tcbndpbGwgZXZhbHVhdGUgdHJ1ZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5pc091dHNpZGUgPSBmdW5jdGlvbigpIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgaXNPdXRzaWRlLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gTGF5b3V0Tm9kZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRpZiggdHlwZW9mIHZhbHVlID09ICdudW1iZXInICkge1xuXG5cdFx0cmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0ID4gdmFsdWU7XHRcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiB0aGlzLnkgKyB0aGlzLmhlaWdodCA+IHZhbHVlLnkgKyB2YWx1ZS5oZWlnaHQ7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0aWYoIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyApIHtcblxuXHRcdHJldHVybiB0aGlzLnkgKyB0aGlzLmhlaWdodCA8IHZhbHVlO1x0XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQgPCB2YWx1ZS55ICsgdmFsdWUuaGVpZ2h0O1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiB0aGlzLmhlaWdodCA+IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gdGhpcy5oZWlnaHQgPCB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuXHR2YXIgbGVmdCwgdG9wLCByaWdodCwgYm90dG9tO1xuXG5cdGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDQgKSB7XG5cblx0XHRsZWZ0ID0gYXJndW1lbnRzWyAwIF07XG5cdFx0dG9wID0gYXJndW1lbnRzWyAxIF07XG5cdFx0cmlnaHQgPSBhcmd1bWVudHNbIDIgXSArIGxlZnQ7XG5cdFx0Ym90dG9tID0gYXJndW1lbnRzWyAzIF0gKyB0b3A7XG5cdH0gZWxzZSB7XG5cblx0XHRsZWZ0ID0gYXJndW1lbnRzWyAwIF0ueDtcblx0XHR0b3AgPSBhcmd1bWVudHNbIDAgXS55O1xuXHRcdHJpZ2h0ID0gYXJndW1lbnRzWyAwIF0ud2lkdGggKyBsZWZ0O1xuXHRcdGJvdHRvbSA9IGFyZ3VtZW50c1sgMCBdLmhlaWdodCArIHRvcDtcblx0fVxuXG5cdHZhciBteUxlZnQgPSB0aGlzLng7XG5cdHZhciBteVRvcCA9IHRoaXMueTtcblx0dmFyIG15UmlnaHQgPSB0aGlzLnggKyB0aGlzLndpZHRoO1xuXHR2YXIgbXlCb3R0b20gPSB0aGlzLnkgKyB0aGlzLmhlaWdodDtcblxuXHRyZXR1cm4gKCBteUxlZnQgPiBsZWZ0ICYmIG15TGVmdCA8IHJpZ2h0ICYmIG15VG9wID4gdG9wICYmIG15VG9wIDwgYm90dG9tICkgfHwgLy90b3AgbGVmdCBjb3JuZXIgaXMgaW5zaWRlXG5cdFx0ICAgKCBteVJpZ2h0ID4gbGVmdCAmJiBteVJpZ2h0IDwgcmlnaHQgJiYgbXlUb3AgPiB0b3AgJiYgbXlUb3AgPCBib3R0b20gKSB8fCAvL3RvcCByaWdodCBjb3JuZXIgaXMgaW5zaWRlXG5cdFx0ICAgKCBteVJpZ2h0ID4gbGVmdCAmJiBteVJpZ2h0IDwgcmlnaHQgJiYgbXlCb3R0b20gPiB0b3AgJiYgbXlCb3R0b20gPCBib3R0b20gKSB8fCAvL2JvdHRvbSByaWdodCBjb3JuZXIgaXMgaW5zaWRlXG5cdFx0ICAgKCBteUxlZnQgPiBsZWZ0ICYmIG15TGVmdCA8IHJpZ2h0ICYmIG15Qm90dG9tID4gdG9wICYmIG15Qm90dG9tIDwgYm90dG9tICk7IC8vYm90dG9tIGxlZnQgY29ybmVyIGlzIGluc2lkZVxufTsiLCJ2YXIgaXNJbnNpZGUgPSByZXF1aXJlKCAnLi9pc0luc2lkZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuXHRyZXR1cm4gIWlzSW5zaWRlLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gdGhpcy54ID4gdmFsdWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdGlmKCB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgKSB7XG5cblx0XHRyZXR1cm4gdGhpcy54IDwgdmFsdWU7XHRcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiB0aGlzLnggPCB2YWx1ZS54O1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdGlmKCB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgKSB7XG5cblx0XHRyZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aCA+IHZhbHVlO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggPiB2YWx1ZS54ICsgdmFsdWUud2lkdGg7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggPCB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0aWYoIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyApIHtcblxuXHRcdHJldHVybiB0aGlzLnkgPiB2YWx1ZTtcdFxuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIHRoaXMueSA+IHZhbHVlLnk7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0aWYoIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyApIHtcblxuXHRcdHJldHVybiB0aGlzLnkgPCB2YWx1ZTtcdFxuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIHRoaXMueSA8IHZhbHVlLnk7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIHRoaXMud2lkdGggPiB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIHRoaXMud2lkdGggPCB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feSA9IE1hdGgubWluKCB0aGlzLl95LCB2YWx1ZSAtIHRoaXMuX2hlaWdodCApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3kgPSBNYXRoLm1pbiggdGhpcy5feSwgaXRlbS55ICsgaXRlbS5oZWlnaHQgLSB0aGlzLl9oZWlnaHQgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feSA9IE1hdGgubWF4KCB0aGlzLl95LCB2YWx1ZSAtIHRoaXMuX2hlaWdodCApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3kgPSBNYXRoLm1heCggdGhpcy5feSwgaXRlbS55ICsgaXRlbS5oZWlnaHQgLSB0aGlzLl9oZWlnaHQgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feCA9IE1hdGgubWluKCB0aGlzLl94LCB2YWx1ZSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggPSBNYXRoLm1pbiggdGhpcy5feCwgaXRlbS54ICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX3ggPSBNYXRoLm1heCggdGhpcy5feCwgdmFsdWUgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ID0gTWF0aC5tYXgoIHRoaXMuX3gsIGl0ZW0ueCApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDEgKSB7XG5cblx0XHR0aGlzLl94ID0gTWF0aC5taW4oIHRoaXMuX3gsIGFyZ3VtZW50c1sgMCBdICk7XG5cdFx0dGhpcy5feSA9IE1hdGgubWluKCB0aGlzLl95LCBhcmd1bWVudHNbIDAgXSApO1xuXHR9IGVsc2Uge1xuXG5cdFx0dGhpcy5feCA9IE1hdGgubWluKCB0aGlzLl94LCBhcmd1bWVudHNbIDAgXSApO1xuXHRcdHRoaXMuX3kgPSBNYXRoLm1pbiggdGhpcy5feSwgYXJndW1lbnRzWyAxIF0gKTtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggPSBNYXRoLm1pbiggdGhpcy5feCwgaXRlbS54ICk7XG5cdHRoaXMuX3kgPSBNYXRoLm1pbiggdGhpcy5feSwgaXRlbS55ICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcblxuXHRcdHRoaXMuX3ggPSBNYXRoLm1heCggdGhpcy5feCwgYXJndW1lbnRzWyAwIF0gKTtcblx0XHR0aGlzLl95ID0gTWF0aC5tYXgoIHRoaXMuX3ksIGFyZ3VtZW50c1sgMCBdICk7XG5cdH0gZWxzZSB7XG5cblx0XHR0aGlzLl94ID0gTWF0aC5tYXgoIHRoaXMuX3gsIGFyZ3VtZW50c1sgMCBdICk7XG5cdFx0dGhpcy5feSA9IE1hdGgubWF4KCB0aGlzLl95LCBhcmd1bWVudHNbIDEgXSApO1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCA9IE1hdGgubWF4KCB0aGlzLl94LCBpdGVtLnggKTtcblx0dGhpcy5feSA9IE1hdGgubWF4KCB0aGlzLl95LCBpdGVtLnkgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feCA9IE1hdGgubWluKCB0aGlzLl94LCB2YWx1ZSAtIHRoaXMuX3dpZHRoICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCA9IE1hdGgubWluKCB0aGlzLl94LCBpdGVtLnggLSB0aGlzLl9oZWlnaHQgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feCA9IE1hdGgubWF4KCB0aGlzLl94LCB2YWx1ZSAtIHRoaXMuX3dpZHRoICk7XG59OyIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoMzIpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feSA9IE1hdGgubWluKCB0aGlzLl95LCB2YWx1ZSApO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feSA9IE1hdGgubWluKCB0aGlzLl95LCBpdGVtLnkgKyBpdGVtLmhlaWdodCAtIHRoaXMuX2hlaWdodCApO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX3kgPSBNYXRoLm1heCggdGhpcy5feSwgdmFsdWUgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl95ID0gTWF0aC5tYXgoIHRoaXMuX3ksIGl0ZW0ueSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl9oZWlnaHQgPSBNYXRoLm1pbiggdGhpcy5faGVpZ2h0LCB2YWx1ZSApO1xufTsiLCJleHBvcnRzLm1vZHVsZSA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX2hlaWdodCA9IE1hdGgubWluKCB0aGlzLl9oZWlnaHQsIGl0ZW0uaGVpZ2h0ICk7IFxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDEgKSB7XG5cblx0XHR0aGlzLl93aWR0aCA9IE1hdGgubWluKCB0aGlzLl93aWR0aCwgYXJndW1lbnRzWyAwIF0gKTtcblx0XHR0aGlzLl9oZWlnaHQgPSBNYXRoLm1pbiggdGhpcy5faGVpZ2h0LCBhcmd1bWVudHNbIDAgXSApO1xuXHR9IGVsc2Uge1xuXG5cdFx0dGhpcy5fd2lkdGggPSBNYXRoLm1pbiggdGhpcy5fd2lkdGgsIGFyZ3VtZW50c1sgMCBdICk7XG5cdFx0dGhpcy5faGVpZ2h0ID0gTWF0aC5taW4oIHRoaXMuX2hlaWdodCwgYXJndW1lbnRzWyAxIF0gKTtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG5cdHRoaXMuX3dpZHRoID0gTWF0aC5taW4oIHRoaXMuX3dpZHRoLCBpdGVtLndpZHRoICk7XG5cdHRoaXMuX2hlaWdodCA9IE1hdGgubWluKCB0aGlzLl9oZWlnaHQsIGl0ZW0uaGVpZ2h0ICk7IFxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl93aWR0aCA9IE1hdGgubWluKCB0aGlzLl93aWR0aCwgdmFsdWUgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl93aWR0aCA9IE1hdGgubWluKCB0aGlzLl93aWR0aCwgaXRlbS53aWR0aCApOyBcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5faGVpZ2h0ID0gTWF0aC5tYXgoIHRoaXMuX2hlaWdodCwgdmFsdWUgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl9oZWlnaHQgPSBNYXRoLm1heCggdGhpcy5faGVpZ2h0LCBpdGVtLmhlaWdodCApOyBcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzLmxlbmd0aCA9PSAxICkge1xuXG5cdFx0dGhpcy5fd2lkdGggPSBNYXRoLm1heCggdGhpcy5fd2lkdGgsIGFyZ3VtZW50c1sgMCBdICk7XG5cdFx0dGhpcy5faGVpZ2h0ID0gTWF0aC5tYXgoIHRoaXMuX2hlaWdodCwgYXJndW1lbnRzWyAwIF0gKTtcblx0fSBlbHNlIHtcblxuXHRcdHRoaXMuX3dpZHRoID0gTWF0aC5tYXgoIHRoaXMuX3dpZHRoLCBhcmd1bWVudHNbIDAgXSApO1xuXHRcdHRoaXMuX2hlaWdodCA9IE1hdGgubWF4KCB0aGlzLl9oZWlnaHQsIGFyZ3VtZW50c1sgMSBdICk7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl93aWR0aCA9IE1hdGgubWF4KCB0aGlzLl93aWR0aCwgaXRlbS53aWR0aCApO1xuXHR0aGlzLl9oZWlnaHQgPSBNYXRoLm1heCggdGhpcy5faGVpZ2h0LCBpdGVtLmhlaWdodCApOyBcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5fd2lkdGggPSBNYXRoLm1heCggdGhpcy5fd2lkdGgsIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5fd2lkdGggPSBNYXRoLm1heCggdGhpcy5fd2lkdGgsIGl0ZW0ud2lkdGggKTsgXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feSArPSBpdGVtLnkgLSB0aGlzLl9oZWlnaHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feSArPSBpdGVtLnkgKyBpdGVtLmhlaWdodDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ICs9IGl0ZW0ueCAtIHRoaXMuX3dpZHRoO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggKz0gaXRlbS54ICsgaXRlbS53aWR0aDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ICs9IGl0ZW0ueDtcblx0dGhpcy5feSArPSBpdGVtLnk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feSArPSBpdGVtLnkgKyBpdGVtLmhlaWdodCAtIHRoaXMuX2hlaWdodDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ICs9IGl0ZW0ueCArICggaXRlbS53aWR0aCAtIHRoaXMuX3dpZHRoICkgKiAwLjU7XHRcblx0dGhpcy5feSArPSBpdGVtLnkgKyAoIGl0ZW0uaGVpZ2h0IC0gdGhpcy5faGVpZ2h0ICkgKiAwLjU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCArPSBpdGVtLnggKyAoIGl0ZW0ud2lkdGggLSB0aGlzLl93aWR0aCApICogMC41O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggKz0gaXRlbS54O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB4LCB5ICkge1xuXG5cdHRoaXMuX3ggKz0geDtcblx0dGhpcy5feSArPSB5O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHRoaXMuX3ggKz0gaXRlbS53aWR0aCAqIHBlcmNlbnRhZ2U7XG5cdHRoaXMuX3kgKz0gaXRlbS5oZWlnaHQgKiBwZXJjZW50YWdlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggKz0gaXRlbS54ICsgaXRlbS53aWR0aCAtIHRoaXMuX3dpZHRoO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3kgKz0gaXRlbS55O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3kgKz0gaXRlbS55ICsgKCBpdGVtLmhlaWdodCAtIHRoaXMuX2hlaWdodCApICogMC41O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB4ICkge1xuXG5cdHRoaXMuX3ggKz0geDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHR0aGlzLl94ICs9IGl0ZW0ud2lkdGggKiBwZXJjZW50YWdlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB5ICkge1xuXG5cdHRoaXMuX3kgKz0geTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHR0aGlzLl95ICs9IGl0ZW0uaGVpZ2h0ICogcGVyY2VudGFnZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaGVpZ2h0ICkge1xuXG5cdHRoaXMuX2hlaWdodCArPSBoZWlnaHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0dGhpcy5faGVpZ2h0ICs9IGl0ZW0uaGVpZ2h0ICogcGVyY2VudGFnZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggb3JpZ2luYWxXaWR0aCwgb3JpZ2luYWxIZWlnaHQgKSB7XG5cblx0dGhpcy5faGVpZ2h0ICs9IHRoaXMuX3dpZHRoIC8gb3JpZ2luYWxXaWR0aCAqIG9yaWdpbmFsSGVpZ2h0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX2hlaWdodCArPSBpdGVtLmhlaWdodDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl93aWR0aCArPSBpdGVtLndpZHRoO1xuXHR0aGlzLl9oZWlnaHQgKz0gaXRlbS5oZWlnaHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5fd2lkdGggKz0gaXRlbS53aWR0aDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggd2lkdGgsIGhlaWdodCApIHtcblxuXHRpZiggYXJndW1lbnRzLmxlbmd0aCA9PSAxICkge1xuXG5cdFx0dGhpcy5fd2lkdGggKz0gYXJndW1lbnRzWyAwIF07XG5cdFx0dGhpcy5faGVpZ2h0ICs9IGFyZ3VtZW50c1sgMCBdO1xuXHR9IGVsc2Uge1xuXG5cdFx0dGhpcy5fd2lkdGggKz0gYXJndW1lbnRzWyAwIF07XG5cdFx0dGhpcy5faGVpZ2h0ICs9IGFyZ3VtZW50c1sgMSBdO1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0dGhpcy5fd2lkdGggKz0gaXRlbS53aWR0aCAqIHBlcmNlbnRhZ2U7XHRcblx0dGhpcy5faGVpZ2h0ICs9IGl0ZW0uaGVpZ2h0ICogcGVyY2VudGFnZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggb3JpZ2luYWxXaWR0aCwgb3JpZ2luYWxIZWlnaHQgKSB7XG5cblx0aWYoIHRoaXMuX3dpZHRoID09IDAgKSB7XG5cblx0XHR0aGlzLl93aWR0aCArPSB0aGlzLl9oZWlnaHQgLyBvcmlnaW5hbEhlaWdodCAqIG9yaWdpbmFsV2lkdGg7XG5cdH0gZWxzZSBpZiggdGhpcy5faGVpZ2h0ID09IDAgKSB7XG5cblx0XHR0aGlzLl9oZWlnaHQgKz0gdGhpcy5fd2lkdGggLyBvcmlnaW5hbFdpZHRoICogb3JpZ2luYWxIZWlnaHQ7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggd2lkdGggKSB7XG5cblx0dGhpcy5fd2lkdGggKz0gd2lkdGg7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0dGhpcy5fd2lkdGggKz0gaXRlbS53aWR0aCAqIHBlcmNlbnRhZ2U7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIG9yaWdpbmFsV2lkdGgsIG9yaWdpbmFsSGVpZ2h0ICkge1xuXG5cdHRoaXMuX3dpZHRoICs9IHRoaXMuX2hlaWdodCAvIG9yaWdpbmFsSGVpZ2h0ICogb3JpZ2luYWxXaWR0aDtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX2hlaWdodCAtPSBpdGVtLmhlaWdodDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94IC09IGl0ZW0ueDtcblx0dGhpcy5feSAtPSBpdGVtLnk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5fd2lkdGggLT0gaXRlbS53aWR0aDtcblx0dGhpcy5faGVpZ2h0IC09IGl0ZW0uaGVpZ2h0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3dpZHRoIC09IGl0ZW0ud2lkdGg7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCAtPSBpdGVtLng7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feSAtPSBpdGVtLnk7XG59OyIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoNzEpIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSg1NCkiLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDcyKSIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoNzMpIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSg1OCkiLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDYyKSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX2hlaWdodCAtPSB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggeCwgeSApIHtcblxuXHR0aGlzLl94IC09IHg7XG5cdHRoaXMuX3kgLT0geTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggd2lkdGgsIGhlaWdodCApIHtcblxuXHR0aGlzLl93aWR0aCAtPSB3aWR0aDtcblx0dGhpcy5faGVpZ2h0IC09IGhlaWdodDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5fd2lkdGggLT0gdmFsdWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX3ggLT0gdmFsdWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX3kgLT0gdmFsdWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX2hlaWdodCArPSB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSg1OSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xuXG5cdHRoaXMuX3dpZHRoICs9IHdpZHRoO1xuXHR0aGlzLl9oZWlnaHQgKz0gaGVpZ2h0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl93aWR0aCArPSB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feCArPSB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feSArPSB2YWx1ZTtcbn07Il19
;