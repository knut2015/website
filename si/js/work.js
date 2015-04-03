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
	var workData = jsonResultModule.getJsonData()[2].work;
	var initNum = 5;
	var idx = 0;

	var Works = function(){

	}

	Works.prototype = {
		thumb: function(){
			var i;
			for ( i = 0; i < initNum; i++ ){
				$(".isotope").append("<div class='item "+workData[i].w_type+"' data-category='" + workData[i].w_type + "'><img src='" + workData[i].w_Thumb + "'><p class='number'>"+i+"</p></div>");
			}

			$(".item img").load(function(){
				work.isotope();
			});
		},
		isotope: function(){
			return isotopeUseful();
		},
		thumbClick: function(){

		}
	}

	var work = new Works();

	work.thumb();

	$(".isotope").append("<div class='item btnMore'>MORE<p class='number'>" + 100 + "</p></div>");
	var idx = 1;
	// more btn click
	$(".btnMore").bind("click", function(){
		var startImg = idx * initNum;

		var elems = [];
		for (var i = startImg; i < initNum * (idx+1); i++ ){
			if ( i == workData.length ){
				$(".btnMore").unbind("click");
			}else{
				var $elems = getItemElement(i);
				$(".isotope").append( $elems ).isotope( 'insert', $elems );
			}
		}

		idx++;
		




























/*


		var viewImg = idx * initNum;
		idx++;
		var total = idx * initNum;

		var rest = Math.abs((workData.length) - viewImg);
		console.log("length: "+ workData.length + ", total: " + total + ", rest: " + rest);
	
		switch ( rest ){
			case 1:
				var $elems = getItemElement(viewImg);
				break;
			case 2:
				var $elems = getItemElement(viewImg).add( getItemElement(viewImg+1) );
				break;
			case 3:
				var $elems = getItemElement(viewImg).add( getItemElement(viewImg+1) ).add( getItemElement(viewImg+2) );
				break;
			case 4:
				var $elems = getItemElement(viewImg).add( getItemElement(viewImg+1) ).add( getItemElement(viewImg+2) ).add( getItemElement(viewImg+3) );
				break;
			default:
				var $elems = getItemElement(viewImg).add( getItemElement(viewImg+1) ).add( getItemElement(viewImg+2) ).add( getItemElement(viewImg+3) ).add( getItemElement(viewImg+4) );
				break;
		}
		
		// append elements to container
		$(".isotope").append( $elems ).isotope( 'insert', $elems );*/
		// getThumbClick();
	});

	getThumbClick();

	// thumbnail click
	function getThumbClick(){
		$(".item").on("click", function(){
			console.log($(this).position().top);
		});
	}

	$(".button").on("click", function(){
		console.log($(this).text());
	});
}

function getItemElement(cal) {
	var workData = jsonResultModule.getJsonData()[2];
	console.log("cal : " + cal  + ", type: " + workData.work[cal].w_type );
	var $item = $('<div class="item '+workData.work[cal].w_type+'" data-category="'+workData.work[cal].w_type+'"><img src="'+ workData.work[cal].w_Thumb +'"></div>');
	// add width and height class

	var wRand = Math.random();
	var hRand = Math.random();
	var widthClass = wRand > 0.85 ? 'width3' : wRand > 0.7 ? 'width2' : '';
	var heightClass = hRand > 0.85 ? 'height3' : hRand > 0.5 ? 'height2' : '';

	var number = workData.work[cal].w_num;
  	// $item.find('img').addClass('number');
  	$item.append( '<p class="number">' + number + '</p>' );
	// $item.addClass( widthClass ).addClass( heightClass );
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
		sortBy: 'number',
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

	$("item btnMore").css('display', 'block');
}
/*****/