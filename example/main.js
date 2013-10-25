var LayDown = require( '../src/LayDown' );

console.log( 'HEY THERE SUNSHINE' );

function layoutFunction( item, node ) { 

	item.style.left = Math.round( node.x ) + 'px';
	item.style.top = Math.round( node.y ) + 'px';
	item.style.width = Math.round( node.width ) + 'px';
	item.style.height = Math.round( node.height ) + 'px';

	var smaller = Math.min( node.width, node.height );

	item.style[ 'fontSize' ] = ( smaller / 30 * 12 ) + 'px';

	//console.log( node.name, node.x, node.y, node.width, node.height );
}

function readFunction( item, name ) {

	if( name == 'width' ) {

		return item.clientWidth;
	} else {

		return item.clientHeight;
	}
}




var layout = new LayDown( layoutFunction, readFunction );

var elem1 = document.getElementById( 'node1' );
elem1.style.backgroundColor = '#CAFE00';
elem1.style.position = 'absolute';

var elem2 = document.getElementById( 'node2' );
elem2.style.backgroundColor = '#FF0000';
elem2.style.position = 'absolute';

var elem3 = document.getElementById( 'node3' );
elem3.style.backgroundColor = '#444';
elem3.style.position = 'absolute';

var elem4 = document.getElementById( 'node4' );
elem4.style.backgroundColor = '#00F';
elem4.style.position = 'absolute';


var node1 = layout.create( elem1 );
var node2 = layout.create( elem2 );
var node3 = layout.create( elem3 );
var node4 = layout.create( elem4 );

node1.name = 'node1';
node2.name = 'node2';
node3.name = 'node3';
node4.name = 'node4';






node1.widthIs( 200 ).leftAlignedWith( node4 ).bottomAlignedWith( node4 );
node2.widthIsAPercentageOf( node4, 0.2 ).matchesHeightOf( node1 ).alignedBelow( node1 ).rightAlignedWith( node1 );

node4.verticallyCenteredWith( layout )
.when( layout ).widthGreaterThan( 900 ).andWhen( layout ).heightGreaterThan( 600 ).sizeIs( 400, 300 ).rightAlignedWith( layout )
.default().matchesSizeOf( layout ).minus( 300 ).min( 0 ).horizontallyCenteredWith( layout );

node3.addCustomRule( function() {

	this._x += layout.width * 0.5;
	this._y += layout.height * 0.5;
}, node3.POSITION_LAYOUT, 30, 30 ).max( node4 ).matchesHeightOf( node1 ).min( node4 ).widthIs( 60 );



// elem1.onmousedown = function() {

// 	window.onmousemove = function( ev ) {

// 		node1.x = ev.pageX;
// 		node1.y = ev.pageY;
// 	};
// };

// elem1.onmouseup = function() {

// 	window.onmousemove = undefined;
// };




onResize();
window.onresize = onResize;

function onResize() {

	layout.resizeAndPosition( 0, 0, window.innerWidth, window.innerHeight );
}