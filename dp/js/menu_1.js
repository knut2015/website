/**
 * @author Goyoung
 */
var IMG_WIDTH = 1280;
var IMG_HEIGHT = 800;

var currentImg=0;
var currentImgs = 0;
var maxImages=0;
var maxHeightImages=0;
var speed=500;
var	flag_phase = "";
var	flag_direction = "";
var menuList;
var DEFAULT_VIEW = 0;

/*
var swipeOptions=
{
	triggerOnTouchEnd : true,	
	swipeStatus : swipeStatus,
	allowPageScroll:"vertical",
	threshold:500
}
*/

$(function()
{
	dataLoad("./res/menu.xml");
	menuList = $("#menuList");
	menuList.swipe( swipeOptions );
});
/**********************************************************/

function dataLoad(url){
	$.ajax({
		type: "GET",
		url: url,
		async: false,
		dataType: "xml",
		success: function(data){
			responseData(data);
		},
		error: function(){
			alert("fail");
		}
	});
}

var categoryList = [];
var thumbList = [];
var menuNameList = [];
var thumbDescList = [];
var bigImgList = [];
var descList = [];
var priceList = [];

/**
 * 
 * getter / setter
 * 
 * **/
var _data;
var _w = 0;
var _h = 0;
var _lang = 0;

/** data **/
function getData() { return _data; }
function setData(data){	_data = data; }

/** width **/
function getW() {return _w;}
function setW(w) { _w = w; }

/** height **/
function getH() {return _h;}
function setH(h) { _h = h; }

/** language **/
function getLang(){return _lang;}
function setLang(lang){ _lang = lang; }

/**
 * 
 * response raw data
 * 
 * **/
function responseData(data){
	setData(data);
	var itemList = [];
	
	$(data).find('section').each(function(i){
		$(".pageCon").append("<li class='pages' id='page_'" + i + " data-role='page'><div class='section'></div><ul class='pageList " + "p" + i + "'></ul></li>");
		$("div.section").eq(i).html($(this).children('page').text());
		
		$(this).find('menuType').each(function(idx){
			var mType = $(this).find('category').children('type').eq(DEFAULT_VIEW).text();
			
			$(this).find('item').each(function(itemlen){
				var thumb = $(this).children('thumb').text();
				
				var menuName = $(this).find('menuName').children('type').eq(DEFAULT_VIEW).text();
				var thumbDesc = $(this).find('thumDesc').children('type').eq(DEFAULT_VIEW).text();
				var price = $(this).children('price').text();
				
				priceList.push(price);
				
				if (itemlen == 0)
				{
					$(".p" + i).append(
						"<li class='cate'>" +
						"	<div class='mType'>" + mType + "</div>" +
						"</li>"
					);
				}
				
				$(".p" + i).append(
					"<li class='mList'>" + 
					"	<img src='./img/menu/" + thumb + "' />" + 
					"	<strong>" + menuName + "</strong>" +
					"	<div class='thumDesc'>" + thumbDesc + "<br></div>" +
					"	<span class='price btn-info btn-small'>Price &nbsp&nbsp" + price + "</span>" +
					"	<span class='addMenu btn-warning btn-small'>Add</span>" +
					"	<span class='detailMenu btn-danger btn-small'>Detail</span>" +
					"	<div class='viewDetail'>" +
					"		<div class='closeView'>CLOSE</div>" +
					"	</div>" +
					"</li>"
				);
				$(".viewDetail").hide();
			});
		});
	});
	
	viewTransLanguage();
	// viewDetail();
	viewPageSize();
	viewAddMenu();
	
}

/**
 * 
 * 언어 변환 
 * lang 타입으로 검색 수정.
 * 
 * **/
