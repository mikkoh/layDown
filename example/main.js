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
