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
	var workTable = $(".workTable");
	var Project = function(){}

	Project.prototype = {
		list: function(){
			var i;
			console.log(jsonResultModule.getJsonData()[0]);
			console.log(jsonResultModule.getJsonData()[0].work.length);
			for ( i = 0; i < jsonResultModule.getJsonData()[0].work.length; i++ ){
				$("tbody").append(
						"<tr>"+
							"<td class='t_thumb'>"+jsonResultModule.getJsonData()[0].work[i].thumb+"</td>"+
							"<td class='t_client'>"+jsonResultModule.getJsonData()[0].work[i].client+"</td>"+
							"<td class='t_prjName'>i30</td>"+
							"<td class='t_role'>lead developer</td>"+
							"<td class='t_copy'>fishingtree</td>"+
						"</tr>"
					);
			}
		},
		close:function(){
			workTable.stop().animate({left: '-100%'}, 400, function(){
				$(this).css('display', 'none');
				$("tbody").empty();
			});
		}
	}

	var prj = new Project();

	workTable.css('display', 'block').stop().animate({left: '0%'}, 400, function(){
		prj.list();
	});

	$(".listClose").on("click", function(){
		prj.close();
	});
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