function viewTransLanguage(){
	$("ul.language li").bind("click", function(){
		var langNum = $(this).index();
		var node = $(getData()).find('section').find('menuType');
		
		setLang(langNum);
		
		$(".pageList li.cate").each(function(i){
			var mType = node.find('category').eq(i).children('type').eq(langNum).text();
			$(this).find('div.mType').html(mType);
		});
		
		$(".pageList li.mList").each(function(i){
			var title = node.find('item').find('menuName').eq(i).children('type').eq(langNum).text();
			var thumbDesc = node.find('thumDesc').eq(i).children('type').eq(langNum).text();
			$(this).find('strong').html(title);
			$(this).find('div.thumDesc').html(thumbDesc);
		});
		
		$("div.orderlistBlock").each(function(i){
			$(this).find("ul.orderContainer").children("li.order_name").html(orderListData[i].selectMenu[langNum]);
		})
		
		$("#viewDetailContainer ul li").each(function(i){
			$(".detailDiv_1 div.currentMenuName").html(detailListData[i].currentMenu[langNum]);
		})
	});
}

/**
 * 
 * 상세보기 
 * 
 * **/
function viewDetail(){
	$(".pageList li.mList").bind("click", function(evt){
		if(flag_phase=="end" && flag_direction==null){
		}else{
			return false;	
		}
		
		evt.stopPropagation();
		var currentView = $(this).index();
		$(this).find('div.viewDetail').stop().slideDown();
		
		var _this = $(this);
		
		$('div.closeView').unbind("click");
		$('div.closeView').bind("click", function(evt){
			evt.stopPropagation();
			_this.find('div.viewDetail').stop().slideUp();
		});
	});
}
	
/**
 * 
 * 페이지 사이즈 설정 
 * 
 * **/
function viewPageSize(){
	var w = $(".pages").width();
	var len = $(getData()).find('section').length;
	maxImages = Math.round(len);
	$("#menuList").css('width',  w * len + 'px');
	
	var h = $("#menuList").height();
	len = h / 800;
	maxHeightImages = len;
}

/**
 * 
 * Add Menu
 *  
 * **/
// RawData
var rawData = [];
// OrderData
var orderListData = [];
// DetailData
var detailListData = [];

