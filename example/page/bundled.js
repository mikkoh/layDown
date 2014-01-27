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

	console.log( 'MENU2 IS SMALLER', isSmaller );
}

function onMenu2GreaterThan600( isGreaterThan ) {

	console.log( 'MENU2 IS GREATER', isGreaterThan );
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
- src/layoutBoundSize/maxX (if your rule will be bounding x only)
- src/layoutBoundSize/maxY (if your rule will be bounding y only)
- src/layoutBoundSize/maxPositionFrom (if your rule will be bounding x and y based on another item)
- src/layoutBoundSize/maxXFrom (if your rule will be bounding x based on another item)
- src/layoutBoundSize/maxYFrom (if your rule will be bounding y based on another item)

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
maxX is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in a LayoutNode from which this node's maximum x value will be read from.

	node1.xIs( 200 );
	node2.xIs( 400 ).maxX( node1 );

When run node2's x value will be 200 and not 400 because it will be bound to node1's x value.

@method maxX
@param layoutNode {LayoutNode} The LayoutNode whose x value will be the maximum x value for this node
@chainable
**/
/**
maxX is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in an x value from which this node's maximum x value will be set.

	node2.xIs( 400 ).maxX( 200 );

When run node2's x value will be 200 and not 400 because it will be bound to the x value 200.

@method maxX
@param x {Number} The maximum x value for this LayoutNode
@chainable
**/
LayoutNode.prototype.maxX = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxXFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, maxX, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};





/**
maxY is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in a LayoutNode from which this node's maximum y value will be read from.

	node1.yIs( 200 );
	node2.yIs( 400 ).maxY( node1 );

When run node2's y value will be 200 and not 400 because it will be bound to node1's y value.

@method maxY
@param layoutNode {LayoutNode} The LayoutNode whose y value will be the maximum y value for this node
@chainable
**/
/**
maxY is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in an y value from which this node's maximum y value will be set.

	node2.yIs( 400 ).maxY( 200 );

When run node2's x value will be 200 and not 400 because it will be bound to the y value 200.

@method maxY
@param y {Number} The maximum y value for this LayoutNode
@chainable
**/
LayoutNode.prototype.maxY = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, maxYFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, maxY, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
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
minX is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in a LayoutNode from which this node's minimum x value will be read from.

	node1.xIs( 200 );
	node2.xIs( 100 ).minX( node1 );

When run node2's x value will be 200 and not 100 because it will be bound to node1's x value.

@method minX
@param layoutNode {LayoutNode} The LayoutNode whose x value will be the minimum x value for this node
@chainable
**/
/**
minX is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in an x value from which this node's minimum x value will be set.

	node2.xIs( 100 ).minX( 200 );

When run node2's x value will be 200 and not 100 because it will be bound to the x value 200.

@method minX
@param x {Number} The minimum x value for this LayoutNode
@chainable
**/
LayoutNode.prototype.minX = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minXFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, minX, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	}
};





