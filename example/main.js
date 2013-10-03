var LayDown = require( '../src/LayDown' );

console.log( 'HEY THERE SUNSHINE' );

function layoutFunction( item, node ) { 

	item.style.backgroundColor = node.color;
	item.style.position = 'absolute';
	item.style.left = node.x + 'px';
	item.style.top = node.y + 'px';
	item.style.width = node.width + 'px';
	item.style.height = node.height + 'px';

	console.log( node.name, node.x, node.y, node.width, node.height );
}





var layout = new LayDown( layoutFunction );

var node1 = layout.create( document.getElementById( 'node1' ) );
var node2 = layout.create( document.getElementById( 'node2' ) );
var node3 = layout.create( document.getElementById( 'node3' ) );
var node4 = layout.create( document.getElementById( 'node4' ) );

node1.name = 'node1';
node1.color = '#CAFE00';
node2.name = 'node2';
node2.color = '#FF0000';
node3.name = 'node3';
node3.color = '#444';
node4.name = 'node4';
node4.color = '#00F';

node1.heightIs( 30 ).widthIsProportional( 20, 10 ).alignedWith( node4 ).plus( 10 );
node2.matchesSizeOf( node1 ).alignedBelow( node1 ).leftAlignedWith( node1 );
node3.sizeIsAPercentageOf( layout, 0.1 ).topAlignedWith( node2 ).alignedRightOf( node2 );
node4.matchesSizeOf( layout ).minus( 300 ).centeredWith( layout );




onResize();
window.onresize = onResize;

function onResize() {

	layout.resizeAndPosition( 0, 0, window.innerWidth, window.innerHeight );
}