function viewAddMenu(){
	var orderCnt = 1;
	var page = "p0";
	
	/** Raw Data **/
	$(getData()).find('section').each(function(i){
		var temp = new Object;
		
		// 가격
		var orderPrice = [];
		//메뉴명
		var mnList = [];
		//상세보기 이미지
		var detailImages = [];
		//상세보기 설명
		var detailDescs = [];
		
		$(this).find('menuType').find('item').each(function(){
			/** 메뉴 언어리스트 **/
			var languageMenuNameList = [];
			var detailImageList = [];
			var detailDescList = [];
			
			/** 메뉴리스트 생성 **/
			$(this).find('menuName').find('type').each(function(){
				var languages = $(this).text();
				languageMenuNameList.push(languages);
			});
			
			/** 상세 이미지 리스트 생성 **/
			$(this).find('images').find('type').each(function(){
				var detailImage = $(this).text();
				detailImageList.push(detailImage);
			});
			
			/** 상세 설명 리스트 생성 **/
			$(this).find('description').find('type').each(function(){
				var detailDesc = $(this).text();
				detailDescList.push(detailDesc);
			});
			
			/** 메뉴명 리스트  **/
			mnList.push(languageMenuNameList);
			/** 가격 리스트  **/
			orderPrice.push($(this).children('price').text());
			/** 상세보기 이미지 리스트  **/
			detailImages.push(detailImageList);
			/** 상세보기 설명 리스트  **/
			detailDescs.push(detailDescList);
			
			temp.price = orderPrice;
			temp.menu = mnList;
			temp.detailImage = detailImages;
			temp.detailDesc = detailDescs;
		});
		
		rawData.push(temp);
	});
	/** Raw Data **/

	$(".pageList li.mList span.addMenu").bind("click", function(event){
		if(flag_phase=="end" && flag_direction==null){
		}else{
			return false;	
		}

		var liNumList = [];
		var thisPage = $(this).closest('ul').attr('class').substr(-1);
		var thisAddBtn = $(this).parent().index();
		var pageItemLen = rawData[thisPage].price.length;
		
		$(".p" + thisPage + " li.mList").each(function(idx){
			liNumList.push($(this).index());
			if (liNumList[idx] == thisAddBtn){
				
				var menuName = rawData[thisPage].menu[idx];
				var price = rawData[thisPage].price[idx];
				var result = getSearchOrderData(menuName);
				
				if (result != undefined){
					result.counts += 1;
				}else{
					var orderTemp = new Object;
					
					orderTemp.selectMenu = menuName;
					orderTemp.selectPrice = price;
					orderTemp.counts = 1;
					
					orderListData.push(orderTemp);
				}
			}
		});
		
		if ($("div.orderlistBlock").length > 0){
			$("#orderStream div.orderlistBlock").remove();
			getOrderView();
		}
		
		if ($("div.orderlistBlock").length == 0){
			getOrderView();
		}
	});
	
	/**
	 * DetailView
	 * **/
	$(".pageList li.mList span.detailMenu").bind("click", function(event){
		if(flag_phase=="end" && flag_direction==null){
		}else{
			return false;	
		}
		$("#viewDetailContainer").stop().animate({left:'0px'}, 600, 'easeInOutQuint');
		var liNumList = [];
		var thisPage = $(this).closest('ul').attr('class').substr(-1);
		var thisAddBtn = $(this).parent().index();
		var pageItemLen = rawData[thisPage].price.length;
		
		$(".p" + thisPage + " li.mList").each(function(idx){
			liNumList.push($(this).index());
			if (liNumList[idx] == thisAddBtn){
				var detailMenuName = rawData[thisPage].menu[idx];
				var detailImages = rawData[thisPage].detailImage[idx];
				var detailDescs = rawData[thisPage].detailDesc[idx];
				var price = rawData[thisPage].price[idx];
				
				var result = getSearchOrderData(detailMenuName);
				
				if (result != undefined){
					result.counts += 1;
				}else{
					var orderTemp = new Object;
					
					orderTemp.selectMenu = detailMenuName;
					orderTemp.selectPrice = price;
					orderTemp.counts = 1;
					
					orderListData.push(orderTemp);
				}
				
				var detailTemp = new Object;
				
				detailTemp.currentMenu = detailMenuName;
				detailTemp.currentImage = detailImages;
				detailTemp.currentDesc = detailDescs;
				
				detailListData.push(detailTemp);
			}
		});
		
		var curNum = 0;
		for (var i = 0; i < detailListData.length; i++)
		{
			$(".detailDiv_1 div.currentMenuName").html(detailListData[i].currentMenu[getLang()]);
			curNum = i;
		}
		loadDetailImage(curNum);
	});
	
	/**
	 * 주문완료
	 * **/
	$("div.orderComplete").on("click", function(){
		viewOrderStream();
		$("#orderStream").stop().animate({bottom: -$("#orderStream").height()+'px'}, 300, 'easeInOutBack');
	});
}