/**
minY is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in a LayoutNode from which this node's minimum y value will be read from.

	node1.yIs( 200 );
	node2.yIs( 100 ).minY( node1 );

When run node2's y value will be 200 and not 100 because it will be bound to node1's y value.

@method minY
@param layoutNode {LayoutNode} The LayoutNode whose y value will be the minimum y value for this node
@chainable
**/
/**
minY is a bounding function.

There are two possible ways to use this function. All are noted in this documentation.

You can pass in an y value from which this node's minimum y value will be set.

	node2.yIs( 100 ).minY( 200 );

When run node2's y value will be 200 and not 100 because it will be bound to the y value 200.

@method minY
@param y {Number} The minimum y value for this LayoutNode
@chainable
**/
LayoutNode.prototype.minY = function() {

	if( arguments[ 0 ] instanceof LayoutNode ) {

		return addRule.call( this, minYFrom, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
	} else {

		return addRule.call( this, minY, arguments, this.rulesPosBound, this.rulesPosBoundProp, BOUND_POSITION );
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
- {{#crossLink "LayoutNode/maxY:method"}}{{/crossLink}}

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
- {{#crossLink "LayoutNode/minY:method"}}{{/crossLink}}

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




module.exports = LayoutNode;
},{"./conditionals/bottomGreaterThan":4,"./conditionals/bottomLessThan":5,"./conditionals/heightGreaterThan":6,"./conditionals/heightLessThan":7,"./conditionals/leftGreaterThan":8,"./conditionals/leftLessThan":9,"./conditionals/rightGreaterThan":10,"./conditionals/rightLessThan":11,"./conditionals/topGreaterThan":12,"./conditionals/topLessThan":13,"./conditionals/widthGreaterThan":14,"./conditionals/widthLessThan":15,"./layoutBoundPosition/maxPosition":16,"./layoutBoundPosition/maxPositionFrom":17,"./layoutBoundPosition/maxX":18,"./layoutBoundPosition/maxXFrom":19,"./layoutBoundPosition/maxY":20,"./layoutBoundPosition/maxYFrom":21,"./layoutBoundPosition/minPosition":22,"./layoutBoundPosition/minPositionFrom":23,"./layoutBoundPosition/minX":24,"./layoutBoundPosition/minXFrom":25,"./layoutBoundPosition/minY":26,"./layoutBoundPosition/minYFrom":27,"./layoutBoundSize/maxHeight":28,"./layoutBoundSize/maxHeightFrom":29,"./layoutBoundSize/maxSize":30,"./layoutBoundSize/maxSizeFrom":31,"./layoutBoundSize/maxWidth":32,"./layoutBoundSize/maxWidthFrom":33,"./layoutBoundSize/minHeight":34,"./layoutBoundSize/minHeightFrom":35,"./layoutBoundSize/minSize":36,"./layoutBoundSize/minSizeFrom":37,"./layoutBoundSize/minWidth":38,"./layoutBoundSize/minWidthFrom":39,"./layoutPosition/alignedAbove":40,"./layoutPosition/alignedBelow":41,"./layoutPosition/alignedLeftOf":42,"./layoutPosition/alignedRightOf":43,"./layoutPosition/alignedWith":44,"./layoutPosition/bottomAlignedWith":45,"./layoutPosition/centeredWith":46,"./layoutPosition/horizontallyCenteredWith":47,"./layoutPosition/leftAlignedWith":48,"./layoutPosition/positionIs":49,"./layoutPosition/positionIsAPercentageOf":50,"./layoutPosition/rightAlignedWith":51,"./layoutPosition/topAlignedWith":52,"./layoutPosition/verticallyCenteredWith":53,"./layoutPosition/xIs":54,"./layoutPosition/xIsAPercentageOf":55,"./layoutPosition/yIs":56,"./layoutPosition/yIsAPercentageOf":57,"./layoutSize/heightIs":58,"./layoutSize/heightIsAPercentageOf":59,"./layoutSize/heightIsProportional":60,"./layoutSize/matchesHeightOf":61,"./layoutSize/matchesSizeOf":62,"./layoutSize/matchesWidthOf":63,"./layoutSize/sizeIs":64,"./layoutSize/sizeIsAPercentageOf":65,"./layoutSize/sizeIsProportional":66,"./layoutSize/widthIs":67,"./layoutSize/widthIsAPercentageOf":68,"./layoutSize/widthIsProportional":69,"./offsets/minusHeight":70,"./offsets/minusPosition":71,"./offsets/minusSize":72,"./offsets/minusWidth":73,"./offsets/minusX":74,"./offsets/minusY":75,"./offsets/plusHeight":76,"./offsets/plusPosition":77,"./offsets/plusSize":78,"./offsets/plusWidth":79,"./offsets/plusX":80,"./offsets/plusY":81,"./offsets/vMinusHeight":82,"./offsets/vMinusPosition":83,"./offsets/vMinusSize":84,"./offsets/vMinusWidth":85,"./offsets/vMinusX":86,"./offsets/vMinusY":87,"./offsets/vPlusHeight":88,"./offsets/vPlusPosition":89,"./offsets/vPlusSize":90,"./offsets/vPlusWidth":91,"./offsets/vPlusX":92,"./offsets/vPlusY":93}],4:[function(require,module,exports){
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
module.exports = function( value ) {

	return this.x > value;
};
},{}],9:[function(require,module,exports){
module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.x < value;	
	} else {

		return this.x < value.x;
	}
};
},{}],10:[function(require,module,exports){
module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.x + this.width > value;
	} else {

		return this.x + this.width > value.x + value.width;
	}
};
},{}],11:[function(require,module,exports){
module.exports = function( value ) {

	return this.x + this.width < value;
};
},{}],12:[function(require,module,exports){
module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.y > value;	
	} else {

		return this.y > value.y;
	}
};
},{}],13:[function(require,module,exports){
module.exports = function( value ) {

	if( typeof value == 'number' ) {

		return this.y < value;	
	} else {

		return this.y < value.y;
	}
};
},{}],14:[function(require,module,exports){
module.exports = function( value ) {

	return this.width > value;
};
},{}],15:[function(require,module,exports){
module.exports = function( value ) {

	return this.width < value;
};
},{}],16:[function(require,module,exports){
module.exports = function() {

	if( arguments.length == 1 ) {

		this._x = Math.min( this._x, arguments[ 0 ] );
		this._y = Math.min( this._y, arguments[ 0 ] );
	} else {

		this._x = Math.min( this._x, arguments[ 0 ] );
		this._y = Math.min( this._y, arguments[ 1 ] );
	}
};
},{}],17:[function(require,module,exports){
module.exports = function( item ) {

	this._x = Math.min( this._x, item.x );
	this._y = Math.min( this._y, item.y );
};
},{}],18:[function(require,module,exports){
module.exports = function( value ) {

	this._x = Math.min( this._x, value );
};
},{}],19:[function(require,module,exports){
module.exports = function( item ) {

	this._x = Math.min( this._x, item.x );
};
},{}],20:[function(require,module,exports){
module.exports = function( value ) {

	this._y = Math.min( this._y, value );
}
},{}],21:[function(require,module,exports){
module.exports = function( item ) {

	this._y = Math.min( this._y, item.y );
}
},{}],22:[function(require,module,exports){
module.exports = function() {

	if( arguments.length == 1 ) {

		this._x = Math.max( this._x, arguments[ 0 ] );
		this._y = Math.max( this._y, arguments[ 0 ] );
	} else {

		this._x = Math.max( this._x, arguments[ 0 ] );
		this._y = Math.max( this._y, arguments[ 1 ] );
	}
};
},{}],23:[function(require,module,exports){
module.exports = function( item ) {

	this._x = Math.max( this._x, item.x );
	this._y = Math.max( this._y, item.y );
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
module.exports = function( value ) {

	this._y = Math.max( this._y, value );
};
},{}],27:[function(require,module,exports){
module.exports = function( item ) {

	this._y = Math.max( this._y, item.y );
};
},{}],28:[function(require,module,exports){
module.exports = function( value ) {

	this._height = Math.min( this._height, value );
};
},{}],29:[function(require,module,exports){
exports.module = function( item ) {

	this._height = Math.min( this._height, item.height ); 
};
},{}],30:[function(require,module,exports){
module.exports = function() {

	if( arguments.length == 1 ) {

		this._width = Math.min( this._width, arguments[ 0 ] );
		this._height = Math.min( this._height, arguments[ 0 ] );
	} else {

		this._width = Math.min( this._width, arguments[ 0 ] );
		this._height = Math.min( this._height, arguments[ 1 ] );
	}
};
},{}],31:[function(require,module,exports){
module.exports = function() {

	this._width = Math.min( this._width, item.width );
	this._height = Math.min( this._height, item.height ); 
};
},{}],32:[function(require,module,exports){
module.exports = function( value ) {

	this._width = Math.min( this._width, value );
};
},{}],33:[function(require,module,exports){
module.exports = function( item ) {

	this._width = Math.min( this._width, item.width ); 
};
},{}],34:[function(require,module,exports){
module.exports = function( value ) {

	this._height = Math.max( this._height, value );
};
},{}],35:[function(require,module,exports){
module.exports = function( item ) {

	this._height = Math.max( this._height, item.height ); 
};
},{}],36:[function(require,module,exports){
module.exports = function() {

	if( arguments.length == 1 ) {

		this._width = Math.max( this._width, arguments[ 0 ] );
		this._height = Math.max( this._height, arguments[ 0 ] );
	} else {

		this._width = Math.max( this._width, arguments[ 0 ] );
		this._height = Math.max( this._height, arguments[ 1 ] );
	}
};
},{}],37:[function(require,module,exports){
module.exports = function( item ) {

	this._width = Math.max( this._width, item.width );
	this._height = Math.max( this._height, item.height ); 
};
},{}],38:[function(require,module,exports){
module.exports = function( value ) {

	this._width = Math.max( this._width, value );
};
},{}],39:[function(require,module,exports){
module.exports = function( item ) {

	this._width = Math.max( this._width, item.width ); 
};
},{}],40:[function(require,module,exports){
module.exports = function( item ) {

	this._y += item.y - this._height;
};
},{}],41:[function(require,module,exports){
module.exports = function( item ) {

	this._y += item.y + item.height;
};
},{}],42:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x - this._width;
};
},{}],43:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x + item.width;
};
},{}],44:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x;
	this._y += item.y;
};
},{}],45:[function(require,module,exports){
module.exports = function( item ) {

	this._y += item.y + item.height - this._height;
};
},{}],46:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x + ( item.width - this._width ) * 0.5;	
	this._y += item.y + ( item.height - this._height ) * 0.5;
};
},{}],47:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x + ( item.width - this._width ) * 0.5;
};
},{}],48:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x;
};
},{}],49:[function(require,module,exports){
module.exports = function( x, y ) {

	this._x += x;
	this._y += y;
};
},{}],50:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._x += item.width * percentage;
	this._y += item.height * percentage;
};
},{}],51:[function(require,module,exports){
module.exports = function( item ) {

	this._x += item.x + item.width - this._width;
};
},{}],52:[function(require,module,exports){
module.exports = function( item ) {

	this._y += item.y;
};
},{}],53:[function(require,module,exports){
module.exports = function( item ) {

	this._y += item.y + ( item.height - this._height ) * 0.5;
};
},{}],54:[function(require,module,exports){
module.exports = function( x ) {

	this._x += x;
};
},{}],55:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._x += item.width * percentage;
};
},{}],56:[function(require,module,exports){
module.exports = function( y ) {

	this._y += y;
};
},{}],57:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._y += item.height * percentage;
};
},{}],58:[function(require,module,exports){
module.exports = function( height ) {

	this._height += height;
};
},{}],59:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._height += item.height * percentage;
};
},{}],60:[function(require,module,exports){
module.exports = function( originalWidth, originalHeight ) {

	this._height += this._width / originalWidth * originalHeight;
};
},{}],61:[function(require,module,exports){
module.exports = function( item ) {

	this._height += item.height;
};
},{}],62:[function(require,module,exports){
module.exports = function( item ) {

	this._width += item.width;
	this._height += item.height;
};
},{}],63:[function(require,module,exports){
module.exports = function( item ) {

	this._width += item.width;
};
},{}],64:[function(require,module,exports){
module.exports = function( width, height ) {

	if( arguments.length == 1 ) {

		this._width += arguments[ 0 ];
		this._height += arguments[ 0 ];
	} else {

		this._width += arguments[ 0 ];
		this._height += arguments[ 1 ];
	}
};
},{}],65:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._width += item.width * percentage;	
	this._height += item.height * percentage;
};
},{}],66:[function(require,module,exports){
module.exports = function( originalWidth, originalHeight ) {

	if( this._width == 0 ) {

		this._width += this._height / originalHeight * originalWidth;
	} else if( this._height == 0 ) {

		this._height += this._width / originalWidth * originalHeight;
	}
};
},{}],67:[function(require,module,exports){
module.exports = function( width ) {

	this._width += width;
};
},{}],68:[function(require,module,exports){
module.exports = function( item, percentage ) {

	this._width += item.width * percentage;
};
},{}],69:[function(require,module,exports){
module.exports = function( originalWidth, originalHeight ) {

	this._width += this._height / originalHeight * originalWidth;
}
},{}],70:[function(require,module,exports){
module.exports = function( item ) {

	this._height -= item.height;
};
},{}],71:[function(require,module,exports){
module.exports = function( item ) {

	this._x -= item.x;
	this._y -= item.y;
};
},{}],72:[function(require,module,exports){
module.exports = function( item ) {

	this._width -= item.width;
	this._height -= item.height;
};
},{}],73:[function(require,module,exports){
module.exports = function( item ) {

	this._width -= item.width;
};
},{}],74:[function(require,module,exports){
module.exports = function( item ) {

	this._x -= item.x;
};
},{}],75:[function(require,module,exports){
module.exports = function( item ) {

	this._y -= item.y;
};
},{}],76:[function(require,module,exports){
module.exports=require(61)
},{}],77:[function(require,module,exports){
module.exports=require(44)
},{}],78:[function(require,module,exports){
module.exports=require(62)
},{}],79:[function(require,module,exports){
module.exports=require(63)
},{}],80:[function(require,module,exports){
module.exports=require(48)
},{}],81:[function(require,module,exports){
module.exports=require(52)
},{}],82:[function(require,module,exports){
module.exports = function( value ) {

	this._height -= value;
};
},{}],83:[function(require,module,exports){
module.exports = function( x, y ) {

	this._x -= x;
	this._y -= y;
};
},{}],84:[function(require,module,exports){
module.exports = function( width, height ) {

	this._width -= width;
	this._height -= height;
};
},{}],85:[function(require,module,exports){
module.exports = function( value ) {

	this._width -= value;
};
},{}],86:[function(require,module,exports){
module.exports = function( value ) {

	this._x -= value;
};
},{}],87:[function(require,module,exports){
module.exports = function( value ) {

	this._y -= value;
};
},{}],88:[function(require,module,exports){
module.exports = function( value ) {

	this._height += value;
};
},{}],89:[function(require,module,exports){
module.exports=require(49)
},{}],90:[function(require,module,exports){
module.exports = function( width, height ) {

	this._width += width;
	this._height += height;
};
},{}],91:[function(require,module,exports){
module.exports = function( value ) {

	this._width += value;
};
},{}],92:[function(require,module,exports){
module.exports = function( value ) {

	this._x += value;
};
},{}],93:[function(require,module,exports){
module.exports = function( value ) {

	this._y += value;
};
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vZXhhbXBsZS9wYWdlL21haW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL0xheURvd24uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL0xheW91dE5vZGUuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2NvbmRpdGlvbmFscy9ib3R0b21HcmVhdGVyVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL2JvdHRvbUxlc3NUaGFuLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvaGVpZ2h0R3JlYXRlclRoYW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2NvbmRpdGlvbmFscy9oZWlnaHRMZXNzVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL2xlZnRHcmVhdGVyVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL2xlZnRMZXNzVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL3JpZ2h0R3JlYXRlclRoYW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2NvbmRpdGlvbmFscy9yaWdodExlc3NUaGFuLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9jb25kaXRpb25hbHMvdG9wR3JlYXRlclRoYW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2NvbmRpdGlvbmFscy90b3BMZXNzVGhhbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvY29uZGl0aW9uYWxzL3dpZHRoR3JlYXRlclRoYW4uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2NvbmRpdGlvbmFscy93aWR0aExlc3NUaGFuLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFBvc2l0aW9uLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFBvc2l0aW9uRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi9tYXhYLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFhGcm9tLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFkuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vbWF4WUZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vbWluUG9zaXRpb24uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vbWluUG9zaXRpb25Gcm9tLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFBvc2l0aW9uL21pblguanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vbWluWEZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kUG9zaXRpb24vbWluWS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5ZRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21heEhlaWdodC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21heEhlaWdodEZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9tYXhTaXplLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFNpemUvbWF4U2l6ZUZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9tYXhXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21heFdpZHRoRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21pbkhlaWdodC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21pbkhlaWdodEZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9taW5TaXplLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRCb3VuZFNpemUvbWluU2l6ZUZyb20uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dEJvdW5kU2l6ZS9taW5XaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0Qm91bmRTaXplL21pbldpZHRoRnJvbS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vYWxpZ25lZEFib3ZlLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9hbGlnbmVkQmVsb3cuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL2FsaWduZWRMZWZ0T2YuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL2FsaWduZWRSaWdodE9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9hbGlnbmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vYm90dG9tQWxpZ25lZFdpdGguanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL2NlbnRlcmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vaG9yaXpvbnRhbGx5Q2VudGVyZWRXaXRoLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9sZWZ0QWxpZ25lZFdpdGguanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL3Bvc2l0aW9uSXMuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL3Bvc2l0aW9uSXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi9yaWdodEFsaWduZWRXaXRoLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi90b3BBbGlnbmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24vdmVydGljYWxseUNlbnRlcmVkV2l0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0UG9zaXRpb24veElzLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi94SXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRQb3NpdGlvbi95SXMuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFBvc2l0aW9uL3lJc0FQZXJjZW50YWdlT2YuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFNpemUvaGVpZ2h0SXMuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL2xheW91dFNpemUvaGVpZ2h0SXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL2hlaWdodElzUHJvcG9ydGlvbmFsLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL21hdGNoZXNIZWlnaHRPZi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0U2l6ZS9tYXRjaGVzU2l6ZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL21hdGNoZXNXaWR0aE9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3NpemVJcy5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0U2l6ZS9zaXplSXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3NpemVJc1Byb3BvcnRpb25hbC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvbGF5b3V0U2l6ZS93aWR0aElzLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3dpZHRoSXNBUGVyY2VudGFnZU9mLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9sYXlvdXRTaXplL3dpZHRoSXNQcm9wb3J0aW9uYWwuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNQb3NpdGlvbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9taW51c1NpemUuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9taW51c1guanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvbWludXNZLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3BsdXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvcGx1c1Bvc2l0aW9uLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3BsdXNTaXplLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3BsdXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9wbHVzWC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy9wbHVzWS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92TWludXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdk1pbnVzUG9zaXRpb24uanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdk1pbnVzU2l6ZS5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92TWludXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92TWludXNYLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9vZmZzZXRzL3ZNaW51c1kuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNIZWlnaHQuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNQb3NpdGlvbi5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92UGx1c1NpemUuanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNXaWR0aC5qcyIsIi9Vc2Vycy9taWtrb2hhYXBvamEvRG9jdW1lbnRzL1dvcmsvbGF5RG93bi9zcmMvb2Zmc2V0cy92UGx1c1guanMiLCIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vc3JjL29mZnNldHMvdlBsdXNZLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6aUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTGF5RG93biA9IHJlcXVpcmUoICcuLi8uLi9zcmMvTGF5RG93bicgKTtcblxuY29uc29sZS5sb2coICdIRVkgVEhFUkUgU1VOU0hJTkUnICk7XG5cbmZ1bmN0aW9uIGxheW91dEZ1bmN0aW9uKCBpdGVtLCBub2RlLCBzZXRXaWR0aCwgc2V0SGVpZ2h0ICkgeyBcblxuXHRpdGVtLnN0eWxlLmxlZnQgPSBNYXRoLmZsb29yKCBub2RlLnggKSArICdweCc7XG5cdGl0ZW0uc3R5bGUudG9wID0gTWF0aC5mbG9vciggbm9kZS55ICkgKyAncHgnO1xuXG5cdGlmKCBzZXRXaWR0aCApIHtcblxuXHRcdGl0ZW0uc3R5bGUud2lkdGggPSBNYXRoLmZsb29yKCBub2RlLndpZHRoICkgKyAncHgnO1xuXHR9XG5cblx0aWYoIHNldEhlaWdodCApIHtcblxuXHRcdGl0ZW0uc3R5bGUuaGVpZ2h0ID0gTWF0aC5mbG9vciggbm9kZS5oZWlnaHQgKSArICdweCc7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVhZEZ1bmN0aW9uKCBpdGVtLCBuYW1lICkge1xuXG5cdGlmKCBuYW1lID09ICd3aWR0aCcgKSB7XG5cblx0XHRyZXR1cm4gaXRlbS5jbGllbnRXaWR0aDtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBpdGVtLmNsaWVudEhlaWdodDtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVGdW5jdGlvbiggaXRlbSApIHtcblxuXHRpdGVtLnN0eWxlWyAnYm94LXNpemluZycgXSA9ICdib3JkZXItYm94Jztcblx0aXRlbS5zdHlsZVsgJy1tb3otYm94LXNpemluZycgXSA9ICdib3JkZXItYm94Jztcblx0aXRlbS5zdHlsZVsgJy13ZWJraXQtYm94LXNpemluZycgXSA9ICdib3JkZXItYm94JztcblxuXHRpdGVtLnN0eWxlWyAncG9zaXRpb24nIF0gPSAnYWJzb2x1dGUnO1xufVxuXG5cblxuXG52YXIgbGF5b3V0ID0gbmV3IExheURvd24oIGxheW91dEZ1bmN0aW9uLCByZWFkRnVuY3Rpb24sIGNyZWF0ZUZ1bmN0aW9uICk7XG5cbnZhciBsb2dvID0gbGF5b3V0LmNyZWF0ZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdsb2dvJyApICk7XG5cbnZhciBtZW51ID0gbGF5b3V0LmNyZWF0ZSgpO1xudmFyIG1lbnUxID0gbGF5b3V0LmNyZWF0ZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdtZW51MScgKSApO1xudmFyIG1lbnUyID0gbGF5b3V0LmNyZWF0ZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdtZW51MicgKSApO1xudmFyIG1lbnUzID0gbGF5b3V0LmNyZWF0ZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdtZW51MycgKSApO1xudmFyIGltYWdlQ29udGFpbmVyID0gbGF5b3V0LmNyZWF0ZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdpbWFnZUNvbnRhaW5lcicgKSApO1xudmFyIGNvbnRlbnQxID0gbGF5b3V0LmNyZWF0ZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdjb250ZW50MScgKSApO1xudmFyIGNvbnRlbnQyID0gbGF5b3V0LmNyZWF0ZSggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdjb250ZW50MicgKSApO1xuXG5sb2dvLm5hbWUgPSAnbG9nbyc7XG5tZW51Lm5hbWUgPSAnbWVudSc7XG5tZW51MS5uYW1lID0gJ21lbnUxJztcbm1lbnUyLm5hbWUgPSAnbWVudTInO1xubWVudTMubmFtZSA9ICdtZW51Myc7XG5jb250ZW50MS5uYW1lID0gJ2NvbnRlbnQxJztcbmNvbnRlbnQyLm5hbWUgPSAnY29udGVudDInO1xuaW1hZ2VDb250YWluZXIubmFtZT0gJ2ltYWdlQ29udGFpbmVyJztcbmltYWdlQ29udGFpbmVyLmlubmVyLm5hbWUgPSAnaW1hZ2VDb250YWluZXJJbm5lcic7XG5cbmxvZ28uaG9yaXpvbnRhbGx5Q2VudGVyZWRXaXRoKCBsYXlvdXQgKS50b3BBbGlnbmVkV2l0aCggbGF5b3V0IClcbi53aGVuKCBsYXlvdXQgKS5oZWlnaHRMZXNzVGhhbiggMzQyICkubWF0Y2hlc0hlaWdodE9mKCBsYXlvdXQgKS5taW51cyggNjAgKS53aWR0aElzUHJvcG9ydGlvbmFsKCAyMDAsIDI4MiApXG4uZGVmYXVsdCgpLnNpemVJcyggMjAwLCAyODIgKTtcblxubWVudS5tYXRjaGVzV2lkdGhPZiggbGF5b3V0ICkuaG9yaXpvbnRhbGx5Q2VudGVyZWRXaXRoKCBsYXlvdXQgKS5hbGlnbmVkQmVsb3coIGxvZ28gKS5wbHVzKCAyMCApO1xuXG5tZW51MS5hbGlnbmVkV2l0aCggbWVudSApXG4ud2hlbiggbWVudSApLndpZHRoTGVzc1RoYW4oIDYwMCApLm1hdGNoZXNXaWR0aE9mKCBtZW51IClcbi5kZWZhdWx0KCkud2lkdGhJc0FQZXJjZW50YWdlT2YoIG1lbnUsIDAuMzMzMzMgKS5taW51cyggMSApO1xuXG5tZW51Mi5tYXRjaGVzU2l6ZU9mKCBtZW51MSApXG4ud2hlbiggbWVudSApLndpZHRoTGVzc1RoYW4oIDYwMCApLmFsaWduZWRCZWxvdyggbWVudTEgKS5wbHVzKCAzICkubGVmdEFsaWduZWRXaXRoKCBtZW51MSApLm9uKCBvbk1lbnUyU21hbGxlclRoYW42MDAgKVxuLmRlZmF1bHQoKS50b3BBbGlnbmVkV2l0aCggbWVudSApLmFsaWduZWRSaWdodE9mKCBtZW51MSApLnBsdXMoIDMgKS5vbiggb25NZW51MkdyZWF0ZXJUaGFuNjAwICk7XG5cbm1lbnUzLm1hdGNoZXNTaXplT2YoIG1lbnUxIClcbi53aGVuKCBtZW51ICkud2lkdGhMZXNzVGhhbiggNjAwICkuYWxpZ25lZEJlbG93KCBtZW51MiApLnBsdXMoIDMgKS5sZWZ0QWxpZ25lZFdpdGgoIG1lbnUxIClcbi5kZWZhdWx0KCkudG9wQWxpZ25lZFdpdGgoIG1lbnUgKS5hbGlnbmVkUmlnaHRPZiggbWVudTIgKS5wbHVzKCAzICk7XG5cbmltYWdlQ29udGFpbmVyLm1hdGNoZXNXaWR0aE9mKCBtZW51ICkuaGVpZ2h0SXNQcm9wb3J0aW9uYWwoIDI3MDAsIDY1MiApLmFsaWduZWRCZWxvdyggbWVudTMgKS5wbHVzKCAzICk7XG5cbmNvbnRlbnQxLm1hdGNoZXNXaWR0aE9mKCBpbWFnZUNvbnRhaW5lci5pbm5lciApLm1pbiggOTAwICkuaGVpZ2h0SXNQcm9wb3J0aW9uYWwoIDI3MDAsIDY1MiApLmNlbnRlcmVkV2l0aCggaW1hZ2VDb250YWluZXIuaW5uZXIgKTtcblxuY29udGVudDIubWF0Y2hlc1dpZHRoT2YoIG1lbnUgKS5oZWlnaHRJcyggMjAwICkuYWxpZ25lZEJlbG93KCBpbWFnZUNvbnRhaW5lciApLnBsdXMoIDMgKTtcblxuXG5cbm9uUmVzaXplKCk7XG53aW5kb3cub25yZXNpemUgPSBvblJlc2l6ZTtcblxuZnVuY3Rpb24gb25SZXNpemUoKSB7XG5cblx0bGF5b3V0LnJlc2l6ZUFuZFBvc2l0aW9uKCAwLCAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XG59XG5cbmZ1bmN0aW9uIG9uTWVudTJTbWFsbGVyVGhhbjYwMCggaXNTbWFsbGVyICkge1xuXG5cdGNvbnNvbGUubG9nKCAnTUVOVTIgSVMgU01BTExFUicsIGlzU21hbGxlciApO1xufVxuXG5mdW5jdGlvbiBvbk1lbnUyR3JlYXRlclRoYW42MDAoIGlzR3JlYXRlclRoYW4gKSB7XG5cblx0Y29uc29sZS5sb2coICdNRU5VMiBJUyBHUkVBVEVSJywgaXNHcmVhdGVyVGhhbiApO1xufSIsInZhciBMYXlvdXROb2RlID0gcmVxdWlyZSggJy4vTGF5b3V0Tm9kZScgKTtcblxuLyoqXG5MYXlEb3duIGlzIHRoZSByb290IG9mIHRoZSBsYXlEb3duIGxpYnJhcnkuIEl0IGlzIGEgZmFjdG9yeSB0byBjcmVhdGUge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZVwifX17ey9jcm9zc0xpbmt9fSdzLlxuXG5BbiBpbnN0YW5jZSBvZiBMYXlEb3duIGlzIGVxdWl2YWxlbnQgdG8gc2F5aW5nIFwiYSBsYXlvdXRcIi4gU28gYSBMYXlEb3duIGlzIGEgbGF5b3V0IHRoYXQgeW91IGxheSBkb3duIGl0ZW1zIG9uLlxuXG5XaGVuIHlvdSBpbnN0YW50aWF0ZSBhIExheURvd24geW91IG11c3QgcGFzcyBpbiB0d28gZnVuY3Rpb25zLiBcblxuVGhlIGZpcnN0IG9uZSBpcyBhIGxheW91dCBmdW5jdGlvbiB3aGljaCB3aWxsIHBvc2l0aW9uIHRoaW5ncy4gXG5cbkFuIGV4YW1wbGUgbGF5b3V0IGZ1bmN0aW9uOlxuXG5cdGZ1bmN0aW9uIGxheW91dEZ1bmN0aW9uKCBpdGVtLCBub2RlLCBzZXRXaWR0aCwgc2V0SGVpZ2h0ICkgeyBcblxuXHRcdGl0ZW0uc3R5bGUubGVmdCA9IE1hdGguZmxvb3IoIG5vZGUueCApICsgJ3B4Jztcblx0XHRpdGVtLnN0eWxlLnRvcCA9IE1hdGguZmxvb3IoIG5vZGUueSApICsgJ3B4JztcblxuXHRcdGlmKCBzZXRXaWR0aCApIHtcblxuXHRcdFx0aXRlbS5zdHlsZS53aWR0aCA9IE1hdGguZmxvb3IoIG5vZGUud2lkdGggKSArICdweCc7XG5cdFx0fVxuXG5cdFx0aWYoIHNldEhlaWdodCApIHtcblxuXHRcdFx0aXRlbS5zdHlsZS5oZWlnaHQgPSBNYXRoLmZsb29yKCBub2RlLmhlaWdodCApICsgJ3B4Jztcblx0XHR9XG5cdH1cblxuXG5UaGUgc2Vjb25kIGlzIGEgcmVhZCBmdW5jdGlvbiB3aGljaCB3aWxsIHJlYWQgaW4gdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgYW4gaXRlbSBpZiBubyBydWxlcyBlZmZlY3RlZCB0aG9zZSBwcm9wZXJ0aWVzLiBcblxuSGVyZSBpcyBhbiBleGFtcGxlIHJlYWRGdW5jdGlvbjpcblxuXHRmdW5jdGlvbiByZWFkRnVuY3Rpb24oIGl0ZW0sIG5hbWUgKSB7XG5cblx0XHRpZiggbmFtZSA9PSAnd2lkdGgnICkge1xuXG5cdFx0XHRyZXR1cm4gaXRlbS5jbGllbnRXaWR0aDtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRyZXR1cm4gaXRlbS5jbGllbnRIZWlnaHQ7XG5cdFx0fVxuXHR9XG5cblRoZSB0aGlyZCBmdW5jdGlvbiB0aGF0IHlvdSBtYXkgcGFzcyBpbiBpcyBhIGNyZWF0ZSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIHJ1biBvbiBlYWNoIGl0ZW0gYmVmb3JlIGEgTGF5b3V0Tm9kZSBpcyBjcmVhdGVkLlxuXG5IZXJlIGlzIGFuIGV4YW1wbGUgY3JlYXRlRnVuY3Rpb246XG5cblx0ZnVuY3Rpb24gY3JlYXRlRnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0XHRpdGVtLnN0eWxlWyAnYm94LXNpemluZycgXSA9ICdib3JkZXItYm94Jztcblx0XHRpdGVtLnN0eWxlWyAnLW1vei1ib3gtc2l6aW5nJyBdID0gJ2JvcmRlci1ib3gnO1xuXHRcdGl0ZW0uc3R5bGVbICctd2Via2l0LWJveC1zaXppbmcnIF0gPSAnYm9yZGVyLWJveCc7XG5cblx0XHRpdGVtLnN0eWxlWyAncG9zaXRpb24nIF0gPSAnYWJzb2x1dGUnO1xuXHR9XG5cblxuXG5AY2xhc3MgTGF5RG93blxuQGNvbnN0cnVjdG9yXG5cbkBwYXJhbSBsYXlvdXRGdW5jdGlvbiB7RnVuY3Rpb259IFRoZSBsYXlvdXRGdW5jdGlvbiBmdW5jdGlvbiBpcyBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgdHJhbnNsYXRlIHRoZSB4LCB5LCB3aWR0aCwgYW5kIGhlaWdodCBwcm9wZXJ0aWVzIG9mIGFcbkxheW91dE5vZGUgaW50byBhY3R1YWwgcGh5c2ljYWwgc2NyZWVuIHBvc2l0aW9uLiAoc2VlIHRoZSBhYm92ZSBleGFtcGxlKVxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgd2UncmUgd29ya2luZyB3aXRoIHRoZSBET00gaXQgd291bGQgc2V0IENTUyBwcm9wZXJ0aWVzIG9uIHRoZSBcIml0ZW1cIiBwYXNzZWQgaW4gdG8gZW5zdXJlIHRoYXQgdGhlIGl0ZW0gaXMgb24gXG5zY3JlZW4gYXQgeCwgeSBhdCB0aGUgY29ycmVjdCBzaXplLiAoc2VlIHRoZSBhYm92ZSBleGFtcGxlKVxuXG5AcGFyYW0gcmVhZEZ1bmN0aW9uIHtmdW5jdGlvbn0gSWYgeW91IGRlZmluZSBubyBzaXppbmcgcnVsZXMgdG8gc2V0IHdpZHRoIGFuZCBoZWlnaHQgb2YgYW4gXCJpdGVtXCIvTGF5b3V0Tm9kZSB0aGVuIHdlIHdpbGwgbmVlZCB0byByZWFkIHRoZVxud2lkdGggYW5kIGhlaWdodCBvZiB0aGUgb2JqZWN0IHRvIGJlIGFibGUgdG8gcG9zaXRpb24gZGVwZW5kZW50IExheW91dE5vZGUncy5cblxuQHBhcmFtIGNyZWF0ZUZ1bmN0aW9uIHtmdW5jdGlvbn0gSXMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgcnVuIG9uIGV2ZXJ5IGV2ZXJ5IGl0ZW0gdG8gYmUgbGF5ZWQgb3V0IGJlZm9yZSBhIExheW91dE5vZGUgaXMgY3JlYXRlZC5cblxuTGV0J3Mgc2F5IHlvdSdyZSB3b3JraW5nIHdpdGggdGhlIERPTSB5b3UgbWF5IHdhbnQgdG8gZm9yIGluc3RhbmNlIHNldCB0aGUgQ1NTIHBvc2l0aW9uIHByb3BlcnR5IHRvIGJlIGFic29sdXRlIHdpdGhpbiB0aGlzIGZ1bmN0aW9uLiAoc2VlIHRoZSBhYm92ZSBleGFtcGxlKVxuXG4qKi9cbnZhciBMYXlEb3duID0gZnVuY3Rpb24oIGxheW91dEZ1bmN0aW9uLCByZWFkRnVuY3Rpb24sIGNyZWF0ZUZ1bmN0aW9uICkge1xuXG5cdHRoaXMubGF5b3V0RnVuY3Rpb24gPSBsYXlvdXRGdW5jdGlvbjtcblx0dGhpcy5yZWFkRnVuY3Rpb24gPSByZWFkRnVuY3Rpb247XG5cdHRoaXMuY3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbiB8fCBudWxsO1xuXHR0aGlzLm5vZGVzID0gW107XG59O1xuXG4vKipcblRoaXMgaXMgdGhlIHggcG9zaXRpb24gb2YgdGhlIExheURvd24gb24gc2NyZWVuLiBJbml0aWFsbHkgdGhlIHZhbHVlIG9mIHggd2lsbCBiZSAwIHVudGlsIFxue3sjY3Jvc3NMaW5rIFwiTGF5RG93bi9yZXNpemVBbmRQb3NpdGlvbjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gaXMgY2FsbGVkLlxuXG5PbmNlIHt7I2Nyb3NzTGluayBcIkxheURvd24vcmVzaXplQW5kUG9zaXRpb246bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGhhcyBiZWVuIGNhbGxlZCB0aGUgeCB2YWx1ZSB3aWxsIGJlIHdoYXRldmVyIHdhcyBwYXNzZWRcbmluIGZvciB0aGUgeCBwYXJhbWV0ZXIuXG5cblRoaXMgcHJvcGVydHkgaXMgcmVhZCBvbmx5IGFuZCBzaG91bGQgbm90IGJlIHNldCBtYW51YWxseS5cblxuQHByb3BlcnR5IHhcbkB0eXBlIE51bWJlclxuQHJlYWRPbmx5XG4qKi9cbkxheURvd24ucHJvdG90eXBlLnggPSAwO1xuXG5cbi8qKlxuVGhpcyBpcyB0aGUgeSBwb3NpdGlvbiBvZiB0aGUgTGF5RG93biBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2YgeSB3aWxsIGJlIDAgdW50aWwgXG57eyNjcm9zc0xpbmsgXCJMYXlEb3duL3Jlc2l6ZUFuZFBvc2l0aW9uOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBpcyBjYWxsZWQuXG5cbk9uY2Uge3sjY3Jvc3NMaW5rIFwiTGF5RG93bi9yZXNpemVBbmRQb3NpdGlvbjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gaGFzIGJlZW4gY2FsbGVkIHRoZSB5IHZhbHVlIHdpbGwgYmUgd2hhdGV2ZXIgd2FzIHBhc3NlZFxuaW4gZm9yIHRoZSB5IHBhcmFtZXRlci5cblxuVGhpcyBwcm9wZXJ0eSBpcyByZWFkIG9ubHkgYW5kIHNob3VsZCBub3QgYmUgc2V0IG1hbnVhbGx5LlxuXG5AcHJvcGVydHkgeVxuQHR5cGUgTnVtYmVyXG5AcmVhZE9ubHlcbioqL1xuTGF5RG93bi5wcm90b3R5cGUueSA9IDA7XG5cblxuLyoqXG5UaGlzIGlzIHRoZSB3aWR0aCBwb3NpdGlvbiBvZiB0aGUgTGF5RG93biBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2Ygd2lkdGggd2lsbCBiZSAwIHVudGlsIFxue3sjY3Jvc3NMaW5rIFwiTGF5RG93bi9yZXNpemVBbmRQb3NpdGlvbjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX0gaXMgY2FsbGVkLlxuXG5PbmNlIHt7I2Nyb3NzTGluayBcIkxheURvd24vcmVzaXplQW5kUG9zaXRpb246bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGhhcyBiZWVuIGNhbGxlZCB0aGUgd2lkdGggdmFsdWUgd2lsbCBiZSB3aGF0ZXZlciB3YXMgcGFzc2VkXG5pbiBmb3IgdGhlIHdpZHRoIHBhcmFtZXRlci5cblxuVGhpcyBwcm9wZXJ0eSBpcyByZWFkIG9ubHkgYW5kIHNob3VsZCBub3QgYmUgc2V0IG1hbnVhbGx5LlxuXG5AcHJvcGVydHkgd2lkdGhcbkB0eXBlIE51bWJlclxuQHJlYWRPbmx5XG4qKi9cbkxheURvd24ucHJvdG90eXBlLndpZHRoID0gMDtcblxuXG4vKipcblRoaXMgaXMgdGhlIGhlaWdodCBwb3NpdGlvbiBvZiB0aGUgTGF5RG93biBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2YgaGVpZ2h0IHdpbGwgYmUgMCB1bnRpbCBcbnt7I2Nyb3NzTGluayBcIkxheURvd24vcmVzaXplQW5kUG9zaXRpb246bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319IGlzIGNhbGxlZC5cblxuT25jZSB7eyNjcm9zc0xpbmsgXCJMYXlEb3duL3Jlc2l6ZUFuZFBvc2l0aW9uOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fSBoYXMgYmVlbiBjYWxsZWQgdGhlIGhlaWdodCB2YWx1ZSB3aWxsIGJlIHdoYXRldmVyIHdhcyBwYXNzZWRcbmluIGZvciB0aGUgaGVpZ2h0IHBhcmFtZXRlci5cblxuVGhpcyBwcm9wZXJ0eSBpcyByZWFkIG9ubHkgYW5kIHNob3VsZCBub3QgYmUgc2V0IG1hbnVhbGx5LlxuXG5AcHJvcGVydHkgaGVpZ2h0XG5AdHlwZSBOdW1iZXJcbkByZWFkT25seVxuKiovXG5MYXlEb3duLnByb3RvdHlwZS5oZWlnaHQgPSAwO1xuXG4vKipcblRoaXMgaXMgdGhlIGxheW91dCBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIHVzZWQgYnkgZGVmYXVsdCBmb3IgYWxsIExheW91dE5vZGUncy4gVGhpcyB2YWx1ZSBpcyBzZXQgaW4gdGhlIGNvbnN0cnVjdG9yIGluaXRpYWxseS5cblxuQHByb3BlcnR5IGxheW91dEZ1bmN0aW9uXG5AdHlwZSBGdW5jdGlvblxuKiovXG5MYXlEb3duLnByb3RvdHlwZS5sYXlvdXRGdW5jdGlvbiA9IG51bGw7XG5cbi8qKlxuVGhpcyBpcyB0aGUgcmVhZCBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIHVzZWQgYnkgZGVmYXVsdCBmb3IgYWxsIExheW91dE5vZGUncy4gVGhpcyB2YWx1ZSBpcyBzZXQgaW4gdGhlIGNvbnN0cnVjdG9yIGluaXRpYWxseS5cblxuQHByb3BlcnR5IHJlYWRGdW5jdGlvblxuQHR5cGUgRnVuY3Rpb25cbioqL1xuTGF5RG93bi5wcm90b3R5cGUucmVhZEZ1bmN0aW9uID0gbnVsbDtcblxuLyoqXG5UaGlzIGlzIHRoZSBjcmVhdGUgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSB1c2VkIG9uIGFsbCBpdGVtcyBiZWluZyBsYXllZCBvdXQuIFRoaXMgdmFsdWUgaXMgc2V0IGluIHRoZSBjb25zdHJ1Y3RvciBpbml0aWFsbHkuXG5cbkBwcm9wZXJ0eSBjcmVhdGVGdW5jdGlvblxuQHR5cGUgRnVuY3Rpb25cbioqL1xuTGF5RG93bi5wcm90b3R5cGUuY3JlYXRlRnVuY3Rpb24gPSBudWxsO1xuTGF5RG93bi5wcm90b3R5cGUubm9kZXMgPSBudWxsO1xuXG4vKipcblRoZSBjcmVhdGUgbWV0aG9kIHdpbGwgY3JlYXRlIGEge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZVwifX17ey9jcm9zc0xpbmt9fSB3aGljaCBydWxlcyBjYW4gdGhlbiBiZSBhcHBsaWVkIHRvLlxuXG5AbWV0aG9kIGNyZWF0ZVxuQHBhcmFtIGl0ZW1Ub0xheURvd24ge09iamVjdH0gVGhpcyB3aWxsIGJlIHRoZSBpdGVtIHRoYXQgd2UnbGwgYmUgbGF5aW5nIGRvd24uIEZvciBpbnN0YW5jZSBpZiB3ZSB3ZXJlIHdvcmtpbmcgd2l0aCB0aGUgRE9NIGl0IGNvdWxkIGJlXG5hbiBpbWFnZSBodG1sIGVsZW1lbnQgb3IgYSBkaXYgZWxlbWVudCBvciB3aGF0ZXZlciB5b3UnZCBsaWtlLlxuXG5AcGFyYW0gY3JlYXRlRnVuY3Rpb24ge0Z1bmN0aW9ufSBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCBiZWZvcmUgY3JlYXRpbmcgdGhlIExheW91dE5vZGUgd2hlcmUgdGhpcyBpcyBoYW5keSBpcyBpZiB5b3Ugd2FudCB0byBvdmVycmlkZSB0aGUgXG5kZWZhdWx0IGNyZWF0ZSBmdW5jdGlvblxuKiovXG5MYXlEb3duLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiggaXRlbVRvTGF5RG93biwgY3JlYXRlRnVuY3Rpb24gKSB7XG5cblx0Y3JlYXRlRnVuY3Rpb24gPSBjcmVhdGVGdW5jdGlvbiA9PT0gdW5kZWZpbmVkID8gdGhpcy5jcmVhdGVGdW5jdGlvbiA6IGNyZWF0ZUZ1bmN0aW9uO1xuXG5cdGlmKCBjcmVhdGVGdW5jdGlvbiAmJiBpdGVtVG9MYXlEb3duKSB7XG5cblx0XHR0aGlzLmNyZWF0ZUZ1bmN0aW9uKCBpdGVtVG9MYXlEb3duICk7XG5cdH1cblxuXHR2YXIgbk5vZGUgPSBuZXcgTGF5b3V0Tm9kZSggdGhpcywgaXRlbVRvTGF5RG93biwgdGhpcy5sYXlvdXRGdW5jdGlvbiwgdGhpcy5yZWFkRnVuY3Rpb24gKTtcdFxuXG5cdHRoaXMubm9kZXMucHVzaCggbk5vZGUgKTtcblxuXHRyZXR1cm4gbk5vZGU7XG59O1xuXG4vKipcbkNhbGwgcmVzaXplQW5kUG9zaXRpb24gd2hlbmV2ZXIgeW91J2QgbGlrZSB0byBsYXlvdXQgYWxsIHlvdXIgaXRlbXMuIEZvciBpbnN0YW5jZSB5b3UgbWF5IHdhbnQgdG8gY2FsbCB0aGlzIHdoZW4gYSB3aW5kb3cgcmVzaXplcy5cblxuQG1ldGhvZCByZXNpemVBbmRQb3NpdGlvblxuQHBhcmFtIHgge051bWJlcn0gVGhpcyBpcyB0aGUgeCBwb3NpdGlvbiBvZiB3aGVyZSB0aGlzIGxheW91dCBzaG91bGQgYmVnaW4uIEZvciBpbnN0YW5jZSB4ID0gMCBjb3VsZCBiZSB0aGUgbGVmdCBzaWRlIG9mIHRoZSBzY3JlZW4uXG5AcGFyYW0geSB7TnVtYmVyfSBUaGlzIGlzIHRoZSB5IHBvc2l0aW9uIG9mIHdoZXJlIHRoaXMgbGF5b3V0IHNob3VsZCBiZWdpbi4gRm9yIGluc3RhbmNlIHkgPSAwIGNvdWxkIGJlIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIHNjcmVlbi5cbkBwYXJhbSB3aWR0aCB7TnVtYmVyfSBUaGlzIGlzIHRoZSB3aWR0aCBvZiB0aGUgbGF5b3V0LiBGb3IgaW5zdGFuY2UgdGhpcyBjb3VsZCBiZSB0aGUgd2lkdGggb2YgdGhlIHNjcmVlbi5cbkBwYXJhbSBoZWlnaHQge051bWJlcn0gVGhpcyBpcyB0aGUgaGVpZ2h0IG9mIHRoZSBsYXlvdXQuIEZvciBpbnN0YW5jZSB0aGlzIGNvdWxkIGJlIHRoZSBoZWlnaHQgb2YgdGhlIHNjcmVlbi5cbioqL1xuTGF5RG93bi5wcm90b3R5cGUucmVzaXplQW5kUG9zaXRpb24gPSBmdW5jdGlvbiggeCwgeSwgd2lkdGgsIGhlaWdodCApIHtcblxuXHR0aGlzLnggPSB4O1xuXHR0aGlzLnkgPSB5O1xuXHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXG5cdHRoaXMuZG9MYXlvdXQoKTtcbn07XG5cbkxheURvd24ucHJvdG90eXBlLm5vZGVDaGFuZ2VkID0gZnVuY3Rpb24oIG5vZGUgKSB7XG5cblx0dGhpcy5kb0xheW91dCgpO1xufTtcblxuTGF5RG93bi5wcm90b3R5cGUuZG9MYXlvdXQgPSBmdW5jdGlvbigpIHtcblxuXHQvL3dlIG5lZWQgdG8gcmVzZXQgYWxsIHRoZSBoYXNCZWVuTGF5ZWRPdXRcblx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHRoaXMubm9kZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHR0aGlzLm5vZGVzWyBpIF0uaGFzQmVlbkxheWVkT3V0ID0gZmFsc2U7XG5cdH1cblxuXHQvL25vdyBkb0xheURvd24gb24gYWxsIG9mIHRoZW0gdGhhdCBoYXZlbid0IGJlZW4gbGF5ZWQgb3V0XG5cdC8vdGhleSBjb3VsZCBiZWNvbWUgbGF5ZWRvdXQgaWYgb3RoZXIgbm9kZXMgaGF2ZSBkZXBlbmRlbmNpZXNcblx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHRoaXMubm9kZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHRpZiggIXRoaXMubm9kZXNbIGkgXS5oYXNCZWVuTGF5ZWRPdXQgKSB7XG5cblx0XHRcdHRoaXMubm9kZXNbIGkgXS5kb0xheW91dCgpO1xuXHRcdH1cblx0fVxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gTGF5RG93bjsiLCJcbi8vL1BPU0lUSU9OIEZVTkNUSU9OU1xudmFyIGFsaWduZWRBYm92ZSA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL2FsaWduZWRBYm92ZScgKTtcbnZhciBhbGlnbmVkQmVsb3cgPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi9hbGlnbmVkQmVsb3cnICk7XG52YXIgYWxpZ25lZExlZnRPZiA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL2FsaWduZWRMZWZ0T2YnICk7XG52YXIgYWxpZ25lZFJpZ2h0T2YgPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi9hbGlnbmVkUmlnaHRPZicgKTtcbnZhciBhbGlnbmVkV2l0aCA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL2FsaWduZWRXaXRoJyApO1xudmFyIGJvdHRvbUFsaWduZWRXaXRoID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vYm90dG9tQWxpZ25lZFdpdGgnICk7XG52YXIgY2VudGVyZWRXaXRoID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vY2VudGVyZWRXaXRoJyApO1xudmFyIGhvcml6b250YWxseUNlbnRlcmVkV2l0aCA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL2hvcml6b250YWxseUNlbnRlcmVkV2l0aCcgKTtcbnZhciBsZWZ0QWxpZ25lZFdpdGggPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi9sZWZ0QWxpZ25lZFdpdGgnICk7XG52YXIgcG9zaXRpb25JcyA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3Bvc2l0aW9uSXMnICk7XG52YXIgcG9zaXRpb25Jc0FQZXJjZW50YWdlT2YgPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi9wb3NpdGlvbklzQVBlcmNlbnRhZ2VPZicgKTtcbnZhciByaWdodEFsaWduZWRXaXRoID0gcmVxdWlyZSggJy4vbGF5b3V0UG9zaXRpb24vcmlnaHRBbGlnbmVkV2l0aCcgKTtcbnZhciB0b3BBbGlnbmVkV2l0aCA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3RvcEFsaWduZWRXaXRoJyApO1xudmFyIHZlcnRpY2FsbHlDZW50ZXJlZFdpdGggPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi92ZXJ0aWNhbGx5Q2VudGVyZWRXaXRoJyApO1xudmFyIHhJcyA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3hJcycgKTtcbnZhciB5SXMgPSByZXF1aXJlKCAnLi9sYXlvdXRQb3NpdGlvbi95SXMnICk7XG52YXIgeElzQVBlcmNlbnRhZ2VPZiA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3hJc0FQZXJjZW50YWdlT2YnICk7XG52YXIgeUlzQVBlcmNlbnRhZ2VPZiA9IHJlcXVpcmUoICcuL2xheW91dFBvc2l0aW9uL3lJc0FQZXJjZW50YWdlT2YnICk7XG5cbi8vUE9TSVRJT04gQk9VTkQgRlVOQ1RJT05TXG52YXIgbWF4UG9zaXRpb24gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFBvc2l0aW9uJyApO1xudmFyIG1heFBvc2l0aW9uRnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kUG9zaXRpb24vbWF4UG9zaXRpb25Gcm9tJyApO1xudmFyIG1heFggPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFgnICk7XG52YXIgbWF4WEZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFhGcm9tJyApO1xudmFyIG1heFkgPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFknICk7XG52YXIgbWF4WUZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL21heFlGcm9tJyApO1xudmFyIG1pblBvc2l0aW9uID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5Qb3NpdGlvbicgKTtcbnZhciBtaW5Qb3NpdGlvbkZyb20gPSByZXF1aXJlKCAnLi9sYXlvdXRCb3VuZFBvc2l0aW9uL21pblBvc2l0aW9uRnJvbScgKTtcbnZhciBtaW5YID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5YJyApO1xudmFyIG1pblhGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5YRnJvbScgKTtcbnZhciBtaW5ZID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5ZJyApO1xudmFyIG1pbllGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRQb3NpdGlvbi9taW5ZRnJvbScgKTtcblxuLy8vU0laRSBGVU5DVElPTlNcbnZhciBoZWlnaHRJcyA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvaGVpZ2h0SXMnICk7XG52YXIgaGVpZ2h0SXNBUGVyY2VudGFnZU9mID0gcmVxdWlyZSggJy4vbGF5b3V0U2l6ZS9oZWlnaHRJc0FQZXJjZW50YWdlT2YnICk7XG52YXIgaGVpZ2h0SXNQcm9wb3J0aW9uYWwgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL2hlaWdodElzUHJvcG9ydGlvbmFsJyApO1xudmFyIG1hdGNoZXNIZWlnaHRPZiA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvbWF0Y2hlc0hlaWdodE9mJyApO1xudmFyIG1hdGNoZXNTaXplT2YgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL21hdGNoZXNTaXplT2YnICk7XG52YXIgbWF0Y2hlc1dpZHRoT2YgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL21hdGNoZXNXaWR0aE9mJyApO1xudmFyIHNpemVJcyA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvc2l6ZUlzJyApO1xudmFyIHNpemVJc0FQZXJjZW50YWdlT2YgPSByZXF1aXJlKCAnLi9sYXlvdXRTaXplL3NpemVJc0FQZXJjZW50YWdlT2YnICk7XG52YXIgc2l6ZUlzUHJvcG9ydGlvbmFsID0gcmVxdWlyZSggJy4vbGF5b3V0U2l6ZS9zaXplSXNQcm9wb3J0aW9uYWwnICk7XG52YXIgd2lkdGhJcyA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvd2lkdGhJcycgKTtcbnZhciB3aWR0aElzQVBlcmNlbnRhZ2VPZiA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvd2lkdGhJc0FQZXJjZW50YWdlT2YnICk7XG52YXIgd2lkdGhJc1Byb3BvcnRpb25hbCA9IHJlcXVpcmUoICcuL2xheW91dFNpemUvd2lkdGhJc1Byb3BvcnRpb25hbCcgKTtcblxuXG4vL1NJWkUgQk9VTkQgRlVOQ1RJT05TXG52YXIgbWF4SGVpZ2h0ID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21heEhlaWdodCcgKTtcbnZhciBtYXhIZWlnaHRGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21heEhlaWdodEZyb20nICk7XG52YXIgbWF4U2l6ZSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9tYXhTaXplJyApO1xudmFyIG1heFNpemVGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21heFNpemVGcm9tJyApO1xudmFyIG1heFdpZHRoID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21heFdpZHRoJyApO1xudmFyIG1heFdpZHRoRnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9tYXhXaWR0aEZyb20nICk7XG52YXIgbWluSGVpZ2h0ID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21pbkhlaWdodCcgKTtcbnZhciBtaW5IZWlnaHRGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21pbkhlaWdodEZyb20nICk7XG52YXIgbWluU2l6ZSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9taW5TaXplJyApO1xudmFyIG1pblNpemVGcm9tID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21pblNpemVGcm9tJyApO1xudmFyIG1pbldpZHRoID0gcmVxdWlyZSggJy4vbGF5b3V0Qm91bmRTaXplL21pbldpZHRoJyApO1xudmFyIG1pbldpZHRoRnJvbSA9IHJlcXVpcmUoICcuL2xheW91dEJvdW5kU2l6ZS9taW5XaWR0aEZyb20nICk7XG5cbi8vQ09ORElUSU9OQUwgRlVOQ1RJT05TXG52YXIgd2lkdGhHcmVhdGVyVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy93aWR0aEdyZWF0ZXJUaGFuJyApO1xudmFyIGhlaWdodEdyZWF0ZXJUaGFuID0gcmVxdWlyZSggJy4vY29uZGl0aW9uYWxzL2hlaWdodEdyZWF0ZXJUaGFuJyApO1xudmFyIHdpZHRoTGVzc1RoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvd2lkdGhMZXNzVGhhbicgKTtcbnZhciBoZWlnaHRMZXNzVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy9oZWlnaHRMZXNzVGhhbicgKTtcbnZhciBsZWZ0R3JlYXRlclRoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvbGVmdEdyZWF0ZXJUaGFuJyApO1xudmFyIHJpZ2h0R3JlYXRlclRoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvcmlnaHRHcmVhdGVyVGhhbicgKTtcbnZhciBsZWZ0TGVzc1RoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvbGVmdExlc3NUaGFuJyApO1xudmFyIHJpZ2h0TGVzc1RoYW4gPSByZXF1aXJlKCAnLi9jb25kaXRpb25hbHMvcmlnaHRMZXNzVGhhbicgKTtcbnZhciBib3R0b21HcmVhdGVyVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy9ib3R0b21HcmVhdGVyVGhhbicgKTtcbnZhciB0b3BHcmVhdGVyVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy90b3BHcmVhdGVyVGhhbicgKTtcbnZhciBib3R0b21MZXNzVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy9ib3R0b21MZXNzVGhhbicgKTtcbnZhciB0b3BMZXNzVGhhbiA9IHJlcXVpcmUoICcuL2NvbmRpdGlvbmFscy90b3BMZXNzVGhhbicgKTtcblxuLy9PRkZTRVQgRlVOQ1RJT05TXG52YXIgbWludXNIZWlnaHQgPSByZXF1aXJlKCAnLi9vZmZzZXRzL21pbnVzSGVpZ2h0JyApO1xudmFyIG1pbnVzUG9zaXRpb24gPSByZXF1aXJlKCAnLi9vZmZzZXRzL21pbnVzUG9zaXRpb24nICk7XG52YXIgbWludXNTaXplID0gcmVxdWlyZSggJy4vb2Zmc2V0cy9taW51c1NpemUnICk7XG52YXIgbWludXNXaWR0aCA9IHJlcXVpcmUoICcuL29mZnNldHMvbWludXNXaWR0aCcgKTtcbnZhciBtaW51c1ggPSByZXF1aXJlKCAnLi9vZmZzZXRzL21pbnVzWCcgKTtcbnZhciBtaW51c1kgPSByZXF1aXJlKCAnLi9vZmZzZXRzL21pbnVzWScgKTtcbnZhciBwbHVzSGVpZ2h0ID0gcmVxdWlyZSggJy4vb2Zmc2V0cy9wbHVzSGVpZ2h0JyApO1xudmFyIHBsdXNQb3NpdGlvbiA9IHJlcXVpcmUoICcuL29mZnNldHMvcGx1c1Bvc2l0aW9uJyApO1xudmFyIHBsdXNTaXplID0gcmVxdWlyZSggJy4vb2Zmc2V0cy9wbHVzU2l6ZScgKTtcbnZhciBwbHVzV2lkdGggPSByZXF1aXJlKCAnLi9vZmZzZXRzL3BsdXNXaWR0aCcgKTtcbnZhciBwbHVzWCA9IHJlcXVpcmUoICcuL29mZnNldHMvcGx1c1gnICk7XG52YXIgcGx1c1kgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3BsdXNZJyApO1xudmFyIHZNaW51c0hlaWdodCA9IHJlcXVpcmUoICcuL29mZnNldHMvdk1pbnVzSGVpZ2h0JyApO1xudmFyIHZNaW51c1Bvc2l0aW9uID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92TWludXNQb3NpdGlvbicgKTtcbnZhciB2TWludXNTaXplID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92TWludXNTaXplJyApO1xudmFyIHZNaW51c1dpZHRoID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92TWludXNXaWR0aCcgKTtcbnZhciB2TWludXNYID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92TWludXNYJyApO1xudmFyIHZNaW51c1kgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZNaW51c1knICk7XG52YXIgdlBsdXNIZWlnaHQgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZQbHVzSGVpZ2h0JyApO1xudmFyIHZQbHVzUG9zaXRpb24gPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZQbHVzUG9zaXRpb24nICk7XG52YXIgdlBsdXNTaXplID0gcmVxdWlyZSggJy4vb2Zmc2V0cy92UGx1c1NpemUnICk7XG52YXIgdlBsdXNXaWR0aCA9IHJlcXVpcmUoICcuL29mZnNldHMvdlBsdXNXaWR0aCcgKTtcbnZhciB2UGx1c1ggPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZQbHVzWCcgKTtcbnZhciB2UGx1c1kgPSByZXF1aXJlKCAnLi9vZmZzZXRzL3ZQbHVzWScgKTtcblxuXG5cblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tUFJPUFMgVE8gRUZGRUNULS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbnZhciBTSVpFID0gJ1NJWkUnO1xudmFyIFNJWkVfV0lEVEggPSAnU0laRV9XSURUSCc7XG52YXIgU0laRV9IRUlHSFQgPSAnU0laRV9IRUlHSFQnO1xudmFyIFBPU0lUSU9OID0gJ1BPU0lUSU9OJztcbnZhciBQT1NJVElPTl9YID0gJ1BPU0lUSU9OX1gnO1xudmFyIFBPU0lUSU9OX1kgPSAnUE9TSVRJT05fWSc7XG5cbnZhciBCT1VORF9TSVpFID0gJ0JPVU5EX1NJWkUnO1xudmFyIEJPVU5EX1NJWkVfV0lEVEggPSAnQk9VTkRfU0laRV9XSURUSCc7XG52YXIgQk9VTkRfU0laRV9IRUlHSFQgPSAnQk9VTkRfU0laRV9IRUlHSFQnO1xudmFyIEJPVU5EX1BPU0lUSU9OID0gJ0JPVU5EX1BPU0lUSU9OJztcbnZhciBCT1VORF9QT1NJVElPTl9YID0gJ0JPVU5EX1BPU0lUSU9OX1gnO1xudmFyIEJPVU5EX1BPU0lUSU9OX1kgPSAnQk9VTkRfUE9TSVRJT05fWSc7XG5cblxuXG5cblxuLyoqXG5MYXlvdXROb2RlIGlzIHdoZXJlIGFsbCB0aGUgbWFnaWMgaGFwcGVucy4gTGF5b3V0Tm9kZSdzIGFyZSBjcmVhdGVkIGZyb20gTGF5RG93bi4gWW91IHdpbGwgbmV2ZXIgaW5zdGFudGlhdGUgTGF5b3V0Tm9kZXMgXG5kaXJlY3RseSBob3dldmVyIHlvdSB3aWxsIHVzZSB0aGUgTGF5RG93biBub2RlIHRvIGFsd2F5cyBpbnN0YW50aWF0ZSB0aGVtLlxuXG5MYXlvdXROb2RlJ3MgYWJzdHJhY3QgcG9zaXRpb25pbmcgZWxlbWVudHMgb24gc2NyZWVuIHVzaW5nIHJ1bGVzLlxuXG5CYXNpY2FsbHkgd2hhdCB0aGF0IG1lYW5zIGlzIGlmIHlvdSdyZSB1c2luZyB0aGUgRE9NLCBMYXlvdXROb2RlJ3Mgd2lsbCBzaXQgYmV0d2VlbiB0aGUgRE9NIGFuZCB0aGUgbG9naWNcbnRvIHBvc2l0aW9uIGFuZCByZXNpemUgdGhpbmdzIG9uIHNjcmVlbi5cblxuVG8gZG8gdGhpcyB5b3UgYWRkIFwicnVsZXNcIiB0byB0aGUgTGF5b3V0Tm9kZSdzIGJ5IGNhbGxpbmcgdGhlaXIgcnVsZSBmdW5jdGlvbnMuIEZvciBlYXNlIG9mIHVzZSBhbmQgdG8ga2VlcCBpbmxpbmUgd2l0aCB0aGVcbmxpYnJhcmllcyBnb2FsIG9mIGJlaW5nIHZlcnkgcmVhZGFibGUsIGhhbmR5IHRvIHRyYW5zbGF0ZSBkZXNpZ25lcnMgbmVlZHMsIGFsbCBydWxlcyBhcmUgY2hhaW5hYmxlIGFuZCBmb3JtIFwic2VudGVuY2VzXCIuXG5cbkZvciBleGFtcGxlIHRoZSBjb2RlOlxuXG5ub2RlLmxlZnRBbGlnbmVkV2l0aCggc29tZVVJICkuYWxpZ25lZEJlbG93KCBzb21lVUkgKS5wbHVzKCAzICk7XG5cbldvdWxkIHJlYWQgYXM6XG5cbk91ciBub2RlIHdpbGwgYmUgbGVmdCBhbGlnbmVkIHdpdGggU29tZSBVSSBhbmQgYWxpZ25lZCBiZWxvdyBTb21lIFVJIHBsdXMgMyBwaXhlbHMuXG5cbkBjbGFzcyBMYXlvdXROb2RlXG5AY29uc3RydWN0b3JcbkBwYXJhbSB7TGF5RG93bn0gbGF5b3V0IElzIHRoZSBwYXJlbnQgTGF5RG93biBvYmplY3QuIFRoZSBwYXJlbnQgTGF5RG93biBvYmplY3Qgd2lsbCBtYW5hZ2UgcmVsYXRpb25zaGlwcyBiZXR3ZWVuIGFsbCBMYXlvdXROb2RlJ3MgYW5kIHdpbGxcblx0XHRcdFx0XHRcdGhhbmRsZSBjaXJjdWxhciBkZXBlbmRlbmNpZXMgYW5kIGFsbCB0aGF0IGZ1biBzdHVmZi5cblxuQHBhcmFtIGl0ZW0ge09iamVjdH0gaXRlbSB3aWxsIGJlIHdoYXQgd2lsbCBiZSBwb3NpdGlvbmVkIG9uIHNjcmVlbi4gRm9yIGluc3RhbmNlIGFuIEhUTUwgRE9NIEVsZW1lbnQgb3IgYSBQSVhJIERpc3BsYXlPYmplY3QuIEl0J3Ncblx0XHRcdFx0d2hhdGV2ZXIgeW91IHdhbnQgdG8gbGF5b3V0IG9uIHNjcmVlbi5cblxuQHBhcmFtIGxheW91dEZ1bmN0aW9uIHtmdW5jdGlvbn0gVGhlIGxheW91dEZ1bmN0aW9uIGZ1bmN0aW9uIGlzIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCB0cmFuc2xhdGUgdGhlIHgsIHksIHdpZHRoLCBhbmQgaGVpZ2h0IHByb3BlcnRpZXMgb2YgYVxuTGF5b3V0Tm9kZSBpbnRvIGFjdHVhbCBwaHlzaWNhbCBzY3JlZW4gcG9zaXRpb24uIFNvIGZvciBpbnN0YW5jZSBpZiB3ZSdyZSB3b3JraW5nIHdpdGggdGhlIERPTSBpdCB3b3VsZCBzZXRcbkNTUyBwcm9wZXJ0aWVzIG9uIHRoZSBcIml0ZW1cIiBwYXNzZWQgaW4gdG8gZW5zdXJlIHRoYXQgdGhlIGl0ZW0gaXMgb24gc2NyZWVuIGF0IHgsIHkgYXQgdGhlIGNvcnJlY3Qgc2l6ZS5cblxuQHBhcmFtIHJlYWRGdW5jdGlvbiB7ZnVuY3Rpb259IElmIHlvdSBkZWZpbmUgbm8gc2l6aW5nIHJ1bGVzIHRvIHNldCB3aWR0aCBhbmQgaGVpZ2h0IG9mIGFuIFwiaXRlbVwiL0xheW91dE5vZGUgdGhlbiB3ZSB3aWxsIG5lZWQgdG8gcmVhZCB0aGVcbndpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIG9iamVjdCB0byBiZSBhYmxlIHRvIHBvc2l0aW9uIGRlcGVuZGVudCBMYXlvdXROb2RlJ3MuIFxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgd2UgaGF2ZSBMYXlvdXROb2RlIEJ1dHRvbiBhbmQgTGF5b3V0Tm9kZSBJbWFnZSBhbmQgd2Ugd2FudGVkIEltYWdlIHRvIGJlIGJlbG93IEJ1dHRvbiBhbmRcbkJ1dHRvbiBoYXMgbm8gbGF5b3V0IHJ1bGVzIGZvciBzZXR0aW5nIGl0J3MgaGVpZ2h0IHdlIHdpbGwgbmVlZCB0byBcInJlYWRcIiBpbiBCdXR0b25zIGhlaWdodCB0byBiZSBhYmxlIHRvIGNvcnJlY3RseVxucG9zaXRpb24gSW1hZ2UuIFNvIGlmIEJ1dHRvbiBpcyBhIERJViBlbGVtZW50IHdlIHdpbGwgcmVhZCBpbiBpdCdzIGhlaWdodCB0byBiZSBhYmxlIHRvIHBvc3Rpb24gSW1hZ2UgYmVsb3cgaXQuXG5cbioqL1xudmFyIExheW91dE5vZGUgPSBmdW5jdGlvbiggbGF5b3V0LCBpdGVtLCBsYXlvdXRGdW5jdGlvbiwgcmVhZEZ1bmN0aW9uICkge1xuXG5cdHRoaXMubGF5b3V0ID0gbGF5b3V0O1xuXHR0aGlzLml0ZW0gPSBpdGVtID09PSB1bmRlZmluZWQgPyBudWxsIDogaXRlbTtcblx0dGhpcy5sYXlvdXRGdW5jdGlvbiA9IGxheW91dEZ1bmN0aW9uID09PSB1bmRlZmluZWQgPyBudWxsIDogbGF5b3V0RnVuY3Rpb247XG5cdHRoaXMucmVhZEZ1bmN0aW9uID0gcmVhZEZ1bmN0aW9uID09PSB1bmRlZmluZWQgPyBudWxsIDogcmVhZEZ1bmN0aW9uO1xuXHR0aGlzLnNpemVEZXBlbmRlbmNpZXMgPSBbXTtcblx0dGhpcy5wb3NpdGlvbkRlcGVuZGVuY2llcyA9IFtdO1xuXHR0aGlzLnJ1bGVzUG9zID0gW107XG5cdHRoaXMucnVsZXNQb3NQcm9wID0gW107XG5cdHRoaXMucnVsZXNTaXplID0gW107XG5cdHRoaXMucnVsZXNTaXplUHJvcCA9IFtdO1xuXHR0aGlzLnJ1bGVzUG9zQm91bmQgPSBbXTtcblx0dGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCA9IFtdO1xuXHR0aGlzLnJ1bGVzU2l6ZUJvdW5kID0gW107XG5cdHRoaXMucnVsZXNTaXplQm91bmRQcm9wID0gW107XG5cdHRoaXMuaXRlbXNUb0NvbXBhcmUgPSBbXTtcblx0dGhpcy5jb25kaXRpb25hbHNGb3JJdGVtID0gW107XG5cdHRoaXMuY29uZGl0aW9uYWxzQXJndW1lbnRzRm9ySXRlbSA9IFtdO1xuXHR0aGlzLmxheW91dE5vZGVGb3JDb25kaXRpb25hbCA9IFtdO1xuXHR0aGlzLmNvbmRpdGlvbmFsTGlzdGVuZXJzID0gW107XG5cblx0dGhpcy5faW5uZXIgPSBudWxsO1xuXHR0aGlzLl94ID0gMDtcblx0dGhpcy5feSA9IDA7XG5cdHRoaXMuX3dpZHRoID0gMDtcblx0dGhpcy5faGVpZ2h0ID0gMDtcblx0dGhpcy5fb2ZmWCA9IDA7XG5cdHRoaXMuX29mZlkgPSAwO1xuXHR0aGlzLl9vZmZXaWR0aCA9IDA7XG5cdHRoaXMuX29mZkhlaWdodCA9IDA7XG5cdHRoaXMuX2lzRG9pbmdXaGVuID0gZmFsc2U7XG5cdHRoaXMuX2hhc0NvbmRpdGlvbmFsID0gZmFsc2U7XG5cdHRoaXMuX2lzRG9pbmdEZWZhdWx0ID0gZmFsc2U7XG5cdHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgPSBudWxsO1xuXHR0aGlzLmhhc0JlZW5MYXllZE91dCA9IGZhbHNlO1xuXHR0aGlzLmxheW91dE5vZGVGb3JEZWZhdWx0ID0gbnVsbDtcblx0dGhpcy5jb25kaXRpb25hbFBhcmVudCA9IG51bGw7IC8vdGhpcyBpcyB0aGUgcGFyZW50IExheW91dE5vZGUgdGhhdCB0aGlzIGNvbmRpdGlvbmFsIExheW91dE5vZGUgd2FzIGNyZWF0ZWQgZnJvbVxuXHR0aGlzLmRlZmF1bHRDb25kaXRpb25hbExpc3RlbmVyID0gbnVsbDtcblx0dGhpcy5sYXN0Q29uZGl0aW9uYWxMaXN0bmVySWR4ID0gLTE7XG5cdHRoaXMubGFzdENvbmRpdGlvbmFsTGlzdGVuZXJJc0RlZmF1bHQgPSBmYWxzZTtcblx0dGhpcy5kb05vdFJlYWRXaWR0aCA9IGZhbHNlO1xuXHR0aGlzLmRvTm90UmVhZEhlaWdodCA9IGZhbHNlO1xufTtcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3Igc2l6ZSBsYXlvdXQgcnVsZXMgd2hlcmUgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgZWZmZWN0ZWQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgU0laRV9MQVlPVVRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuU0laRV9MQVlPVVQgPSAnU0laRV9MQVlPVVQnO1xuXG4vKipcblRoaXMgY29uc3RhbnQgZGVzY3JpYmVzIG9yIGlzIGEga2V5IGZvciBzaXplIGJvdW5kIHJ1bGVzIHdoZXJlIGJvdGggd2lkdGggYW5kIGhlaWdodCB3aWxsIGJlIGJvdW5kLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFNJWkVfQk9VTkRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuU0laRV9CT1VORCA9ICdTSVpFX0JPVU5EJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3Igd2lkdGggbGF5b3V0IHJ1bGVzIHdoZXJlIHdpZHRoIHdpbGwgYmUgZWZmZWN0ZWQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgU0laRV9XSURUSF9MQVlPVVRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuU0laRV9XSURUSF9MQVlPVVQgPSAnU0laRV9XSURUSF9MQVlPVVQnO1xuXG4vKipcblRoaXMgY29uc3RhbnQgZGVzY3JpYmVzIG9yIGlzIGEga2V5IGZvciB3aWR0aCBib3VuZCBydWxlcyB3aGVyZSB3aWR0aCB3aWxsIGJlIGJvdW5kLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFNJWkVfV0lEVEhfQk9VTkRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuU0laRV9XSURUSF9CT1VORCA9ICdTSVpFX1dJRFRIX0JPVU5EJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3IgaGVpZ2h0IGxheW91dCBydWxlcyB3aGVyZSBoZWlnaHQgd2lsbCBiZSBlZmZlY3RlZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBTSVpFX0hFSUdIVF9MQVlPVVRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuU0laRV9IRUlHSFRfTEFZT1VUID0gJ1NJWkVfSEVJR0hUX0xBWU9VVCc7XG5cbi8qKlxuVGhpcyBjb25zdGFudCBkZXNjcmliZXMgb3IgaXMgYSBrZXkgZm9yIGhlaWdodCBib3VuZCBydWxlcyB3aGVyZSBoZWlnaHQgd2lsbCBiZSBib3VuZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBTSVpFX0hFSUdIVF9CT1VORFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5TSVpFX0hFSUdIVF9CT1VORCA9ICdTSVpFX0hFSUdIVF9CT1VORCc7XG5cbi8qKlxuVGhpcyBjb25zdGFudCBkZXNjcmliZXMgb3IgaXMgYSBrZXkgZm9yIHBvc2l0aW9uIGxheW91dCBydWxlcyB3aGVyZSB4IGFuZCB5IHdpbGwgYmUgZWZmZWN0ZWQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgUE9TSVRJT05fTEFZT1VUXG5AdHlwZSBTdHJpbmdcbkBzdGF0aWNcbkBmaW5hbFxuKiovXG5MYXlvdXROb2RlLlBPU0lUSU9OX0xBWU9VVCA9ICdQT1NJVElPTl9MQVlPVVQnO1xuXG4vKipcblRoaXMgY29uc3RhbnQgZGVzY3JpYmVzIG9yIGlzIGEga2V5IGZvciBwb3NpdGlvbiBib3VuZCBydWxlcyB3aGVyZSB4IGFuZCB5IHdpbGwgYmUgYm90aCBib3VuZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBQT1NJVElPTl9CT1VORFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5QT1NJVElPTl9CT1VORCA9ICdQT1NJVElPTl9CT1VORCc7XG5cbi8qKlxuVGhpcyBjb25zdGFudCBkZXNjcmliZXMgb3IgaXMgYSBrZXkgZm9yIHggbGF5b3V0IHJ1bGVzIHdoZXJlIHggd2lsbCBiZSBlZmZlY3RlZC4gXG5cblRoaXMgaXMgdXNlZCBmb3IgaW5zdGFuY2UgdXNlZCB3aGVuIGFkZGluZyBjdXN0b20gcnVsZXMuXG5cbkBwcm9wZXJ0eSBQT1NJVElPTl9YX0xBWU9VVFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5QT1NJVElPTl9YX0xBWU9VVCA9ICdQT1NJVElPTl9YX0xBWU9VVCc7XG5cbi8qKlxuVGhpcyBjb25zdGFudCBkZXNjcmliZXMgb3IgaXMgYSBrZXkgZm9yIHggYm91bmQgcnVsZXMgd2hlcmUgeCB3aWxsIGJlIGJvdW5kLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFBPU0lUSU9OX1hfQk9VTkRcbkB0eXBlIFN0cmluZ1xuQHN0YXRpY1xuQGZpbmFsXG4qKi9cbkxheW91dE5vZGUuUE9TSVRJT05fWF9CT1VORCA9ICdQT1NJVElPTl9YX0JPVU5EJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3IgeSBsYXlvdXQgcnVsZXMgd2hlcmUgeSB3aWxsIGJlIGVmZmVjdGVkLiBcblxuVGhpcyBpcyB1c2VkIGZvciBpbnN0YW5jZSB1c2VkIHdoZW4gYWRkaW5nIGN1c3RvbSBydWxlcy5cblxuQHByb3BlcnR5IFBPU0lUSU9OX1lfTEFZT1VUXG5AdHlwZSBTdHJpbmdcbkBzdGF0aWNcbkBmaW5hbFxuKiovXG5MYXlvdXROb2RlLlBPU0lUSU9OX1lfTEFZT1VUID0gJ1BPU0lUSU9OX1lfTEFZT1VUJztcblxuLyoqXG5UaGlzIGNvbnN0YW50IGRlc2NyaWJlcyBvciBpcyBhIGtleSBmb3IgeSBib3VuZCBydWxlcyB3aGVyZSB5IHdpbGwgYmUgYm91bmQuIFxuXG5UaGlzIGlzIHVzZWQgZm9yIGluc3RhbmNlIHVzZWQgd2hlbiBhZGRpbmcgY3VzdG9tIHJ1bGVzLlxuXG5AcHJvcGVydHkgUE9TSVRJT05fWV9CT1VORFxuQHR5cGUgU3RyaW5nXG5Ac3RhdGljXG5AZmluYWxcbioqL1xuTGF5b3V0Tm9kZS5QT1NJVElPTl9ZX0JPVU5EID0gJ1BPU0lUSU9OX1lfQk9VTkQnO1xuXG5cbkxheW91dE5vZGUucHJvdG90eXBlLlNJWkVfTEFZT1VUID0gTGF5b3V0Tm9kZS5TSVpFX0xBWU9VVDtcbkxheW91dE5vZGUucHJvdG90eXBlLlNJWkVfQk9VTkQgPSBMYXlvdXROb2RlLlNJWkVfQk9VTkQ7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5TSVpFX1dJRFRIX0xBWU9VVCA9IExheW91dE5vZGUuU0laRV9XSURUSF9MQVlPVVQ7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5TSVpFX1dJRFRIX0JPVU5EID0gTGF5b3V0Tm9kZS5TSVpFX1dJRFRIX0JPVU5EO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuU0laRV9IRUlHSFRfTEFZT1VUID0gTGF5b3V0Tm9kZS5TSVpFX0hFSUdIVF9MQVlPVVQ7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5TSVpFX0hFSUdIVF9CT1VORCA9IExheW91dE5vZGUuU0laRV9IRUlHSFRfQk9VTkQ7XG5cbkxheW91dE5vZGUucHJvdG90eXBlLlBPU0lUSU9OX0xBWU9VVCA9IExheW91dE5vZGUuUE9TSVRJT05fTEFZT1VUO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuUE9TSVRJT05fQk9VTkQgPSBMYXlvdXROb2RlLlBPU0lUSU9OX0JPVU5EO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuUE9TSVRJT05fWF9MQVlPVVQgPSBMYXlvdXROb2RlLlBPU0lUSU9OX1hfTEFZT1VUO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuUE9TSVRJT05fWF9CT1VORCA9IExheW91dE5vZGUuUE9TSVRJT05fWF9CT1VORDtcbkxheW91dE5vZGUucHJvdG90eXBlLlBPU0lUSU9OX1lfTEFZT1VUID0gTGF5b3V0Tm9kZS5QT1NJVElPTl9ZX0xBWU9VVDtcbkxheW91dE5vZGUucHJvdG90eXBlLlBPU0lUSU9OX1lfQk9VTkQgPSBMYXlvdXROb2RlLlBPU0lUSU9OX1lfQk9VTkQ7XG5cbi8qKlxuVGhpcyBpcyB0aGUgeCBwb3NpdGlvbiBvZiB0aGUgTGF5b3V0Tm9kZSBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2YgeCB3aWxsIGJlIDAgdW50aWwgdGhpcyBub2RlIGhhcyBiZWVuIGxheWVkIG91dC5cblxuT25jZSB0aGlzIG5vZGUgaGFzIGJlZW4gbGF5ZWQgb3V0IHRoZSB4IHBvc2l0aW9uIHdpbGwgYmUgc2V0IGZyb20gYWxsIHRoZSBydWxlcyBhcHBsaWVkIHRvIHRoaXMgbm9kZS5cblxuWW91IGNhbiBhbHNvIHNldCB0aGUgeCBwb3NpdGlvbiBvZiBhIG5vZGUgYnkgc2ltcGx5IHNldHRpbmcgdGhlIHggdmFsdWU6XG5cblx0bm9kZS54ID0gMTA7XG5cbldoYXQgdGhpcyB3aWxsIGRvIGlzIGFkanVzdCBhbiBvZmZzZXQgaW4gdGhpcyBMYXlvdXROb2RlLiBTbyBpbiBwcmFjdGljZSB3aGF0IHRoaXMgbWVhbnMgaXMgdGhhdCB5b3UgY2FuIGZyZWVseSBtb3ZlIGFyb3VuZFxubm9kZXMgZm9yIGluc3RhbmNlIGJ5IGRyYWdnaW5nIGJ1dCBhbGwgZGVwZW5kZW50IG5vZGVzIHdpbGwgc3RpbGwgcG9zaXRpb24gdGhlbXNlbHZlcyBhY2NvcmRpbmcgdG8gdGhlIHJ1bGVzIHNldCBvbiB0aGVtLlxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgeW91IGhhZCBhbiBpbWFnZSB0aGF0IGlzIHJpZ2h0IGFsaWduZWQgdG8gYW5vdGhlciBpbWFnZS4gSWYgeW91IGdyYWIgdGhlIGltYWdlIG9uIHRoZSBsZWZ0IGFuZCBtb3ZlIGl0IGFyb3VuZCBcbnRoZSBpbWFnZSBvbiB0aGUgcmlnaHQgd2lsbCBmb2xsb3cuXG5cbkBwcm9wZXJ0eSB4XG5AdHlwZSBOdW1iZXJcbioqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KCBMYXlvdXROb2RlLnByb3RvdHlwZSwgJ3gnLCB7XG5cblx0Z2V0OiBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB0aGlzLl94O1xuXHR9LFxuXG5cdHNldDogZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdFx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IFBPU0lUSU9OX1g7XG5cblx0XHR0aGlzLl9vZmZYICs9IHZhbHVlIC0gdGhpcy5feDtcblx0XHRcblx0XHRpZiggdGhpcy5oYXNCZWVuTGF5ZWRPdXQgKSB7XG5cdFx0XHRcblx0XHRcdHRoaXMubGF5b3V0Lm5vZGVDaGFuZ2VkKCB0aGlzICk7XG5cdFx0fVxuXHR9XG59KTtcblxuLyoqXG5UaGlzIGlzIHRoZSB5IHBvc2l0aW9uIG9mIHRoZSBMYXlvdXROb2RlIG9uIHNjcmVlbi4gSW5pdGlhbGx5IHRoZSB2YWx1ZSBvZiB5IHdpbGwgYmUgMCB1bnRpbCB0aGlzIG5vZGUgaGFzIGJlZW4gbGF5ZWQgb3V0LlxuXG5PbmNlIHRoaXMgbm9kZSBoYXMgYmVlbiBsYXllZCBvdXQgdGhlIHkgcG9zaXRpb24gd2lsbCBiZSBzZXQgZnJvbSBhbGwgdGhlIHJ1bGVzIGFwcGxpZWQgdG8gdGhpcyBub2RlLlxuXG5Zb3UgY2FuIGFsc28gc2V0IHRoZSB5IHBvc2l0aW9uIG9mIGEgbm9kZSBieSBzaW1wbHkgc2V0dGluZyB0aGUgeSB2YWx1ZTpcblxuXHRub2RlLnkgPSAxMDtcblxuV2hhdCB0aGlzIHdpbGwgZG8gaXMgYWRqdXN0IGFuIG9mZnNldCBpbiB0aGlzIExheW91dE5vZGUuIFNvIGluIHByYWN0aWNlIHdoYXQgdGhpcyBtZWFucyBpcyB0aGF0IHlvdSBjYW4gZnJlZWx5IG1vdmUgYXJvdW5kXG5ub2RlcyBmb3IgaW5zdGFuY2UgYnkgZHJhZ2dpbmcgYnV0IGFsbCBkZXBlbmRlbnQgbm9kZXMgd2lsbCBzdGlsbCBwb3NpdGlvbiB0aGVtc2VsdmVzIGFjY29yZGluZyB0byB0aGUgcnVsZXMgc2V0IG9uIHRoZW0uXG5cblNvIGZvciBpbnN0YW5jZSBpZiB5b3UgaGFkIGFuIGltYWdlIHRoYXQgaXMgcmlnaHQgYWxpZ25lZCB0byBhbm90aGVyIGltYWdlLiBJZiB5b3UgZ3JhYiB0aGUgaW1hZ2Ugb24gdGhlIGxlZnQgYW5kIG1vdmUgaXQgYXJvdW5kIFxudGhlIGltYWdlIG9uIHRoZSByaWdodCB3aWxsIGZvbGxvdy5cblxuQHByb3BlcnR5IHlcbkB0eXBlIE51bWJlclxuKiovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoIExheW91dE5vZGUucHJvdG90eXBlLCAneScsIHtcblxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuX3k7XG5cdH0sXG5cblx0c2V0OiBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0XHR0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkID0gUE9TSVRJT05fWTtcblx0XHRcblx0XHR0aGlzLl9vZmZZICs9IHZhbHVlIC0gdGhpcy5feTtcblxuXHRcdGlmKCB0aGlzLmhhc0JlZW5MYXllZE91dCApIHtcblxuXHRcdFx0dGhpcy5sYXlvdXQubm9kZUNoYW5nZWQoIHRoaXMgKTtcblx0XHR9XG5cdH1cbn0pO1xuXG4vKipcblRoaXMgaXMgdGhlIHdpZHRoIG9mIGEgTGF5b3V0Tm9kZSBvbiBzY3JlZW4uIEluaXRpYWxseSB0aGUgdmFsdWUgb2Ygd2lkdGggd2lsbCBiZSAwIHVudGlsIHRoaXMgbm9kZSBoYXMgYmVlbiBsYXllZCBvdXQuXG5cbk9uY2UgdGhpcyBub2RlIGhhcyBiZWVuIGxheWVkIG91dCB0aGUgd2lkdGggd2lsbCBiZSBzZXQgZnJvbSBhbGwgdGhlIHJ1bGVzIGFwcGxpZWQgdG8gdGhpcyBub2RlIG9yIHJlYWQgaW4gYnkgdGhlIHJlYWQgZnVuY3Rpb24uXG5cbllvdSBjYW4gYWxzbyBzZXQgdGhlIHdpZHRoIG9mIGEgbm9kZSBieSBzaW1wbHkgc2V0dGluZyB0aGUgd2lkdGggdmFsdWU6XG5cblx0bm9kZS53aWR0aCA9IDIwMDtcblxuV2hhdCB0aGlzIHdpbGwgZG8gaXMgYWRqdXN0IGFuIG9mZnNldCBpbiB0aGlzIExheW91dE5vZGUuIFNvIGluIHByYWN0aWNlIHdoYXQgdGhpcyBtZWFucyBpcyB0aGF0IHlvdSBjYW4gc2V0IHRoZSBzaXplcyBvZiBub2Rlc1xuYW5kIHN0aWxsIGFsbCBkZXBlbmRlbnQgbm9kZXMgd2lsbCBmb2xsb3cgdGhlaXIgZGVwZW5kZW5jeSBydWxlcy5cblxuU28gbGV0J3Mgc2F5IHlvdSBoYWQgYW4gaW1hZ2UgY2FsbGVkIGltYWdlMSB3aGljaCB5b3Ugd2FudGVkIHRvIHNjYWxlIHVwIGhvd2V2ZXIgYW5vdGhlciBpbWFnZSBjYWxsZWQgaW1hZ2UyIGFsaWduZWQgbGVmdCBvZiBpbWFnZTEuXG5Zb3UgY2FuIHN0aWxsIHNldCBpbWFnZTEud2lkdGggdG8gYmUgd2hhdGV2ZXIgdmFsdWUgeW91IHdhbnRlZCBhbmQgaW1hZ2UyIHdvdWxkIGFsaWduIGxlZnQgb2YgaW1hZ2UxLlxuXG5AcHJvcGVydHkgd2lkdGhcbkB0eXBlIE51bWJlclxuKiovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoIExheW91dE5vZGUucHJvdG90eXBlLCAnd2lkdGgnLCB7XG5cblx0Z2V0OiBmdW5jdGlvbigpIHtcblxuXHRcdHJldHVybiB0aGlzLl93aWR0aDtcblx0fSxcblxuXHRzZXQ6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRcdHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgPSBTSVpFX1dJRFRIO1xuXG5cdFx0dGhpcy5fb2ZmV2lkdGggKz0gdmFsdWUgLSB0aGlzLl93aWR0aDtcblxuXHRcdGlmKCB0aGlzLmhhc0JlZW5MYXllZE91dCApIHtcblx0XHRcdFxuXHRcdFx0dGhpcy5sYXlvdXQubm9kZUNoYW5nZWQoIHRoaXMgKTtcblx0XHR9XG5cdH1cbn0pO1xuXG4vKipcblRoaXMgaXMgdGhlIGhlaWdodCBvZiBhIExheW91dE5vZGUgb24gc2NyZWVuLiBJbml0aWFsbHkgdGhlIHZhbHVlIG9mIGhlaWdodCB3aWxsIGJlIDAgdW50aWwgdGhpcyBub2RlIGhhcyBiZWVuIGxheWVkIG91dC5cblxuT25jZSB0aGlzIG5vZGUgaGFzIGJlZW4gbGF5ZWQgb3V0IHRoZSBoZWlnaHQgd2lsbCBiZSBzZXQgZnJvbSBhbGwgdGhlIHJ1bGVzIGFwcGxpZWQgdG8gdGhpcyBub2RlIG9yIHJlYWQgaW4gYnkgdGhlIHJlYWQgZnVuY3Rpb24uXG5cbllvdSBjYW4gYWxzbyBzZXQgdGhlIGhlaWdodCBvZiBhIG5vZGUgYnkgc2ltcGx5IHNldHRpbmcgdGhlIGhlaWdodCB2YWx1ZTpcblxuXHRub2RlLmhlaWdodCA9IDMzMztcblxuV2hhdCB0aGlzIHdpbGwgZG8gaXMgYWRqdXN0IGFuIG9mZnNldCBpbiB0aGlzIExheW91dE5vZGUuIFNvIGluIHByYWN0aWNlIHdoYXQgdGhpcyBtZWFucyBpcyB0aGF0IHlvdSBjYW4gc2V0IHRoZSBzaXplcyBvZiBub2Rlc1xuYW5kIHN0aWxsIGFsbCBkZXBlbmRlbnQgbm9kZXMgd2lsbCBmb2xsb3cgdGhlaXIgZGVwZW5kZW5jeSBydWxlcy5cblxuU28gbGV0J3Mgc2F5IHlvdSBoYWQgYW4gaW1hZ2UgY2FsbGVkIGltYWdlMSB3aGljaCB5b3Ugd2FudGVkIHRvIHNjYWxlIHVwIGhvd2V2ZXIgYW5vdGhlciBpbWFnZSBjYWxsZWQgaW1hZ2UyIGFsaWduZWQgYmVsb3cgaW1hZ2UxLlxuWW91IGNhbiBzdGlsbCBzZXQgaW1hZ2UxLmhlaWdodCB0byBiZSB3aGF0ZXZlciB2YWx1ZSB5b3Ugd2FudGVkIGFuZCBpbWFnZTIgd291bGQgYWxpZ24gYmVsb3cgaW1hZ2UxLlxuXG5AcHJvcGVydHkgd2lkdGhcbkB0eXBlIE51bWJlclxuKiovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoIExheW91dE5vZGUucHJvdG90eXBlLCAnaGVpZ2h0Jywge1xuXG5cdGdldDogZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5faGVpZ2h0O1xuXHR9LFxuXG5cdHNldDogZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdFx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IFNJWkVfSEVJR0hUO1xuXG5cdFx0dGhpcy5fb2ZmSGVpZ2h0ICs9IHZhbHVlIC0gdGhpcy5faGVpZ2h0O1xuXG5cdFx0aWYoIHRoaXMuaGFzQmVlbkxheWVkT3V0ICkge1xuXHRcdFx0XG5cdFx0XHR0aGlzLmxheW91dC5ub2RlQ2hhbmdlZCggdGhpcyApO1xuXHRcdH1cblx0fVxufSk7XG5cblxuLyoqXG5Jbm5lciBpcyBhIExheW91dE5vZGUgdGhhdCBpcyBjb250YWluZWQgYnkgdGhpcyBMYXlvdXROb2RlLiBJbm5lciB3aWxsIG1hdGNoIHRoZSBzaXplIG9mIHRoaXMgbm9kZSBidXQgd2lsbCBoYXZlIG5vIHBvc2l0b25hbCB2YWx1ZXMuXG5cbkl0IGlzIHVzZWZ1bCB3aGVuIHdvcmtpbmcgd2l0aCB0aGUgRE9NIHRvIGhhbmRsZSBuZXN0ZWQgY29udGVudCBpbnNpZGUgaHRtbCBlbGVtZW50cy4gRm9yIGluc3RhbmNlIGlmIHdlIGhhdmUgYSBkaXYgd2l0aCBhbiBpbWFnZSBpbnNpZGUuIFlvdSBjYW5cbmNhbiBhcHBseSBhIExheW91dE5vZGUgdG8gdGhlIGRpdiBhbmQgdXNlIHRoZSBpbm5lciBhdHRyaWJ1dGUgdG8gY2VudGVyIHRoZSBpbWFnZSBpbnNpZGUuXG5cblx0dmFyIG91ckRpdiA9IGxheW91dC5jcmVhdGUoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnb3VyRGl2JyApICk7XG5cdHZhciBvdXJJbWFnZUluc2lkZURpdiA9IGxheW91dC5jcmVhdGUoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnb3VySW1hZ2VJbnNpZGVEaXYnICkgKTtcblxuXHRvdXJEaXYubWF0Y2hlc1NpemVPZiggbGF5b3V0ICk7XG5cdG91ckltYWdlSW5zaWRlRGl2Lm1hdGNoZXNXaWR0aE9mKCBvdXJEaXYuaW5uZXIgKS5oZWlnaHRJc1Byb3BvcnRpb25hbCggNDAwLCAzMDAgKS5jZW50ZXJlZFdpdGgoIG91ckRpdi5pbm5lciApO1xuXG5AcHJvcGVydHkgaW5uZXJcbkB0eXBlIExheW91dE5vZGVcbioqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KCBMYXlvdXROb2RlLnByb3RvdHlwZSwgJ2lubmVyJywge1xuXG5cdGdldDogZnVuY3Rpb24oKSB7XG5cblx0XHRpZiggdGhpcy5faW5uZXIgPT09IG51bGwgKSB7XG5cblx0XHRcdHRoaXMuX2lubmVyID0gdGhpcy5sYXlvdXQuY3JlYXRlKCk7XG5cdFx0XHR0aGlzLl9pbm5lci5tYXRjaGVzU2l6ZU9mKCB0aGlzICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX2lubmVyO1xuXHR9XG59KTtcblxuLyoqXG5kb0xheW91dCB3aWxsIHBlcmZvcm0gdGhlIGxheW91dCBvZiB0aGlzIExheW91dE5vZGUuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIG5ldmVyIGJlIGNhbGxlZCBkaXJlY3RseSBidXQgYmUgY2FsbGVkIGJ5IHRoZSBMYXlEb3duIGxheW91dC5cblRoaXMgd2F5IGRlcGVuZGVuY2llcyB3aWxsIGJlIGhhbmRsZWQgY29ycmVjdGx5LlxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgeW91IGhhdmUgb25lIExheW91dE5vZGUgd2hpY2ggc2V0cyBpdCdzIHNpemUgYWNjb3JkaW5nIHRvIGFub3RoZXIgbm9kZSBjYWxsaW5nIGRvTGF5b3V0IG1hbnVhbGx5IGNvdWxkIHBvdGVudGlhbGx5IGJlXG5kZXN0cnVjdGl2ZS5cblxuQWx0aG91Z2ggdGhpcyBpcyB0aGUgZW50cnkgcG9pbnQgdG8gcGVyZm9ybSBsYXlvdXRzIHRoZSBhY3R1YWwgZ3J1bnQgd29yayBpcyBwZXJmb3JtZWQgaW4gdGhlIFwiZG9MYXlvdXRXb3JrXCIgZnVuY3Rpb24uIFRoaXMgZnVuY3Rpb24gd2lsbFxuZXZhbHVhdGUgY29uZGl0aW9uYWxzIChpZiB0aGVyZSBhcmUgYW55KSBhbmQgZ3JhYiB0aGUgYXBwcm9wcmlhdGUgcnVsZSBzZXRzIHRvIHVzZS4gQWZ0ZXIgdGhlIHJ1bGUgc2V0cyBhcmUgZGV0ZXJtaW5lZCBieSB0aGUgY29uZGl0aW9uYWxzXG5kb0xheW91dFdvcmsgaXMgY2FsbGVkLlxuXG5AcHJvdGVjdGVkXG5AbWV0aG9kIGRvTGF5b3V0XG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmRvTGF5b3V0ID0gZnVuY3Rpb24oKSB7XG5cblx0dGhpcy5oYXNCZWVuTGF5ZWRPdXQgPSB0cnVlO1xuXG5cdHRoaXMuX3ggPSB0aGlzLl95ID0gdGhpcy5fd2lkdGggPSB0aGlzLl9oZWlnaHQgPSAwO1xuXHR0aGlzLmRvTGF5b3V0V29yaygpO1xuXG5cdC8vdGhpcyBpcyB0aGUgbGlzdGVuZXIgYWRkZWQgd2hlbiBhbiBvbiBmdW5jdGlvbiB3YXMgY2FsbGVkIGFmdGVyIGNyZWF0aW5nIGEgY29uZGl0aW9uYWxcblx0dmFyIGxpc3RlbmVyRm9yQ29uZGl0aW9uYWwgPSBudWxsO1xuXG5cdGlmKCB0aGlzLml0ZW1zVG9Db21wYXJlLmxlbmd0aCA+IDAgKSB7XG5cblx0XHR2YXIgY29uZGl0aW9uYWxMYXllZE91dCA9IGZhbHNlO1xuXG5cdFx0Zm9yKCB2YXIgaSA9IDAsIGxlbkkgPSB0aGlzLml0ZW1zVG9Db21wYXJlLmxlbmd0aDsgaSA8IGxlbkk7IGkrKyApIHtcblxuXHRcdFx0dmFyIGxheW91dE5vZGUgPSB0aGlzLmxheW91dE5vZGVGb3JDb25kaXRpb25hbFsgaSBdO1xuXHRcdFx0dmFyIGl0ZW1zVG9Db21wYXJlVG8gPSB0aGlzLml0ZW1zVG9Db21wYXJlWyBpIF07XG5cdFx0XHR2YXIgaXNDb25kaXRpb25hbFZhbGlkID0gdHJ1ZTtcblxuXHRcdFx0Zm9yKCB2YXIgaiA9IDAsIGxlbkogPSBpdGVtc1RvQ29tcGFyZVRvLmxlbmd0aDsgaXNDb25kaXRpb25hbFZhbGlkICYmIGogPCBsZW5KOyBqKysgKSB7XG5cblx0XHRcdFx0dmFyIGNvbmRpdGlvbmFscyA9IHRoaXMuY29uZGl0aW9uYWxzRm9ySXRlbVsgaSBdWyBqIF07XG5cdFx0XHRcdHZhciBhcmd1bWVudHNGb3JDb25kaXRpb25hbHMgPSB0aGlzLmNvbmRpdGlvbmFsc0FyZ3VtZW50c0Zvckl0ZW1bIGkgXVsgaiBdO1xuXHRcdFx0XHRcblx0XHRcdFx0Zm9yKCB2YXIgayA9IDAsIGxlbksgPSBjb25kaXRpb25hbHMubGVuZ3RoOyBpc0NvbmRpdGlvbmFsVmFsaWQgJiYgayA8IGxlbks7IGsrKyApIHtcblxuXHRcdFx0XHRcdGlzQ29uZGl0aW9uYWxWYWxpZCA9IGNvbmRpdGlvbmFsc1sgayBdLmFwcGx5KCBpdGVtc1RvQ29tcGFyZVRvWyBrIF0sIGFyZ3VtZW50c0ZvckNvbmRpdGlvbmFsc1sgayBdICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly9pZiB0aGUgY29uZGl0aW9uYWwgaXMgc3RpbGwgdmFsaWQgYWZ0ZXJcblx0XHRcdC8vYWxsIHRoZSB0ZXN0cyB0aGVuIHdlIHNob3VsZCBkbyBsYXlvdXQgd2l0aCB0aGlzIG90aGVyIG5vZGVcblx0XHRcdC8vaW5zdGVhZCBvZiBcInRoaXNcIiB3aGljaCBpcyBub3cgY29uc2lkZXJlZCB0aGUgZGVmYXVsdCB2YWx1ZVxuXHRcdFx0aWYoIGlzQ29uZGl0aW9uYWxWYWxpZCApIHtcblxuXHRcdFx0XHRsYXlvdXROb2RlLmRvTGF5b3V0KCk7XG5cblx0XHRcdFx0Y29uZGl0aW9uYWxMYXllZE91dCA9IHRydWU7XG5cblx0XHRcdFx0bGlzdGVuZXJGb3JDb25kaXRpb25hbCA9IHRoaXMuY29uZGl0aW9uYWxMaXN0ZW5lcnNbIGkgXTtcblxuXHRcdFx0XHQvL3NpbmNlIGxheW91dCBpcyBwZXJmb3JtZWQgd2UnbGwganVzdCBleGl0IHRoaXMgZnVuY3Rpb25cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGlmKCB0aGlzLmNvbmRpdGlvbmFsTGlzdGVuZXJzWyBpIF0gKSB7XG5cblx0XHRcdFx0XHR0aGlzLmNvbmRpdGlvbmFsTGlzdGVuZXJzWyBpIF0oIGZhbHNlICk7XG5cdFx0XHRcdH1cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vaWYgYWxsIG9mIHRoZSBhYm92ZSBldmFsdWF0ZWQgZmFsc2UgdGhlbiB3ZSdsbCBnZXQgaGVyZVxuXHRcdC8vaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGQgY2hlY2sgaWYgdGhlcmVzIGEgZGVmYXVsdFxuXHRcdGlmKCAhY29uZGl0aW9uYWxMYXllZE91dCAmJiB0aGlzLmxheW91dE5vZGVGb3JEZWZhdWx0ICkge1xuXG5cdFx0XHRsaXN0ZW5lckZvckNvbmRpdGlvbmFsID0gdGhpcy5kZWZhdWx0Q29uZGl0aW9uYWxMaXN0ZW5lcjtcblxuXHRcdFx0dGhpcy5sYXlvdXROb2RlRm9yRGVmYXVsdC5kb0xheW91dCgpO1xuXHRcdH1cblx0fVxuXG5cdC8vSWYgdGhpcyBsYXlveXQgbm9kZSBoYXMgc29tZXRoaW5nIHRvIHBvc2l0aW9uIGFuZCBzaXplIGFuZCBoYXMgYSBsYXlvdXQgZnVuY3Rpb24gcnVuIGl0XG5cdGlmKCB0aGlzLml0ZW0gJiYgdGhpcy5sYXlvdXRGdW5jdGlvbiApIHtcblx0XHRcblx0XHR0aGlzLmxheW91dEZ1bmN0aW9uKCB0aGlzLml0ZW0sIHRoaXMsIHRoaXMuZG9Ob3RSZWFkV2lkdGgsIHRoaXMuZG9Ob3RSZWFkSGVpZ2h0ICk7XG5cdH1cblxuXHQvL2lmIGEgY29uZGl0aW9uYWwgaGFzIGJlZW4gdmFsaWRhdGVkIGl0IHNob3VsZCBiZSBjYWxsZWQgbm93XG5cdGlmKCBsaXN0ZW5lckZvckNvbmRpdGlvbmFsICkge1xuXG5cdFx0bGlzdGVuZXJGb3JDb25kaXRpb25hbCggdHJ1ZSApO1xuXHR9XG59O1xuXG5cbi8qKlxuZG9MYXlvdXRXb3JrIHdpbGwgcGVyZm9ybSB0aGUgbGF5b3V0IHdvcmsgb2YgdGhpcyBMYXlvdXROb2RlLiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBuZXZlciBiZSBjYWxsZWQgZGlyZWN0bHkgYnV0IGJlIGNhbGxlZCBieSBkb0xheW91dCBhZnRlclxuYWxsIGNvbmRpdGlvbmFscyAoaWYgYW55KSBhcmUgZXZhbHVhdGVkLlxuXG5UaGlzIGZ1bmN0aW9uIGVuc3VyZXMgZXZlcnl0aGluZyBpcyBldmFsdWF0ZWQgaW4gY29ycmVjdCBvcmRlcjpcblxuMS4gU2l6ZSBEZXBlbmRlbmNpZXNcbjIuIFBvc2l0aW9uIERlcGVuZGVuY2llc1xuMy4gU2l6ZSBSdWxlc1xuNC4gU2l6ZSBCb3VuZHNcbjUuIFNpemUgT2Zmc2V0c1xuNi4gU2l6ZSBCb3VuZHMgKGFnYWluIGFmdGVyIHNpemUgb2Zmc2V0KVxuNy4gUmVhZGluZyB3aWR0aCwgaGVpZ2h0IGlmIHRoZXkgd2VyZSBub3Qgc2V0XG44LiBQb3NpdGlvbiBydWxlc1xuOS4gUG9zaXRpb25hbCBCb3VuZHNcbjEwLiBQb3NpdGlvbmFsIE9mZnNldHNcbjExLiBQb3NpdGlvbmFsIEJvdW5kcyAoYWdhaW4gYWZ0ZXIgcG9zaXRpb24gb2Zmc2V0KVxuXG5UaGUgYmFzaWMgcnVsZSBvZiB0aHVtYiBpcyB3ZSBjYW4ndCBwb3NpdGlvbiBhbnl0aGluZyB1bnRpbCB3ZSBrbm93IGl0J3Mgc2l6ZS4gQm91bmRzIGFyZSB1c2VkIHRvIGVuc3VyZSB0aGluZ3MgZG9uJ3QgZ28gb2ZmIHNjcmVlbiwgZ2V0IHRvbyBiaWcgb3Igc21hbGwuXG5cbkBwcm90ZWN0ZWRcbkBtZXRob2QgZG9MYXlvdXRXb3JrXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmRvTGF5b3V0V29yayA9IGZ1bmN0aW9uKCkge1xuXG5cdGZvciggdmFyIGkgPSAwLCBsZW4gPSB0aGlzLnNpemVEZXBlbmRlbmNpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHRpZiggIXRoaXMuc2l6ZURlcGVuZGVuY2llc1sgaSBdLmhhc0JlZW5MYXllZE91dCApIHtcblxuXHRcdFx0dGhpcy5zaXplRGVwZW5kZW5jaWVzWyBpIF0uZG9MYXlvdXQoKTtcblx0XHR9XG5cdH1cdFxuXG5cdGZvciggdmFyIGkgPSAwLCBsZW4gPSB0aGlzLnBvc2l0aW9uRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXG5cdFx0aWYoICF0aGlzLnBvc2l0aW9uRGVwZW5kZW5jaWVzWyBpIF0uaGFzQmVlbkxheWVkT3V0ICkge1xuXG5cdFx0XHR0aGlzLnBvc2l0aW9uRGVwZW5kZW5jaWVzWyBpIF0uZG9MYXlvdXQoKTtcblx0XHR9XG5cdH1cdFxuXG5cblx0Ly9IQU5ETEUgU0laRVxuXHRmb3IoIHZhciBpID0gMCwgbGVuID0gdGhpcy5ydWxlc1NpemUubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHR0aGlzLnJ1bGVzU2l6ZVsgaSBdLmFwcGx5KCB0aGlzLCB0aGlzLnJ1bGVzU2l6ZVByb3BbIGkgXSApO1xuXG5cdFx0Ly9IQU5ETEUgQk9VTkRJTkcgU0laRVxuXHRcdGZvciggdmFyIGogPSAwLCBsZW5KID0gdGhpcy5ydWxlc1NpemVCb3VuZC5sZW5ndGg7IGogPCBsZW5KOyBqKysgKSB7XG5cblx0XHRcdHRoaXMucnVsZXNTaXplQm91bmRbIGogXS5hcHBseSggdGhpcywgdGhpcy5ydWxlc1NpemVCb3VuZFByb3BbIGogXSApO1xuXHRcdH1cblx0fVxuXG5cdHRoaXMuX3dpZHRoICs9IHRoaXMuX29mZldpZHRoO1xuXHR0aGlzLl9oZWlnaHQgKz0gdGhpcy5fb2ZmSGVpZ2h0O1xuXG5cdGZvciggdmFyIGogPSAwLCBsZW5KID0gdGhpcy5ydWxlc1NpemVCb3VuZC5sZW5ndGg7IGogPCBsZW5KOyBqKysgKSB7XG5cblx0XHR0aGlzLnJ1bGVzU2l6ZUJvdW5kWyBqIF0uYXBwbHkoIHRoaXMsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wWyBqIF0gKTtcblx0fVxuXG5cdFxuXHQvL2NoZWNrIGlmIHdlIHNob3VsZCByZWFkIGluIGEgc2l6ZSBmb3IgYW4gaXRlbVxuXHRpZiggdGhpcy5pdGVtICkge1xuXG5cdFx0aWYoIHRoaXMucmVhZEZ1bmN0aW9uICkge1xuXG5cdFx0XHRpZiggIXRoaXMuZG9Ob3RSZWFkV2lkdGggJiYgIXRoaXMuZG9Ob3RSZWFkV2lkdGggKSB7XG5cblx0XHRcdFx0dGhpcy5fd2lkdGggPSB0aGlzLnJlYWRGdW5jdGlvbiggdGhpcy5pdGVtLCAnd2lkdGgnICk7XG5cdFx0XHRcdHRoaXMuX2hlaWdodCA9IHRoaXMucmVhZEZ1bmN0aW9uKCB0aGlzLml0ZW0sICdoZWlnaHQnICk7XG5cdFx0XHR9IGVsc2UgaWYoICF0aGlzLmRvTm90UmVhZFdpZHRoICkge1xuXG5cdFx0XHRcdHRoaXMuX3dpZHRoID0gdGhpcy5yZWFkRnVuY3Rpb24oIHRoaXMuaXRlbSwgJ3dpZHRoJyApO1xuXHRcdFx0fSBlbHNlIGlmKCAhdGhpcy5kb05vdFJlYWRIZWlnaHQgKSB7XG5cblx0XHRcdFx0dGhpcy5faGVpZ2h0ID0gdGhpcy5yZWFkRnVuY3Rpb24oIHRoaXMuaXRlbSwgJ2hlaWdodCcgKTtcblx0XHRcdH1cblx0XHR9XHRcblx0fVxuXG5cblxuXG5cdC8vSEFORExFIFBPU0lUSU9OXG5cdGZvciggdmFyIGkgPSAwLCBsZW4gPSB0aGlzLnJ1bGVzUG9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXG5cdFx0dGhpcy5ydWxlc1Bvc1sgaSBdLmFwcGx5KCB0aGlzLCB0aGlzLnJ1bGVzUG9zUHJvcFsgaSBdICk7XG5cblx0XHQvL0hBTkRMRSBCT1VORElORyBQT1NJVElPTlxuXHRcdGZvciggdmFyIGogPSAwLCBsZW5KID0gdGhpcy5ydWxlc1Bvc0JvdW5kLmxlbmd0aDsgaiA8IGxlbko7IGorKyApIHtcblxuXHRcdFx0dGhpcy5ydWxlc1Bvc0JvdW5kWyBqIF0uYXBwbHkoIHRoaXMsIHRoaXMucnVsZXNQb3NCb3VuZFByb3BbIGogXSApO1xuXHRcdH1cblx0fVxuXG5cdHRoaXMuX3ggKz0gdGhpcy5fb2ZmWDtcblx0dGhpcy5feSArPSB0aGlzLl9vZmZZO1xuXG5cdGZvciggdmFyIGogPSAwLCBsZW5KID0gdGhpcy5ydWxlc1Bvc0JvdW5kLmxlbmd0aDsgaiA8IGxlbko7IGorKyApIHtcblxuXHRcdHRoaXMucnVsZXNQb3NCb3VuZFsgaiBdLmFwcGx5KCB0aGlzLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wWyBqIF0gKTtcblx0fVxuXG5cdC8vYmVjYXVzZSBvdGhlciBpdGVtcyB3aWxsIGFjdHVhbGx5IHJlbHkgb24gdGhlIHZhbHVlcyBvZiB0aGVcblx0Ly9wYXJlbnQgbm9kZSBvZiBhIGNvbmRpdGlvbmFsIG5vZGUgdGhlbiB3ZSBuZWVkIHRvIHNldCB0aGUgX3gsIF95LCBfd2lkdGgsIF9oZWlnaHRcblx0Ly9mb3IgdGhlIHBhcmVudCBhbHNvXG5cdGlmKCB0aGlzLmNvbmRpdGlvbmFsUGFyZW50ICE9IG51bGwgKSB7XG5cblx0XHR0aGlzLmNvbmRpdGlvbmFsUGFyZW50Ll94ICs9IHRoaXMuX3g7XG5cdFx0dGhpcy5jb25kaXRpb25hbFBhcmVudC5feSArPSB0aGlzLl95O1xuXHRcdHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuX3dpZHRoICs9IHRoaXMuX3dpZHRoO1xuXHRcdHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuX2hlaWdodCArPSB0aGlzLl9oZWlnaHQ7XG5cdH1cbn07XG5cbi8qKlxuVXNlIHRoaXMgZnVuY3Rpb24gdG8gc2V0IHRoZSBsYXlvdXQgZnVuY3Rpb24gZm9yIHRoaXMgbm9kZS4gTGF5b3V0IGZ1bmN0aW9ucyBwZXJmb3JtIHRoZSBhY3R1YWwgd29yayB0byBtb3ZlIHRoaW5ncyBvbiBzY3JlZW4uIExheW91dE5vZGUncyBhbmQgcnVsZXNcbm9uIExheW91dE5vZGUncyBwZXJmb3JtIHRoZSB2aXJ0dWFsIHBvc2l0aW9uaW5nIG9mIGFuIG9iamVjdCB3aGVyZSB0aGUgbGF5b3V0RnVuY3Rpb24gcGVyZm9ybXMgdGhlIGFjdHVhbCBwaHlzaWNhbC5cblxuRm9yIGluc3RhbmNlIGlmIHlvdSdyZSB3b3JraW5nIHdpdGggdGhlIERPTSB0aGUgbGF5b3V0RnVuY3Rpb24gY291bGQgc2V0IENTUyB3aWR0aCBhbmQgaGVpZ2h0IHByb3BlcnRpZXMgb3Igc2NhbGUuIE9yIGlmIHlvdSByZWFsbHkgd2FudGVkIHRvIGdldCBmYW5jeVxuaXQgY291bGQgcGVyZm9ybSBhbiBhbmltYXRpb24gdG8gcG9zaXRpb24gdGhlIEhUTUwgZWxlbWVudC5cblxuQG1ldGhvZCBzZXRMYXlvdXRGdW5jdGlvblxuQHBhcmFtIGxheW91dEZ1bmN0aW9uIHtmdW5jdGlvbn0gVGhpcyBpcyB0aGUgbGF5b3V0IGZ1bmN0aW9uIHRoYXQgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUuXG5cbkxheW91dCBmdW5jdGlvbidzIHNob3VsZCB0YWtlIGZvdXIgcHJvcGVydGllczogaXRlbSwgbm9kZSwgc2V0V2lkdGgsIHNldEhlaWdodC4gXG5cbisgV2hlcmUgaXRlbSBpcyB0aGUgaXRlbSB0byBsYXlvdXQgKERPTSBlbGVtZW50IG9yIFBJWEkgRGlzcGxheU9iamVjdClcbisgbm9kZSB3aWxsIGJlIGEgTGF5b3V0Tm9kZSBmcm9tIHdoaWNoIHlvdSBjYW4gcmVhZCB4LCB5LCB3aWR0aCwgaGVpZ2h0XG4rIHNldFdpZHRoIHdpbGwgYmUgYSBib29sZWFuIGZvciB3aGV0aGVyIHRoZSBsYXlvdXQgZnVuY3Rpb24gc2hvdWxkIHNldCB0aGUgd2lkdGggb2YgdGhlIGl0ZW1cbisgc2V0SGVpZ2h0IHdpbGwgYmUgYSBib29sZWFuIGZvciB3aGV0aGVyIHRoZSBsYXlvdXQgZnVuY3Rpb24gc2hvdWxkIHNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpdGVtXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnNldExheW91dEZ1bmN0aW9uID0gZnVuY3Rpb24oIGxheW91dEZ1bmN0aW9uICkge1xuXG5cdHRoaXMubGF5b3V0RnVuY3Rpb24gPSBsYXlvdXRGdW5jdGlvbjtcblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuWW91IGNhbiB1c2UgYWRkQ3VzdG9tUnVsZSB0byBkZWZpbmUgbmV3IHJ1bGVzIHdoaWNoIG1heSBub3QgYmUgZGVmaW5lZCBieSBMYXlEb3duLiBUaGlzIGNvdWxkIGJlIGhhbmR5IGZvciBpbnN0YW5jZSBpZiB5b3Ugd2FudGVkIHRvIHNldCB0aGVcbmNvbG91ciBvZiBhIERJViBlbGVtZW50IGJhc2VkIG9uIGhvdyBsYXJnZSBpdCBpcy4gUmVhbGx5IHRoZSBza3kgaXMgdGhlIGxpbWl0IGhlcmUuIEFsdGhvdWdoIHRvIGVuc3VyZSB5b3VyIG5ldyBydWxlIGlzIHBlcmZvcm1lZCBjb3JyZWN0bHkgYW5kXG5kb2VzIG5vdCBpbnRlcmZlcmUgd2l0aCBvdGhlciBydWxlcyB5b3UgbXVzdCBwYXNzIGluIGEgcnVsZSB0eXBlLlxuXG5AbWV0aG9kIGFkZEN1c3RvbVJ1bGVcbkBwYXJhbSB7ZnVuY3Rpb259IHJ1bGVGdW5jdGlvbiBUaGlzIGEgbmV3IHJ1bGUgeW91J2QgbGlrZSB0byBhZGQuIFRvIHNlZSBob3cgcnVsZXMgYXJlIGNvbXBvc2VkIHdlIHN1Z2dlc3QgbG9va2luZyBhdCB0aGUgZm9sbG93aW5nIGZ1bmN0aW9uc1xuaW4gdGhlIHNyYyBmb2xkZXIuXG5cbiMjIyMjIyBTZXR0aW5nIHNpemUgKHdpZHRoLCBoZWlnaHQpOlxuLSBzcmMvbGF5b3V0U2l6ZS9zaXplSXMgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IGF0IHRoZSBzYW1lIHRpbWUgZnJvbSB2YWx1ZXMpXG4tIHNyYy9sYXlvdXRTaXplL3dpZHRoSXMgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgb25seSB0aGUgd2lkdGggZnJvbSBhIHZhbHVlKVxuLSBzcmMvbGF5b3V0U2l6ZS9oZWlnaHRJcyAoaWYgeW91ciBydWxlIHdpbGwgYmUgc2V0dGluZyBvbmx5IHRoZSBoZWlnaHQgZnJvbSBhIHZhbHVlKVxuLSBzcmMvbGF5b3V0U2l6ZS9tYXRjaGVzU2l6ZU9mIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIGJvdGggd2lkdGggYW5kIGhlaWdodCBmcm9tIGFub3RoZXIgbm9kZSlcbi0gc3JjL2xheW91dFNpemUvbWF0Y2hlc1dpZHRoT2YgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgYm90aCB3aWR0aCBmcm9tIGFub3RoZXIgbm9kZSlcbi0gc3JjL2xheW91dFNpemUvbWF0Y2hlc0hlaWdodE9mIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIGJvdGggaGVpZ2h0IGZyb20gYW5vdGhlciBub2RlKVxuXG4jIyMjIyMgU2V0dGluZyBwb3NpdGlvbiAoeCwgeSk6XG4tIHNyYy9sYXlvdXRQb3NpdGlvbi9wb3NpdGlvbklzIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIHggYW5kIHkgZnJvbSBhIHZhbHVlcyBhdCB0aGUgc2FtZSB0aW1lKVxuLSBzcmMvbGF5b3V0UG9zaXRpb24veElzIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIHggZnJvbSBhIHZhbHVlKVxuLSBzcmMvbGF5b3V0UG9zaXRpb24veUlzIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBzZXR0aW5nIHkgZnJvbSBhIHZhbHVlKVxuLSBzcmMvbGF5b3V0UG9zaXRpb24vYWxpZ25lZFdpdGggKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgeCBhbmQgeSBiYXNlZCBvbiBhbm90aGVyIG5vZGUpXG4tIHNyYy9sYXlvdXRQb3NpdGlvbi9sZWZ0QWxpZ25lZFdpdGggKGlmIHlvdXIgcnVsZSB3aWxsIGJlIHNldHRpbmcgeCBiYXNlZCBvbiBhbm90aGVyIG5vZGUpXG4tIHNyYy9sYXlvdXRQb3NpdGlvbi90b3BBbGlnbmVkV2l0aCAoaWYgeW91ciBydWxlIHdpbGwgYmUgc2V0dGluZyB5IGJhc2VkIG9uIGFub3RoZXIgbm9kZSlcblxuIyMjIyMjIEJvdW5kaW5nIHNpemUgKHdpZHRoLCBoZWlnaHQpOlxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heFNpemUgKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIGJvdGggd2lkdGggYW5kIGhlaWdodCBhdCB0aGUgc2FtZSB0aW1lKVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heFdpZHRoIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBib3VuZGluZyB3aWR0aCBvbmx5KVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heEhlaWdodCAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgaGVpZ2h0IG9ubHkpXG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbWF4U2l6ZUZyb20gKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIHdpZHRoIGFuZCBoZWlnaHQgYmFzZWQgb24gYW5vdGhlciBpdGVtKVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heFdpZHRoRnJvbSAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgd2lkdGggYmFzZWQgb24gYW5vdGhlciBpdGVtKVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heEhlaWdodEZyb20gKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIGhlaWdodCBiYXNlZCBvbiBhbm90aGVyIGl0ZW0pXG5cbiMjIyMjIyBCb3VuZGluZyBwb3NpdGlvbiAoeCwgeSk6XG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbWF4UG9zaXRpb24gKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIGJvdGggeCBhbmQgeSBhdCB0aGUgc2FtZSB0aW1lKVxuLSBzcmMvbGF5b3V0Qm91bmRTaXplL21heFggKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIHggb25seSlcbi0gc3JjL2xheW91dEJvdW5kU2l6ZS9tYXhZIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBib3VuZGluZyB5IG9ubHkpXG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbWF4UG9zaXRpb25Gcm9tIChpZiB5b3VyIHJ1bGUgd2lsbCBiZSBib3VuZGluZyB4IGFuZCB5IGJhc2VkIG9uIGFub3RoZXIgaXRlbSlcbi0gc3JjL2xheW91dEJvdW5kU2l6ZS9tYXhYRnJvbSAoaWYgeW91ciBydWxlIHdpbGwgYmUgYm91bmRpbmcgeCBiYXNlZCBvbiBhbm90aGVyIGl0ZW0pXG4tIHNyYy9sYXlvdXRCb3VuZFNpemUvbWF4WUZyb20gKGlmIHlvdXIgcnVsZSB3aWxsIGJlIGJvdW5kaW5nIHkgYmFzZWQgb24gYW5vdGhlciBpdGVtKVxuXG5AcGFyYW0ge1N0cmluZ30gcnVsZVR5cGUgaXMgYSBzdHJpbmcgd2hpY2ggZGVzY3JpYmVzIHdoYXQgdHlwZSBvZiBydWxlIHlvdSdyZSBkZWZpbmluZy4gRm9yIHV0aWxpdHkgeW91IGNhbiB1c2UgdGhlIHN0YXRpYyBjb25zdGFudHMgZGVmaW5lZFxub24gTGF5b3V0Tm9kZTpcblxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1NJWkVfTEFZT1VUOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvU0laRV9MQVlPVVQ6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cbi0ge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZS9TSVpFX0JPVU5EOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvU0laRV9XSURUSF9MQVlPVVQ6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cbi0ge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZS9TSVpFX1dJRFRIX0JPVU5EOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvU0laRV9IRUlHSFRfTEFZT1VUOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvU0laRV9IRUlHSFRfQk9VTkQ6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cbi0ge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZS9QT1NJVElPTl9MQVlPVVQ6cHJvcGVydHlcIn19e3svY3Jvc3NMaW5rfX1cbi0ge3sjY3Jvc3NMaW5rIFwiTGF5b3V0Tm9kZS9QT1NJVElPTl9CT1VORDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1BPU0lUSU9OX1hfTEFZT1VUOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvUE9TSVRJT05fWF9CT1VORDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL1BPU0lUSU9OX1lfTEFZT1VUOnByb3BlcnR5XCJ9fXt7L2Nyb3NzTGlua319XG4tIHt7I2Nyb3NzTGluayBcIkxheW91dE5vZGUvUE9TSVRJT05fWV9CT1VORDpwcm9wZXJ0eVwifX17ey9jcm9zc0xpbmt9fVxuXG5cbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuYWRkQ3VzdG9tUnVsZSA9IGZ1bmN0aW9uKCBydWxlRnVuY3Rpb24sIHJ1bGVUeXBlICkge1xuXG5cdGFyZ3VtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDIgKTtcblxuXHR2YXIgZWZmZWN0c1Byb3BlcnRpZXMgPSBudWxsO1xuXHR2YXIgcnVsZUFyciA9IG51bGw7XG5cdHZhciBydWxlUHJvcEFyciA9IG51bGw7XG5cblx0c3dpdGNoKCBydWxlVHlwZSApIHtcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5TSVpFX0xBWU9VVDpcblx0XHRcdGVmZmVjdHNQcm9wZXJ0aWVzID0gU0laRTtcblx0XHRcdHJ1bGVBcnIgPSB0aGlzLnJ1bGVzU2l6ZTtcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1NpemVQcm9wO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBMYXlvdXROb2RlLlNJWkVfQk9VTkQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFNJWkU7XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1NpemVCb3VuZDtcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1NpemVCb3VuZFByb3A7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIExheW91dE5vZGUuU0laRV9XSURUSF9MQVlPVVQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFNJWkVfV0lEVEg7XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1NpemU7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNTaXplUHJvcDtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5TSVpFX1dJRFRIX0JPVU5EOlxuXHRcdFx0ZWZmZWN0c1Byb3BlcnRpZXMgPSBTSVpFX1dJRFRIO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNTaXplQm91bmQ7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNTaXplQm91bmRQcm9wO1xuXHRcdGJyZWFrO1x0XHRcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5TSVpFX0hFSUdIVF9MQVlPVVQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFNJWkVfSEVJR0hUO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNTaXplO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzU2l6ZVByb3A7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIExheW91dE5vZGUuU0laRV9IRUlHSFRfQk9VTkQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFNJWkVfSEVJR0hUO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNTaXplQm91bmQ7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNTaXplQm91bmRQcm9wO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBMYXlvdXROb2RlLlBPU0lUSU9OX0xBWU9VVDpcblx0XHRcdGVmZmVjdHNQcm9wZXJ0aWVzID0gUE9TSVRJT047XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1Bvcztcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1Bvc1Byb3A7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIExheW91dE5vZGUuUE9TSVRJT05fQk9VTkQ6XG5cblx0XHRcdGVmZmVjdHNQcm9wZXJ0aWVzID0gUE9TSVRJT047XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1Bvc0JvdW5kO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBMYXlvdXROb2RlLlBPU0lUSU9OX1hfTEFZT1VUOlxuXHRcdFx0ZWZmZWN0c1Byb3BlcnRpZXMgPSBQT1NJVElPTl9YO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNQb3M7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMucnVsZXNQb3NQcm9wO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBMYXlvdXROb2RlLlBPU0lUSU9OX1hfQk9VTkQ6XG5cdFx0XHRlZmZlY3RzUHJvcGVydGllcyA9IFBPU0lUSU9OX1g7XG5cdFx0XHRydWxlQXJyID0gdGhpcy5ydWxlc1Bvc0JvdW5kO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wO1xuXHRcdGJyZWFrO1x0XHRcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5QT1NJVElPTl9ZX0xBWU9VVDpcblx0XHRcdGVmZmVjdHNQcm9wZXJ0aWVzID0gUE9TSVRJT05fWTtcblx0XHRcdHJ1bGVBcnIgPSB0aGlzLnJ1bGVzUG9zO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLnJ1bGVzUG9zUHJvcDtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgTGF5b3V0Tm9kZS5QT1NJVElPTl9ZX0JPVU5EOlxuXHRcdFx0ZWZmZWN0c1Byb3BlcnRpZXMgPSBQT1NJVElPTl9ZO1xuXHRcdFx0cnVsZUFyciA9IHRoaXMucnVsZXNQb3NCb3VuZDtcblx0XHRcdHJ1bGVQcm9wQXJyID0gdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcDtcblx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6IFxuXHRcdFx0dGhyb3cgJ1Vrbm93biBydWxlIHR5cGUnO1xuXHRcdGJyZWFrO1xuXHR9O1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHJ1bGVGdW5jdGlvbiwgYXJndW1lbnRzLCBydWxlQXJyLCBydWxlUHJvcEFyciwgZWZmZWN0c1Byb3BlcnRpZXMgKTtcbn07XG5cbkxheW91dE5vZGUucHJvdG90eXBlLmFkZERlcGVuZGVuY3kgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRzd2l0Y2goIHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgKSB7XG5cblx0XHRjYXNlIFNJWkU6XG5cdFx0Y2FzZSBCT1VORF9TSVpFOlxuXHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRjYXNlIEJPVU5EX1NJWkVfV0lEVEg6XG5cdFx0Y2FzZSBTSVpFX0hFSUdIVDpcblx0XHRjYXNlIEJPVU5EX1NJWkVfSEVJR0hUOlxuXG5cdFx0XHR0aGlzLnNpemVEZXBlbmRlbmNpZXMucHVzaCggaXRlbSApO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OOlxuXHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1g6XG5cdFx0Y2FzZSBQT1NJVElPTl9ZOlxuXHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWTpcblxuXHRcdFx0dGhpcy5wb3NpdGlvbkRlcGVuZGVuY2llcy5wdXNoKCBpdGVtICk7XG5cdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbkxheW91dE5vZGUucHJvdG90eXBlLnJlc2V0UnVsZXMgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLnJlc2V0U2l6ZVJ1bGVzKCk7XG5cdHRoaXMucmVzZXRQb3NpdGlvblJ1bGVzKCk7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5yZXNldFBvc2l0aW9uUnVsZXMgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkID0gbnVsbDtcblx0dGhpcy5wb3NpdGlvbkRlcGVuZGVuY2llcyA9IFtdO1xuXHR0aGlzLnJ1bGVzUG9zID0gW107XG5cdHRoaXMucnVsZXNQb3NQcm9wID0gW107XG5cdHRoaXMuX29mZlggPSB0aGlzLl9vZmZZID0gMDtcblxuXHRpZiggdGhpcy5oYXNCZWVuTGF5ZWRPdXQgKSB7XG5cdFx0XHRcblx0XHR0aGlzLmxheW91dC5ub2RlQ2hhbmdlZCggdGhpcyApO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5yZXNldFNpemVSdWxlcyA9IGZ1bmN0aW9uKCkge1xuXG5cdHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgPSBudWxsO1xuXHR0aGlzLnNpemVEZXBlbmRlbmNpZXMgPSBbXTtcblx0dGhpcy5ydWxlc1NpemUgPSBbXTtcblx0dGhpcy5ydWxlc1NpemVQcm9wID0gW107XG5cdHRoaXMuX29mZldpZHRoID0gdGhpcy5fb2ZmSGVpZ2h0ID0gMDtcblxuXHRpZiggdGhpcy5oYXNCZWVuTGF5ZWRPdXQgKSB7XG5cdFx0XHRcblx0XHR0aGlzLmxheW91dC5ub2RlQ2hhbmdlZCggdGhpcyApO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcblRoaXMgaXMgYSB1dGlsaXR5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBMYXlvdXROb2RlLiBJdCB3aWxsIHVzZSB0aGUgcGFyZW50IGxheW91dCAoTGF5RG93bikgb2YgdGhpcyBub2RlLlxuXG5UaGlzIGlzIGJhc2ljYWxseSBmb3IgdGhvc2UgcGVlcHMgd2hvIGxvdmVzIHRoZW0gY2hhaW5pbmdzLiAoZG9uJ3QgZ2V0IHRvbyBjcmF6eSB0aG91Z2gpXG5cbkBtZXRob2QgY3JlYXRlXG5AcGFyYW0gaXRlbVRvTGF5RG93biB7T2JqZWN0fSBUaGlzIGlzIGEgbmV3IGl0ZW0gdG8gYmUgbGFpZCBvdXQuIGVnLiBBIERPTSBlbGVtZW50IG9yIGEgRGl4aURpc3BsYXlPYmplY3Qgb3Igd2hhdGV2ZXJcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oIGl0ZW1Ub0xheURvd24gKSB7XG5cblx0cmV0dXJuIHRoaXMubGF5b3V0LmNyZWF0ZSggaXRlbVRvTGF5RG93biApO1xufTtcblxuLy9UaGlzIGlzIG5vdCBhIHBhcnQgb2YgcHJvdG90eXBlIGNhdXNlIGl0J3MgbW9yZSBqdXN0IGEgdXRpbGl0eSBmdW5jdGlvbiB0byBhZGQgcnVsZXMgcXVpY2tseVxuLy9kb24ndCB3YW50IHBlb3BsZSB0byBnZXQgY29uZnVzZWQgaWYgdGhlcmUncyBhbiBhZGQgcnVsZSBmdW5jdGlvbiBvbiB0aGUgcHJvdG9cbmZ1bmN0aW9uIGFkZFJ1bGUoIHJ1bGUsIHJ1bGVBcmd1bWVudHMsIHJ1bGVBcnIsIHJ1bGVQcm9wQXJyLCB0eXBlICkge1xuXG5cdGlmKCB0aGlzLmNvbmRpdGlvbmFsUGFyZW50ICkgeyBcblxuXHRcdC8vY2hlY2sgd2hldGVyIHdpZHRoIGlzIGJlaW5nIGVmZmVjdGVkXG5cdFx0dGhpcy5jb25kaXRpb25hbFBhcmVudC5kb05vdFJlYWRXaWR0aCA9IHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuZG9Ob3RSZWFkV2lkdGggfHwgXG5cdFx0dHlwZSA9PSBTSVpFIHx8XG5cdFx0dHlwZSA9PSBTSVpFX1dJRFRIO1xuXG5cdFx0dGhpcy5jb25kaXRpb25hbFBhcmVudC5kb05vdFJlYWRIZWlnaHQgPSB0aGlzLmNvbmRpdGlvbmFsUGFyZW50LmRvTm90UmVhZEhlaWdodCB8fCBcblx0XHR0eXBlID09IFNJWkUgfHxcblx0XHR0eXBlID09IFNJWkVfSEVJR0hUO1xuXG5cblx0XHQvL2lmIHdlJ3JlIGluIGEgY2hpbGQgY29uZGl0aW9uYWwgYW5kIHRoaXMgaXMgYSBib3VuZCBmdW5jdGlvbiBpdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHBhcmVudFxuXHRcdGlmKCB0eXBlID09IEJPVU5EX1NJWkUgfHxcblx0XHQgICAgdHlwZSA9PSBCT1VORF9TSVpFX1dJRFRIIHx8XG5cdFx0ICAgIHR5cGUgPT0gQk9VTkRfU0laRV9IRUlHSFQgKSB7XG5cblx0XHRcdHJ1bGVBcnIgPSB0aGlzLmNvbmRpdGlvbmFsUGFyZW50LnJ1bGVzU2l6ZUJvdW5kO1xuXHRcdFx0cnVsZVByb3BBcnIgPSB0aGlzLmNvbmRpdGlvbmFsUGFyZW50LnJ1bGVzU2l6ZUJvdW5kUHJvcDtcblxuXHRcdC8vaWYgd2UncmUgaW4gYSBjaGlsZCBjb25kaXRpb25hbCBhbmQgdGhpcyBpcyBhIGJvdW5kIGZ1bmN0aW9uIGl0IHNob3VsZCBiZSBhZGRlZCB0byB0aGUgcGFyZW50XG5cdFx0fSBlbHNlIGlmKCB0eXBlID09IEJPVU5EX1BPU0lUSU9OIHx8XG5cdFx0XHRcdCAgIHR5cGUgPT0gQk9VTkRfUE9TSVRJT05fWCB8fFxuXHRcdFx0XHQgICB0eXBlID09IEJPVU5EX1BPU0lUSU9OX1kgKSB7XG5cblx0XHRcdHJ1bGVBcnIgPSB0aGlzLmNvbmRpdGlvbmFsUGFyZW50LnJ1bGVzUG9zQm91bmQ7XG5cdFx0XHRydWxlUHJvcEFyciA9IHRoaXMuY29uZGl0aW9uYWxQYXJlbnQucnVsZXNQb3NCb3VuZFByb3A7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXG5cdFx0Ly9jaGVjayB3aGV0ZXIgd2lkdGggaXMgYmVpbmcgZWZmZWN0ZWRcblx0XHR0aGlzLmRvTm90UmVhZFdpZHRoID0gdGhpcy5kb05vdFJlYWRXaWR0aCB8fCBcblx0XHR0eXBlID09IFNJWkUgfHxcblx0XHR0eXBlID09IFNJWkVfV0lEVEg7XG5cblx0XHR0aGlzLmRvTm90UmVhZEhlaWdodCA9IHRoaXMuZG9Ob3RSZWFkSGVpZ2h0IHx8IFxuXHRcdHR5cGUgPT0gU0laRSB8fFxuXHRcdHR5cGUgPT0gU0laRV9IRUlHSFQ7XG5cdH1cblxuXG5cdC8vanVzdCBjaGVjayBpZiB3ZSd2ZSBzdGFydGVkIHdyaXRpbmcgYSBjb25kaXRpb25hbCBidXQgZGlkbnQgYWRkIGEgY2FzZVxuXHRpZiggdGhpcy5faXNEb2luZ1doZW4gJiYgIXRoaXMuX2hhc0NvbmRpdGlvbmFsICkge1xuXG5cdFx0dGhyb3cgJ1lvdSBzaG91bGQgYWRkIGEgY29uZGl0aW9uYWwgc3VjaCBhcyBcIndpZHRoR3JlYXRlclRoYW5cIiBiZWZvcmUgYWRkaW5nIGEgcnVsZSc7XG5cblx0Ly9pZiB0aGVzZSBhcmUgYm90aCB0cnVlIHRoZW4gd2hlbiBoYXMgYmVlbiBjYWxsZWQgYW5kIGEgY29uZGl0aW9uYWxcblx0Ly9oYXMgYmVlbiBhZGRlZCBzbyB3ZSBzaG91bGQgY3JlYXRlIGEgbmV3IExheW91dE5vZGUgZm9yIHRoZSBjb25kaXRpb25hbHNcblx0fSBlbHNlIGlmKCAoIHRoaXMuX2lzRG9pbmdXaGVuICYmIHRoaXMuX2hhc0NvbmRpdGlvbmFsICkgfHwgdGhpcy5faXNEb2luZ0RlZmF1bHQgKSB7XG5cblx0XHR2YXIgbk5vZGUgPSBuZXcgTGF5b3V0Tm9kZSggdGhpcy5sYXlvdXQgKTtcblx0XHRuTm9kZS5jb25kaXRpb25hbFBhcmVudCA9IHRoaXM7XG5cblx0XHRpZiggIXRoaXMuX2lzRG9pbmdEZWZhdWx0ICkge1xuXG5cdFx0XHR0aGlzLmxheW91dE5vZGVGb3JDb25kaXRpb25hbC5wdXNoKCBuTm9kZSApO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHRoaXMubGF5b3V0Tm9kZUZvckRlZmF1bHQgPSBuTm9kZTtcblx0XHR9XG5cblx0XHR0aGlzLl9pc0RvaW5nV2hlbiA9IGZhbHNlO1xuXHRcdHRoaXMuX2hhc0NvbmRpdGlvbmFsID0gZmFsc2U7XG5cdFx0dGhpcy5faXNEb2luZ0RlZmF1bHQgPSBmYWxzZTtcblxuXHRcdC8vbmVlZCB0byBmaWd1cmUgb3V0IHdoaWNoIHJ1bGVBcnIgYW5kIHJ1bGVQcm9wQXJyIHRvIHVzZVxuXHRcdHN3aXRjaCggdHlwZSApIHtcblxuXHRcdFx0Y2FzZSBTSVpFOlxuXHRcdFx0Y2FzZSBTSVpFX1dJRFRIOlxuXHRcdFx0Y2FzZSBTSVpFX0hFSUdIVDpcblxuXHRcdFx0XHRydWxlQXJyID0gbk5vZGUucnVsZXNTaXplO1xuXHRcdFx0XHRydWxlUHJvcEFyciA9IG5Ob2RlLnJ1bGVzU2l6ZVByb3A7XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRcdGNhc2UgUE9TSVRJT05fWTpcblxuXHRcdFx0XHRydWxlQXJyID0gbk5vZGUucnVsZXNQb3M7XG5cdFx0XHRcdHJ1bGVQcm9wQXJyICA9IG5Ob2RlLnJ1bGVzUG9zUHJvcDtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdC8vdGhpcyB3aWxsIHJldHVybiB0aGUgbmV3IG5vZGVcblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCBuTm9kZSwgcnVsZSwgcnVsZUFyZ3VtZW50cywgcnVsZUFyciwgcnVsZVByb3BBcnIsIHR5cGUgKTtcblx0fVxuXG5cdHJ1bGVBcnIucHVzaCggcnVsZSApO1xuXHRydWxlUHJvcEFyci5wdXNoKCBydWxlQXJndW1lbnRzICk7XG5cblx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IHR5cGU7XG5cblx0aWYoIHJ1bGVBcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHR0aGlzLmFkZERlcGVuZGVuY3koIHJ1bGVBcmd1bWVudHNbIDAgXSApO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59XG5cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS1QT1NJVElPTiBGVU5DVElPTlMtLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gYW4gaXRlbSBhdCB0aGUgY29yZGluYXRlIHBhc3NlZCBpbi5cblxuQG1ldGhvZCBwb3NpdGlvbklzXG5AcGFyYW0geCB7TnVtYmVyfSB4IGNvcmRpbmF0ZSB3aGVyZSB0aGUgaXRlbSBiZWluZyBwb3NpdGlvbmVkIHNob3VsZCBnb1xuQHBhcmFtIHkge051bWJlcn0geSBjb3JkaW5hdGUgd2hlcmUgdGhlIGl0ZW0gYmVpbmcgcG9zaXRpb25lZCBzaG91bGQgZ29cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucG9zaXRpb25JcyA9IGZ1bmN0aW9uKCB4LCB5ICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHBvc2l0aW9uSXMsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIGFuIGl0ZW0gYXQgdGhlIHggYW5kIHkgY2FsY3VsYXRlZCBieSB0YWtpbmcgdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluIHRpbWVzIHRoZVxucGVyY2VudGFnZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgcG9zaXRpb25Jc0FQZXJjZW50YWdlT2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSB0aGlzIExheW91dE5vZGUncyB3aWR0aCBhbmQgaGVpZ2h0IGlzIGdvaW5nIHRvIGJlIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBwb3NpdG9uIG9mIHRoaXMgTGF5b3V0Tm9kZVxuQHBhcmFtIHBlcmNlbnRhZ2Uge051bWJlcn0gdGhpcyBwZXJjZW50YWdlIHdpbGwgYmUgdXNlZCB0byB0aGUgY2FsY3VsYXRlIHRoZSB4IGFuZCB5IHBvc2l0aW9uIG9mIHRoaXMgTGF5b3V0Tm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5wb3NpdGlvbklzQVBlcmNlbnRhZ2VPZiA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHBvc2l0aW9uSXNBUGVyY2VudGFnZU9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiBhbiBpdGVtIGF0IHRoZSB4IGNvcmRpbmF0ZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgeElzXG5AcGFyYW0geCB7TnVtYmVyfSB4IGNvcmRpbmF0ZSB3aGVyZSB0aGUgaXRlbSBiZWluZyBwb3NpdGlvbmVkIHNob3VsZCBnb1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS54SXMgPSBmdW5jdGlvbiggeCApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB4SXMsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gYW4gaXRlbSBhdCB0aGUgeCBjYWxjdWxhdGVkIGJ5IHRha2luZyB0aGUgd2lkdGggb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluIHRpbWVzIHRoZVxucGVyY2VudGFnZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgeElzQVBlcmNlbnRhZ2VPZlxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IHRoaXMgTGF5b3V0Tm9kZSdzIHdpZHRoIGlzIGdvaW5nIHRvIGJlIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSBwb3NpdG9uIG9mIHRoaXMgTGF5b3V0Tm9kZVxuQHBhcmFtIHBlcmNlbnRhZ2Uge051bWJlcn0gdGhpcyBwZXJjZW50YWdlIHdpbGwgYmUgdXNlZCB0byB0aGUgY2FsY3VsYXRlIHRoZSB4IHBvc2l0aW9uIG9mIHRoaXMgTGF5b3V0Tm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS54SXNBUGVyY2VudGFnZU9mID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgeElzQVBlcmNlbnRhZ2VPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiBhbiBpdGVtIGF0IHRoZSB5IGNvcmRpbmF0ZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgeUlzXG5AcGFyYW0geSB7TnVtYmVyfSB5IGNvcmRpbmF0ZSB3aGVyZSB0aGUgaXRlbSBiZWluZyBwb3NpdGlvbmVkIHNob3VsZCBnb1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS55SXMgPSBmdW5jdGlvbiggeSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB5SXMsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gYW4gaXRlbSBhdCB0aGUgeSBjYWxjdWxhdGVkIGJ5IHRha2luZyB0aGUgaGVpZ2h0IG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aW1lcyB0aGVcbnBlcmNlbnRhZ2UgcGFzc2VkIGluLlxuXG5AbWV0aG9kIHlJc0FQZXJjZW50YWdlT2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSB0aGlzIExheW91dE5vZGUncyBoZWlnaHQgaXMgZ29pbmcgdG8gYmUgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHBvc2l0b24gb2YgdGhpcyBMYXlvdXROb2RlXG5AcGFyYW0gcGVyY2VudGFnZSB7TnVtYmVyfSB0aGlzIHBlcmNlbnRhZ2Ugd2lsbCBiZSB1c2VkIHRvIHRoZSBjYWxjdWxhdGUgdGhlIHkgcG9zaXRpb24gb2YgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnlJc0FQZXJjZW50YWdlT2YgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB5SXNBUGVyY2VudGFnZU9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBiZWxvdyB0aGUgaXRlbSBwYXNzZWQuXG5cbkBtZXRob2QgYWxpZ25lZEJlbG93XG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgYmVsb3dcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuYWxpZ25lZEJlbG93ID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgYWxpZ25lZEJlbG93LCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBhYm92ZSB0aGUgaXRlbSBwYXNzZWQuXG5cbkBtZXRob2QgYWxpZ25lZEFib3ZlXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgYWJvdmVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuYWxpZ25lZEFib3ZlID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgYWxpZ25lZEFib3ZlLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG5cbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gdGhpcyBMYXlvdXROb2RlIGxlZnQgb2YgdGhlIGl0ZW0gcGFzc2VkLlxuXG5AbWV0aG9kIGFsaWduZWRMZWZ0T2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIHRoYXQgdGhpcyBMYXlvdXROb2RlIHNob3VsZCBiZSBsZWZ0IG9mXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmFsaWduZWRMZWZ0T2YgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBhbGlnbmVkTGVmdE9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSByaWdodCBvZiB0aGUgaXRlbSBwYXNzZWQuXG5cbkBtZXRob2QgYWxpZ25lZFJpZ2h0T2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIHRoYXQgdGhpcyBMYXlvdXROb2RlIHNob3VsZCBiZSByaWdodCBvZlxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5hbGlnbmVkUmlnaHRPZiA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGFsaWduZWRSaWdodE9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBzbyB0aGF0IGl0J3MgYWxpZ25lZCBmdWxseSAodG9wLCBsZWZ0KSB3aXRoIHRoZSBpdGVtIHBhc3NlZCBpbi5cblxuQG1ldGhvZCBhbGlnbmVkV2l0aFxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIGFsaWduIHRvXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmFsaWduZWRXaXRoID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgYWxpZ25lZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBzbyB0aGF0IGl0J3MgbGVmdCBhbGlnbmVkIHdpdGggdGhlIGl0ZW0gcGFzc2VkIGluLlxuXG5AbWV0aG9kIGxlZnRBbGlnbmVkV2l0aFxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIGxlZnQgYWxpZ24gdG9cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubGVmdEFsaWduZWRXaXRoID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbGVmdEFsaWduZWRXaXRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBzbyB0aGF0IGl0J3MgcmlnaHQgYWxpZ25lZCB3aXRoIHRoZSBpdGVtIHBhc3NlZCBpbi5cblxuQG1ldGhvZCByaWdodEFsaWduZWRXaXRoXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgcmlnaHQgYWxpZ24gdG9cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucmlnaHRBbGlnbmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHJpZ2h0QWxpZ25lZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gdGhpcyBMYXlvdXROb2RlIHNvIHRoYXQgaXQncyB0b3AgYWxpZ25lZCB3aXRoIHRoZSBpdGVtIHBhc3NlZCBpbi5cblxuQG1ldGhvZCB0b3BBbGlnbmVkV2l0aFxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIHRvcCBhbGlnbiB0b1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS50b3BBbGlnbmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHRvcEFsaWduZWRXaXRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG59O1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHBvc2l0aW9uIHRoaXMgTGF5b3V0Tm9kZSBzbyB0aGF0IGl0J3MgYm90dG9tIGFsaWduZWQgd2l0aCB0aGUgaXRlbSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgYm90dG9tQWxpZ25lZFdpdGhcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSBpdGVtIHRoYXQgdGhpcyBMYXlvdXROb2RlIHNob3VsZCBib3R0b20gYWxpZ24gdG9cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuYm90dG9tQWxpZ25lZFdpdGggPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBib3R0b21BbGlnbmVkV2l0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUgc28gdGhhdCBpdCdzIGNlbnRlciAoaG9yaXpvbnRhbGx5IGFuZCB2ZXJpY2FsbHkpIGFsaWduZWQgd2l0aCB0aGUgaXRlbSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgY2VudGVyZWRXaXRoXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgY2VudGVyIGFsaWduIHRvXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmNlbnRlcmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGNlbnRlcmVkV2l0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT04gKTtcbn07XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgcG9zaXRpb24gdGhpcyBMYXlvdXROb2RlIHNvIHRoYXQgaXQncyBob3Jpem9udGFsbHkgY2VudGVyZWQgd2l0aCB0aGUgaXRlbSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgaG9yaXpvbnRhbGx5Q2VudGVyZWRXaXRoXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gaXRlbSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgaG9yaXpvbnRhbGx5IGNlbnRlcmVkIHRvXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmhvcml6b250YWxseUNlbnRlcmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGhvcml6b250YWxseUNlbnRlcmVkV2l0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xufTtcblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBwb3NpdGlvbiB0aGlzIExheW91dE5vZGUgc28gdGhhdCBpdCdzIHZlcnRpY2FsbHkgY2VudGVyZWQgd2l0aCB0aGUgaXRlbSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgdmVydGljYWxseUNlbnRlcmVkV2l0aFxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gdGhhdCB0aGlzIExheW91dE5vZGUgc2hvdWxkIGJlIHZlcnRpY2FsbHkgY2VudGVyZWQgdG9cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUudmVydGljYWxseUNlbnRlcmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHZlcnRpY2FsbHlDZW50ZXJlZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS1TSVpFIEZVTkNUSU9OUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNpemUgYW4gaXRlbSB0byBiZSB0aGUgZXhhY3Qgc2l6ZSB2YWx1ZSAod2lkdGggYW5kIGhlaWdodCkgcGFzc2VkIGluXG5cbkBtZXRob2Qgc2l6ZUlzXG5AcGFyYW0gd2lkdGgge051bWJlcn0gd2lkdGggb2YgdGhpcyBMYXlvdXROb2RlXG5AcGFyYW0gaGVpZ2h0IHtOdW1iZXJ9IGhlaWdodCBvZiB0aGlzIExheW91dE5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuc2l6ZUlzID0gZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgc2l6ZUlzLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkUgKTtcbn1cblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBzZXQgdGhlIHdpZHRoIG9mIGFuIGl0ZW0gdG8gYmUgdGhlIGV4YWN0IHZhbHVlIHBhc3NlZCBpblxuXG5AbWV0aG9kIHdpZHRoSXNcbkBwYXJhbSB3aWR0aCB7TnVtYmVyfSB3aWR0aCBvZiB0aGlzIExheW91dE5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUud2lkdGhJcyA9IGZ1bmN0aW9uKCB3aWR0aCApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCB3aWR0aElzLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfV0lEVEggKTtcbn1cblxuLyoqXG5UaGlzIHJ1bGUgd2lsbCBzZXQgdGhlIGhlaWdodCBvZiBhbiBpdGVtIHRvIGJlIHRoZSBleGFjdCB2YWx1ZSBwYXNzZWQgaW5cblxuQG1ldGhvZCBoZWlnaHRJc1xuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSBoZWlnaHQgb2YgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmhlaWdodElzID0gZnVuY3Rpb24oIGhlaWdodCApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBoZWlnaHRJcywgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xuXG59XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgc2V0IHRoZSB3aWR0aCBvciBoZWlnaHQgb2YgdGhpcyBMYXlvdXROb2RlIHRvIGJlIHByb3BvcnRpb25hbCBiYXNlZCBvbiB0aGUgb3JpZ2luYWwgd2lkdGggYW5kIGhlaWdodCBwYXNzZWQgaW4uXG5JdCBpcyBoYW5keSBmb3Igd2hlbiB5b3UgaGF2ZSBydWxlcyBhZGp1c3RpbmcgZWl0aGVyIHdpZHRoIG9yIGhlaWdodCBvbmx5IGFuZCB5ZXQgeW91IHdhbnQgdGhlIHVudG91Y2hlZCBwcm9wZXJ0eSB0byBiZVxucHJvcG9ydGlvbmFsLlxuXG5TbyBpZiB5b3UgaGF2ZSBhbiBpbWFnZSB0aGF0IGlzIDIwMHgxMDAgaWYgdGhlcmUgYXJlIHJ1bGVzIGFwcGxpZWQgdG8gdGhpcyBMYXlvdXROb2RlIHdoZXJlIHRoZSB3aWR0aCB3aWxsIGJlY29tZSA0MDBweFxudGhpcyBydWxlIHdpbGwgc2VlIHRoYXQgaGVpZ2h0IGhhcyBub3QgYmVlbiBlZmZlY3RlZCBhdCBhbGwgYW5kIHdpbGwgc2V0IHRoZSBoZWlnaHQgdG8gYmUgcHJvcG9ydGlvbmFsIHRvIHRoZSB3aWR0aCBiYXNlZCBvblxudGhlIG9yaWdpbmFsIGhlaWdodCBwYXNzZWQgaW4uIFNvIGluIHRoaXMgY2FzZSBvdXIgaW1hZ2UncyBzaXplIHdvdWxkIGJlIDQwMHgyMDAgd2hlcmUgdGhpcyBydWxlIHNldHMgdGhlIGhlaWdodCB0byBiZSAyMDBweFxudG8gc3RheSBpbiBwcm9wb3J0aW9uIHRvIHRoZSBvcmlnaW5hbCB3aWR0aC5cblxuQG1ldGhvZCBzaXplSXNQcm9wb3J0aW9uYWxcbkBwYXJhbSBvcmlnaW5hbFdpZHRoIHtOdW1iZXJ9IHRoZSBvcmlnaW5hbCB3aWR0aCBvZiB0aGUgaXRlbSBiZWluZyBsYXllZCBvdXQgYmVmb3JlIGFueSBsYXlvdXQgZnVuY3Rpb25zIGFyZSBhcHBsaWVkXG5AcGFyYW0gb3JpZ2luYWxIZWlnaHQge051bWJlcn0gdGhlIG9yaWdpbmFsIGhlaWdodCBvZiB0aGUgaXRlbSBiZWluZyBsYXllZCBvdXQgYmVmb3JlIGFueSBsYXlvdXQgZnVuY3Rpb25zIGFyZSBhcHBsaWVkXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnNpemVJc1Byb3BvcnRpb25hbCA9IGZ1bmN0aW9uKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBzaXplSXNQcm9wb3J0aW9uYWwsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgd2lkdGggb2YgdGhlIExheW91dE5vZGUgdG8gYmUgcHJvcG9ydGlvbmFsIHRvIHRoZSBoZWlnaHQgYmFzZWQgb24gdGhlIG9yaWdpbmFsV2lkdGggcGFzc2VkLlxuSXQgaXMgaGFuZHkgZm9yIHdoZW4geW91IGhhdmUgcnVsZXMgYWRqdXN0aW5nIGhlaWdodCBhbmQgd2lkdGggc2hvdWxkIHJlbWFpbiBwcm9wb3J0aW9uYWwgdG8gdGhlIGhlaWdodC5cblxuRm9yIGluc3RhbmNlIHlvdSBoYXZlIGFuIGltYWdlIHdoaWNoIGlzIDIwMHgxMDAuIE9uY2UgcnVsZXMgYXJlIGFwcGxpZWQgdG8gaXQgdGhlIGhlaWdodCBiZWNvbWVzIDIwMHB4LiBJZGVhbGx5IHdlJ2xsXG53YW50IHRoZSB3aWR0aCB0byBhbHNvIGJlIDJ4IGxhcmdlci4gU28gdGhpcyBydWxlIHdpbGwgc2V0IHRoZSB3aWR0aCB0byBiZSA0MDBweCBhbmQgb3VyIGZpbmFsIHJlc29sdXRpb24gaXMgNDAweDIwMC5cblxuQG1ldGhvZCB3aWR0aElzUHJvcG9ydGlvbmFsXG5AcGFyYW0gb3JpZ2luYWxXaWR0aCB7TnVtYmVyfSB0aGUgb3JpZ2luYWwgd2lkdGggb2YgdGhlIGl0ZW0gYmVpbmcgbGF5ZWQgb3V0IGJlZm9yZSBhbnkgbGF5b3V0IGZ1bmN0aW9ucyBhcmUgYXBwbGllZFxuQHBhcmFtIG9yaWdpbmFsSGVpZ2h0IHtOdW1iZXJ9IHRoZSBvcmlnaW5hbCBoZWlnaHQgb2YgdGhlIGl0ZW0gYmVpbmcgbGF5ZWQgb3V0IGJlZm9yZSBhbnkgbGF5b3V0IGZ1bmN0aW9ucyBhcmUgYXBwbGllZFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS53aWR0aElzUHJvcG9ydGlvbmFsID0gZnVuY3Rpb24oIG9yaWdpbmFsV2lkdGgsIG9yaWdpbmFsSGVpZ2h0ICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHdpZHRoSXNQcm9wb3J0aW9uYWwsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgaGVpZ2h0IG9mIHRoZSBMYXlvdXROb2RlIHRvIGJlIHByb3BvcnRpb25hbCB0byB0aGUgd2lkdGggYmFzZWQgb24gdGhlIG9yaWdpbmFsSGVpZ2h0IHBhc3NlZC5cbkl0IGlzIGhhbmR5IGZvciB3aGVuIHlvdSBoYXZlIHJ1bGVzIGFkanVzdGluZyB3aWR0aCBhbmQgaGVpZ2h0IHNob3VsZCByZW1haW4gcHJvcG9ydGlvbmFsIHRvIHRoZSB3aWR0aC5cblxuRm9yIGluc3RhbmNlIHlvdSBoYXZlIGFuIGltYWdlIHdoaWNoIGlzIDIwMHgxMDAuIE9uY2UgcnVsZXMgYXJlIGFwcGxpZWQgdG8gaXQgdGhlIHdpZHRoIGJlY29tZXMgNDAwcHguIElkZWFsbHkgd2UnbGxcbndhbnQgdGhlIGhlaWdodCB0byBhbHNvIGJlIDJ4IGxhcmdlci4gU28gdGhpcyBydWxlIHdpbGwgc2V0IHRoZSBoZWlnaHQgdG8gYmUgMjAwcHggYW5kIG91ciBmaW5hbCByZXNvbHV0aW9uIGlzIDQwMHgyMDAuXG5cbkBtZXRob2QgaGVpZ2h0SXNQcm9wb3J0aW9uYWxcbkBwYXJhbSBvcmlnaW5hbFdpZHRoIHtOdW1iZXJ9IHRoZSBvcmlnaW5hbCB3aWR0aCBvZiB0aGUgaXRlbSBiZWluZyBsYXllZCBvdXQgYmVmb3JlIGFueSBsYXlvdXQgZnVuY3Rpb25zIGFyZSBhcHBsaWVkXG5AcGFyYW0gb3JpZ2luYWxIZWlnaHQge051bWJlcn0gdGhlIG9yaWdpbmFsIGhlaWdodCBvZiB0aGUgaXRlbSBiZWluZyBsYXllZCBvdXQgYmVmb3JlIGFueSBsYXlvdXQgZnVuY3Rpb25zIGFyZSBhcHBsaWVkXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmhlaWdodElzUHJvcG9ydGlvbmFsID0gZnVuY3Rpb24oIG9yaWdpbmFsV2lkdGgsIG9yaWdpbmFsSGVpZ2h0ICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGhlaWdodElzUHJvcG9ydGlvbmFsLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfSEVJR0hUICk7XG59XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgc2V0IHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoaXMgTGF5b3V0Tm9kZSB0byBtYXRjaCB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4uXG5cbkBtZXRob2QgbWF0Y2hlc1NpemVPZlxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gaXMgYSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbWF0Y2ggaW4gc2l6ZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXRjaGVzU2l6ZU9mID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF0Y2hlc1NpemVPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XG59XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgc2V0IHRoZSB3aWR0aCBvZiB0aGlzIExheW91dE5vZGUgdG8gbWF0Y2ggdGhlIHdpZHRoIG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbi5cblxuQG1ldGhvZCBtYXRjaGVzV2lkdGhPZlxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gaXMgYSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbWF0Y2ggaW4gd2lkdGhcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF0Y2hlc1dpZHRoT2YgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXRjaGVzV2lkdGhPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX1dJRFRIICk7XG59XG5cbi8qKlxuVGhpcyBydWxlIHdpbGwgc2V0IHRoZSBoZWlnaHQgb2YgdGhpcyBMYXlvdXROb2RlIHRvIG1hdGNoIHRoZSBoZWlnaHQgb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluLlxuXG5AbWV0aG9kIG1hdGNoZXNIZWlnaHRPZlxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IGl0ZW0gaXMgYSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbWF0Y2ggaW4gaGVpZ2h0XG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1hdGNoZXNIZWlnaHRPZiA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1hdGNoZXNIZWlnaHRPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGlzIExheW91dE5vZGUgdG8gYmUgYSBwZXJjZW50YWdlIG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbi5cblxuU28gZm9yIGluc3RhbmNlIGlmIHRoZSBMYXlvdXROb2RlIHdlJ3JlIHBhc3NpbmcgaW4gaXMgNDAweDIwMCBhZnRlciBhbGwgcnVsZXMgaGF2ZSBiZWVuIGFwcGxpZWQgYW5kIFxud2Ugc2F5IHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgMC41IG9mIHRoZSBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aGlzIExheW91dE5vZGUncyBzaXplIHdpbGwgYmUgMjAweDEwMCBvciA1MCUgb2YgNDAweDIwMC5cblxuQG1ldGhvZCBzaXplSXNBUGVyY2VudGFnZU9mXG5AcGFyYW0gaXRlbSB7TGF5b3V0Tm9kZX0gdGhlIExheW91dE5vZGUgdGhhdCB0aGlzIExheW91dE5vZGUgd2lsbCBzZXQgaXQncyB3aWR0aCBhbmQgaGVpZ2h0IGZyb21cbkBwYXJhbSBwZXJjZW50YWdlIHtOdW1iZXJ9IGEgcGVyY2VudGFnZSB2YWx1ZSBpbiBkZWNpbWFsIHRoYXQgc3RhdGVzIGhvdyBiaWcgdGhpcyBMYXlvdXROb2RlIHNob3VsZCBiZSBiYXNlZCBvbiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuc2l6ZUlzQVBlcmNlbnRhZ2VPZiA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIHNpemVJc0FQZXJjZW50YWdlT2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgd2lkdGggb2YgdGhpcyBMYXlvdXROb2RlIHRvIGJlIGEgcGVyY2VudGFnZSBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4uXG5cblNvIGZvciBpbnN0YW5jZSBpZiB0aGUgTGF5b3V0Tm9kZSB3ZSdyZSBwYXNzaW5nIGluIGlzIDQwMHgyMDAgYWZ0ZXIgYWxsIHJ1bGVzIGhhdmUgYmVlbiBhcHBsaWVkIGFuZCBcbndlIHNheSB0aGlzIExheW91dE5vZGUncyB3aWR0aCBzaG91bGQgYmUgMC41IG9mIHRoZSB3aWR0aCBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4uIFRoaXMgTGF5b3V0Tm9kZSdzIHdpZHRoIHdpbGwgYmUgXG4yMDBweCBvciA1MCUgb2YgNDAwcHguXG5cbkBtZXRob2Qgd2lkdGhJc0FQZXJjZW50YWdlT2ZcbkBwYXJhbSBpdGVtIHtMYXlvdXROb2RlfSB0aGUgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIHNldCBpdCdzIHdpZHRoIGZyb21cbkBwYXJhbSBwZXJjZW50YWdlIHtOdW1iZXJ9IGEgcGVyY2VudGFnZSB2YWx1ZSBpbiBkZWNpbWFsIHRoYXQgc3RhdGVzIGhvdyB3aWRlIHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgYmFzZWQgb24gdGhlIExheW91dE5vZGUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLndpZHRoSXNBUGVyY2VudGFnZU9mID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgd2lkdGhJc0FQZXJjZW50YWdlT2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xufVxuXG4vKipcblRoaXMgcnVsZSB3aWxsIHNldCB0aGUgaGVpZ2h0IG9mIHRoaXMgTGF5b3V0Tm9kZSB0byBiZSBhIHBlcmNlbnRhZ2Ugb2YgdGhlIExheW91dE5vZGUgcGFzc2VkIGluLlxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgdGhlIExheW91dE5vZGUgd2UncmUgcGFzc2luZyBpbiBpcyA0MDB4MjAwIGFmdGVyIGFsbCBydWxlcyBoYXZlIGJlZW4gYXBwbGllZCBhbmQgXG53ZSBzYXkgdGhpcyBMYXlvdXROb2RlJ3MgaGVpZ2h0IHNob3VsZCBiZSAwLjUgb2YgdGhlIGhlaWdodCBvZiB0aGUgTGF5b3V0Tm9kZSBwYXNzZWQgaW4uIFRoaXMgTGF5b3V0Tm9kZSdzIGhlaWdodCB3aWxsIGJlIFxuMTAwcHggb3IgNTAlIG9mIDIwMHB4LlxuXG5AbWV0aG9kIGhlaWdodElzQVBlcmNlbnRhZ2VPZlxuQHBhcmFtIGl0ZW0ge0xheW91dE5vZGV9IHRoZSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgc2V0IGl0J3MgaGVpZ2h0IGZyb21cbkBwYXJhbSBwZXJjZW50YWdlIHtOdW1iZXJ9IGEgcGVyY2VudGFnZSB2YWx1ZSBpbiBkZWNpbWFsIHRoYXQgc3RhdGVzIGhvdyB0YWxsIHRoaXMgTGF5b3V0Tm9kZSBzaG91bGQgYmUgYmFzZWQgb24gdGhlIExheW91dE5vZGUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmhlaWdodElzQVBlcmNlbnRhZ2VPZiA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIGhlaWdodElzQVBlcmNlbnRhZ2VPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xufVxuXG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLU9GRlNFVCBGVU5DVElPTlMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKipcbnBsdXMgaXMgYW4gb2Zmc2V0IGZ1bmN0aW9uLiBPZmZzZXQgZnVuY3Rpb25zIHdpbGwgb2Zmc2V0IHRoZSBwcm9wZXJ0eSBwcmV2aW91c2x5IGVmZmVjdGVkLlxuXG5TbyBmb3IgaW5zdGFuY2UgaWYgd2UgZGlkOlxuXG5cdG5vZGUud2lkdGhJcyggMjAwICkucGx1cyggMTAgKTtcblxuVGhlbiB0aGUgd2lkdGggb2YgdGhpcyBMYXlvdXROb2RlIHdvdWxkIGJlIDIxMHB4LiBIb3dldmVyIGlmIHdlIGRvOlxuXG5cdG5vZGUueUlzKCAxMDAgKS5wbHVzKCAzMCApO1xuXG5UaGVuIHRoZSB5IHBvc2l0aW9uIG9mIHRoaXMgTGF5b3V0Tm9kZSB3b3VsZCBiZSBhdCAxMzBweC5cblxuQXMgeW91IGNhbiBzZWUgcGx1cycgY29udGV4dCB3aWxsIGNoYW5nZSBiYXNlZCBvbiB0aGUgdHlwZSBvZiBydWxlIGFwcGxpZWQgcHJldmlvdXNseS5cblxuUGx1cyBpcyBoYW5keSBmb3Igd2hlbiBhIGRlc2lnbmVyIHNhaXMgXCJDYW4geW91IG1vdmUgdGhpcyBvdmVyIGJ5IFggcGl4ZWxzXCIuXG5cbkBtZXRob2QgcGx1c1xuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5wbHVzID0gZnVuY3Rpb24oKSB7XG5cblx0c3dpdGNoKCB0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkICkge1xuXG5cdFx0Y2FzZSBTSVpFOlxuXHRcdGNhc2UgQk9VTkRfU0laRTpcblxuXHRcdFx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcblxuXHRcdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzU2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XHRcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdlBsdXNTaXplLCBbIGFyZ3VtZW50c1sgMCBdLCBhcmd1bWVudHNbIDAgXSBdLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XHRcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDIgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2UGx1c1NpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1x0XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRoaXMuZG9Ob3RSZWFkV2lkdGggPSB0cnVlO1xuXHRcdFx0dGhpcy5kb05vdFJlYWRIZWlnaHQgPSB0cnVlO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTSVpFX1dJRFRIOlxuXHRcdGNhc2UgQk9VTkRfU0laRV9XSURUSDpcblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzV2lkdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZQbHVzV2lkdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRvTm90UmVhZFdpZHRoID0gdHJ1ZTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgU0laRV9IRUlHSFQ6XG5cdFx0Y2FzZSBCT1VORF9TSVpFX0hFSUdIVDpcblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzSGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfSEVJR0hUICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdlBsdXNIZWlnaHQsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9IRUlHSFQgKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kb05vdFJlYWRIZWlnaHQgPSB0cnVlO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OOlxuXHRcdFx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcblxuXHRcdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzUG9zaXRpb24sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZQbHVzUG9zaXRpb24sIFsgYXJndW1lbnRzWyAwIF0sIGFyZ3VtZW50c1sgMCBdIF0sIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMiApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZQbHVzUG9zaXRpb24sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRicmVhaztcblxuXHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1g6XG5cdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c1gsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2UGx1c1gsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcblx0XHRcdH1cblx0XHRicmVhaztcblxuXHRcdGNhc2UgUE9TSVRJT05fWTpcblx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1k6XG5cdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c1ksIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2UGx1c1ksIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcblx0XHRcdH1cblx0XHRicmVhaztcblxuXHRcdGNhc2UgbnVsbDpcblxuXHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHBsdXNTaXplLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkUgKTtcblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzUG9zaXRpb24sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgPSBudWxsO1xuXHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbm1pbnVzIGlzIGFuIG9mZnNldCBmdW5jdGlvbi4gT2Zmc2V0IGZ1bmN0aW9ucyB3aWxsIG9mZnNldCB0aGUgcHJvcGVydHkgcHJldmlvdXNseSBlZmZlY3RlZC5cblxuU28gZm9yIGluc3RhbmNlIGlmIHdlIGRpZDpcblxuXHRub2RlLndpZHRoSXMoIDIwMCApLm1pbnVzKCAxMCApO1xuXG5UaGVuIHRoZSB3aWR0aCBvZiB0aGlzIExheW91dE5vZGUgd291bGQgYmUgMTkwcHguIEhvd2V2ZXIgaWYgd2UgZG86XG5cblx0bm9kZS55SXMoIDEwMCApLm1pbnVzKCAzMCApO1xuXG5UaGVuIHRoZSB5IHBvc2l0aW9uIG9mIHRoaXMgTGF5b3V0Tm9kZSB3b3VsZCBiZSBhdCA3MHB4LlxuXG5BcyB5b3UgY2FuIHNlZSBtaW51cycgY29udGV4dCB3aWxsIGNoYW5nZSBiYXNlZCBvbiB0aGUgdHlwZSBvZiBydWxlIGFwcGxpZWQgcHJldmlvdXNseS5cblxuTWludXMgaXMgaGFuZHkgZm9yIHdoZW4gYSBkZXNpZ25lciBzYWlzIFwiQ2FuIHlvdSBtb3ZlIHRoaXMgb3ZlciBieSBYIHBpeGVsc1wiLlxuXG5AbWV0aG9kIG1pbnVzXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1pbnVzID0gZnVuY3Rpb24oKSB7XG5cblx0c3dpdGNoKCB0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkICkge1xuXG5cdFx0Y2FzZSBTSVpFOlxuXHRcdGNhc2UgQk9VTkRfU0laRTpcblxuXHRcdFx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcblxuXHRcdFx0XHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtaW51c1NpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2TWludXNTaXplLCBbIGFyZ3VtZW50c1sgMCBdLCBhcmd1bWVudHNbIDAgXSBdLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiggYXJndW1lbnRzLmxlbmd0aCA9PSAyICkge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdk1pbnVzU2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRoaXMuZG9Ob3RSZWFkV2lkdGggPSB0cnVlO1xuXHRcdFx0dGhpcy5kb05vdFJlYWRIZWlnaHQgPSB0cnVlO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTSVpFX1dJRFRIOlxuXHRcdGNhc2UgQk9VTkRfU0laRV9XSURUSDpcblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtaW51c1dpZHRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfV0lEVEggKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2TWludXNXaWR0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX1dJRFRIICk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZG9Ob3RSZWFkV2lkdGggPSB0cnVlO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTSVpFX0hFSUdIVDpcblx0XHRjYXNlIEJPVU5EX1NJWkVfSEVJR0hUOlxuXHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbnVzSGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfSEVJR0hUICk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdk1pbnVzSGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfSEVJR0hUICk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmRvTm90UmVhZEhlaWdodCA9IHRydWU7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFBPU0lUSU9OOlxuXHRcdGNhc2UgQk9VTkRfUE9TSVRJT046XG5cblx0XHRcdGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDEgKSB7XG5cblx0XHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWludXNQb3NpdGlvbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT04gKTtcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgdk1pbnVzUG9zaXRpb24sIFsgYXJndW1lbnRzWyAwIF0sIGFyZ3VtZW50c1sgMCBdIF0sIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMiApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZNaW51c1Bvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xuXHRcdFx0fVxuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTl9YOlxuXHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWDpcblx0XHRcdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtaW51c1gsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCB2TWludXNYLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG5cdFx0XHR9XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFBPU0lUSU9OX1k6XG5cdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9ZOlxuXHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbnVzWSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZNaW51c1ksIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcblx0XHRcdH1cblx0XHRicmVhaztcblxuXHRcdGNhc2UgbnVsbDpcblxuXHRcdFx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbnVzU2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XG5cdFx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWludXNQb3NpdGlvbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT04gKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IG51bGw7XG5cdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tQk9VTkQgRlVOQ1RJT05TLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKipcbm1heFNpemUgaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHRocmVlIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhTaXplLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTEuc2l6ZUlzKCAyMDAsIDEwMCApO1xuXHRub2RlMi5zaXplSXMoIDMwMCwgMzAwICkubWF4U2l6ZSggbm9kZTEgKTtcblxuV2hlbiBydW4gbm9kZTIncyB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgMjAweDEwMCBub3QgMzAweDMwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuXG5ub2RlMS5cblxuQG1ldGhvZCBtYXhTaXplXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gdGhpcyBMYXlvdXROb2RlIHdpbGwgYWx3YXlzIGJlIGxhcmdlciBvciB0aGUgc2FtZSBzaXplIGFzIHRoZSBMYXlvdXROb2RlIHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uXG5AY2hhaW5hYmxlXG4qKi9cblxuLyoqXG5tYXhTaXplIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWF4U2l6ZS4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiB3aWR0aCBhbmQgaGVpZ2h0IHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMi5zaXplSXMoIDMwMCwgMzAwICkubWF4U2l6ZSggMjAwLCAxMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgMjAweDEwMCBub3QgMzAweDMwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuXG4yMDB4MTAwLlxuXG5AbWV0aG9kIG1heFNpemVcbkBwYXJhbSB3aWR0aCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIHdpZHRoIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIGhlaWdodCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1heFNpemUgaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHRocmVlIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhTaXplLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgc2l6ZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIuc2l6ZUlzKCAzMDAsIDMwMCApLm1heFNpemUoIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHdpZHRoIGFuZCBoZWlnaHQgd2lsbCBiZSAyMDB4MjAwIG5vdCAzMDB4MzAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbjIwMHgyMDAuXG5cbkBtZXRob2QgbWF4U2l6ZVxuQHBhcmFtIHNpemUge051bWJlcn0gdGhlIExheW91dE5vZGUncyB3aWR0aCBhbmQgaGVpZ2h0IHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXhTaXplID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50c1sgMCBdIGluc3RhbmNlb2YgTGF5b3V0Tm9kZSApIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFNpemVGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XHRcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFNpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkUgKTtcblx0fVxufTtcblxuXG5cblxuLyoqXG5tYXhXaWR0aCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhXaWR0aC4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgdGhhdCB0aGlzIExheW91dE5vZGUncyB3aWR0aCB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTEud2lkdGhJcyggMjAwICk7XG5cdG5vZGUyLndpZHRoSXMoIDMwMCApLm1heFdpZHRoKCBub2RlMSApO1xuXG5XaGVuIHJ1biBpbiB0aGUgZW5kIG5vZGUyJ3Mgd2lkdGggd2lsbCBiZSAyMDBweCBub3QgMzAwcHggYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgdGhhblxubm9kZTEuXG5cbkBtZXRob2QgbWF4V2lkdGhcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSB0aGlzIExheW91dE5vZGUgd2lsbCBhbHdheXMgYmUgbGFyZ2VyIG9yIHRoZSBzYW1lIHNpemUgYXMgdGhlIExheW91dE5vZGUgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb25cbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1heFdpZHRoIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1heFdpZHRoLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIHdpZHRoIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMi53aWR0aElzKCAzMDAgKS5tYXhXaWR0aCggMjAwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3Mgd2lkdGggd2lsbCBiZSAyMDBweCBub3QgMzAwcHggYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgdGhhblxuMjAwcHguXG5cbkBtZXRob2QgbWF4V2lkdGhcbkBwYXJhbSB3aWR0aCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIHdpZHRoIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIGhlaWdodCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF4V2lkdGggPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4V2lkdGhGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XHRcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFdpZHRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XHRcblx0fVxufTtcblxuXG5cblxuLyoqXG5tYXhIZWlnaHQgaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWF4SGVpZ2h0LiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSdzIHdpZHRoIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMS5oZWlnaHRJcyggMjAwICk7XG5cdG5vZGUyLmhlaWdodElzKCAzMDAgKS5tYXhIZWlnaHQoIG5vZGUxICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgaGVpZ2h0IHdpbGwgYmUgMjAwcHggbm90IDMwMHB4IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbm5vZGUxLlxuXG5AbWV0aG9kIG1heEhlaWdodFxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIGFsd2F5cyBiZSBsYXJnZXIgb3IgdGhlIHNhbWUgc2l6ZSBhcyB0aGUgTGF5b3V0Tm9kZSB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvblxuQGNoYWluYWJsZVxuKiovXG5cbi8qKlxubWF4SGVpZ2h0IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1heEhlaWdodC4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiB3aWR0aCB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIuaGVpZ2h0SXMoIDMwMCApLm1heEhlaWdodCggMjAwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgaGVpZ2h0IHdpbGwgYmUgMjAwcHggbm90IDMwMHB4IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbjIwMHB4LlxuXG5AbWV0aG9kIG1heEhlaWdodFxuQHBhcmFtIHdpZHRoIHtOdW1iZXJ9IHRoZSBMYXlvdXROb2RlJ3Mgd2lkdGggdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuIHRoaXMgdmFsdWUgcGFzc2VkIGluXG5AcGFyYW0gaGVpZ2h0IHtOdW1iZXJ9IHRoZSBMYXlvdXROb2RlJ3MgaGVpZ2h0IHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXhIZWlnaHQgPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4SGVpZ2h0RnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9IRUlHSFQgKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heEhlaWdodCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9IRUlHSFQgKTtcblx0fVxufTtcblxuXG5cbi8qKlxubWluU2l6ZSBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdGhyZWUgZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pblNpemUuIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBMYXlvdXROb2RlIHRoYXQgdGhpcyBMYXlvdXROb2RlIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMS5zaXplSXMoIDIwMCwgMTAwICk7XG5cdG5vZGUyLnNpemVJcyggNTAsIDUwICkubWluU2l6ZSggbm9kZTEgKTtcblxuV2hlbiBydW4gbm9kZTIncyB3aWR0aCBhbmQgaGVpZ2h0IHdpbGwgYmUgMjAweDEwMCBub3QgNTB4NTAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgdGhhblxubm9kZTEuXG5cbkBtZXRob2QgbWluU2l6ZVxuQHBhcmFtIGxheW91dE5vZGUge0xheW91dE5vZGV9IHRoaXMgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgcnVsZSBpcyBhcHBsaWVkIHRvIHdpbGwgbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoYW4gdGhpcyBMYXlvdXROb2RlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5cbi8qKlxubWluU2l6ZSBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdGhyZWUgZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pblNpemUuIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gd2lkdGggYW5kIGhlaWdodCB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIuc2l6ZUlzKCA1MCwgNTAgKS5taW5TaXplKCAyMDAsIDEwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHdpZHRoIGFuZCBoZWlnaHQgd2lsbCBiZSAyMDB4MTAwIG5vdCAzMDB4MzAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbjIwMHgxMDAuXG5cbkBtZXRob2QgbWluU2l6ZVxuQHBhcmFtIHdpZHRoIHtOdW1iZXJ9IHRoZSBMYXlvdXROb2RlJ3Mgd2lkdGggdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQHBhcmFtIGhlaWdodCB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIGhlaWdodCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoaXMgdmFsdWUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cblxuLyoqXG5taW5TaXplIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWluU2l6ZS4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIHNpemUgdGhhdCB0aGlzIExheW91dE5vZGUgd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUyLnNpemVJcyggMTAwLCA1MCApLm1pblNpemUoIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHdpZHRoIGFuZCBoZWlnaHQgd2lsbCBiZSAyMDB4MjAwIG5vdCAxMDB4NTAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBzbWFsbGVyIHRoYW5cbjIwMHgyMDAuXG5cbkBtZXRob2QgbWluU2l6ZVxuQHBhcmFtIHNpemUge051bWJlcn0gdGhlIExheW91dE5vZGUncyB3aWR0aCBhbmQgaGVpZ2h0IHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgb24gd2lsbCBuZXZlciBiZSBzbWFsbGVyIHRoYW4gdGhpcyB2YWx1ZSBwYXNzZWQgaW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWluU2l6ZSA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5TaXplRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRSApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluU2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRSApO1xuXHR9XG59O1xuXG5cblxuXG4vKipcbm1pbldpZHRoIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pbldpZHRoLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSdzIHdpZHRoIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMS53aWR0aElzKCAyMDAgKTtcblx0bm9kZTIud2lkdGhJcyggNTAgKS5taW5XaWR0aCggbm9kZTEgKTtcblxuV2hlbiBydW4gbm9kZTIncyB3aWR0aCB3aWxsIGJlIDIwMHB4IG5vdCA1MHB4IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW4gbm9kZTEuXG5cbkBtZXRob2QgbWluV2lkdGhcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSB0aGUgd2lkdGggb2YgdGhlIG5vZGUgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuIHRoZSB3aWR0aCBvZiB0aGlzIG5vZGUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbi8qKlxubWluV2lkdGggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWluV2lkdGguIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSB3aWR0aCB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIud2lkdGhJcyggMTAwICkubWluV2lkdGgoIDUwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3Mgd2lkdGggd2lsbCBiZSA1MHB4IG5vdCAxMDBweCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuIDUwcHguXG5cbkBtZXRob2QgbWluV2lkdGhcbkBwYXJhbSBzaXplIHtOdW1iZXJ9IHRoZSBMYXlvdXROb2RlJ3Mgd2lkdGggdGhhdCB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiB3aWxsIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGlzIHZhbHVlIHBhc3NlZCBpblxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5taW5XaWR0aCA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5XaWR0aEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfV0lEVEggKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbldpZHRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX1dJRFRIICk7XG5cdH1cbn07XG5cblxuXG5cbi8qKlxubWluSGVpZ2h0IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pbkhlaWdodC4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgdGhhdCB0aGlzIExheW91dE5vZGUncyBoZWlnaHQgd2lsbCBuZXZlciBiZSBsYXJnZXIgdGhhbi4gU28gZm9yIGluc3RhbmNlOlxuXG5cdG5vZGUxLmhlaWdodElzKCAyMDAgKTtcblx0bm9kZTIuaGVpZ2h0SXMoIDUwICkubWluSGVpZ2h0KCBub2RlMSApO1xuXG5XaGVuIHJ1biBub2RlMidzIGhlaWdodCB3aWxsIGJlIDIwMHB4IG5vdCA1MHB4IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgbGFyZ2VyIHRoYW4gbm9kZTEuXG5cbkBtZXRob2QgbWluSGVpZ2h0XG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gdGhlIGhlaWdodCBvZiB0aGUgbm9kZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhlIGhlaWdodCBvZiB0aGlzIG5vZGUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbi8qKlxubWluSGVpZ2h0IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHdheXMgdG8gdXNlIG1pbkhlaWdodC4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIGhlaWdodCB0aGF0IHRoaXMgTGF5b3V0Tm9kZSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIuaGVpZ2h0SXMoIDEwMCApLm1pbkhlaWdodCggNTAgKTtcblxuV2hlbiBydW4gbm9kZTIncyBoZWlnaHQgd2lsbCBiZSA1MHB4IG5vdCAxMDBweCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm90IGJlIGxhcmdlciB0aGFuIDUwcHguXG5cbkBtZXRob2QgbWluSGVpZ2h0XG5AcGFyYW0gc2l6ZSB7TnVtYmVyfSB0aGUgTGF5b3V0Tm9kZSdzIGhlaWdodCB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIHdpbGwgbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoaXMgdmFsdWUgcGFzc2VkIGluXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1pbkhlaWdodCA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5IZWlnaHRGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX0hFSUdIVCApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluSGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX0hFSUdIVCApO1xuXHR9XG59O1xuXG5cblxuXG5cbi8qKlxubWF4UG9zaXRpb24gaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHRocmVlIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhQb3NpdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUuIFRoaXMgTGF5b3V0Tm9kZSdzIHBvc2l0aW9uIHdpbGwgbmV2ZXIgYmUgbGFyZ2VyIHRoYW4gdGhlIHBvc2l0aW9uIG9mIHRoZSBwYXNzZWQgbm9kZS5cblxuXHRub2RlMS5wb3NpdGlvbklzKCAzMDAsIDIwMCApO1xuXHRub2RlMi5wb3NpdGlvbklzKCA0MDAsIDQwMCApLm1heFBvc2l0aW9uKCBub2RlMSApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggYW5kIHkgd2lsbCBiZSAyMDAgYW5kIDEwMCBub3QgeCAzMDAgYW5kIHkgMjAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB4IGFuZCB5IHRvIG5vdCBiZSBsYXJnZXIgdGhhblxubm9kZTEncyB4IGFuZCB5LlxuXG5AbWV0aG9kIG1heFBvc2l0aW9uXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gdGhpcyBwYXNzZWQgaW4gTGF5b3V0Tm9kZSdzIHggYW5kIHkgcG9zaXRpb24gd2lsbCBiZSBiZSB0aGUgbWF4aW11bSB4IGFuZCB5IHBvc2l0aW9uIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1heFBvc2l0aW9uIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWF4UG9zaXRpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBtYXhpbXVtIHggYW5kIHkgcG9zaXRpb24gZm9yIHRoaXMgbm9kZS5cblxuXHRub2RlMi5wb3NpdGlvbklzKCAzMDAsIDMwMCApLm1heFBvc2l0aW9uKCAyMDAsIDEwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggYW5kIHkgd2lsbCBiZSB4IDIwMCBhbmQgeSAxMDAgbm90IHggMzAwIGFuZCB5IDMwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgeCBhbmQgeSB0byBub3QgYmUgbGFyZ2VyIHRoYW5cbnggMjAwIGFuZCB5IDEwMC5cblxuQG1ldGhvZCBtYXhQb3NpdGlvblxuQHBhcmFtIHgge051bWJlcn0gdGhlIG1heGltdW0geCB2YWx1ZSBmb3IgdGhpcyBub2RlJ3MgeCB2YWx1ZVxuQHBhcmFtIHkge051bWJlcn0gdGhlIG1heGltdW0geSB2YWx1ZSBmb3IgdGhpcyBub2RlJ3MgeSB2YWx1ZVxuQGNoYWluYWJsZVxuKiovXG5cbi8qKlxubWF4UG9zaXRpb24gaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHRocmVlIGRpZmZlcmVudCB3YXlzIHRvIHVzZSBtYXhQb3NpdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIHZhbHVlIHRoYXQgdGhpcyBMYXlvdXROb2RlJ3MgeCBhbmQgeSB3aWxsIG5ldmVyIGJlIGxhcmdlciB0aGFuLiBTbyBmb3IgaW5zdGFuY2U6XG5cblx0bm9kZTIucG9zaXRpb25JcyggMzAwLCA0MDAgKS5tYXhQb3NpdGlvbiggMjAwICk7XG5cbldoZW4gcnVuIG5vZGUyJ3Mgd2lkdGggYW5kIGhlaWdodCB3aWxsIGJlIDIwMHgyMDAgbm90IDMwMHg0MDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vdCBiZSBsYXJnZXIgeFxuMjAwIGFuZCB5IDIwMC5cblxuQG1ldGhvZCBtYXhQb3NpdGlvblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IHRoZSBtYXhpbXVtIHggYW5kIHkgdmFsdWUgZm9yIHRoaXMgbm9kZVxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXhQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhQb3NpdGlvbkZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4UG9zaXRpb24sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9XG59O1xuXG5cblxuXG4vKipcbm1heFggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSBmcm9tIHdoaWNoIHRoaXMgbm9kZSdzIG1heGltdW0geCB2YWx1ZSB3aWxsIGJlIHJlYWQgZnJvbS5cblxuXHRub2RlMS54SXMoIDIwMCApO1xuXHRub2RlMi54SXMoIDQwMCApLm1heFgoIG5vZGUxICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgeCB2YWx1ZSB3aWxsIGJlIDIwMCBhbmQgbm90IDQwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm9kZTEncyB4IHZhbHVlLlxuXG5AbWV0aG9kIG1heFhcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSBUaGUgTGF5b3V0Tm9kZSB3aG9zZSB4IHZhbHVlIHdpbGwgYmUgdGhlIG1heGltdW0geCB2YWx1ZSBmb3IgdGhpcyBub2RlXG5AY2hhaW5hYmxlXG4qKi9cbi8qKlxubWF4WCBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIHBvc3NpYmxlIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYW4geCB2YWx1ZSBmcm9tIHdoaWNoIHRoaXMgbm9kZSdzIG1heGltdW0geCB2YWx1ZSB3aWxsIGJlIHNldC5cblxuXHRub2RlMi54SXMoIDQwMCApLm1heFgoIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggdmFsdWUgd2lsbCBiZSAyMDAgYW5kIG5vdCA0MDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIHRoZSB4IHZhbHVlIDIwMC5cblxuQG1ldGhvZCBtYXhYXG5AcGFyYW0geCB7TnVtYmVyfSBUaGUgbWF4aW11bSB4IHZhbHVlIGZvciB0aGlzIExheW91dE5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF4WCA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhYRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhYLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fVxufTtcblxuXG5cblxuXG4vKipcbm1heFkgaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGEgTGF5b3V0Tm9kZSBmcm9tIHdoaWNoIHRoaXMgbm9kZSdzIG1heGltdW0geSB2YWx1ZSB3aWxsIGJlIHJlYWQgZnJvbS5cblxuXHRub2RlMS55SXMoIDIwMCApO1xuXHRub2RlMi55SXMoIDQwMCApLm1heFkoIG5vZGUxICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgeSB2YWx1ZSB3aWxsIGJlIDIwMCBhbmQgbm90IDQwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgdG8gbm9kZTEncyB5IHZhbHVlLlxuXG5AbWV0aG9kIG1heFlcbkBwYXJhbSBsYXlvdXROb2RlIHtMYXlvdXROb2RlfSBUaGUgTGF5b3V0Tm9kZSB3aG9zZSB5IHZhbHVlIHdpbGwgYmUgdGhlIG1heGltdW0geSB2YWx1ZSBmb3IgdGhpcyBub2RlXG5AY2hhaW5hYmxlXG4qKi9cbi8qKlxubWF4WSBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5UaGVyZSBhcmUgdHdvIHBvc3NpYmxlIHdheXMgdG8gdXNlIHRoaXMgZnVuY3Rpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYW4geSB2YWx1ZSBmcm9tIHdoaWNoIHRoaXMgbm9kZSdzIG1heGltdW0geSB2YWx1ZSB3aWxsIGJlIHNldC5cblxuXHRub2RlMi55SXMoIDQwMCApLm1heFkoIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggdmFsdWUgd2lsbCBiZSAyMDAgYW5kIG5vdCA0MDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIHRoZSB5IHZhbHVlIDIwMC5cblxuQG1ldGhvZCBtYXhZXG5AcGFyYW0geSB7TnVtYmVyfSBUaGUgbWF4aW11bSB5IHZhbHVlIGZvciB0aGlzIExheW91dE5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF4WSA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhZRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH0gZWxzZSB7XG5cblx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhZLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fVxufTtcblxuXG5cblxuXG4vKipcbm1pblBvc2l0aW9uIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWluUG9zaXRpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBMYXlvdXROb2RlLiBUaGlzIExheW91dE5vZGUncyBwb3NpdGlvbiB3aWxsIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGUgcG9zaXRpb24gb2YgdGhlIHBhc3NlZCBub2RlLlxuXG5cdG5vZGUxLnBvc2l0aW9uSXMoIDMwMCwgMjAwICk7XG5cdG5vZGUyLnBvc2l0aW9uSXMoIDEwMCwgMTAwICkubWluUG9zaXRpb24oIG5vZGUxICk7XG5cbldoZW4gcnVuIG5vZGUyJ3MgeCBhbmQgeSB3aWxsIGJlIDMwMCBhbmQgMjAwIG5vdCB4IDEwMCBhbmQgeSAxMDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHggYW5kIHkgdG8gbm90IGJlIHNtYWxsZXIgdGhhblxubm9kZTEncyB4IGFuZCB5LlxuXG5AbWV0aG9kIG1pblBvc2l0aW9uXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gdGhpcyBwYXNzZWQgaW4gTGF5b3V0Tm9kZSdzIHggYW5kIHkgcG9zaXRpb24gd2lsbCBiZSBiZSB0aGUgbWluaW11bSB4IGFuZCB5IHBvc2l0aW9uIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1pblBvc2l0aW9uIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWluUG9zaXRpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSBtaW5pbXVtIHggYW5kIHkgcG9zaXRpb24gZm9yIHRoaXMgbm9kZS5cblxuXHRub2RlMi5wb3NpdGlvbklzKCAxMDAsIDEwMCApLm1pblBvc2l0aW9uKCAyMDAsIDEwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggYW5kIHkgd2lsbCBiZSB4IDIwMCBhbmQgeSAxMDAgbm90IHggMTAwIGFuZCB5IDEwMCBiZWNhdXNlIGl0IHdpbGwgYmUgYm91bmQgeCBhbmQgeSB0byBub3QgYmUgc21hbGxlciB0aGFuXG54IDIwMCBhbmQgeSAxMDAuXG5cbkBtZXRob2QgbWluUG9zaXRpb25cbkBwYXJhbSB4IHtOdW1iZXJ9IHRoZSBtaW5pbXVtIHggdmFsdWUgZm9yIHRoaXMgbm9kZSdzIHggdmFsdWVcbkBwYXJhbSB5IHtOdW1iZXJ9IHRoZSBtaW5pbXVtIHkgdmFsdWUgZm9yIHRoaXMgbm9kZSdzIHkgdmFsdWVcbkBjaGFpbmFibGVcbioqL1xuXG4vKipcbm1pblBvc2l0aW9uIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0aHJlZSBkaWZmZXJlbnQgd2F5cyB0byB1c2UgbWluUG9zaXRpb24uIEFsbCBhcmUgbm90ZWQgaW4gdGhpcyBkb2N1bWVudGF0aW9uLlxuXG5Zb3UgY2FuIHBhc3MgaW4gYSB2YWx1ZSB0aGF0IHRoaXMgTGF5b3V0Tm9kZSdzIHggYW5kIHkgd2lsbCBuZXZlciBiZSBzbWFsbGVyIHRoYW4uIFNvIGZvciBpbnN0YW5jZTpcblxuXHRub2RlMi5wb3NpdGlvbklzKCAxMDAsIDUwICkubWluUG9zaXRpb24oIDIwMCApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggYW5kIHkgd2lsbCBiZSB4IDIwMCBhbmQgeSAyMDAgbm90IDEwMCB4IGFuZCA1MCB5IGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byBub3QgYmUgc21hbGxlciB0aGFuIHhcbjIwMCBhbmQgeSAyMDAuXG5cbkBtZXRob2QgbWluUG9zaXRpb25cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSB0aGUgbWluaW11bSB4IGFuZCB5IHZhbHVlIGZvciB0aGlzIG5vZGVcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWluUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluUG9zaXRpb25Gcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pblBvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0fVxufTtcblxuXG5cblxuLyoqXG5taW5YIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgZnJvbSB3aGljaCB0aGlzIG5vZGUncyBtaW5pbXVtIHggdmFsdWUgd2lsbCBiZSByZWFkIGZyb20uXG5cblx0bm9kZTEueElzKCAyMDAgKTtcblx0bm9kZTIueElzKCAxMDAgKS5taW5YKCBub2RlMSApO1xuXG5XaGVuIHJ1biBub2RlMidzIHggdmFsdWUgd2lsbCBiZSAyMDAgYW5kIG5vdCAxMDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vZGUxJ3MgeCB2YWx1ZS5cblxuQG1ldGhvZCBtaW5YXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gVGhlIExheW91dE5vZGUgd2hvc2UgeCB2YWx1ZSB3aWxsIGJlIHRoZSBtaW5pbXVtIHggdmFsdWUgZm9yIHRoaXMgbm9kZVxuQGNoYWluYWJsZVxuKiovXG4vKipcbm1pblggaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGFuIHggdmFsdWUgZnJvbSB3aGljaCB0aGlzIG5vZGUncyBtaW5pbXVtIHggdmFsdWUgd2lsbCBiZSBzZXQuXG5cblx0bm9kZTIueElzKCAxMDAgKS5taW5YKCAyMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB4IHZhbHVlIHdpbGwgYmUgMjAwIGFuZCBub3QgMTAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byB0aGUgeCB2YWx1ZSAyMDAuXG5cbkBtZXRob2QgbWluWFxuQHBhcmFtIHgge051bWJlcn0gVGhlIG1pbmltdW0geCB2YWx1ZSBmb3IgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1pblggPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluWEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluWCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH1cbn07XG5cblxuXG5cblxuLyoqXG5taW5ZIGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cblRoZXJlIGFyZSB0d28gcG9zc2libGUgd2F5cyB0byB1c2UgdGhpcyBmdW5jdGlvbi4gQWxsIGFyZSBub3RlZCBpbiB0aGlzIGRvY3VtZW50YXRpb24uXG5cbllvdSBjYW4gcGFzcyBpbiBhIExheW91dE5vZGUgZnJvbSB3aGljaCB0aGlzIG5vZGUncyBtaW5pbXVtIHkgdmFsdWUgd2lsbCBiZSByZWFkIGZyb20uXG5cblx0bm9kZTEueUlzKCAyMDAgKTtcblx0bm9kZTIueUlzKCAxMDAgKS5taW5ZKCBub2RlMSApO1xuXG5XaGVuIHJ1biBub2RlMidzIHkgdmFsdWUgd2lsbCBiZSAyMDAgYW5kIG5vdCAxMDAgYmVjYXVzZSBpdCB3aWxsIGJlIGJvdW5kIHRvIG5vZGUxJ3MgeSB2YWx1ZS5cblxuQG1ldGhvZCBtaW5ZXG5AcGFyYW0gbGF5b3V0Tm9kZSB7TGF5b3V0Tm9kZX0gVGhlIExheW91dE5vZGUgd2hvc2UgeSB2YWx1ZSB3aWxsIGJlIHRoZSBtaW5pbXVtIHkgdmFsdWUgZm9yIHRoaXMgbm9kZVxuQGNoYWluYWJsZVxuKiovXG4vKipcbm1pblkgaXMgYSBib3VuZGluZyBmdW5jdGlvbi5cblxuVGhlcmUgYXJlIHR3byBwb3NzaWJsZSB3YXlzIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLiBBbGwgYXJlIG5vdGVkIGluIHRoaXMgZG9jdW1lbnRhdGlvbi5cblxuWW91IGNhbiBwYXNzIGluIGFuIHkgdmFsdWUgZnJvbSB3aGljaCB0aGlzIG5vZGUncyBtaW5pbXVtIHkgdmFsdWUgd2lsbCBiZSBzZXQuXG5cblx0bm9kZTIueUlzKCAxMDAgKS5taW5ZKCAyMDAgKTtcblxuV2hlbiBydW4gbm9kZTIncyB5IHZhbHVlIHdpbGwgYmUgMjAwIGFuZCBub3QgMTAwIGJlY2F1c2UgaXQgd2lsbCBiZSBib3VuZCB0byB0aGUgeSB2YWx1ZSAyMDAuXG5cbkBtZXRob2QgbWluWVxuQHBhcmFtIHkge051bWJlcn0gVGhlIG1pbmltdW0geSB2YWx1ZSBmb3IgdGhpcyBMYXlvdXROb2RlXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1pblkgPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzWyAwIF0gaW5zdGFuY2VvZiBMYXlvdXROb2RlICkge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluWUZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluWSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdH1cbn07XG5cblxuXG5cbi8qKlxubWF4IGlzIGEgYm91bmRpbmcgZnVuY3Rpb24uXG5cbkl0J3MgYSBnZW5lcmFsIGJvdW5kaW5nIGZ1bmN0aW9uIHdoaWNoIGRlcml2ZXMgaXQncyBjb250ZXh0IGZyb20gdGhlIHByZXZpb3VzIHJ1bGUgYWRkZWQuXG5cblNvIGJhc2ljYWxseTpcblxuXHRub2RlLnhJcyggMjAwICkubWF4KCAxMDAgKTtcblxuVGhlIHggdmFsdWUgb2YgdGhlIG5vZGUgd291bGQgZW5kIHVwIGJlaW5nIDEwMC5cblxuQW5vdGhlciBleGFtcGxlOlxuXG5cdG5vZGUud2lkdGhJcyggMjQwICkubWF4KCA0MCApO1xuXG5UaGUgd2lkdGggdmFsdWUgb2YgdGhlIG5vZGUgd291bGQgZW5kIHVwIGJlaW5nIGJlaW5nIDQwLlxuXG5TbyBhcyB5b3UgY2FuIHNlZSBhY3QncyBsaWtlIGFsbCB0aGUgb3RoZXIgbWF4IGZ1bmN0aW9ucy4gRm9yIHJlZmVyZW5jZSBsb29rIGF0OlxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL21heFdpZHRoOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL21heFBvc2l0aW9uOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL21heFk6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG5cbkBtZXRob2QgbWF4XG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHR0aGlzLmFkZERlcGVuZGVuY3koIGFyZ3VtZW50c1sgMCBdICk7XG5cblx0XHRzd2l0Y2goIHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgKSB7XG5cblx0XHRcdGNhc2UgU0laRTpcblx0XHRcdGNhc2UgQk9VTkRfU0laRTpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4U2l6ZUZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkUgKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFNJWkVfV0lEVEg6XG5cdFx0XHRjYXNlIEJPVU5EX1NJWkVfV0lEVEg6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFdpZHRoRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9XSURUSCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgU0laRV9IRUlHSFQ6XG5cdFx0XHRjYXNlIEJPVU5EX1NJWkVfSEVJR0hUOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhIZWlnaHRGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX0hFSUdIVCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT046XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhQb3NpdGlvbkZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWF4WEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTl9YICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTl9ZOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9ZOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhZRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OX1kgKTtcblx0XHRcdFxuXHRcdH1cblx0fSBlbHNlIHtcblxuXHRcdHN3aXRjaCggdGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCApIHtcblxuXHRcdFx0Y2FzZSBTSVpFOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhTaXplLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBTSVpFX1dJRFRIOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFX1dJRFRIOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhXaWR0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9XSURUSCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgU0laRV9IRUlHSFQ6XG5cdFx0XHRjYXNlIEJPVU5EX1NJWkVfSEVJR0hUOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhIZWlnaHQsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfSEVJR0hUICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT046XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFBvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT04gKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFBPU0lUSU9OX1g6XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OX1g6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTl9YICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTl9ZOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9ZOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhZLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT05fWSApO1xuXHRcdFx0XG5cdFx0fVxuXHR9XG59O1xuXG5cblxuXG4vKipcbm1pbiBpcyBhIGJvdW5kaW5nIGZ1bmN0aW9uLlxuXG5JdCdzIGEgZ2VuZXJhbCBib3VuZGluZyBmdW5jdGlvbiB3aGljaCBkZXJpdmVzIGl0J3MgY29udGV4dCBmcm9tIHRoZSBwcmV2aW91cyBydWxlIGFkZGVkLlxuXG5TbyBiYXNpY2FsbHk6XG5cblx0bm9kZS54SXMoIDUwICkubWluKCAxMDAgKTtcblxuVGhlIHggdmFsdWUgb2YgdGhlIG5vZGUgd291bGQgZW5kIHVwIGJlaW5nIDEwMC5cblxuQW5vdGhlciBleGFtcGxlOlxuXG5cdG5vZGUud2lkdGhJcyggLTQwMCApLm1pbiggLTQwICk7XG5cblRoZSB3aWR0aCB2YWx1ZSBvZiB0aGUgbm9kZSB3b3VsZCBlbmQgdXAgYmVpbmcgYmVpbmcgLTQwLlxuXG5TbyBhcyB5b3UgY2FuIHNlZSBhY3QncyBsaWtlIGFsbCB0aGUgb3RoZXIgbWF4IGZ1bmN0aW9ucy4gRm9yIHJlZmVyZW5jZSBsb29rIGF0OlxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL21pbldpZHRoOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL21pblBvc2l0aW9uOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuLSB7eyNjcm9zc0xpbmsgXCJMYXlvdXROb2RlL21pblk6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG5cbkBtZXRob2QgbWluXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHNbIDAgXSBpbnN0YW5jZW9mIExheW91dE5vZGUgKSB7XG5cblx0XHR0aGlzLmFkZERlcGVuZGVuY3koIGFyZ3VtZW50c1sgMCBdICk7XG5cblx0XHRzd2l0Y2goIHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgKSB7XG5cblx0XHRcdGNhc2UgU0laRTpcblx0XHRcdGNhc2UgQk9VTkRfU0laRTpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluU2l6ZUZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkUgKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFNJWkVfV0lEVEg6XG5cdFx0XHRjYXNlIEJPVU5EX1NJWkVfV0lEVEg6XG5cdFx0XHRcdHJldHVybiBhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbldpZHRoRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRV9XSURUSCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgU0laRV9IRUlHSFQ6XG5cdFx0XHRjYXNlIEJPVU5EX1NJWkVfSEVJR0hUOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5IZWlnaHRGcm9tLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX0hFSUdIVCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT046XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5Qb3NpdGlvbkZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTiApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluWEZyb20sIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBCT1VORF9QT1NJVElPTl9YICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTl9ZOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9ZOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5ZRnJvbSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OX1kgKTtcblx0XHRcdFxuXHRcdH1cdFx0XG5cdH0gZWxzZSB7XG5cblx0XHRzd2l0Y2goIHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgKSB7XG5cblx0XHRcdGNhc2UgU0laRTpcblx0XHRcdGNhc2UgQk9VTkRfU0laRTpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluU2l6ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgQk9VTkRfU0laRSApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRcdGNhc2UgQk9VTkRfU0laRV9XSURUSDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluV2lkdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIEJPVU5EX1NJWkVfV0lEVEggKTtcblx0XHRcdFxuXG5cdFx0XHRjYXNlIFNJWkVfSEVJR0hUOlxuXHRcdFx0Y2FzZSBCT1VORF9TSVpFX0hFSUdIVDpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluSGVpZ2h0LCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBCT1VORF9TSVpFX0hFSUdIVCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT046XG5cdFx0XHRjYXNlIEJPVU5EX1BPU0lUSU9OOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5Qb3NpdGlvbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OICk7XG5cdFx0XHRcblxuXHRcdFx0Y2FzZSBQT1NJVElPTl9YOlxuXHRcdFx0Y2FzZSBCT1VORF9QT1NJVElPTl9YOlxuXHRcdFx0XHRyZXR1cm4gYWRkUnVsZS5jYWxsKCB0aGlzLCBtaW5YLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgQk9VTkRfUE9TSVRJT05fWCApO1xuXHRcdFx0XG5cblx0XHRcdGNhc2UgUE9TSVRJT05fWTpcblx0XHRcdGNhc2UgQk9VTkRfUE9TSVRJT05fWTpcblx0XHRcdFx0cmV0dXJuIGFkZFJ1bGUuY2FsbCggdGhpcywgbWluWSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIEJPVU5EX1BPU0lUSU9OX1kgKTtcblx0XHRcdFxuXHRcdH1cblx0fVxufTtcblxuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS1DT05ESVRJT05BTFMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmZ1bmN0aW9uIGFkZENvbmRpdGlvbmFsKCBjRnVuY3Rpb24sIGNBcmd1bWVudHMgKSB7XG5cblx0aWYoICF0aGlzLl9pc0RvaW5nV2hlbiApIHtcblxuXHRcdHRocm93ICdCZWZvcmUgYWRkaW5nIGEgY29uZGl0aW9uYWwgc3VjaCBhcyBcIndpZHRoR3JlYXRlclRoYW5cIiB5b3Ugc2hvdWxkIGNhbGwgdGhlIFwid2hlblwiIGZ1bmN0aW9uIHRvIGRlY2xhcmUgd2hpY2ggaXRlbSB3ZVxcJ2xsIGJlIGNvbXBhcmluZyB0byc7XG5cdH1cblxuXHR0aGlzLl9oYXNDb25kaXRpb25hbCA9IHRydWU7XG5cblx0dmFyIGlkeDEgPSB0aGlzLml0ZW1zVG9Db21wYXJlLmxlbmd0aCAtIDE7XG5cblx0Ly93ZSBkb24ndCBoYXMgbWFueSBjb25kaXRpb25hbHMgdG8gY29tcGFyZSBhZ2FpbnN0IGFzIHdlIGhhdmUgaXRlbXMgdG8gY29tcGFyZSBhZ2FpbnN0XG5cdGlmKCB0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXSA9PSB1bmRlZmluZWQgKSB7XG5cblx0XHR0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXSA9IFtdO1xuXHRcdHRoaXMuY29uZGl0aW9uYWxzQXJndW1lbnRzRm9ySXRlbVsgaWR4MSBdID0gW107XG5cblx0XHR0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXS5wdXNoKCBbXSApO1xuXHRcdHRoaXMuY29uZGl0aW9uYWxzQXJndW1lbnRzRm9ySXRlbVsgaWR4MSBdLnB1c2goIFtdICk7XG5cblx0fSBlbHNlIGlmKCB0aGlzLml0ZW1zVG9Db21wYXJlWyBpZHgxIF0ubGVuZ3RoICE9IHRoaXMuY29uZGl0aW9uYWxzRm9ySXRlbVsgaWR4MSBdLmxlbmd0aCApIHtcblxuXHRcdHRoaXMuY29uZGl0aW9uYWxzRm9ySXRlbVsgaWR4MSBdLnB1c2goIFtdICk7XG5cdFx0dGhpcy5jb25kaXRpb25hbHNBcmd1bWVudHNGb3JJdGVtWyBpZHgxIF0ucHVzaCggW10gKTtcblx0fVxuXG5cblx0dmFyIGlkeDIgPSB0aGlzLmNvbmRpdGlvbmFsc0Zvckl0ZW1bIGlkeDEgXS5sZW5ndGggLSAxO1xuXG5cdHRoaXMuY29uZGl0aW9uYWxzRm9ySXRlbVsgaWR4MSBdWyBpZHgyIF0ucHVzaCggY0Z1bmN0aW9uICk7XG5cdHRoaXMuY29uZGl0aW9uYWxzQXJndW1lbnRzRm9ySXRlbVsgaWR4MSBdWyBpZHgyIF0ucHVzaCggY0FyZ3VtZW50cyApO1xuXG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcblVzaW5nIHRoZSB3aGVuIGZ1bmN0aW9uIHlvdSBjYW4gY3JlYXRlIGNvbmRpdGlvbmFscy4gSXQgaXMgdGhlIGZpcnN0IGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiBjcmVhdGluZyBhIGNvbmRpdG9uYWwuIFxuSXQgc3BlY2lmaWVzIHdoYXQgTGF5b3V0Tm9kZSB3aWxsIGJlIHVzZWQgd2hlbiBldmFsdWF0aW5nIGEgY29uZGl0aW9uYWwgc3RhdGVtZW50IHRoYXQgZm9sbG93cy5cblxuRm9yIGluc3RhbmNlOlxuXG5cdG5vZGUxLndoZW4oIG5vZGUyICkud2lkdGhHcmVhdGVyVGhhbiggMjAwICkud2lkdGhJcyggMTAwICk7XG5cbkJhc2ljYWxseSB3aGF0IHRoaXMgc3RhdGVtZW50IHNhaXMgaXMgXCJ3aGVuIG5vZGUyJ3Mgd2lkdGggaXMgZ3JlYXRlciB0aGFuIDIwMHB4IG5vZGUxJ3Mgd2lkdGggaXMgMTAwcHhcIi5cblxuQSBjb25kaXRpb25hbCBzdGF0ZW1lbnQgbXVzdCBhbHdheXMgZm9sbG93IGFmdGVyIGEgd2hlbiBzdGF0ZW1lbnQuXG5cbkBtZXRob2Qgd2hlblxuQHBhcmFtIG5vZGUge0xheW91dE5vZGV9IHRoZSBMYXlvdXROb2RlIHdoaWNoIGZvbGxvd2luZyBjb25kaXRpb25hbHMgd2lsbCBiZSBldmFsdWF0ZWQgYWdhaW5zdFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS53aGVuID0gZnVuY3Rpb24oIG5vZGUgKSB7XG5cblx0Ly93ZSdyZSBjaGVja2luZyBvZiB0aGlzIGlzIExheW91dE5vZGUgY3JlYXRlZCBiYXNlZCBvbiBjb25kaXRpb25hbHNcblx0Ly9pZiB3aGVuIGlzIGNhbGxlZCB3ZSBzaG91bGQga2ljayBiYWNrIHRvIHRoZSBwYXJlbnQgbm9kZXMgd2hlbiBmdW5jdGlvbiBhbmQgY2FsbCB3aGVuIHRoZXJlXG5cdGlmKCB0aGlzLmNvbmRpdGlvbmFsUGFyZW50ICE9PSBudWxsICkge1xuXG5cdFx0cmV0dXJuIHRoaXMuY29uZGl0aW9uYWxQYXJlbnQud2hlbiggbm9kZSApO1xuXHR9XG5cblx0Ly9DaGVjayBpZiB0aGV5J3ZlIGNhbGxlZCB3aGVuIGFuZCB0cmllZCB0byBjYWxsIGl0IGFnYWluXG5cdGlmKCB0aGlzLl9pc0RvaW5nV2hlbiAmJiAhdGhpcy5faGFzQ29uZGl0aW9uYWwgKSB7XG5cblx0XHR0aHJvdyAnWW91IHNob3VsZCBjYWxsIHdoZW4gb3IgYW5kV2hlbiBhZnRlciBhZGRpbmcgY29uZGl0aW9uYWxzIHN1Y2ggXCJ3aWR0aEdyZWF0ZXJUaGFuXCInO1xuXHR9XG5cblx0dGhpcy5faXNEb2luZ1doZW4gPSB0cnVlO1xuXG5cdHZhciBpdGVtQXJyYXkgPSBbXTtcblx0dGhpcy5pdGVtc1RvQ29tcGFyZS5wdXNoKCBpdGVtQXJyYXkgKTtcblx0aXRlbUFycmF5LnB1c2goIG5vZGUgKTtcblxuXHR0aGlzLmNvbmRpdGlvbmFsTGlzdGVuZXJzLnB1c2goIG51bGwgKTtcblx0dGhpcy5sYXN0Q29uZGl0aW9uYWxMaXN0bmVySWR4ID0gdGhpcy5jb25kaXRpb25hbExpc3RlbmVycy5sZW5ndGggLSAxO1xuXHR0aGlzLmxhc3RDb25kaXRpb25hbExpc3RlbmVySXNEZWZhdWx0ID0gZmFsc2U7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcblRoZSBhbmRXaGVuIGZ1bmN0aW9uIGluIGVzc2VuY2UgaXMgdGhlIHNhbWUgYXMgYW4gJiYgb3BlcmF0b3IuIGFuZFdoZW4gc3RhdGVtZW50cyBtdXN0IGZvbGxvdyBhZnRlciBhIGNvbmRpdGlvbmFsLlxuXG5Gb3IgZXhhbXBsZTpcblxuXHRub2RlMS53aGVuKCBub2RlMiApLndpZHRoR3JlYXRlclRoYW4oIDEwMCApLmFuZFdoZW4oIG5vZGUyICkud2lkdGhMZXNzVGhhbiggMjAwICkud2lkdGhJcyggMTAwICk7XG5cbldoYXQgdGhlIGFib3ZlIGlzIHNheWluZyBpcyBcIldoZW4gbm9kZTIncyB3aWR0aCBpcyBncmVhdGVyIHRoYW4gMTAwcHggYW5kIHdoZW4gbm9kZTIncyB3aWR0aCBpcyBsZXNzIHRoYW4gMjAwcHggdGhlbiBub2RlMSdzIHdpZHRoIGlzXG4xMDBweFwiXG5cbmFuZFdoZW4gc3RhdGVtZW50cyBtdXN0IGZvbGxvdyBhZnRlciBhIGNvbmRpdGlvbmFsIHN0YXRlbWVudC5cblxuQG1ldGhvZCBhbmRXaGVuXG5AcGFyYW0gbm9kZSB7TGF5b3V0Tm9kZX0gdGhlIExheW91dE5vZGUgd2hpY2ggZm9sbG93aW5nIGNvbmRpdGlvbmFscyB3aWxsIGJlIGV2YWx1YXRlZCBhZ2FpbnN0XG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmFuZFdoZW4gPSBmdW5jdGlvbiggbm9kZSApIHtcblxuXHRpZiggdGhpcy5jb25kaXRpb25hbFBhcmVudCApIHtcblxuXHRcdHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuYW5kV2hlbiggbm9kZSApO1xuXHR9XG5cblx0dGhpcy5faXNEb2luZ1doZW4gPSB0cnVlO1xuXG5cdHZhciBpZHggPSB0aGlzLml0ZW1zVG9Db21wYXJlLmxlbmd0aCAtIDE7XG5cdHRoaXMuaXRlbXNUb0NvbXBhcmVbIGlkeCBdLnB1c2goIG5vZGUgKTtcblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuVGhlIGRlZmF1bHQgc3RhdGVtZW50IGlzIHRoZSBlcXVpdmFsZW50IHRvIGFuIGVsc2Ugc3RhdGVtZW50LlxuXG5Gb3IgaW5zdGFuY2UgaWYgd2UgaGF2ZSB0aGUgZm9sbG93aW5nIHN0YXRlbWVudDpcblxuXHRub2RlMVxuXHQud2hlbiggbm9kZTIgKS53aWR0aEdyZWF0ZXJUaGFuKCAxMDAgKS53aWR0aElzKCAxMDAgKVxuXHQuZGVmYXVsdCgpLndpZHRoSXMoIDUwICk7XG5cbldoYXQgdGhlIGFib3ZlIG1lYW5zIGlzIFwiV2hlbiBub2RlMidzIHdpZHRoIGlzIGdyZWF0ZXIgdGhhbiAxMDBweCB0aGUgd2lkdGggb2Ygbm9kZTEgaXMgMTAwcHguIE90aGVyd2lzZSBpZiB0aGUgd2lkdGggb2Ygbm9kZTIgaXMgbm90XG5ncmVhdGVyIHRoYW4gMTAwcHggdGhlbiB0aGUgd2lkdGggb2Ygbm9kZTEgaXMgNTBweFwiXG5cblNvbWV0aGluZyB0byBub3RlIGlzIHRoYXQgeW91IGNhbiBhbHNvIGFkZCBydWxlcyB3aGljaCB3aWxsIGFsd2F5cyBldmFsdWF0ZSBieSBkb2luZyB0aGUgZm9sbG93aW5nOlxuXG5cdG5vZGUxXG5cdC5oZWlnaHRJcyggMjAwIClcblx0LndoZW4oIG5vZGUyICkud2lkdGhHcmVhdGVyVGhhbiggMTAwICkud2lkdGhJcyggMTAwIClcblx0LmRlZmF1bHQoKS53aWR0aElzKCA1MCApO1xuXG5CYXNpY2FsbHkgcmVnYXJkbGVzcyBvZiB0aGUgd2lkdGggb2Ygbm9kZTIgdGhlIGhlaWdodCBvZiBub2RlMSB3aWxsIGJlIDIwMHB4LiBUaGlzIGNsZWFybHkgZGlmZmVycyBmcm9tIHRoZSBcImRlZmF1bHRcIiBzdGF0ZW1lbnQuXG5cbkBtZXRob2QgZGVmYXVsdFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5kZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG5cblx0dGhpcy5faXNEb2luZ0RlZmF1bHQgPSB0cnVlO1xuXG5cdGlmKCB0aGlzLmNvbmRpdGlvbmFsUGFyZW50ICkge1xuXG5cdFx0cmV0dXJuIHRoaXMuY29uZGl0aW9uYWxQYXJlbnQuZGVmYXVsdCgpO1xuXHR9XG5cblx0dGhpcy5sYXN0Q29uZGl0aW9uYWxMaXN0bmVySWR4ID0gLTE7XG5cdHRoaXMubGFzdENvbmRpdGlvbmFsTGlzdGVuZXJJc0RlZmF1bHQgPSB0cnVlO1xuXG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG5Zb3UgY2FuIHVzZSB0aGlzIG1ldGhvZCB0byBhZGQgY2FsbGJhY2tzIGZvciB3aGVuIGNvbmRpdGlvbmFscyBldmFsdWF0ZS5cblxuU28gbGV0J3Mgc2F5IHdlIGRvOlxuXG5cdG5vZGUxLndoZW4oIG5vZGUyICkuaGVpZ2h0TGVzc1RoYW4oIDMwMCApLm1hdGNoZXNIZWlnaHRPZiggbm9kZTIgKS5vbiggZnVuY3Rpb24oIGlzVHJ1ZSApIHtcblx0XHRcblx0XHRjb25zb2xlLmxvZyggXCJJcyB0aGUgaGVpZ2h0IG9mIG5vZGUyIHNtYWxsZXIgdGhhbiAzMDA/XCIsIGlzVHJ1ZSApO1xuXHR9KTtcblxuRXZlcnl0aW1lIHRoZSBsYXlvdXQgaXMgdXBkYXRlZCB0aGUgY2FsbCBiYWNrIHdpbGwgZmlyZSB3aXRoIGEgYm9vbGVhbiB3aGljaCBpcyB3aGV0aGVyIHRoZSBjb25kaXRpb25hbCBpc1xudHJ1ZSBvciBmYWxzZS5cblxuVGhlIG9uIGZ1bmN0aW9uIHdpbGwgb25seSBiZSBhcHBsaWVkIHRvIHRoZSBwcmV2aW91cyBcIndoZW5cIiBvciBcImRlZmF1bHRcIiBzdGF0ZW1lbnQgcHJlY2VkaW5nIHRoZSBvbiBzdGF0ZW1lbnQuXG5cbkBtZXRob2Qgb25cbkBwYXJhbSBsaXN0ZW5lciB7RnVuY3Rpb259IFRoaXMgaXMgdGhlIGxpc3RlbmVyIGZvciB0aGUgY2FsbCBiYWNrIHdoZW4gdGhpcyBjb25kaXRpb25hbCBldmFsdWF0ZXNcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbiggbGlzdGVuZXIgKSB7XG5cblxuXHRpZiggdGhpcy5jb25kaXRpb25hbFBhcmVudCApIHtcblxuXHRcdHRoaXMuY29uZGl0aW9uYWxQYXJlbnQub24oIGxpc3RlbmVyICk7XG5cdH0gZWxzZSB7XG5cblx0XHRpZiggIXRoaXMubGFzdENvbmRpdGlvbmFsTGlzdGVuZXJJc0RlZmF1bHQgKSB7XG5cblx0XHRcdGlmKCB0aGlzLmxhc3RDb25kaXRpb25hbExpc3RuZXJJZHggPiAtMSApIHtcblxuXHRcdFx0XHR0aGlzLmNvbmRpdGlvbmFsTGlzdGVuZXJzWyB0aGlzLmxhc3RDb25kaXRpb25hbExpc3RuZXJJZHggXSA9IGxpc3RlbmVyO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHRoaXMuZGVmYXVsdENvbmRpdGlvbmFsTGlzdGVuZXIgPSBsaXN0ZW5lcjtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudCBhbmQgYSBsYXlvdXQgcnVsZSBtdXN0IGZvbGxvd1xudGhpcyBjb25kaXRpb25hbCBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS53aWR0aEdyZWF0ZXJUaGFuKCAzMDAgKS5tYXRjaGVzSGVpZ2h0T2YoIG5vZGUyICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgd2lkdGggb2Ygbm9kZTIgaXMgZ3JlYXRlciB0aGFuIDMwMHB4IG5vZGUxIHNob3VsZCBtYXRjaCB0aGUgaGVpZ2h0IG9mIG5vZGUyXCIuXG5cbkBtZXRob2Qgd2lkdGhHcmVhdGVyVGhhblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IFRoaXMgdmFsdWUgc3RhdGVzIHRoZSB3aWR0aCB0aGF0IHRoZSBMYXlvdXROb2RlJ3Mgd2lkdGggc2hvdWxkIGJlIGV2YWx1YXRlZCBhZ2FpbnN0XG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLndpZHRoR3JlYXRlclRoYW4gPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIGFkZENvbmRpdGlvbmFsLmNhbGwoIHRoaXMsIHdpZHRoR3JlYXRlclRoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50IGFuZCBhIGxheW91dCBydWxlIG11c3QgZm9sbG93XG50aGlzIGNvbmRpdGlvbmFsIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLmhlaWdodEdyZWF0ZXJUaGFuKCAzMDAgKS5tYXRjaGVzSGVpZ2h0T2YoIG5vZGUyICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgaGVpZ2h0IG9mIG5vZGUyIGlzIGdyZWF0ZXIgdGhhbiAzMDBweCBub2RlMSBzaG91bGQgbWF0Y2ggdGhlIGhlaWdodCBvZiBub2RlMlwiLlxuXG5AbWV0aG9kIGhlaWdodEdyZWF0ZXJUaGFuXG5AcGFyYW0gdmFsdWUge051bWJlcn0gVGhpcyB2YWx1ZSBzdGF0ZXMgdGhlIGhlaWdodCB0aGF0IHRoZSBMYXlvdXROb2RlJ3MgaGVpZ2h0IHNob3VsZCBiZSBldmFsdWF0ZWQgYWdhaW5zdFxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5oZWlnaHRHcmVhdGVyVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgaGVpZ2h0R3JlYXRlclRoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50IGFuZCBhIGxheW91dCBydWxlIG11c3QgZm9sbG93XG50aGlzIGNvbmRpdGlvbmFsIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLndpZHRoTGVzc1RoYW4oIDMwMCApLm1hdGNoZXNIZWlnaHRPZiggbm9kZTIgKTtcblxuVGhlIGFib3ZlIGlzIHN0YXRpbmcgXCJ3aGVuIHRoZSB3aWR0aCBvZiBub2RlMiBpcyBsZXNzIHRoYW4gMzAwcHggbm9kZTEgc2hvdWxkIG1hdGNoIHRoZSBoZWlnaHQgb2Ygbm9kZTJcIi5cblxuQG1ldGhvZCB3aWR0aExlc3NUaGFuXG5AcGFyYW0gdmFsdWUge051bWJlcn0gVGhpcyB2YWx1ZSBzdGF0ZXMgdGhlIHdpZHRoIHRoYXQgdGhlIExheW91dE5vZGUncyB3aWR0aCBzaG91bGQgYmUgZXZhbHVhdGVkIGFnYWluc3RcbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUud2lkdGhMZXNzVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgd2lkdGhMZXNzVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cblxuXG4vKipcblRoaXMgZnVuY3Rpb24gaXMgYSBjb25kaXRpb25hbC4gSXQgbXVzdCBmb2xsb3cgYWZ0ZXIgYSBcIndoZW5cIiBvciBcImFuZFdoZW5cIiBzdGF0ZW1lbnQgYW5kIGEgbGF5b3V0IHJ1bGUgbXVzdCBmb2xsb3dcbnRoaXMgY29uZGl0aW9uYWwgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkuaGVpZ2h0TGVzc1RoYW4oIDMwMCApLm1hdGNoZXNIZWlnaHRPZiggbm9kZTIgKTtcblxuVGhlIGFib3ZlIGlzIHN0YXRpbmcgXCJ3aGVuIHRoZSBoZWlnaHQgb2Ygbm9kZTIgaXMgbGVzcyB0aGFuIDMwMHB4IG5vZGUxIHNob3VsZCBtYXRjaCB0aGUgaGVpZ2h0IG9mIG5vZGUyXCIuXG5cbkBtZXRob2QgaGVpZ2h0TGVzc1RoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBUaGlzIHZhbHVlIHN0YXRlcyB0aGUgaGVpZ2h0IHRoYXQgdGhlIExheW91dE5vZGUncyBoZWlnaHQgc2hvdWxkIGJlIGV2YWx1YXRlZCBhZ2FpbnN0XG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmhlaWdodExlc3NUaGFuID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiBhZGRDb25kaXRpb25hbC5jYWxsKCB0aGlzLCBoZWlnaHRMZXNzVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudCBhbmQgYSBsYXlvdXQgcnVsZSBtdXN0IGZvbGxvd1xudGhpcyBjb25kaXRpb25hbCBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS5sZWZ0R3JlYXRlclRoYW4oIDQwMCApLnhJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgdGhlIGxlZnQgc2lkZSAobm9kZTIueCBwb3NpdGlvbikgb2Ygbm9kZTIgaXMgZ3JlYXRlciB0aGFuIDQwMCBub2RlMSdzIHggd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCBsZWZ0R3JlYXRlclRoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBXaGVuIHRoZSB4IHZhbHVlIG9mIExheW91dE5vZGUgcGFzc2VkIGluIHRoZSB3aGVuIHN0YXRlbWVudCBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSB0aGUgXG5jb25kaXRpb25hbHMgbGF5b3V0IHJ1bGVzIHdpbGwgYmUgcnVuXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmxlZnRHcmVhdGVyVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgbGVmdEdyZWF0ZXJUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudCBhbmQgYSBsYXlvdXQgcnVsZSBtdXN0IGZvbGxvd1xudGhpcyBjb25kaXRpb25hbCBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS5sZWZ0TGVzc1RoYW4oIDQwMCApLnhJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgdGhlIGxlZnQgc2lkZSAobm9kZTIueCBwb3NpdGlvbikgb2Ygbm9kZTIgaXMgbGVzcyB0aGFuIDQwMCBub2RlMSdzIHggd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCBsZWZ0TGVzc1RoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBXaGVuIHRoZSB4IHZhbHVlIG9mIExheW91dE5vZGUgcGFzc2VkIGluIHRoZSB3aGVuIHN0YXRlbWVudCBpcyBsZXNzIHRoYW4gdGhpcyB2YWx1ZSB0aGUgXG5jb25kaXRpb25hbHMgbGF5b3V0IHJ1bGVzIHdpbGwgYmUgcnVuXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLmxlZnRMZXNzVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgbGVmdExlc3NUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudCBhbmQgYSBsYXlvdXQgcnVsZSBtdXN0IGZvbGxvd1xudGhpcyBjb25kaXRpb25hbCBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS5yaWdodEdyZWF0ZXJUaGFuKCA0MDAgKS54SXMoIDQwMCApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIHRoZSByaWdodCBzaWRlIChub2RlMi54ICsgbm9kZTIud2lkdGgpIG9mIG5vZGUyIGlzIGdyZWF0ZXIgdGhhbiA0MDAgbm9kZTEncyB4IHdpbGwgYmUgNDAwXCIuXG5cbkBtZXRob2QgcmlnaHRHcmVhdGVyVGhhblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IFdoZW4geCArIHdpZHRoIHZhbHVlIG9mIExheW91dE5vZGUgcGFzc2VkIGluIHRoZSB3aGVuIHN0YXRlbWVudCBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSB0aGUgXG5jb25kaXRpb25hbHMgbGF5b3V0IHJ1bGVzIHdpbGwgYmUgcnVuXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnJpZ2h0R3JlYXRlclRoYW4gPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIGFkZENvbmRpdGlvbmFsLmNhbGwoIHRoaXMsIHJpZ2h0R3JlYXRlclRoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50IGFuZCBhIGxheW91dCBydWxlIG11c3QgZm9sbG93XG50aGlzIGNvbmRpdGlvbmFsIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLnJpZ2h0TGVzc1RoYW4oIDQwMCApLnhJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgdGhlIHJpZ2h0IHNpZGUgKG5vZGUyLnggKyBub2RlMi53aWR0aCkgb2Ygbm9kZTIgaXMgbGVzcyB0aGFuIDQwMCBub2RlMSdzIHggd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCByaWdodExlc3NUaGFuXG5AcGFyYW0gdmFsdWUge051bWJlcn0gV2hlbiB4ICsgd2lkdGggdmFsdWUgb2YgTGF5b3V0Tm9kZSBwYXNzZWQgaW4gdGhlIHdoZW4gc3RhdGVtZW50IGlzIGxlc3MgdGhhbiB0aGlzIHZhbHVlIHRoZSBcbmNvbmRpdGlvbmFscyBsYXlvdXQgcnVsZXMgd2lsbCBiZSBydW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucmlnaHRMZXNzVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgcmlnaHRMZXNzVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50IGFuZCBhIGxheW91dCBydWxlIG11c3QgZm9sbG93XG50aGlzIGNvbmRpdGlvbmFsIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLnRvcEdyZWF0ZXJUaGFuKCA0MDAgKS55SXMoIDQwMCApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIHRoZSBsZWZ0IHNpZGUgKG5vZGUyLnkgcG9zaXRpb24pIG9mIG5vZGUyIGlzIGdyZWF0ZXIgdGhhbiA0MDAgbm9kZTEncyB5IHdpbGwgYmUgNDAwXCIuXG5cbkBtZXRob2QgdG9wR3JlYXRlclRoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBXaGVuIHRoZSB5IHZhbHVlIG9mIExheW91dE5vZGUgcGFzc2VkIGluIHRoZSB3aGVuIHN0YXRlbWVudCBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSB0aGUgXG5jb25kaXRpb25hbHMgbGF5b3V0IHJ1bGVzIHdpbGwgYmUgcnVuXG5AY2hhaW5hYmxlXG4qKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnRvcEdyZWF0ZXJUaGFuID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiBhZGRDb25kaXRpb25hbC5jYWxsKCB0aGlzLCB0b3BHcmVhdGVyVGhhbiwgYXJndW1lbnRzICk7XG59O1xuXG5cblxuXG4vKipcblRoaXMgZnVuY3Rpb24gaXMgYSBjb25kaXRpb25hbC4gSXQgbXVzdCBmb2xsb3cgYWZ0ZXIgYSBcIndoZW5cIiBvciBcImFuZFdoZW5cIiBzdGF0ZW1lbnQgYW5kIGEgbGF5b3V0IHJ1bGUgbXVzdCBmb2xsb3dcbnRoaXMgY29uZGl0aW9uYWwgc3RhdGVtZW50LlxuXG5IZXJlIGlzIGEgdXNhZ2UgZXhhbXBsZTpcblx0XG5cdG5vZGUxLndoZW4oIG5vZGUyICkudG9wTGVzc1RoYW4oIDQwMCApLnlJcyggNDAwICk7XG5cblRoZSBhYm92ZSBpcyBzdGF0aW5nIFwid2hlbiB0aGUgdGhlIGxlZnQgc2lkZSAobm9kZTIueSBwb3NpdGlvbikgb2Ygbm9kZTIgaXMgbGVzcyB0aGFuIDQwMCBub2RlMSdzIHkgd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCB0b3BMZXNzVGhhblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IFdoZW4gdGhlIHkgdmFsdWUgb2YgTGF5b3V0Tm9kZSBwYXNzZWQgaW4gdGhlIHdoZW4gc3RhdGVtZW50IGlzIGxlc3MgdGhhbiB0aGlzIHZhbHVlIHRoZSBcbmNvbmRpdGlvbmFscyBsYXlvdXQgcnVsZXMgd2lsbCBiZSBydW5cbkBjaGFpbmFibGVcbioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUudG9wTGVzc1RoYW4gPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIGFkZENvbmRpdGlvbmFsLmNhbGwoIHRoaXMsIHRvcExlc3NUaGFuLCBhcmd1bWVudHMgKTtcbn07XG5cblxuXG5cbi8qKlxuVGhpcyBmdW5jdGlvbiBpcyBhIGNvbmRpdGlvbmFsLiBJdCBtdXN0IGZvbGxvdyBhZnRlciBhIFwid2hlblwiIG9yIFwiYW5kV2hlblwiIHN0YXRlbWVudCBhbmQgYSBsYXlvdXQgcnVsZSBtdXN0IGZvbGxvd1xudGhpcyBjb25kaXRpb25hbCBzdGF0ZW1lbnQuXG5cbkhlcmUgaXMgYSB1c2FnZSBleGFtcGxlOlxuXHRcblx0bm9kZTEud2hlbiggbm9kZTIgKS5ib3R0b21HcmVhdGVyVGhhbiggNDAwICkueUlzKCA0MDAgKTtcblxuVGhlIGFib3ZlIGlzIHN0YXRpbmcgXCJ3aGVuIHRoZSB0aGUgcmlnaHQgc2lkZSAobm9kZTIueSArIG5vZGUyLmhlaWdodCkgb2Ygbm9kZTIgaXMgZ3JlYXRlciB0aGFuIDQwMCBub2RlMSdzIHkgd2lsbCBiZSA0MDBcIi5cblxuQG1ldGhvZCBib3R0b21HcmVhdGVyVGhhblxuQHBhcmFtIHZhbHVlIHtOdW1iZXJ9IFdoZW4geSArIGhlaWdodCB2YWx1ZSBvZiBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aGUgd2hlbiBzdGF0ZW1lbnQgaXMgZ3JlYXRlciB0aGFuIHRoaXMgdmFsdWUgdGhlIFxuY29uZGl0aW9uYWxzIGxheW91dCBydWxlcyB3aWxsIGJlIHJ1blxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5ib3R0b21HcmVhdGVyVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgYm90dG9tR3JlYXRlclRoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG5cblxuLyoqXG5UaGlzIGZ1bmN0aW9uIGlzIGEgY29uZGl0aW9uYWwuIEl0IG11c3QgZm9sbG93IGFmdGVyIGEgXCJ3aGVuXCIgb3IgXCJhbmRXaGVuXCIgc3RhdGVtZW50IGFuZCBhIGxheW91dCBydWxlIG11c3QgZm9sbG93XG50aGlzIGNvbmRpdGlvbmFsIHN0YXRlbWVudC5cblxuSGVyZSBpcyBhIHVzYWdlIGV4YW1wbGU6XG5cdFxuXHRub2RlMS53aGVuKCBub2RlMiApLmJvdHRvbUxlc3NUaGFuKCA0MDAgKS55SXMoIDQwMCApO1xuXG5UaGUgYWJvdmUgaXMgc3RhdGluZyBcIndoZW4gdGhlIHRoZSByaWdodCBzaWRlIChub2RlMi55ICsgbm9kZTIud2lkdGgpIG9mIG5vZGUyIGlzIGxlc3MgdGhhbiA0MDAgbm9kZTEncyB5IHdpbGwgYmUgNDAwXCIuXG5cbkBtZXRob2QgYm90dG9tTGVzc1RoYW5cbkBwYXJhbSB2YWx1ZSB7TnVtYmVyfSBXaGVuIHkgKyB3aWR0aCB2YWx1ZSBvZiBMYXlvdXROb2RlIHBhc3NlZCBpbiB0aGUgd2hlbiBzdGF0ZW1lbnQgaXMgbGVzcyB0aGFuIHRoaXMgdmFsdWUgdGhlIFxuY29uZGl0aW9uYWxzIGxheW91dCBydWxlcyB3aWxsIGJlIHJ1blxuQGNoYWluYWJsZVxuKiovXG5MYXlvdXROb2RlLnByb3RvdHlwZS5ib3R0b21MZXNzVGhhbiA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gYWRkQ29uZGl0aW9uYWwuY2FsbCggdGhpcywgYm90dG9tTGVzc1RoYW4sIGFyZ3VtZW50cyApO1xufTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBMYXlvdXROb2RlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdGlmKCB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgKSB7XG5cblx0XHRyZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQgPiB2YWx1ZTtcdFxuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0ID4gdmFsdWUueSArIHZhbHVlLmhlaWdodDtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRpZiggdHlwZW9mIHZhbHVlID09ICdudW1iZXInICkge1xuXG5cdFx0cmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IDwgdmFsdWU7XHRcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiB0aGlzLnkgKyB0aGlzLmhlaWdodCA8IHZhbHVlLnkgKyB2YWx1ZS5oZWlnaHQ7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIHRoaXMuaGVpZ2h0ID4gdmFsdWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHJldHVybiB0aGlzLmhlaWdodCA8IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRyZXR1cm4gdGhpcy54ID4gdmFsdWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdGlmKCB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgKSB7XG5cblx0XHRyZXR1cm4gdGhpcy54IDwgdmFsdWU7XHRcblx0fSBlbHNlIHtcblxuXHRcdHJldHVybiB0aGlzLnggPCB2YWx1ZS54O1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdGlmKCB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgKSB7XG5cblx0XHRyZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aCA+IHZhbHVlO1xuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggPiB2YWx1ZS54ICsgdmFsdWUud2lkdGg7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggPCB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0aWYoIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyApIHtcblxuXHRcdHJldHVybiB0aGlzLnkgPiB2YWx1ZTtcdFxuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIHRoaXMueSA+IHZhbHVlLnk7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0aWYoIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyApIHtcblxuXHRcdHJldHVybiB0aGlzLnkgPCB2YWx1ZTtcdFxuXHR9IGVsc2Uge1xuXG5cdFx0cmV0dXJuIHRoaXMueSA8IHZhbHVlLnk7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIHRoaXMud2lkdGggPiB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0cmV0dXJuIHRoaXMud2lkdGggPCB2YWx1ZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzLmxlbmd0aCA9PSAxICkge1xuXG5cdFx0dGhpcy5feCA9IE1hdGgubWluKCB0aGlzLl94LCBhcmd1bWVudHNbIDAgXSApO1xuXHRcdHRoaXMuX3kgPSBNYXRoLm1pbiggdGhpcy5feSwgYXJndW1lbnRzWyAwIF0gKTtcblx0fSBlbHNlIHtcblxuXHRcdHRoaXMuX3ggPSBNYXRoLm1pbiggdGhpcy5feCwgYXJndW1lbnRzWyAwIF0gKTtcblx0XHR0aGlzLl95ID0gTWF0aC5taW4oIHRoaXMuX3ksIGFyZ3VtZW50c1sgMSBdICk7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ID0gTWF0aC5taW4oIHRoaXMuX3gsIGl0ZW0ueCApO1xuXHR0aGlzLl95ID0gTWF0aC5taW4oIHRoaXMuX3ksIGl0ZW0ueSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl94ID0gTWF0aC5taW4oIHRoaXMuX3gsIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCA9IE1hdGgubWluKCB0aGlzLl94LCBpdGVtLnggKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5feSA9IE1hdGgubWluKCB0aGlzLl95LCB2YWx1ZSApO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feSA9IE1hdGgubWluKCB0aGlzLl95LCBpdGVtLnkgKTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG5cdGlmKCBhcmd1bWVudHMubGVuZ3RoID09IDEgKSB7XG5cblx0XHR0aGlzLl94ID0gTWF0aC5tYXgoIHRoaXMuX3gsIGFyZ3VtZW50c1sgMCBdICk7XG5cdFx0dGhpcy5feSA9IE1hdGgubWF4KCB0aGlzLl95LCBhcmd1bWVudHNbIDAgXSApO1xuXHR9IGVsc2Uge1xuXG5cdFx0dGhpcy5feCA9IE1hdGgubWF4KCB0aGlzLl94LCBhcmd1bWVudHNbIDAgXSApO1xuXHRcdHRoaXMuX3kgPSBNYXRoLm1heCggdGhpcy5feSwgYXJndW1lbnRzWyAxIF0gKTtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggPSBNYXRoLm1heCggdGhpcy5feCwgaXRlbS54ICk7XG5cdHRoaXMuX3kgPSBNYXRoLm1heCggdGhpcy5feSwgaXRlbS55ICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX3ggPSBNYXRoLm1heCggdGhpcy5feCwgdmFsdWUgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ID0gTWF0aC5tYXgoIHRoaXMuX3gsIGl0ZW0ueCApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl95ID0gTWF0aC5tYXgoIHRoaXMuX3ksIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feSA9IE1hdGgubWF4KCB0aGlzLl95LCBpdGVtLnkgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5faGVpZ2h0ID0gTWF0aC5taW4oIHRoaXMuX2hlaWdodCwgdmFsdWUgKTtcbn07IiwiZXhwb3J0cy5tb2R1bGUgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl9oZWlnaHQgPSBNYXRoLm1pbiggdGhpcy5faGVpZ2h0LCBpdGVtLmhlaWdodCApOyBcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuXHRpZiggYXJndW1lbnRzLmxlbmd0aCA9PSAxICkge1xuXG5cdFx0dGhpcy5fd2lkdGggPSBNYXRoLm1pbiggdGhpcy5fd2lkdGgsIGFyZ3VtZW50c1sgMCBdICk7XG5cdFx0dGhpcy5faGVpZ2h0ID0gTWF0aC5taW4oIHRoaXMuX2hlaWdodCwgYXJndW1lbnRzWyAwIF0gKTtcblx0fSBlbHNlIHtcblxuXHRcdHRoaXMuX3dpZHRoID0gTWF0aC5taW4oIHRoaXMuX3dpZHRoLCBhcmd1bWVudHNbIDAgXSApO1xuXHRcdHRoaXMuX2hlaWdodCA9IE1hdGgubWluKCB0aGlzLl9oZWlnaHQsIGFyZ3VtZW50c1sgMSBdICk7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuXHR0aGlzLl93aWR0aCA9IE1hdGgubWluKCB0aGlzLl93aWR0aCwgaXRlbS53aWR0aCApO1xuXHR0aGlzLl9oZWlnaHQgPSBNYXRoLm1pbiggdGhpcy5faGVpZ2h0LCBpdGVtLmhlaWdodCApOyBcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5fd2lkdGggPSBNYXRoLm1pbiggdGhpcy5fd2lkdGgsIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5fd2lkdGggPSBNYXRoLm1pbiggdGhpcy5fd2lkdGgsIGl0ZW0ud2lkdGggKTsgXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX2hlaWdodCA9IE1hdGgubWF4KCB0aGlzLl9oZWlnaHQsIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5faGVpZ2h0ID0gTWF0aC5tYXgoIHRoaXMuX2hlaWdodCwgaXRlbS5oZWlnaHQgKTsgXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cblx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcblxuXHRcdHRoaXMuX3dpZHRoID0gTWF0aC5tYXgoIHRoaXMuX3dpZHRoLCBhcmd1bWVudHNbIDAgXSApO1xuXHRcdHRoaXMuX2hlaWdodCA9IE1hdGgubWF4KCB0aGlzLl9oZWlnaHQsIGFyZ3VtZW50c1sgMCBdICk7XG5cdH0gZWxzZSB7XG5cblx0XHR0aGlzLl93aWR0aCA9IE1hdGgubWF4KCB0aGlzLl93aWR0aCwgYXJndW1lbnRzWyAwIF0gKTtcblx0XHR0aGlzLl9oZWlnaHQgPSBNYXRoLm1heCggdGhpcy5faGVpZ2h0LCBhcmd1bWVudHNbIDEgXSApO1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5fd2lkdGggPSBNYXRoLm1heCggdGhpcy5fd2lkdGgsIGl0ZW0ud2lkdGggKTtcblx0dGhpcy5faGVpZ2h0ID0gTWF0aC5tYXgoIHRoaXMuX2hlaWdodCwgaXRlbS5oZWlnaHQgKTsgXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX3dpZHRoID0gTWF0aC5tYXgoIHRoaXMuX3dpZHRoLCB2YWx1ZSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3dpZHRoID0gTWF0aC5tYXgoIHRoaXMuX3dpZHRoLCBpdGVtLndpZHRoICk7IFxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3kgKz0gaXRlbS55IC0gdGhpcy5faGVpZ2h0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3kgKz0gaXRlbS55ICsgaXRlbS5oZWlnaHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCArPSBpdGVtLnggLSB0aGlzLl93aWR0aDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ICs9IGl0ZW0ueCArIGl0ZW0ud2lkdGg7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCArPSBpdGVtLng7XG5cdHRoaXMuX3kgKz0gaXRlbS55O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3kgKz0gaXRlbS55ICsgaXRlbS5oZWlnaHQgLSB0aGlzLl9oZWlnaHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCArPSBpdGVtLnggKyAoIGl0ZW0ud2lkdGggLSB0aGlzLl93aWR0aCApICogMC41O1x0XG5cdHRoaXMuX3kgKz0gaXRlbS55ICsgKCBpdGVtLmhlaWdodCAtIHRoaXMuX2hlaWdodCApICogMC41O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggKz0gaXRlbS54ICsgKCBpdGVtLndpZHRoIC0gdGhpcy5fd2lkdGggKSAqIDAuNTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ICs9IGl0ZW0ueDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggeCwgeSApIHtcblxuXHR0aGlzLl94ICs9IHg7XG5cdHRoaXMuX3kgKz0geTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHR0aGlzLl94ICs9IGl0ZW0ud2lkdGggKiBwZXJjZW50YWdlO1xuXHR0aGlzLl95ICs9IGl0ZW0uaGVpZ2h0ICogcGVyY2VudGFnZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl94ICs9IGl0ZW0ueCArIGl0ZW0ud2lkdGggLSB0aGlzLl93aWR0aDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl95ICs9IGl0ZW0ueTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl95ICs9IGl0ZW0ueSArICggaXRlbS5oZWlnaHQgLSB0aGlzLl9oZWlnaHQgKSAqIDAuNTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggeCApIHtcblxuXHR0aGlzLl94ICs9IHg7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0dGhpcy5feCArPSBpdGVtLndpZHRoICogcGVyY2VudGFnZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggeSApIHtcblxuXHR0aGlzLl95ICs9IHk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0dGhpcy5feSArPSBpdGVtLmhlaWdodCAqIHBlcmNlbnRhZ2U7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGhlaWdodCApIHtcblxuXHR0aGlzLl9oZWlnaHQgKz0gaGVpZ2h0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHRoaXMuX2hlaWdodCArPSBpdGVtLmhlaWdodCAqIHBlcmNlbnRhZ2U7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIG9yaWdpbmFsV2lkdGgsIG9yaWdpbmFsSGVpZ2h0ICkge1xuXG5cdHRoaXMuX2hlaWdodCArPSB0aGlzLl93aWR0aCAvIG9yaWdpbmFsV2lkdGggKiBvcmlnaW5hbEhlaWdodDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl9oZWlnaHQgKz0gaXRlbS5oZWlnaHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5fd2lkdGggKz0gaXRlbS53aWR0aDtcblx0dGhpcy5faGVpZ2h0ICs9IGl0ZW0uaGVpZ2h0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3dpZHRoICs9IGl0ZW0ud2lkdGg7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKSB7XG5cblx0aWYoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcblxuXHRcdHRoaXMuX3dpZHRoICs9IGFyZ3VtZW50c1sgMCBdO1xuXHRcdHRoaXMuX2hlaWdodCArPSBhcmd1bWVudHNbIDAgXTtcblx0fSBlbHNlIHtcblxuXHRcdHRoaXMuX3dpZHRoICs9IGFyZ3VtZW50c1sgMCBdO1xuXHRcdHRoaXMuX2hlaWdodCArPSBhcmd1bWVudHNbIDEgXTtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHRoaXMuX3dpZHRoICs9IGl0ZW0ud2lkdGggKiBwZXJjZW50YWdlO1x0XG5cdHRoaXMuX2hlaWdodCArPSBpdGVtLmhlaWdodCAqIHBlcmNlbnRhZ2U7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIG9yaWdpbmFsV2lkdGgsIG9yaWdpbmFsSGVpZ2h0ICkge1xuXG5cdGlmKCB0aGlzLl93aWR0aCA9PSAwICkge1xuXG5cdFx0dGhpcy5fd2lkdGggKz0gdGhpcy5faGVpZ2h0IC8gb3JpZ2luYWxIZWlnaHQgKiBvcmlnaW5hbFdpZHRoO1xuXHR9IGVsc2UgaWYoIHRoaXMuX2hlaWdodCA9PSAwICkge1xuXG5cdFx0dGhpcy5faGVpZ2h0ICs9IHRoaXMuX3dpZHRoIC8gb3JpZ2luYWxXaWR0aCAqIG9yaWdpbmFsSGVpZ2h0O1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHdpZHRoICkge1xuXG5cdHRoaXMuX3dpZHRoICs9IHdpZHRoO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHRoaXMuX3dpZHRoICs9IGl0ZW0ud2lkdGggKiBwZXJjZW50YWdlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHR0aGlzLl93aWR0aCArPSB0aGlzLl9oZWlnaHQgLyBvcmlnaW5hbEhlaWdodCAqIG9yaWdpbmFsV2lkdGg7XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl9oZWlnaHQgLT0gaXRlbS5oZWlnaHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0dGhpcy5feCAtPSBpdGVtLng7XG5cdHRoaXMuX3kgLT0gaXRlbS55O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3dpZHRoIC09IGl0ZW0ud2lkdGg7XG5cdHRoaXMuX2hlaWdodCAtPSBpdGVtLmhlaWdodDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHR0aGlzLl93aWR0aCAtPSBpdGVtLndpZHRoO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3ggLT0gaXRlbS54O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdHRoaXMuX3kgLT0gaXRlbS55O1xufTsiLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDYxKSIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoNDQpIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSg2MikiLCJtb2R1bGUuZXhwb3J0cz1yZXF1aXJlKDYzKSIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoNDgpIiwibW9kdWxlLmV4cG9ydHM9cmVxdWlyZSg1MikiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl9oZWlnaHQgLT0gdmFsdWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHgsIHkgKSB7XG5cblx0dGhpcy5feCAtPSB4O1xuXHR0aGlzLl95IC09IHk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHdpZHRoLCBoZWlnaHQgKSB7XG5cblx0dGhpcy5fd2lkdGggLT0gd2lkdGg7XG5cdHRoaXMuX2hlaWdodCAtPSBoZWlnaHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX3dpZHRoIC09IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl94IC09IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl95IC09IHZhbHVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHR0aGlzLl9oZWlnaHQgKz0gdmFsdWU7XG59OyIsIm1vZHVsZS5leHBvcnRzPXJlcXVpcmUoNDkpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggd2lkdGgsIGhlaWdodCApIHtcblxuXHR0aGlzLl93aWR0aCArPSB3aWR0aDtcblx0dGhpcy5faGVpZ2h0ICs9IGhlaWdodDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0dGhpcy5fd2lkdGggKz0gdmFsdWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX3ggKz0gdmFsdWU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdHRoaXMuX3kgKz0gdmFsdWU7XG59OyJdfQ==
;