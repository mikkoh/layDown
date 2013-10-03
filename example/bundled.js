;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LayoutNode = require( '../src/LayoutNode' );

console.log( 'HEY THERE SUNSHINE' );

var node1 = new LayoutNode( null, null, function() { } );
node1.heightIs( 20 ).plus( 10 ).xIs( 10 ).plus( 25 );
node1.doLayout();

console.log( node1.x, node1.y, node1.width, node1.height );



var node2 = new LayoutNode( null, null, function() { });
node2.matchesSizeOf( node1 ).alignedWith( node1 ).plus( 10 );
node2.doLayout();

console.log( node2.x, node2.y, node2.width, node2.height );

},{"../src/LayoutNode":2}],2:[function(require,module,exports){
/************************************************************/
/************************************************************/
/********************POSITION FUNCTIONS**********************/
/************************************************************/
/************************************************************/
function positionIs( x, y ) {

	this.x += x;
	this.y += y;
}

function xIs( x ) {

	this.x += x;
}

function yIs( y ) {

	this.y += y;
}

function alignedBelow( item ) {

	this.y += item.y + item.height;
}

function alignedAbove( item ) {

	this.y += item.y - this.height;
}

function alignedLeftOf( item ) {

	this.x += item.x - this.width;
}

function alignedRightOf( item ) {

	this.x += item.x + item.width;
}

function alignedWith( item ) {

	this.x += item.x;
	this.y += item.y;
}

function leftAlignedWith( item ) {

	this.x += item.x;
}

function rightAlignedWith( item ) {

	this.x += item.x + item.x - this.width;
}

function topAlignedWith( item ) {

	this.y += item.y;
}

function bottomAlignedWith( item ) {

	this.y += item.y + item.height - this.height;
}

function horizonallyCenteredWith( item ) {

	this.x += item.x + ( item.width - this.width ) * 0.5;
}

function verticallyCenteredWith( item ) {

	this.y += item.y + ( item.height - this.height ) * 0.5;
}


/************************************************************/
/************************************************************/
/**********************SIZE FUNCTIONS************************/
/************************************************************/
/************************************************************/
function sizeIs( width, height ) {

	this.width += width;
	this.height += height;
}

function widthIs( width ) {

	this.width += width;
}

function heightIs( height ) {

	this.height += height;
}

function sizeIsProportional( originalWidth, originalHeight ) {

	if( this.width == 0 ) {

		this.width += this.height / originalHeight * originalWidth;
	} else if( this.height == 0 ) {

		this.height += this.width / originalWidth * originalHeight;
	}
}

function widthIsProportional( originalWidth, originalHeight ) {

	this.width += this.height / originalHeight * originalWidth;
}

function heightIsProportional( originalWidth, originalHeight ) {

	this.height += this.width / originalWidth * originalHeight;
}

function matchesSizeOf( item ) {

	this.width += item.width;
	this.height += item.height;
}

function matchesWidthOf( item ) {

	this.width += item.width;
}

function matchesHeightOf( item ) {

	this.height += item.height;
}

function sizeIsAPercentageOf( item, percentage ) {

	this.width += item.width * percentage;	
	this.height += item.height * percentage;
}

function widthIsAPercentageOf( item, percentage ) {

	this.width += item.width * percentage;
}

function heightIsAPercentageOf( item, percentage ) {

	this.height += item.height * percentage;
}


/************************************************************/
/************************************************************/
/*********************OFFSET FUNCTIONS***********************/
/************************************************************/
/************************************************************/
function plusSize( amount ) {

	this.width += amount;
	this.height += amount;
}

function minusSize( amount ) {

	this.width -= amount;
	this.height -= amount;
}

function minSize( amount ) {

	this.width = Math.max( amount, this.width );
	this.height = Math.max( amount, this.height );
}

function maxSize( amount ) {

	this.width = Math.min( amount, this.width );
	this.height = Math.min( amount, this.height );
}




function plusWidth( amount ) {

	this.width += amount;
}

function minusWidth( amount ) {

	this.width -= amount;
}

function minWidth( amount ) {

	this.width = Math.max( amount, this.width );
}

function maxWidth( amount ) {

	this.width = Math.min( amount, this.width );
}




function plusHeight( amount ) {

	this.height += amount;
}

function minusHeight( amount ) {

	this.height -= amount;
}

function minHeight( amount ) {

	this.height = Math.max( amount, this.height );
}

function maxHeight( amount ) {

	this.height = Math.min( amount, this.height );
}




function plusPosition( amount ) {

	this.x += amount;
	this.y += amount;
}

function minusPosition( amount ) {

	this.x -= amount;
	this.y -= amount;
}

function minPosition( amount ) {

	this.x = Math.max( amount, this.x );
	this.y = Math.max( amount, this.y );
}

function maxPosition( amount ) {

	this.x = Math.min( amount, this.x );
	this.y = Math.min( amount, this.y );
}




function plusX( amount ) {

	this.x += amount;
}

function minusX( amount ) {

	this.x -= amount;
}

function minX( amount ) {

	this.x = Math.max( amount, this.x );
}

function maxX( amount ) {

	this.x = Math.min( amount, this.x );
}



function plusY( amount ) {

	this.y += amount;
}

function minusY( amount ) {

	this.y -= amount;
}

function minY( amount ) {

	this.y = Math.max( amount, this.y );
}

function maxY( amount ) {

	this.y = Math.min( amount, this.y );
}




function addRule( rule, ruleArguments, ruleArr, rulePropArr, type ) {

	ruleArr.push( rule );
	rulePropArr.push( ruleArguments );

	this.lastPropTypeEffected = type;
}






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
	this.rulesPos = [];
	this.rulesPosProp = [];
	this.rulesSize = [];
	this.rulesSizeProp = [];
	this.rulesPosBound = [];
	this.rulesPosBoundProp = [];
	this.rulesSizeBound = [];
	this.rulesSizeBoundProp = [];
};


LayoutNode.prototype.x = 0;
LayoutNode.prototype.y = 0;
LayoutNode.prototype.width = 0;
LayoutNode.prototype.height = 0;
LayoutNode.prototype.layout = null;
LayoutNode.prototype.item = null;
LayoutNode.prototype.layoutFunction = null;
LayoutNode.prototype.lastPropTypeEffected = null;
LayoutNode.prototype.rulesPos = null;
LayoutNode.prototype.rulesPosProp = null;
LayoutNode.prototype.rulesSize = null;
LayoutNode.prototype.rulesSizeProp = null;
LayoutNode.prototype.rulesPosBound = null;
LayoutNode.prototype.rulesPosBoundProp = null;
LayoutNode.prototype.rulesSizeBound = null;
LayoutNode.prototype.rulesSizeBoundProp = null;

LayoutNode.prototype.doLayout = function() {

	this.x = this.y = this.width = this.height = 0;

	for( var i = 0, len = this.rulesSize.length; i < len; i++ ) {

		this.rulesSize[ i ].apply( this, this.rulesSizeProp[ i ] );
	}

	for( var i = 0, len = this.rulesSizeBound.length; i < len; i++ ) {

		this.rulesSizeBound[ i ].apply( this, this.rulesPosBoundProp[ i ] );
	}

	for( var i = 0, len = this.rulesPos.length; i < len; i++ ) {

		this.rulesPos[ i ].apply( this, this.rulesPosProp[ i ] );
	}

	for( var i = 0, len = this.rulesPosBound.length; i < len; i++ ) {

		this.rulesPosBound[ i ].apply( this, this.rulesPosBoundProp[ i ] );
	}

	this.layoutFunction( this.item, this );
};

LayoutNode.prototype.setLayoutFunction = function( layoutFunction ) {

	this.layoutFunction = layoutFunction;
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

	return this;
};

LayoutNode.prototype.alignedAbove = function( item ) {

	addRule.call( this, alignedAbove, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
	
	return this;
};

LayoutNode.prototype.alignedLeftOf = function( item ) {

	addRule.call( this, alignedLeftOf, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
	
	return this;
};

LayoutNode.prototype.alignedRightOf = function( item ) {

	addRule.call( this, alignedRightOf, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
	
	return this;
};

LayoutNode.prototype.alignedWith = function( item ) {

	addRule.call( this, alignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION );

	return this;
};

LayoutNode.prototype.leftAlignedWith = function( item ) {

	addRule.call( this, leftAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );

	return this;
};

LayoutNode.prototype.rightAlignedWith = function( item ) {

	addRule.call( this, rightAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );

	return this;
};

LayoutNode.prototype.topAlignedWith = function( item ) {

	addRule.call( this, topAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
	
	return this;
};

LayoutNode.prototype.bottomAlignedWith = function( item ) {

	addRule.call( this, bottomAlignedWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
	
	return this;
};

LayoutNode.prototype.horizonallyCenteredWith = function( item ) {

	addRule.call( this, horizonallyCenteredWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );

	return this;
};

LayoutNode.prototype.verticallyCenteredWith = function( item ) {

	addRule.call( this, verticallyCenteredWith, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );

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

	return this;
}

LayoutNode.prototype.matchesWidthOf = function( item ) {

	addRule.call( this, matchesWidthOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );

	return this;
}

LayoutNode.prototype.matchesHeightOf = function( item ) {

	addRule.call( this, matchesHeightOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );

	return this;
}

LayoutNode.prototype.sizeIsAPercentageOf = function( item, percentage ) {

	addRule.call( this, sizeIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE );

	return this;
}

LayoutNode.prototype.widthIsAPercentageOf = function( item, percentage ) {

	addRule.call( this, widthIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );

	return this;
}

LayoutNode.prototype.heightIsAPercentageOf = function( item, percentage ) {

	addRule.call( this, heightIsAPercentageOf, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );

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
			addRule.call( this, plusSize, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
		break;

		case SIZE_WIDTH:
			addRule.call( this, plusWidth, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
		break;

		case SIZE_HEIGHT:
			addRule.call( this, plusHeight, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
		break;

		case POSITION:
			addRule.call( this, plusPosition, arguments, this.rulesPos, this.rulesPosProp, POSITION );
		break;

		case POSITION_X:
			addRule.call( this, plusX, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
		break;

		case POSITION_Y:
			addRule.call( this, plusY, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
		break;
	}

	return this;
};

LayoutNode.prototype.minus = function() {

	switch( this.lastPropTypeEffected ) {

		case SIZE:
			addRule.call( this, minusSize, arguments, this.rulesSize, this.rulesSizeProp, SIZE );
		break;

		case SIZE_WIDTH:
			addRule.call( this, minusWidth, arguments, this.rulesSize, this.rulesSizeProp, SIZE_WIDTH );
		break;

		case SIZE_HEIGHT:
			addRule.call( this, minusHeight, arguments, this.rulesSize, this.rulesSizeProp, SIZE_HEIGHT );
		break;

		case POSITION:
			addRule.call( this, minusPosition, arguments, this.rulesPos, this.rulesPosProp, POSITION );
		break;

		case POSITION_X:
			addRule.call( this, minusX, arguments, this.rulesPos, this.rulesPosProp, POSITION_X );
		break;

		case POSITION_Y:
			addRule.call( this, minusY, arguments, this.rulesPos, this.rulesPosProp, POSITION_Y );
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






module.exports = LayoutNode;
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWlra29oYWFwb2phL0RvY3VtZW50cy9Xb3JrL2xheURvd24vZXhhbXBsZS9tYWluLmpzIiwiL1VzZXJzL21pa2tvaGFhcG9qYS9Eb2N1bWVudHMvV29yay9sYXlEb3duL3NyYy9MYXlvdXROb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIExheW91dE5vZGUgPSByZXF1aXJlKCAnLi4vc3JjL0xheW91dE5vZGUnICk7XG5cbmNvbnNvbGUubG9nKCAnSEVZIFRIRVJFIFNVTlNISU5FJyApO1xuXG52YXIgbm9kZTEgPSBuZXcgTGF5b3V0Tm9kZSggbnVsbCwgbnVsbCwgZnVuY3Rpb24oKSB7IH0gKTtcbm5vZGUxLmhlaWdodElzKCAyMCApLnBsdXMoIDEwICkueElzKCAxMCApLnBsdXMoIDI1ICk7XG5ub2RlMS5kb0xheW91dCgpO1xuXG5jb25zb2xlLmxvZyggbm9kZTEueCwgbm9kZTEueSwgbm9kZTEud2lkdGgsIG5vZGUxLmhlaWdodCApO1xuXG5cblxudmFyIG5vZGUyID0gbmV3IExheW91dE5vZGUoIG51bGwsIG51bGwsIGZ1bmN0aW9uKCkgeyB9KTtcbm5vZGUyLm1hdGNoZXNTaXplT2YoIG5vZGUxICkuYWxpZ25lZFdpdGgoIG5vZGUxICkucGx1cyggMTAgKTtcbm5vZGUyLmRvTGF5b3V0KCk7XG5cbmNvbnNvbGUubG9nKCBub2RlMi54LCBub2RlMi55LCBub2RlMi53aWR0aCwgbm9kZTIuaGVpZ2h0ICk7XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKlBPU0lUSU9OIEZVTkNUSU9OUyoqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmZ1bmN0aW9uIHBvc2l0aW9uSXMoIHgsIHkgKSB7XG5cblx0dGhpcy54ICs9IHg7XG5cdHRoaXMueSArPSB5O1xufVxuXG5mdW5jdGlvbiB4SXMoIHggKSB7XG5cblx0dGhpcy54ICs9IHg7XG59XG5cbmZ1bmN0aW9uIHlJcyggeSApIHtcblxuXHR0aGlzLnkgKz0geTtcbn1cblxuZnVuY3Rpb24gYWxpZ25lZEJlbG93KCBpdGVtICkge1xuXG5cdHRoaXMueSArPSBpdGVtLnkgKyBpdGVtLmhlaWdodDtcbn1cblxuZnVuY3Rpb24gYWxpZ25lZEFib3ZlKCBpdGVtICkge1xuXG5cdHRoaXMueSArPSBpdGVtLnkgLSB0aGlzLmhlaWdodDtcbn1cblxuZnVuY3Rpb24gYWxpZ25lZExlZnRPZiggaXRlbSApIHtcblxuXHR0aGlzLnggKz0gaXRlbS54IC0gdGhpcy53aWR0aDtcbn1cblxuZnVuY3Rpb24gYWxpZ25lZFJpZ2h0T2YoIGl0ZW0gKSB7XG5cblx0dGhpcy54ICs9IGl0ZW0ueCArIGl0ZW0ud2lkdGg7XG59XG5cbmZ1bmN0aW9uIGFsaWduZWRXaXRoKCBpdGVtICkge1xuXG5cdHRoaXMueCArPSBpdGVtLng7XG5cdHRoaXMueSArPSBpdGVtLnk7XG59XG5cbmZ1bmN0aW9uIGxlZnRBbGlnbmVkV2l0aCggaXRlbSApIHtcblxuXHR0aGlzLnggKz0gaXRlbS54O1xufVxuXG5mdW5jdGlvbiByaWdodEFsaWduZWRXaXRoKCBpdGVtICkge1xuXG5cdHRoaXMueCArPSBpdGVtLnggKyBpdGVtLnggLSB0aGlzLndpZHRoO1xufVxuXG5mdW5jdGlvbiB0b3BBbGlnbmVkV2l0aCggaXRlbSApIHtcblxuXHR0aGlzLnkgKz0gaXRlbS55O1xufVxuXG5mdW5jdGlvbiBib3R0b21BbGlnbmVkV2l0aCggaXRlbSApIHtcblxuXHR0aGlzLnkgKz0gaXRlbS55ICsgaXRlbS5oZWlnaHQgLSB0aGlzLmhlaWdodDtcbn1cblxuZnVuY3Rpb24gaG9yaXpvbmFsbHlDZW50ZXJlZFdpdGgoIGl0ZW0gKSB7XG5cblx0dGhpcy54ICs9IGl0ZW0ueCArICggaXRlbS53aWR0aCAtIHRoaXMud2lkdGggKSAqIDAuNTtcbn1cblxuZnVuY3Rpb24gdmVydGljYWxseUNlbnRlcmVkV2l0aCggaXRlbSApIHtcblxuXHR0aGlzLnkgKz0gaXRlbS55ICsgKCBpdGVtLmhlaWdodCAtIHRoaXMuaGVpZ2h0ICkgKiAwLjU7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKioqKlNJWkUgRlVOQ1RJT05TKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5mdW5jdGlvbiBzaXplSXMoIHdpZHRoLCBoZWlnaHQgKSB7XG5cblx0dGhpcy53aWR0aCArPSB3aWR0aDtcblx0dGhpcy5oZWlnaHQgKz0gaGVpZ2h0O1xufVxuXG5mdW5jdGlvbiB3aWR0aElzKCB3aWR0aCApIHtcblxuXHR0aGlzLndpZHRoICs9IHdpZHRoO1xufVxuXG5mdW5jdGlvbiBoZWlnaHRJcyggaGVpZ2h0ICkge1xuXG5cdHRoaXMuaGVpZ2h0ICs9IGhlaWdodDtcbn1cblxuZnVuY3Rpb24gc2l6ZUlzUHJvcG9ydGlvbmFsKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHRpZiggdGhpcy53aWR0aCA9PSAwICkge1xuXG5cdFx0dGhpcy53aWR0aCArPSB0aGlzLmhlaWdodCAvIG9yaWdpbmFsSGVpZ2h0ICogb3JpZ2luYWxXaWR0aDtcblx0fSBlbHNlIGlmKCB0aGlzLmhlaWdodCA9PSAwICkge1xuXG5cdFx0dGhpcy5oZWlnaHQgKz0gdGhpcy53aWR0aCAvIG9yaWdpbmFsV2lkdGggKiBvcmlnaW5hbEhlaWdodDtcblx0fVxufVxuXG5mdW5jdGlvbiB3aWR0aElzUHJvcG9ydGlvbmFsKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHR0aGlzLndpZHRoICs9IHRoaXMuaGVpZ2h0IC8gb3JpZ2luYWxIZWlnaHQgKiBvcmlnaW5hbFdpZHRoO1xufVxuXG5mdW5jdGlvbiBoZWlnaHRJc1Byb3BvcnRpb25hbCggb3JpZ2luYWxXaWR0aCwgb3JpZ2luYWxIZWlnaHQgKSB7XG5cblx0dGhpcy5oZWlnaHQgKz0gdGhpcy53aWR0aCAvIG9yaWdpbmFsV2lkdGggKiBvcmlnaW5hbEhlaWdodDtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1NpemVPZiggaXRlbSApIHtcblxuXHR0aGlzLndpZHRoICs9IGl0ZW0ud2lkdGg7XG5cdHRoaXMuaGVpZ2h0ICs9IGl0ZW0uaGVpZ2h0O1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzV2lkdGhPZiggaXRlbSApIHtcblxuXHR0aGlzLndpZHRoICs9IGl0ZW0ud2lkdGg7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNIZWlnaHRPZiggaXRlbSApIHtcblxuXHR0aGlzLmhlaWdodCArPSBpdGVtLmhlaWdodDtcbn1cblxuZnVuY3Rpb24gc2l6ZUlzQVBlcmNlbnRhZ2VPZiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHR0aGlzLndpZHRoICs9IGl0ZW0ud2lkdGggKiBwZXJjZW50YWdlO1x0XG5cdHRoaXMuaGVpZ2h0ICs9IGl0ZW0uaGVpZ2h0ICogcGVyY2VudGFnZTtcbn1cblxuZnVuY3Rpb24gd2lkdGhJc0FQZXJjZW50YWdlT2YoIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0dGhpcy53aWR0aCArPSBpdGVtLndpZHRoICogcGVyY2VudGFnZTtcbn1cblxuZnVuY3Rpb24gaGVpZ2h0SXNBUGVyY2VudGFnZU9mKCBpdGVtLCBwZXJjZW50YWdlICkge1xuXG5cdHRoaXMuaGVpZ2h0ICs9IGl0ZW0uaGVpZ2h0ICogcGVyY2VudGFnZTtcbn1cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKipPRkZTRVQgRlVOQ1RJT05TKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmZ1bmN0aW9uIHBsdXNTaXplKCBhbW91bnQgKSB7XG5cblx0dGhpcy53aWR0aCArPSBhbW91bnQ7XG5cdHRoaXMuaGVpZ2h0ICs9IGFtb3VudDtcbn1cblxuZnVuY3Rpb24gbWludXNTaXplKCBhbW91bnQgKSB7XG5cblx0dGhpcy53aWR0aCAtPSBhbW91bnQ7XG5cdHRoaXMuaGVpZ2h0IC09IGFtb3VudDtcbn1cblxuZnVuY3Rpb24gbWluU2l6ZSggYW1vdW50ICkge1xuXG5cdHRoaXMud2lkdGggPSBNYXRoLm1heCggYW1vdW50LCB0aGlzLndpZHRoICk7XG5cdHRoaXMuaGVpZ2h0ID0gTWF0aC5tYXgoIGFtb3VudCwgdGhpcy5oZWlnaHQgKTtcbn1cblxuZnVuY3Rpb24gbWF4U2l6ZSggYW1vdW50ICkge1xuXG5cdHRoaXMud2lkdGggPSBNYXRoLm1pbiggYW1vdW50LCB0aGlzLndpZHRoICk7XG5cdHRoaXMuaGVpZ2h0ID0gTWF0aC5taW4oIGFtb3VudCwgdGhpcy5oZWlnaHQgKTtcbn1cblxuXG5cblxuZnVuY3Rpb24gcGx1c1dpZHRoKCBhbW91bnQgKSB7XG5cblx0dGhpcy53aWR0aCArPSBhbW91bnQ7XG59XG5cbmZ1bmN0aW9uIG1pbnVzV2lkdGgoIGFtb3VudCApIHtcblxuXHR0aGlzLndpZHRoIC09IGFtb3VudDtcbn1cblxuZnVuY3Rpb24gbWluV2lkdGgoIGFtb3VudCApIHtcblxuXHR0aGlzLndpZHRoID0gTWF0aC5tYXgoIGFtb3VudCwgdGhpcy53aWR0aCApO1xufVxuXG5mdW5jdGlvbiBtYXhXaWR0aCggYW1vdW50ICkge1xuXG5cdHRoaXMud2lkdGggPSBNYXRoLm1pbiggYW1vdW50LCB0aGlzLndpZHRoICk7XG59XG5cblxuXG5cbmZ1bmN0aW9uIHBsdXNIZWlnaHQoIGFtb3VudCApIHtcblxuXHR0aGlzLmhlaWdodCArPSBhbW91bnQ7XG59XG5cbmZ1bmN0aW9uIG1pbnVzSGVpZ2h0KCBhbW91bnQgKSB7XG5cblx0dGhpcy5oZWlnaHQgLT0gYW1vdW50O1xufVxuXG5mdW5jdGlvbiBtaW5IZWlnaHQoIGFtb3VudCApIHtcblxuXHR0aGlzLmhlaWdodCA9IE1hdGgubWF4KCBhbW91bnQsIHRoaXMuaGVpZ2h0ICk7XG59XG5cbmZ1bmN0aW9uIG1heEhlaWdodCggYW1vdW50ICkge1xuXG5cdHRoaXMuaGVpZ2h0ID0gTWF0aC5taW4oIGFtb3VudCwgdGhpcy5oZWlnaHQgKTtcbn1cblxuXG5cblxuZnVuY3Rpb24gcGx1c1Bvc2l0aW9uKCBhbW91bnQgKSB7XG5cblx0dGhpcy54ICs9IGFtb3VudDtcblx0dGhpcy55ICs9IGFtb3VudDtcbn1cblxuZnVuY3Rpb24gbWludXNQb3NpdGlvbiggYW1vdW50ICkge1xuXG5cdHRoaXMueCAtPSBhbW91bnQ7XG5cdHRoaXMueSAtPSBhbW91bnQ7XG59XG5cbmZ1bmN0aW9uIG1pblBvc2l0aW9uKCBhbW91bnQgKSB7XG5cblx0dGhpcy54ID0gTWF0aC5tYXgoIGFtb3VudCwgdGhpcy54ICk7XG5cdHRoaXMueSA9IE1hdGgubWF4KCBhbW91bnQsIHRoaXMueSApO1xufVxuXG5mdW5jdGlvbiBtYXhQb3NpdGlvbiggYW1vdW50ICkge1xuXG5cdHRoaXMueCA9IE1hdGgubWluKCBhbW91bnQsIHRoaXMueCApO1xuXHR0aGlzLnkgPSBNYXRoLm1pbiggYW1vdW50LCB0aGlzLnkgKTtcbn1cblxuXG5cblxuZnVuY3Rpb24gcGx1c1goIGFtb3VudCApIHtcblxuXHR0aGlzLnggKz0gYW1vdW50O1xufVxuXG5mdW5jdGlvbiBtaW51c1goIGFtb3VudCApIHtcblxuXHR0aGlzLnggLT0gYW1vdW50O1xufVxuXG5mdW5jdGlvbiBtaW5YKCBhbW91bnQgKSB7XG5cblx0dGhpcy54ID0gTWF0aC5tYXgoIGFtb3VudCwgdGhpcy54ICk7XG59XG5cbmZ1bmN0aW9uIG1heFgoIGFtb3VudCApIHtcblxuXHR0aGlzLnggPSBNYXRoLm1pbiggYW1vdW50LCB0aGlzLnggKTtcbn1cblxuXG5cbmZ1bmN0aW9uIHBsdXNZKCBhbW91bnQgKSB7XG5cblx0dGhpcy55ICs9IGFtb3VudDtcbn1cblxuZnVuY3Rpb24gbWludXNZKCBhbW91bnQgKSB7XG5cblx0dGhpcy55IC09IGFtb3VudDtcbn1cblxuZnVuY3Rpb24gbWluWSggYW1vdW50ICkge1xuXG5cdHRoaXMueSA9IE1hdGgubWF4KCBhbW91bnQsIHRoaXMueSApO1xufVxuXG5mdW5jdGlvbiBtYXhZKCBhbW91bnQgKSB7XG5cblx0dGhpcy55ID0gTWF0aC5taW4oIGFtb3VudCwgdGhpcy55ICk7XG59XG5cblxuXG5cbmZ1bmN0aW9uIGFkZFJ1bGUoIHJ1bGUsIHJ1bGVBcmd1bWVudHMsIHJ1bGVBcnIsIHJ1bGVQcm9wQXJyLCB0eXBlICkge1xuXG5cdHJ1bGVBcnIucHVzaCggcnVsZSApO1xuXHRydWxlUHJvcEFyci5wdXNoKCBydWxlQXJndW1lbnRzICk7XG5cblx0dGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCA9IHR5cGU7XG59XG5cblxuXG5cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqUFJPUFMgVE8gRUZGRUNUKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbnZhciBTSVpFID0gJ1NJWkUnO1xudmFyIFNJWkVfV0lEVEggPSAnU0laRV9XSURUSCc7XG52YXIgU0laRV9IRUlHSFQgPSAnU0laRV9IRUlHSFQnO1xudmFyIFBPU0lUSU9OID0gJ1BPU0lUSU9OJztcbnZhciBQT1NJVElPTl9YID0gJ1BPU0lUSU9OX1gnO1xudmFyIFBPU0lUSU9OX1kgPSAnUE9TSVRJT05fWSc7XG5cblxuXG5cbnZhciBMYXlvdXROb2RlID0gZnVuY3Rpb24oIGxheW91dCwgaXRlbSwgbGF5b3V0RnVuY3Rpb24gKSB7XG5cblx0dGhpcy5sYXlvdXQgPSBsYXlvdXQ7XG5cdHRoaXMuaXRlbSA9IGl0ZW07XG5cdHRoaXMubGF5b3V0RnVuY3Rpb24gPSBsYXlvdXRGdW5jdGlvbjtcblx0dGhpcy5ydWxlc1BvcyA9IFtdO1xuXHR0aGlzLnJ1bGVzUG9zUHJvcCA9IFtdO1xuXHR0aGlzLnJ1bGVzU2l6ZSA9IFtdO1xuXHR0aGlzLnJ1bGVzU2l6ZVByb3AgPSBbXTtcblx0dGhpcy5ydWxlc1Bvc0JvdW5kID0gW107XG5cdHRoaXMucnVsZXNQb3NCb3VuZFByb3AgPSBbXTtcblx0dGhpcy5ydWxlc1NpemVCb3VuZCA9IFtdO1xuXHR0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCA9IFtdO1xufTtcblxuXG5MYXlvdXROb2RlLnByb3RvdHlwZS54ID0gMDtcbkxheW91dE5vZGUucHJvdG90eXBlLnkgPSAwO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUud2lkdGggPSAwO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUuaGVpZ2h0ID0gMDtcbkxheW91dE5vZGUucHJvdG90eXBlLmxheW91dCA9IG51bGw7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5pdGVtID0gbnVsbDtcbkxheW91dE5vZGUucHJvdG90eXBlLmxheW91dEZ1bmN0aW9uID0gbnVsbDtcbkxheW91dE5vZGUucHJvdG90eXBlLmxhc3RQcm9wVHlwZUVmZmVjdGVkID0gbnVsbDtcbkxheW91dE5vZGUucHJvdG90eXBlLnJ1bGVzUG9zID0gbnVsbDtcbkxheW91dE5vZGUucHJvdG90eXBlLnJ1bGVzUG9zUHJvcCA9IG51bGw7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5ydWxlc1NpemUgPSBudWxsO1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucnVsZXNTaXplUHJvcCA9IG51bGw7XG5MYXlvdXROb2RlLnByb3RvdHlwZS5ydWxlc1Bvc0JvdW5kID0gbnVsbDtcbkxheW91dE5vZGUucHJvdG90eXBlLnJ1bGVzUG9zQm91bmRQcm9wID0gbnVsbDtcbkxheW91dE5vZGUucHJvdG90eXBlLnJ1bGVzU2l6ZUJvdW5kID0gbnVsbDtcbkxheW91dE5vZGUucHJvdG90eXBlLnJ1bGVzU2l6ZUJvdW5kUHJvcCA9IG51bGw7XG5cbkxheW91dE5vZGUucHJvdG90eXBlLmRvTGF5b3V0ID0gZnVuY3Rpb24oKSB7XG5cblx0dGhpcy54ID0gdGhpcy55ID0gdGhpcy53aWR0aCA9IHRoaXMuaGVpZ2h0ID0gMDtcblxuXHRmb3IoIHZhciBpID0gMCwgbGVuID0gdGhpcy5ydWxlc1NpemUubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHR0aGlzLnJ1bGVzU2l6ZVsgaSBdLmFwcGx5KCB0aGlzLCB0aGlzLnJ1bGVzU2l6ZVByb3BbIGkgXSApO1xuXHR9XG5cblx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHRoaXMucnVsZXNTaXplQm91bmQubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHR0aGlzLnJ1bGVzU2l6ZUJvdW5kWyBpIF0uYXBwbHkoIHRoaXMsIHRoaXMucnVsZXNQb3NCb3VuZFByb3BbIGkgXSApO1xuXHR9XG5cblx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHRoaXMucnVsZXNQb3MubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHR0aGlzLnJ1bGVzUG9zWyBpIF0uYXBwbHkoIHRoaXMsIHRoaXMucnVsZXNQb3NQcm9wWyBpIF0gKTtcblx0fVxuXG5cdGZvciggdmFyIGkgPSAwLCBsZW4gPSB0aGlzLnJ1bGVzUG9zQm91bmQubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cblx0XHR0aGlzLnJ1bGVzUG9zQm91bmRbIGkgXS5hcHBseSggdGhpcywgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcFsgaSBdICk7XG5cdH1cblxuXHR0aGlzLmxheW91dEZ1bmN0aW9uKCB0aGlzLml0ZW0sIHRoaXMgKTtcbn07XG5cbkxheW91dE5vZGUucHJvdG90eXBlLnNldExheW91dEZ1bmN0aW9uID0gZnVuY3Rpb24oIGxheW91dEZ1bmN0aW9uICkge1xuXG5cdHRoaXMubGF5b3V0RnVuY3Rpb24gPSBsYXlvdXRGdW5jdGlvbjtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKipQT1NJVElPTiBGVU5DVElPTlMqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbkxheW91dE5vZGUucHJvdG90eXBlLnBvc2l0aW9uSXMgPSBmdW5jdGlvbiggeCwgeSApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIHBvc2l0aW9uSXMsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS54SXMgPSBmdW5jdGlvbiggeCApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIHhJcywgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xuXG5cdHJldHVybiB0aGlzO1xufTtcblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUueUlzID0gZnVuY3Rpb24oIHkgKSB7XG5cblx0YWRkUnVsZS5jYWxsKCB0aGlzLCB5SXMsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbkxheW91dE5vZGUucHJvdG90eXBlLmFsaWduZWRCZWxvdyA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdGFkZFJ1bGUuY2FsbCggdGhpcywgYWxpZ25lZEJlbG93LCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5hbGlnbmVkQWJvdmUgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIGFsaWduZWRBYm92ZSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xuXHRcblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5hbGlnbmVkTGVmdE9mID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0YWRkUnVsZS5jYWxsKCB0aGlzLCBhbGlnbmVkTGVmdE9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG5cdFxuXHRyZXR1cm4gdGhpcztcbn07XG5cbkxheW91dE5vZGUucHJvdG90eXBlLmFsaWduZWRSaWdodE9mID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0YWRkUnVsZS5jYWxsKCB0aGlzLCBhbGlnbmVkUmlnaHRPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xuXHRcblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5hbGlnbmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdGFkZFJ1bGUuY2FsbCggdGhpcywgYWxpZ25lZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OICk7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5sZWZ0QWxpZ25lZFdpdGggPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIGxlZnRBbGlnbmVkV2l0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xuXG5cdHJldHVybiB0aGlzO1xufTtcblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUucmlnaHRBbGlnbmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdGFkZFJ1bGUuY2FsbCggdGhpcywgcmlnaHRBbGlnbmVkV2l0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xuXG5cdHJldHVybiB0aGlzO1xufTtcblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUudG9wQWxpZ25lZFdpdGggPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIHRvcEFsaWduZWRXaXRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9ZICk7XG5cdFxuXHRyZXR1cm4gdGhpcztcbn07XG5cbkxheW91dE5vZGUucHJvdG90eXBlLmJvdHRvbUFsaWduZWRXaXRoID0gZnVuY3Rpb24oIGl0ZW0gKSB7XG5cblx0YWRkUnVsZS5jYWxsKCB0aGlzLCBib3R0b21BbGlnbmVkV2l0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xuXHRcblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5ob3Jpem9uYWxseUNlbnRlcmVkV2l0aCA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdGFkZFJ1bGUuY2FsbCggdGhpcywgaG9yaXpvbmFsbHlDZW50ZXJlZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1ggKTtcblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbkxheW91dE5vZGUucHJvdG90eXBlLnZlcnRpY2FsbHlDZW50ZXJlZFdpdGggPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIHZlcnRpY2FsbHlDZW50ZXJlZFdpdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1BvcywgdGhpcy5ydWxlc1Bvc1Byb3AsIFBPU0lUSU9OX1kgKTtcblxuXHRyZXR1cm4gdGhpcztcbn07XG5cblxuXG5cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqU0laRSBGVU5DVElPTlMqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbkxheW91dE5vZGUucHJvdG90eXBlLnNpemVJcyA9IGZ1bmN0aW9uKCB3aWR0aCwgaGVpZ2h0ICkge1xuXG5cdGFkZFJ1bGUuY2FsbCggdGhpcywgc2l6ZUlzLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkUgKTtcblxuXHRyZXR1cm4gdGhpcztcbn1cblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUud2lkdGhJcyA9IGZ1bmN0aW9uKCB3aWR0aCApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIHdpZHRoSXMsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xuXG5cdHJldHVybiB0aGlzO1xufVxuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5oZWlnaHRJcyA9IGZ1bmN0aW9uKCBoZWlnaHQgKSB7XG5cblx0YWRkUnVsZS5jYWxsKCB0aGlzLCBoZWlnaHRJcywgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xuXHRcblx0cmV0dXJuIHRoaXM7XG59XG5cbkxheW91dE5vZGUucHJvdG90eXBlLnNpemVJc1Byb3BvcnRpb25hbCA9IGZ1bmN0aW9uKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIHNpemVJc1Byb3BvcnRpb25hbCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFICk7XG5cdFxuXHRyZXR1cm4gdGhpcztcbn1cblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUud2lkdGhJc1Byb3BvcnRpb25hbCA9IGZ1bmN0aW9uKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIHdpZHRoSXNQcm9wb3J0aW9uYWwsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xuXG5cdHJldHVybiB0aGlzO1xufVxuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5oZWlnaHRJc1Byb3BvcnRpb25hbCA9IGZ1bmN0aW9uKCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIGhlaWdodElzUHJvcG9ydGlvbmFsLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfSEVJR0hUICk7XG5cblx0cmV0dXJuIHRoaXM7XG59XG5cbkxheW91dE5vZGUucHJvdG90eXBlLm1hdGNoZXNTaXplT2YgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1hdGNoZXNTaXplT2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xuXG5cdHJldHVybiB0aGlzO1xufVxuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXRjaGVzV2lkdGhPZiA9IGZ1bmN0aW9uKCBpdGVtICkge1xuXG5cdGFkZFJ1bGUuY2FsbCggdGhpcywgbWF0Y2hlc1dpZHRoT2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xuXG5cdHJldHVybiB0aGlzO1xufVxuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5tYXRjaGVzSGVpZ2h0T2YgPSBmdW5jdGlvbiggaXRlbSApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1hdGNoZXNIZWlnaHRPZiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xuXG5cdHJldHVybiB0aGlzO1xufVxuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5zaXplSXNBUGVyY2VudGFnZU9mID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0YWRkUnVsZS5jYWxsKCB0aGlzLCBzaXplSXNBUGVyY2VudGFnZU9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkUgKTtcblxuXHRyZXR1cm4gdGhpcztcbn1cblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUud2lkdGhJc0FQZXJjZW50YWdlT2YgPSBmdW5jdGlvbiggaXRlbSwgcGVyY2VudGFnZSApIHtcblxuXHRhZGRSdWxlLmNhbGwoIHRoaXMsIHdpZHRoSXNBUGVyY2VudGFnZU9mLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkVfV0lEVEggKTtcblxuXHRyZXR1cm4gdGhpcztcbn1cblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUuaGVpZ2h0SXNBUGVyY2VudGFnZU9mID0gZnVuY3Rpb24oIGl0ZW0sIHBlcmNlbnRhZ2UgKSB7XG5cblx0YWRkUnVsZS5jYWxsKCB0aGlzLCBoZWlnaHRJc0FQZXJjZW50YWdlT2YsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9IRUlHSFQgKTtcblxuXHRyZXR1cm4gdGhpcztcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKioqKioqKioqKioqKioqKk9GRlNFVCBGVU5DVElPTlMqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuTGF5b3V0Tm9kZS5wcm90b3R5cGUucGx1cyA9IGZ1bmN0aW9uKCkge1xuXG5cdHN3aXRjaCggdGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCApIHtcblxuXHRcdGNhc2UgU0laRTpcblx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c1NpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRSApO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTSVpFX1dJRFRIOlxuXHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzV2lkdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemUsIHRoaXMucnVsZXNTaXplUHJvcCwgU0laRV9XSURUSCApO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBTSVpFX0hFSUdIVDpcblx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c0hlaWdodCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgcGx1c1Bvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTiApO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTl9YOlxuXHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzWCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWCApO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTl9ZOlxuXHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBwbHVzWSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xuXHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5taW51cyA9IGZ1bmN0aW9uKCkge1xuXG5cdHN3aXRjaCggdGhpcy5sYXN0UHJvcFR5cGVFZmZlY3RlZCApIHtcblxuXHRcdGNhc2UgU0laRTpcblx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWludXNTaXplLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplLCB0aGlzLnJ1bGVzU2l6ZVByb3AsIFNJWkUgKTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWludXNXaWR0aCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX1dJRFRIICk7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFNJWkVfSEVJR0hUOlxuXHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtaW51c0hlaWdodCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZSwgdGhpcy5ydWxlc1NpemVQcm9wLCBTSVpFX0hFSUdIVCApO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBQT1NJVElPTjpcblx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWludXNQb3NpdGlvbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT04gKTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWludXNYLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3MsIHRoaXMucnVsZXNQb3NQcm9wLCBQT1NJVElPTl9YICk7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFBPU0lUSU9OX1k6XG5cdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbnVzWSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zLCB0aGlzLnJ1bGVzUG9zUHJvcCwgUE9TSVRJT05fWSApO1xuXHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5MYXlvdXROb2RlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbigpIHtcblxuXHRzd2l0Y2goIHRoaXMubGFzdFByb3BUeXBlRWZmZWN0ZWQgKSB7XG5cblx0XHRjYXNlIFNJWkU6XG5cdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pblNpemUsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIFNJWkUgKTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgU0laRV9XSURUSDpcblx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWluV2lkdGgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIFNJWkVfV0lEVEggKTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgU0laRV9IRUlHSFQ6XG5cdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pbkhlaWdodCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kLCB0aGlzLnJ1bGVzU2l6ZUJvdW5kUHJvcCwgU0laRV9IRUlHSFQgKTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgUE9TSVRJT046XG5cdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1pblBvc2l0aW9uLCBhcmd1bWVudHMsIHRoaXMucnVsZXNQb3NCb3VuZCwgdGhpcy5ydWxlc1Bvc0JvdW5kUHJvcCwgUE9TSVRJT04gKTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgUE9TSVRJT05fWDpcblx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWluWCwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIFBPU0lUSU9OX1ggKTtcblx0XHRicmVhaztcblxuXHRcdGNhc2UgUE9TSVRJT05fWTpcblx0XHRcdGFkZFJ1bGUuY2FsbCggdGhpcywgbWluWSwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIFBPU0lUSU9OX1kgKTtcblx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiB0aGlzO1xufTtcblxuTGF5b3V0Tm9kZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24oKSB7XG5cblx0c3dpdGNoKCB0aGlzLmxhc3RQcm9wVHlwZUVmZmVjdGVkICkge1xuXG5cdFx0Y2FzZSBTSVpFOlxuXHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhTaXplLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBTSVpFICk7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFNJWkVfV0lEVEg6XG5cdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFdpZHRoLCBhcmd1bWVudHMsIHRoaXMucnVsZXNTaXplQm91bmQsIHRoaXMucnVsZXNTaXplQm91bmRQcm9wLCBTSVpFX1dJRFRIICk7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFNJWkVfSEVJR0hUOlxuXHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhIZWlnaHQsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1NpemVCb3VuZCwgdGhpcy5ydWxlc1NpemVCb3VuZFByb3AsIFNJWkVfSEVJR0hUICk7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFBPU0lUSU9OOlxuXHRcdFx0YWRkUnVsZS5jYWxsKCB0aGlzLCBtYXhQb3NpdGlvbiwgYXJndW1lbnRzLCB0aGlzLnJ1bGVzUG9zQm91bmQsIHRoaXMucnVsZXNQb3NCb3VuZFByb3AsIFBPU0lUSU9OICk7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFBPU0lUSU9OX1g6XG5cdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFgsIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBQT1NJVElPTl9YICk7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIFBPU0lUSU9OX1k6XG5cdFx0XHRhZGRSdWxlLmNhbGwoIHRoaXMsIG1heFksIGFyZ3VtZW50cywgdGhpcy5ydWxlc1Bvc0JvdW5kLCB0aGlzLnJ1bGVzUG9zQm91bmRQcm9wLCBQT1NJVElPTl9ZICk7XG5cdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gdGhpcztcbn07XG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dE5vZGU7Il19
;