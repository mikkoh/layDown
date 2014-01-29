layDown
=======

layDown is a library which you can use to create responsive 2d layouts in Javascript. It is designed to be flexible where it's not dependent 
on the DOM or CSS. This allows layDown to be used to create layouts on the DOM, on Canvas, or even on the backend with Node.

Laydown is designed to translate designer speak into programmatic layouts. In saying this, function names are slightly verbose 
but maintain high readability as if you were reading out sentences. This in turn makes it easier to translate thing's that
designers tell developers without much thought or calculation. 

For instance when a designer sais:

#####"The title must be vertically aligned to the top of the page and horizontally aligned with the page."

In layDown it would read:

	title.topAlignedWith( page ).horizontallyCenteredWith( page );

The goal is that you can easily understand what is going to happen when the page is rendered just by looking at the code without
having to evaluate positional calculations. The end goal however is that if we can use designer speak translated into code
we can create nicer code output than what typical WYSIWYG editors generate.

The hope is that layDown is a library on top of which specialized libraries can be built to work with layouts on the DOM or Canvas but still
have the flexibility of creating "hybrid" websites where the DOM and Canvas renderers are used in parallel.


##Example Syntax

Basic usage with jQuery:

```javascript
	//layoutFunction, readFunction, and create function are boiler plate functions
	//to do the pysical positioning via css, reading the DOM elements size and the
	//createFunction initializes the CSS for the jQuery object. These would be defined
	//in a higher library on top of layDown
	var page = new LayDown( layoutFunction, readFunction, createFunction );

	//we create a new LayoutNode's by selecting dom elements via jQuery
	var myDiv = page.create( $( '#myDiv' ) );
	var myImg = page.create( $( '#myImg' ) );

	//then we add rules to the LayoutNodes
	myDiv.heightIsAPercentageOf( page, 0.5 ).verticallyCenteredWith( page ).minus( 30 );
	myImg.alignedBelow( myDiv ).horizontallyCenteredWith( page );

	$( window ).resize( function onResize() {

		var $w = $( window );
		var width = $w.width();
		var height = $w.height();
	
		//this will cause the page to be layed out
		page.resizeAndPosition( 0, 0, width, height );
	});

	//call resize right off the bat to layout the page
	onResize():
```

And here's the example boiler plate for layoutFunction, readFunction, createFunction:

```javascript
	//layoutFunction performs the actual grunt work of moving
	//dom elements using jquery
	var layoutFunction = function( $item, node, setWidth, setHeight ) {

		//$item here is just a jquery object
		//node is a LayoutNode from LayDown
		//setWidth and setHeight are booleans whether we should set
		//the width and height of the jQuery object

		$item.css( {

			left: node.x,
			top: node.y
		});

		if( setWidth ) {

			$item.css( 'width', node.width );
		}

		if( setHeight ) {

			$item.css( 'height', node.height );
		}
	};

	//readFunction is used to read in the width or height of a dom
	//element from jquery. This is used by LayDown where no layout rules
	//have been applied for this item
	var readFunction = function( $item, name ) {

		if( name == 'width' ) {

			return $item.width(); //$item here is just a jquery object
		} else {

			return $item.height(); //$item here is just a jquery object
		}
	};

	//createFunction is a utility which is called on every jquery item
	//before a layout is created
	var createFunction = function( $item ) {

		//$item here is just a jquery object

		$item.css( {

			'box-sizing': 'border-box',
			position: 'absolute'
		});
	};
```