function loadDetailImage(idx){
	var $imageCon = $(".detailDiv_1 div.imageContainer div.imgList");
	var $prevBtn = $(".detailUI span.prev");
	var $nextBtn = $(".detailUI span.next");
	
	var imageFileList = detailListData[idx].currentImage;

	$imageCon.empty();
	$imageCon.css('width', imageFileList.length * 512 + 'px');
	$imageCon.stop().animate({left: '0px'}, 0, 'easeInOutBack');
	
	for (var i = 0; i < imageFileList.length; i++){
		$imageCon.append("<img src=./img/menu/detail/" + imageFileList[i] + " />");
	}
	
	$prevBtn.bind("click", function(){
		if ($imageCon.position().left == 0) return;
		$imageCon.stop().animate({
			left: '+=' + $imageCon.find('img').width() + 'px'
		}, 600, 'easeInOutBack');
	});
	
	var nextLimited = -($imageCon.width() / imageFileList.length) * (imageFileList.length -1);
	$nextBtn.bind("click", function(){
		if ($imageCon.position().left <= nextLimited) return;
		$imageCon.stop().animate({
			left: '-=' + $imageCon.find('img').width() + 'px'
		}, 600, 'easeInOutBack');
	});
	
	$(".currentOrder").bind("click", function(){
		if ($("div.orderlistBlock").length > 0){
			$("#orderStream div.orderlistBlock").remove();
			getOrderView();
		}
		
		if ($("div.orderlistBlock").length == 0){
			getOrderView();
		}
	});
	
	$(".detailDiv_3").bind("click", function(){
		nextLimited = 0;
		$("#viewDetailContainer").stop().animate({left:'-785px'}, 600, 'easeInOutQuint');
	})
}
/**
 * 
 * Create OrderList 
 * 
 * **/
function getOrderView(){
	for (var i = 0; i < orderListData.length; i++)
	{
		if (orderListData[i].counts > 0){
			$("#orderStream").append(
				"<div class='orderlistBlock'>" +
				"	<ul class='orderContainer'>" +
				"		<li class='order_name'>" + orderListData[i].selectMenu[getLang()] + "</li>"+
				"		<li class='order_price'>" + orderListData[i].selectPrice + "</li>"+
				"		<li class='order_count'>" + orderListData[i].counts + "</li>"+
				"		<li class='order_added'>ADD</li>" +
				"		<li class='order_remove'>MINUS</li>" +
				"	</ul>" + 
				"</div>"
			);
		}
	}
	
	$("div.orderlistBlock").each(function(idx){
		$(this).find("ul li.order_added").bind("click", function(){
			var result = getSearchOrderData(orderListData[idx].selectMenu)
			if (result){
				result.counts += 1;
				$("div.orderlistBlock").eq(idx).find('li.order_count').html(result.counts);
			}
		});
		
		$(this).find("ul li.order_remove").bind("click", function(){
			var result = getSearchOrderData(orderListData[idx].selectMenu)
			if (result){
				result.counts -= 1;
				if (result.counts <= 0){
					$("div.orderlistBlock").eq(idx).remove();
				}else{
					$("div.orderlistBlock").eq(idx).find('li.order_count').html(result.counts);
				}
			}
		});
	});
	
	$("#orderStream").stop().animate({bottom: '0px'}, 450, 'easeInOutBack');
}

/**
 * 
 * Search Select OrderList
 * 
 * **/
function getSearchOrderData(menuName){
	var data;
	for (var i = 0; i < orderListData.length; i++){
		if (menuName == orderListData[i].selectMenu){
			data = orderListData[i];
		}
	}
	return data;
}

/**
 * 
 * 실시간 주문완료
 * 
 * **/
function viewOrderStream(){
	var dataHeader = String(
		"<?xml version='1.0'?>" +
		"<OrderCollection xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
		"	<TableNum></TableNum>" +
		"	<Date></Date>" +
		"		<Orders>" +
					 orderNode() +
		"		</Orders>" +
		"</OrderCollection>"
	);
	
	$("div.orderBills").text(dataHeader);
	
	/** console.js function **/
	OrderComplete( "order", dataHeader );
	
	$("div.orderlistBlock").remove();
	orderListData = [];
}

function orderNode(){
	var node = "";
	for (var i = 0; i < orderListData.length; i++)
	{
		var dataContent = String(
			'<Order>' +
			'	<Codes>' + "code" + '</Codes>' +
			'	<Name>' + orderListData[i].selectMenu[0] + '</Name>' +
			'	<Price>' + orderListData[i].selectPrice + '</Price>' +
			'	<Count>' + orderListData[i].counts + '</Count>' +
			'</Order>' 
		);
		
		if (orderListData[i].counts > 0)
			node += dataContent;
	}
	return node;
}

