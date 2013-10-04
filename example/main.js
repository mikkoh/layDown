var LayDown = require( '../src/LayDown' );

console.log( 'HEY THERE SUNSHINE' );

function layoutFunction( item, node ) { 

	item.style.backgroundColor = node.color;
	item.style.position = 'absolute';
	item.style.left = node.x + 'px';
	item.style.top = node.y + 'px';
	item.style.width = node.width + 'px';
	item.style.height = node.height + 'px';

	//console.log( node.name, node.x, node.y, node.width, node.height );
}





var layout = new LayDown( layoutFunction );

var elem1 = document.getElementById( 'node1' );
var elem2 = document.getElementById( 'node2' );
var elem3 = document.getElementById( 'node3' );
var elem4 = document.getElementById( 'node4' );


var node1 = layout.create( elem1 );
var node2 = layout.create( elem2 );
var node3 = layout.create( elem3 );
var node4 = layout.create( elem4 );

node1.name = 'node1';
node1.color = '#CAFE00';
node2.name = 'node2';
node2.color = '#FF0000';
node3.name = 'node3';
node3.color = '#444';
node4.name = 'node4';
node4.color = '#00F';

node1.widthIsAPercentageOf( node4, 0.1 ).heightIsAPercentageOf( node4, 0.1 ).max( 20 ).rightAlignedWith( node4 ).bottomAlignedWith( node4 );
node2.widthIsAPercentageOf( node4, 0.2 ).matchesHeightOf( node1 ).alignedBelow( node1 ).rightAlignedWith( node1 );
node3.sizeIsAPercentageOf( node4, 0.1 ).topAlignedWith( node2 ).alignedRightOf( node2 );
node4.matchesSizeOf( layout ).minus( 300 ).centeredWith( layout );



elem1.onmousedown = function() {

	window.onmousemove = function( ev ) {

		node1.x = ev.pageX;
		node1.y = ev.pageY;
	};
};

elem1.onmouseup = function() {

	window.onmousemove = undefined;
};




onResize();
window.onresize = onResize;

function onResize() {

	layout.resizeAndPosition( 0, 0, window.innerWidth, window.innerHeight );
}