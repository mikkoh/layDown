var LayoutNode = require( '../src/LayoutNode' );

console.log( 'HEY THERE SUNSHINE' );

function layoutFunction( item, node ) { 

	console.log( node.name, node.x, node.y, node.width, node.height );
}

var node1 = new LayoutNode( null, null, layoutFunction );
node1.name = 'node1';
node1.heightIs( 20 ).plus( 10 ).xIs( 10 ).plus( 25 ).widthIsProportional( 20, 40 );

var node2 = new LayoutNode( null, null, layoutFunction );
node2.name = 'node2';
node2.matchesSizeOf( node1 ).positionIs( 100, 100 );
node2.doLayout();