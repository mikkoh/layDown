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


LayoutNode.prototype.x = 0;
LayoutNode.prototype.y = 0;
LayoutNode.prototype.width = 0;
LayoutNode.prototype.height = 0;
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

LayoutNode.prototype.doLayout = function() {

	this.x = this.y = this.width = this.height = 0;

	for( var i = 0, len = this.dependencies.length; i < len; i++ ) {

		if( !this.dependencies[ i ].hasBeenLayedOut ) {

			this.dependencies[ i ].doLayout();
		}
	}	

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

	this.hasBeenLayedOut = true;
};

LayoutNode.prototype.setLayoutFunction = function( layoutFunction ) {

	this.layoutFunction = layoutFunction;
};

LayoutNode.prototype.addDependency = function( item ) {

	if( item != this.layout ) {
		
		this.dependencies.push( item );
	}
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