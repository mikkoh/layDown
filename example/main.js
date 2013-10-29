var LayDown = require( '../src/LayDown' );

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
var content1 = layout.create( document.getElementById( 'content1' ) );
var content2 = layout.create( document.getElementById( 'content2' ) );

logo.name = 'logo';
menu.name = 'menu';
menu1.name = 'menu1';
menu2.name = 'menu2';
menu3.name = 'menu3';
content1.name = 'content1';
content2.name = 'content2';

logo.horizontallyCenteredWith( layout ).topAlignedWith( layout )
.when( layout ).heightSmallerThan( 342 ).matchesHeightOf( layout ).minus( 60 ).widthIsProportional( 200, 282 )
.default().sizeIs( 200, 282 );

menu.matchesWidthOf( layout ).horizontallyCenteredWith( layout ).alignedBelow( logo ).plus( 20 );

menu1.alignedWith( menu )
.when( menu ).widthSmallerThan( 600 ).matchesWidthOf( menu )
.default().widthIsAPercentageOf( menu, 0.33333 ).minus( 1 );

menu2.matchesSizeOf( menu1 )
.when( menu ).widthSmallerThan( 600 ).alignedBelow( menu1 ).plus( 3 ).leftAlignedWith( menu1 ).on( onMenu2SmallerThan600 )
.default().topAlignedWith( menu ).alignedRightOf( menu1 ).plus( 3 );

menu3.matchesSizeOf( menu1 )
.when( menu ).widthSmallerThan( 600 ).alignedBelow( menu2 ).plus( 3 ).leftAlignedWith( menu1 )
.default().topAlignedWith( menu ).alignedRightOf( menu2 ).plus( 3 );

content1.matchesWidthOf( menu ).min( 900 ).heightIsProportional( 2700, 652 ).alignedBelow( menu3 ).plus( 3 ).horizontallyCenteredWith( menu );

content2.matchesWidthOf( menu ).heightIs( 200 ).alignedBelow( content1 ).plus( 3 );



onResize();
window.onresize = onResize;

function onResize() {

	layout.resizeAndPosition( 0, 0, window.innerWidth, window.innerHeight );
}

function onMenu2SmallerThan600( isSmaller ) {

	console.log( 'MENU2 IS SMALLER', isSmaller );
}