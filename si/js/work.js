dataLoadModule.setURL("../data/json/sparkle.json");
dataLoadModule.setDataType("text");
dataLoadModule.getAjax();

function successHandler(json){
	var item = $.parseJSON(json).item;
	var itemLen = item.length;
	
	jsonResultModule.setJsonData(item);
	jsonResultModule.setDataLength(itemLen);
	
	$.AppInit(pageComplete);
}

function errorHandler(){
	console.log("ajax error");
}

function pageComplete(isComplete){
	if (isComplete){
		CreateWork();
	}
}

var CreateWork = CreateWork || function(){
	var workData = jsonResultModule.getJsonData()[1].work;

	var Works = function(){

	}

	Works.prototype = {
		thumb: function(){
			var i;
			//workData.length
			for ( i = 0; i < 3; i++ ){
				console.log(workData[i].w_Thumb);
				$(".isotope").append("<div class='item'><img src='" + workData[i].w_Thumb + "'></div>");
			}

			$(".item img").load(function(){
				work.isotope();
			});
		},
		isotope: function(){
			return isotopeUseful();
		}
	}

	var work = new Works();

	work.thumb();


}


function getItemElement() {
  var $item = $('<div class="item"><img src="'+ workData[4].w_Thumb +'"></div>');
  // add width and height class
  var wRand = Math.random();
  var hRand = Math.random();
  var widthClass = wRand > 0.85 ? 'width3' : wRand > 0.7 ? 'width2' : '';
  var heightClass = hRand > 0.85 ? 'height3' : hRand > 0.5 ? 'height2' : '';
  $item.addClass( widthClass ).addClass( heightClass );
  return $item;
}



/**
 * isotope plugin
 * */
var isotopeUseful = function(){
	var $container;
	$container = $('.isotope').isotope({
		itemSelector: '.item',
		resizable: false,
		masonry: {
		  // columnWidth: 360,
		  isFitWidth: true // center align http://codepen.io/desandro/pen/BptxJ, http://isotope.metafizzy.co/layout-modes/masonry.html
		},
		
		getSortData: {
			name: '.name',
			symbol: '.symbol',
			number: '.number parseInt',
			category: '[data-category]',
			weight: function( itemElem ) {
				var weight = $( itemElem ).find('.weight').text();
				return parseFloat( weight.replace( /[\(\)]/g, '') );
			}
		}
	});

	$(".btnMore").on("click", function(){
		var $elems = getItemElement().add( getItemElement() ).add( getItemElement() );
	    // append elements to container
	    $container.append( $elems )
      	// add and lay out newly appended elements
      	.isotope( 'appended', $elems );
	});

	var filterFns = {
		// show if number is greater than 50
		numberGreaterThan50: function() {
			var number = $(this).find('.number').text();
			return parseInt( number, 10 ) > 50;
		},
		// show if name ends with -ium
		ium: function() {
			var name = $(this).find('.name').text();
			return name.match( /ium$/ );
		}
	};

	// bind filter button click
	$('#filters').on( 'click', 'div', function() {
		var filterValue = $( this ).attr('data-filter');
		// use filterFn if matches value
		filterValue = filterFns[ filterValue ] || filterValue;
		$container.isotope({ filter: filterValue });
	});

	// change is-checked class on buttons
	$('.button-group').each( function( i, buttonGroup ) {
		var $buttonGroup = $( buttonGroup );
		$buttonGroup.on( 'click', 'div', function() {
			$buttonGroup.find('.is-checked').removeClass('is-checked');
			$( this ).addClass('is-checked');
		});
	});
}
/*****/