function orderComplete(data){
	/** To do **/
	/**
	 * 
	 * **/
}

/**********************************************************/
/**
* Catch each phase of the swipe.
* move : we drag the div.
* cancel : we animate back to where we were
* end : we animate to the next image
function swipeStatus(event, phase, direction, distance)
{
	flag_phase = phase;
	flag_direction = direction;
	if( phase=="move" && (direction=="left" || direction=="right" || direction=="up" || direction=="down") )
	{
		var duration=0;
		if (direction == "left")
			scrollImages((IMG_WIDTH * currentImg) + distance, duration);
		
		else if (direction == "right")
			scrollImages((IMG_WIDTH * currentImg) - distance, duration);

		else if (direction == "up")
			scrollImagess((IMG_HEIGHT * currentImgs) + distance, duration);
		
		else if (direction == "down")
			scrollImagess((IMG_HEIGHT * currentImgs) - distance, duration);
	}
	
	else if ( phase == "cancel")
	{
		scrollImages(IMG_WIDTH * currentImg, speed);
	}
	
	else if ( phase =="end" )
	{
		if (direction == "right"){
			previousImage()
		}else if (direction == "left"){
			nextImage()
		}else if (direction == "down"){
			previousImages()
		}else if (direction == "up"){
			nextImages()
		}
			
	}
}
		*/
/*

function previousImage()
{
	currentImg = Math.max(currentImg-1, 0);
	scrollImages( IMG_WIDTH * currentImg, speed);
}

function nextImage()
{
	currentImg = Math.min(currentImg+1, maxImages-1);
	scrollImages( IMG_WIDTH * currentImg, speed);
}

function previousImages()
{
	currentImgs = Math.max(currentImgs-1, 0);
	scrollImagess( IMG_HEIGHT * currentImgs, speed);
}

function nextImages()
{
	currentImgs = Math.min(currentImgs+1, maxHeightImages-1);
	scrollImagess( IMG_HEIGHT * currentImgs, speed);
}
	
function scrollImages(distance, duration)
{
	menuList.css("-webkit-transition-duration", (duration/3000).toFixed(1) + "s");
	menuList.css("-ms-transition-duration", (duration/3000).toFixed(1) + "s");
	menuList.css("-moz-transition-duration", (duration/3000).toFixed(1) + "s");
	menuList.css("transition-duration", (duration/3000).toFixed(1) + "s");
	
	var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();
	
	menuList.css("-webkit-transform", "translate3d("+value +"px,"+getH()+"px,0px)");
	menuList.css("-ms-transform", "translate3d("+value +"px,"+getH()+"px,0px)");
	menuList.css("-moz-transform", "translate3d("+value +"px,"+getH()+"px,0px)");
	menuList.css("transform", "translate3d("+value +"px,"+getH()+"px,0px)");
	setW(value);
	
	
	$("li").find('div.viewDetail').hide();
}

function scrollImagess(distance, duration)
{
	menuList.css("-webkit-transition-duration", (duration/3000).toFixed(1) + "s");
	menuList.css("-ms-transition-duration", (duration/3000).toFixed(1) + "s");
	menuList.css("-moz-transition-duration", (duration/3000).toFixed(1) + "s");
	menuList.css("transition-duration", (duration/3000).toFixed(1) + "s");
	
	var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();
	
	menuList.css("-webkit-transform", "translate3d("+getW()+"px,"+value +"px,0px)");
	menuList.css("-ms-transform", "translate3d("+getW()+"px,"+value +"px,0px)");
	menuList.css("-moz-transform", "translate3d("+getW()+"px,"+value +"px,0px)");
	menuList.css("transform", "translate3d("+getW()+"px,"+value +"px,0px)");
	setH(value);
	$("li").find('div.viewDetail').css('display','none');
}

*/
