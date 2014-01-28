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
.when( ball ).rightGreaterThan( field ).xIs( 0 ).on( function( rightSideOver ) {

	if( rightSideOver ) {

		ballXDirection *= -1;
		ball.x = field.x + field.width - ball.width;
	}
})
.when( ball ).leftLessThan( field ).xIs( 0 ).on( function( leftSideOver ) {

	if( leftSideOver ) {

		ballXDirection *= -1;
		ball.x = field.x;
	}
})
.when( ball ).topLessThan( field ).yIs( 0 ).on( function( topSideOver ) {

	if( topSideOver ) {

		ballYDirection *= -1;
		ball.y = field.y;
	}
})
.when( ball ).bottomGreaterThan( field ).yIs( 0 ).on( function( bottomSideOver ) {

	if( bottomSideOver ) {

		ballYDirection *= -1;
		ball.y = field.y + field.height - ball.height;
	}
})
.when( ball ).isInside( paddle1 ).xIs( 0 ).on( function( isInsidePaddle1 ) {

	if( isInsidePaddle1 ) {

		ballXDirection *= -1;
		ball.x = paddle1.x + paddle1.width + ballXDirection * ballVelocity.x;
	}
})
.when( ball ).isInside( paddle2 ).xIs( 0 ).on( function( isInsidePaddle2 ) {

	if( isInsidePaddle2 ) {

		ballXDirection *= -1;
		ball.x = paddle2.x - ball.width + ballXDirection * ballVelocity.x;
	}
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