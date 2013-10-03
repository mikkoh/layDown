var LayDown = require( '../src/LayDown' );

console.log( 'HEY THERE SUNSHINE' );

function layoutFunction( item, node ) { 

	console.log( node.name, node.x, node.y, node.width, node.height );
}

var layout = new LayDown( layoutFunction );

var node1 = layout.create( null );
node1.name = 'node1';
node1.heightIs( 20 ).plus( 10 ).xIs( 10 ).plus( 25 ).widthIsProportional( 20, 40 );

var node2 = layout.create( null );
node2.name = 'node2';
node2.matchesSizeOf( node1 ).positionIs( 100, 100 );

var node3 = layout.create( null );
node3.name = 'node3';
node3.sizeIsAPercentageOf( layout, 0.5 ).alignedBelow( node2 ).alignedLeftOf( node2 );

layout.resizeAndPosition( 0, 0, 500, 500 );

console.log( 'LAYDOWN', layout.width, layout.height );