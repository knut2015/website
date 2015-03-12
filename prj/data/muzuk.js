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
	/*
	console.log(jsonResultModule.getJsonData()[0].work[0].prjName);
	console.log(jsonResultModule.getJsonData()[0].work[0].imgs[0].viewImg);
	console.log(jsonResultModule.getJsonData()[1].photo[0].title);
	console.log(jsonResultModule.getJsonData()[1].photo[1].title);
	*/

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
	var workDetail = $(".workView");
	var index = 0;

	var Project = function(){}

	Project.prototype = {
		list: function(){
			var i;
			for ( i = 0; i < jsonResultModule.getJsonData()[0].work.length; i++ ){
				$("tbody").append(
						"<tr>"+
							"<td class='t_thumb'>"+jsonResultModule.getJsonData()[0].work[i].thumb+"</td>"+
							"<td class='t_client'>"+jsonResultModule.getJsonData()[0].work[i].client+"</td>"+
							"<td class='t_prjName'>"+jsonResultModule.getJsonData()[0].work[i].prjName+"</td>"+
							"<td class='t_role'>"+jsonResultModule.getJsonData()[0].work[i].role+"</td>"+
							"<td class='t_copy'>"+jsonResultModule.getJsonData()[0].work[i].copyright+"</td>"+
						"</tr>"
					);
			}

			$("tbody tr").hover(function(){
				$(this).css("background-color", jsonResultModule.getJsonData()[0].work[$(this).index()].color);
			});

			$("tbody tr").on("click", function(){
				var idx = $(this).index();
				index = idx;
				prj.update( idx );
			});
		},
		update: function( idx ){
			var title = jsonResultModule.getJsonData()[0].work[idx].prjName;
			var subTitle = jsonResultModule.getJsonData()[0].work[idx].subTitle;
			var typeDev = jsonResultModule.getJsonData()[0].work[idx].typeDev;
			var desc = jsonResultModule.getJsonData()[0].work[idx].description;
			var role = jsonResultModule.getJsonData()[0].work[idx].role;
			var color = jsonResultModule.getJsonData()[0].work[idx].color;
			
			var config = {
				idx: idx,
				title: title,
				subTitle: subTitle,
				typeDev: typeDev,
				desc: desc,
				role: role,
				color: color
			};

			prj.viewDetail( config );
		},
		listClose: function(){
			workTable.css('overflow-y','hidden').stop().animate({left: '-100%'}, 400, function(){
				$(this).css('display','none');
				$("tbody").empty();
			});
		},
		viewDetail: function( config ){
			workDetail.css({'display':'block', 'background':config.color}).stop().animate({left: '0%'}, 400, function(){
				$(this).css('overflow-y', 'auto');
				$(".viewDetail p.title").text(config.title);
				$(".viewDetail p.subTitle").text(config.subTitle);
				$(".viewDetail p.typeDev").text(config.typeDev);
				$(".viewDetail p.desc").text(config.desc);
				$(".viewDetail p.role").text(config.role);

				for ( i = 0; i < jsonResultModule.getJsonData()[0].work[config.idx].imgs.length; i++){
					
					var imgs = jsonResultModule.getJsonData()[0].work[config.idx].imgs[i].viewImg;
					$(".detailImages").append("<p><img src='" + imgs + "'></p>").fadeIn();
				}

				workTable.fadeOut();
			});
		},
		viewClose: function(){
			workTable.css({'display':'block'});
			workDetail.css('overflow-y', 'hidden').stop().animate({left: '-100%'}, 400, function(){
				prj.detailImageInit();
				$(this).css('display', 'none');
			});
		},
		detailImageInit: function(){
			$(".detailImages").fadeOut(300, function(){
				$(this).empty();
			});
		}
	}

	var prj = new Project();

	workTable.css({'display':'block', 'overflow-y':'auto'}).stop().animate({left: '0%'}, 400, function(){
		prj.list();
	});

	$(".listClose").on("click", function(){
		prj.listClose();
	});

	$(".viewClose").on("click", function(){
		prj.viewClose();
	});

	$(".btnPrev").on("click", onClickDetailView);
	$(".btnNext").on("click", onClickDetailView);

	function onClickDetailView(event){
		prj.detailImageInit();

		switch (event.currentTarget.className){
			case "btnPrev":
				index--;
				if ( index < 0 ) {
					index = 0;
				}
				break;
			case "btnNext":
				index++;
				if ( index > jsonResultModule.getJsonData()[0].work.length -1 ){
					index = jsonResultModule.getJsonData()[0].work.length -1;
				}
				break;
		}
		prj.update( index );
	}
}

// photos
var Photos = Photos || function(){
	var photoView = $(".photoView");
	var index = 0;

	var Photograph = function(){

	}

	Photograph.prototype = {
		viewTransition: function( state ){
			if ( state == "start"){
				photoView.css('display', 'block').stop().animate({left: '0%'}, 400, function(){
					photo.update( 0 );
					$(this).css('overflow-y', 'auto');
				});
			}else if ( state == "end" ){
				photoView.css('overflow', 'none').stop().animate({left: '-100%'}, 400, function(){
					photo.closePhoto();
					$(this).css('display', 'none');
				});
			}
		},
		view: function( config ){
			photoView.find("p.title").text( config.title );
			photoView.find("p.date").text( config.date );
			photoView.find("div.imgs").empty().append("<img src='"+ config.imgs +"'>");
			
			$("div.imgs").find("img").load(function(){
				photoView.find("div.imgs").fadeIn();
			});
		},
		update: function( idx ){
			var title = jsonResultModule.getJsonData()[1].photo[idx].title
			var date = jsonResultModule.getJsonData()[1].photo[idx].date;
			var imgs = jsonResultModule.getJsonData()[1].photo[idx].viewimg;
			var type = jsonResultModule.getJsonData()[1].photo[idx].type;
			
			var config = {
				title: title,
				date: date,
				imgs: imgs,
				type: type
			};

			photo.view( config );
		},
		closePhoto: function(){
			photoView.find("div.imgs").fadeOut().empty();
		}
	};

	var photo = new Photograph();
	photo.viewTransition("start");

	$(".closePhoto").on("click", function(){
		photo.viewTransition("end");
	});

	$(".btnPhotoPrev").on("click", onClickDetailView);
	$(".btnPhotoNext").on("click", onClickDetailView);

	function onClickDetailView(event){
		switch (event.currentTarget.className){
			case "btnPhotoPrev":
				index--;
				if ( index < 0 ) {
					index = 0;
				}
				break;
			case "btnPhotoNext":
				index++;
				if ( index > jsonResultModule.getJsonData()[1].photo.length -1 ){
					index = jsonResultModule.getJsonData()[1].photo.length -1;
				}
				break;
		}

		photo.closePhoto();
		photo.update( index );
	}
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

	$(window).resize(function(){
		$(".content").css('top', '30%');
	}).resize();
};