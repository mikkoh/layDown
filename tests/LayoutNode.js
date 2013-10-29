var LayDown = require( '../src/LayDown' );

basicTests();

function basicTests() {

	var layout = new LayDown( function(){} );

	var node1 = layout.create( null );
	var node2 = layout.create( null );

	node1.name = 'node1';
	node2.name = 'node2';

	layout.resizeAndPosition( 10, 10, 510, 410 );

	exports.layoutPositionAndWidthCorrect = function( test ) {
	 
	    test.equal( layout.x, 10, 'layout x value was not correct' );
	    test.equal( layout.y, 10, 'layout y value was not correct' );
	    test.equal( layout.width, 510, 'layout y value was not correct' );
	    test.equal( layout.height, 410, 'layout y value was not correct' );
	    test.done();
	};

	exports.settingXY = function( test ) {

		node1.hasBeenLayedOut = false;
		node2.hasBeenLayedOut = false;
		node1.resetRules();
		node2.resetRules();

		node1.xIs( 10 ).doLayout();
		test.equal( node1.x, 10, 'xIs value was not correct' );
		node1.plus( 10 ).doLayout();
		test.equal( node1.x, 20, 'xIs plus value was not correct' );
		node1.minus( 10 ).doLayout();
		test.equal( node1.x, 10, 'xIs minus value was not correct' );
		node1.resetRules();
		
		node1.doLayout();
		test.equal( node1.x, 0, 'layout.x did not reset properly' );
		test.equal( node1.y, 0, 'layout.y did not reset properly' );
		test.equal( node1.width, 0, 'layout.width did not reset properly' );
		test.equal( node1.height, 0, 'layout.height did not reset properly' );
		node1.resetRules();

		node1.yIs( 10 ).doLayout();
		test.equal( node1.y, 10, 'yIs value was not correct' );
		node1.plus( 10 ).doLayout();
		test.equal( node1.y, 20, 'yIs plus value was not correct' );
		node1.minus( 10 ).doLayout();
		test.equal( node1.y, 10, 'yIs minus value was not correct' );
		node1.resetRules();

		node1.hasBeenLayedOut = false;
		node2.hasBeenLayedOut = false;
		node2.positionIs( 20, 20 ).sizeIs( 20, 20 );
		node1.plus( node2 ).doLayout();
		test.equal( node1.x, 20, 'After plus node1.x was not correct' );
		test.equal( node1.y, 20, 'After plus node1.y was not correct' );
		test.equal( node1.width, 20, 'After plus node1.width was not correct' );
		test.equal( node1.height, 20, 'After plus node1.height was not correct' );
		node1.resetRules();
		node2.resetRules();

		node1.hasBeenLayedOut = false;
		node2.hasBeenLayedOut = false;
		node2.positionIs( 20, 20 ).sizeIs( 20, 20 );
		node1.minus( node2 ).doLayout();
		test.equal( node1.x, -20, 'After minus node1.x was not correct' );
		test.equal( node1.y, -20, 'After minus node1.y was not correct' );
		test.equal( node1.width, -20, 'After minus node1.width was not correct' );
		test.equal( node1.height, -20, 'After minus node1.height was not correct' );
		node1.resetRules();
		node2.resetRules();


		node1.positionIs( 22, 33 ).doLayout();
		test.equal( node1.x, 22, 'positionIs x was not correct' );
		test.equal( node1.y, 33, 'positionIs y was not correct' );
		node1.plus( 10 ).doLayout();
		test.equal( node1.x, 32, 'positionIs x plus value was not correct' );
		test.equal( node1.y, 43, 'positionIs y plus value was not correct' );
		node1.minus( 10 ).doLayout();
		test.equal( node1.x, 22, 'positionIs x minus value was not correct' );
		test.equal( node1.y, 33, 'positionIs y minus value was not correct' );
		node1.resetRules();

		test.done();
	};

	exports.settingWidthHeight = function( test ) { 

		node1.hasBeenLayedOut = false;
		node2.hasBeenLayedOut = false;
		node1.resetRules();
		node2.resetRules();

		node1.widthIs( 10 ).doLayout();
		test.equal( node1.width, 10, 'widthIs value was not correct' );
		node1.plus( 10 ).doLayout();
		test.equal( node1.width, 20, 'widthIs plus value was not correct' );
		node1.minus( 10 ).doLayout();
		test.equal( node1.width, 10, 'widthIs minus value was not correct' );
		node1.resetRules();
		
		node1.heightIs( 10 ).doLayout();
		test.equal( node1.height, 10, 'heightIs value was not correct' );
		node1.plus( 10 ).doLayout();
		test.equal( node1.height, 20, 'heightIs plus value was not correct' );
		node1.minus( 10 ).doLayout();
		test.equal( node1.height, 10, 'heightIs minus value was not correct' );
		node1.resetRules();

		node1.sizeIs( 22, 33 ).doLayout();
		test.equal( node1.width, 22, 'sizeIs width was not correct' );
		test.equal( node1.height, 33, 'sizeIs height was not correct' );
		node1.plus( 10 ).doLayout();
		test.equal( node1.width, 32, 'sizeIs width plus value was not correct' );
		test.equal( node1.height, 43, 'sizeIs height plus value was not correct' );
		node1.minus( 10 ).doLayout();
		test.equal( node1.width, 22, 'sizeIs width minus value was not correct' );
		test.equal( node1.height, 33, 'sizeIs height minus value was not correct' );
		node1.resetRules();

		node1.heightIs( 10 ).sizeIsProportional( 20, 20 ).doLayout();
		test.equal( node1.width, 10, 'sizeIsProportional width was not correct' );
		node1.plus( 10 ).doLayout();
		test.equal( node1.width, 20, 'sizeIsProportional width plus value was not correct' );
		test.equal( node1.height, 20, 'sizeIsProportional height plus value was not correct' );
		node1.minus( 10 ).doLayout();
		test.equal( node1.width, 10, 'sizeIsProportional width minus value was not correct' );
		test.equal( node1.height, 10, 'sizeIsProportional height minus value was not correct' );
		node1.resetRules();

		node1.widthIs( 10 ).sizeIsProportional( 20, 20 ).doLayout();
		test.equal( node1.height, 10, 'sizeIsProportional height was not correct' );
		node1.plus( 10 ).doLayout();
		test.equal( node1.width, 20, 'sizeIsProportional width plus value was not correct' );
		test.equal( node1.height, 20, 'sizeIsProportional height plus value was not correct' );
		node1.minus( 10 ).doLayout();
		test.equal( node1.width, 10, 'sizeIsProportional width minus value was not correct' );
		test.equal( node1.height, 10, 'sizeIsProportional height minus value was not correct' );
		node1.resetRules();

		test.done();
	};

	exports.aligning = function( test ) { 

		node1.hasBeenLayedOut = false;
		node2.hasBeenLayedOut = false;
		node1.resetRules();
		node2.resetRules();

		node1.sizeIs( 100, 100 ).positionIs( 10, 10 );

		node2.sizeIs( 100, 100 ).alignedBelow( node1 ).doLayout();
		test.equal( node2.y, 110, 'alignedBelow value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.y, 120, 'alignedBelow plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.y, 110, 'alignedBelow minus value was not correct' );
		node2.resetRules();

		node2.sizeIs( 100, 100 ).alignedAbove( node1 ).doLayout();
		test.equal( node2.y, -90, 'alignedAbove value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.y, -80, 'alignedAbove plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.y, -90, 'alignedAbove minus value was not correct' );
		node2.resetRules();

		node2.sizeIs( 100, 100 ).alignedLeftOf( node1 ).doLayout();
		test.equal( node2.x, -90, 'alignedLeftOf value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.x, -80, 'alignedLeftOf plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.x, -90, 'alignedLeftOf minus value was not correct' );
		node2.resetRules();

		node2.sizeIs( 100, 100 ).alignedRightOf( node1 ).doLayout();
		test.equal( node2.x, 110, 'alignedRightOf value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.x, 120, 'alignedRightOf plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.x, 110, 'alignedRightOf minus value was not correct' );
		node2.resetRules();

		node2.sizeIs( 100, 100 ).alignedWith( node1 ).doLayout();
		test.equal( node2.x, 10, 'alignedWith x value was not correct' );
		test.equal( node2.y, 10, 'alignedWith y value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.x, 20, 'alignedWith plus value was not correct' );
		test.equal( node2.y, 20, 'alignedWith plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.x, 10, 'alignedWith minus value was not correct' );
		test.equal( node2.y, 10, 'alignedWith minus value was not correct' );
		node2.resetRules();

		node2.sizeIs( 110, 110 ).leftAlignedWith( node1 ).doLayout();
		test.equal( node2.x, 10, 'leftAlignedWith value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.x, 20, 'leftAlignedWith plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.x, 10, 'leftAlignedWith minus value was not correct' );
		node2.resetRules();

		node2.sizeIs( 110, 110 ).rightAlignedWith( node1 ).doLayout();
		test.equal( node2.x, 0, 'rightAlignedWith value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.x, 10, 'rightAlignedWith plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.x, 0, 'rightAlignedWith minus value was not correct' );
		node2.resetRules();

		node2.sizeIs( 110, 110 ).topAlignedWith( node1 ).doLayout();
		test.equal( node2.y, 10, 'topAlignedWith value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.y, 20, 'topAlignedWith plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.y, 10, 'topAlignedWith minus value was not correct' );
		node2.resetRules();

		node2.sizeIs( 110, 110 ).bottomAlignedWith( node1 ).doLayout();
		test.equal( node2.y, 0, 'bottomAlignedWith value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.y, 10, 'bottomAlignedWith plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.y, 0, 'bottomAlignedWith minus value was not correct' );
		node2.resetRules();

		node2.sizeIs( 110, 110 ).centeredWith( node1 ).doLayout();
		test.equal( node2.x, 5, 'centeredWith x value was not correct' );
		test.equal( node2.y, 5, 'centeredWith y value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.x, 15, 'centeredWith plus x value was not correct' );
		test.equal( node2.y, 15, 'centeredWith plus y value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.x, 5, 'centeredWith x minus value was not correct' );
		test.equal( node2.y, 5, 'centeredWith y minus value was not correct' );
		node2.resetRules();

		node2.sizeIs( 110, 110 ).horizontallyCenteredWith( node1 ).doLayout();
		test.equal( node2.x, 5, 'horizontallyCenteredWith value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.x, 15, 'horizontallyCenteredWith plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.x, 5, 'horizontallyCenteredWith minus value was not correct' );
		node2.resetRules();

		node2.sizeIs( 110, 110 ).verticallyCenteredWith( node1 ).doLayout();
		test.equal( node2.y, 5, 'verticallyCenteredWith value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.y, 15, 'verticallyCenteredWith plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.y, 5, 'verticallyCenteredWith minus value was not correct' );
		node2.resetRules();

		test.done();
	};

	exports.matchingSize = function( test ) {

		node1.hasBeenLayedOut = false;
		node2.hasBeenLayedOut = false;
		node1.resetRules();
		node2.resetRules();

		node1.sizeIs( 100, 100 ).positionIs( 10, 10 );

		node2.matchesSizeOf( node1 ).doLayout();
		test.equal( node2.width, 100, 'matchesSizeOf width value was not correct' );
		test.equal( node2.height, 100, 'matchesSizeOf height value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.width, 110, 'matchesSizeOf plus value was not correct' );
		test.equal( node2.height, 110, 'matchesSizeOf plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.width, 100, 'matchesSizeOf minus value was not correct' );
		test.equal( node2.height, 100, 'matchesSizeOf minus value was not correct' );
		node2.resetRules();

		node2.matchesWidthOf( node1 ).doLayout();
		test.equal( node2.width, 100, 'matchesWidthOf value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.width, 110, 'matchesWidthOf plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.width, 100, 'matchesWidthOf minus value was not correct' );
		node2.resetRules();

		node2.matchesHeightOf( node1 ).doLayout();
		test.equal( node2.height, 100, 'matchesHeightOf value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.height, 110, 'matchesHeightOf plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.height, 100, 'matchesHeightOf minus value was not correct' );
		node2.resetRules();
		
		node2.sizeIsAPercentageOf( node1, 0.5 ).doLayout();
		test.equal( node2.width, 50, 'sizeIsAPercentageOf width value was not correct' );
		test.equal( node2.height, 50, 'sizeIsAPercentageOf height value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.width, 60, 'sizeIsAPercentageOf plus value was not correct' );
		test.equal( node2.height, 60, 'sizeIsAPercentageOf plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.width, 50, 'sizeIsAPercentageOf minus value was not correct' );
		test.equal( node2.height, 50, 'sizeIsAPercentageOf minus value was not correct' );
		node2.resetRules();

		node2.widthIsAPercentageOf( node1, 0.2 ).doLayout();
		test.equal( node2.width, 20, 'widthIsAPercentageOf value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.width, 30, 'widthIsAPercentageOf plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.width, 20, 'widthIsAPercentageOf minus value was not correct' );
		node2.resetRules();

		node2.heightIsAPercentageOf( node1, 0.3 ).doLayout();
		test.equal( node2.height, 30, 'heightIsAPercentageOf value was not correct' );
		node2.plus( 10 ).doLayout();
		test.equal( node2.height, 40, 'heightIsAPercentageOf plus value was not correct' );
		node2.minus( 10 ).doLayout();
		test.equal( node2.height, 30, 'heightIsAPercentageOf minus value was not correct' );
		node2.resetRules();

		test.done();
	};
}
