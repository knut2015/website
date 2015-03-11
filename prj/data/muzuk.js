dataLoadModule.setURL("data/muzuk.json");
dataLoadModule.setDataType("text");
dataLoadModule.getAjax();

function successHandler(json){
	var item = $.parseJSON(json).item;
	var itemLen = item.length;
	
	var visual = $.parseJSON(json).visual;
	
	jsonResultModule.setJsonData(item);
	jsonResultModule.setDataLength(itemLen);
	
	$.AppInit(pageComplete);
}

function errorHandler(){
	console.log("ajax error");
}

// page complete
function pageComplete(isComplete){
	console.log(jsonResultModule.getJsonData()[0].work[0].prjName);
	console.log(jsonResultModule.getJsonData()[0].work[0].imgs[0].viewImg);
	console.log(jsonResultModule.getJsonData()[1].photo[0].title);
	console.log(jsonResultModule.getJsonData()[1].photo[1].title);

	if (isComplete){
		pageView();
		ButtonClick();
	}
};

// page button
var ButtonClick = ButtonClick || function(){
	$(".btnView").on("click", onBtnClickHandler);
	function onBtnClickHandler(event){
		switch ($(this).text()){
			case "VIEW PROJECT":
				Works();
				break;
			case "VIEW PICTURES":
				Photos();
				break;
		}
	}
}

// works
var Works = Works || function(){
	var Project = function(){}

	Project.prototype = function(){
		list: function(){},
		click:function(){}
	}

	var prj = Project();

	$(".workTable").stop().animate({left: '0%'}, 500);
}

// photos
var Photos = Photos || function(){
	
}

// static page view
var pageView = function(){
	var idx = 0;
	var timeout;
	$(".arrowContainer a").on("click", onClickPageView);
	
	function onClickPageView(event){
		$(".block").css('display', 'block');
		switch (event.currentTarget.className){
			case "prevCont":
				idx--;
				rePosition();
				$(".flickContainer").stop().animate({left: $(".flickContainer").width()+'px'}, 300);
				break;
			case "nextCont":
				idx++;
				rePosition();
				$(".flickContainer").stop().animate({left: -$(".flickContainer").width()+'px'}, 300);
				break;
		}
		
		if ( idx > 2 ){
			idx = 0;
		}else if ( idx < 0 ){
			idx = 2;
		}
		
		$(".indicate").removeClass('pageActive').eq(idx).addClass('pageActive');
	}
	
	var rePosition = function(){
		var nCenter = idx % 3;
		var nLeft = nCenter - 1;
		var nRight = nCenter + 1;
		
		timeout = setTimeout(function(){
			
			if ( nCenter + 1 > 2 ){
				nRight = 0;
			}
			
			$(".flick").eq(nLeft).css('left', '-100%');
			$(".flick").eq(nCenter).css('left', '0%');
			$(".flick").eq(nRight).css('left', '100%');
			$(".flickContainer").css('left', '0px');
			$(".block").css('display', 'none');
		}, 500);
	};
};