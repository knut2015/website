/**
 * @author Goyoung
 */
var IMG_WIDTH = 1280;
var IMG_HEIGHT = 800;
var currentImg=0;
var currentImgs = 0;
var maxImages=0;
var maxHeightImages=0;
var maxHeightList=0;
var speed=500;
var	flag_phase = "";
var	flag_direction = "";
var menuList;
var listMoveCon;
var DEFAULT_VIEW = 0;
var priceList = [];
// RawData
var rawData = [];
// OrderData
var orderListData = [];
// DetailData
var detailListData = [];
//
var $detailModal = $("div.detailModal");
var boo = false;
var LIST_HEIGHT = 498; //$("div.listContainer").height();
var currentList = 0;

var swipeOptions=
{
	triggerOnTouchEnd : true,	
	swipeStatus : swipeStatus,
	allowPageScroll:"horizontal",
	threshold:500
}

var listSwipeOptions=
{
	triggerOnTouchEnd : true,	
	swipeStatus : listSwipeStatus,
	allowPageScroll:"vertical",
	threshold:500
}

$(function()
{
	dataLoad("./res/menu.xml");
	menuList = $("#menuList");
	menuList.swipe( swipeOptions );
	
	listMoveCon = $(".listMoveCon");
	listMoveCon.swipe( listSwipeOptions );
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
	
	$(data).find('section').each(function(i){
		$(".pageCon").append("<li class='pages'><div class='section'><p></p></div><ul class='pageList " + "p" + i + "'></ul></li>");
		$("div.section").eq(i).find("p").html($(this).children('page').text());
		
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
					"	<p>" + menuName + "</p>" +
					"	<div class='thumDesc'>" + thumbDesc + "</div>" +
					"	<span class='detailMenu'><img src='./img/btnView.png' /></span>" +
					"	<span class='addMenu'><img src='./img/btnOrder.png' /></span>" +
					"	<span class='price'><img src='./img/icoPrice.png' />" + price + "</span>" +
					"</li>"
				);
				$(".viewDetail").hide();
			});
		});
	});
	
	// viewDetail();
	viewPageSize();
	viewAddMenu();
	viewTransLanguage();
	creatGnb();
}

function creatGnb(){
	var $gnb = $("#gnb ul:first li");
	var $callOrder = $("div.callOrder div");
	var callState = true;
	var $callList = $("div.callList");
	
	$gnb.each(function(){
		var index = $(this).index();
		
		$(this).bind("click", function(){
			if ($(this).hasClass('menuActivate')){
				return;
			}else{
				$(this).stop().animate({left:'-115px'}, 100).addClass('menuActivate').siblings().stop().animate({left:'0px'}, 200).removeClass('menuActivate');
			}
		});
	});
	
	$gnb.eq(0).trigger("click");
	
	$callOrder.bind("click", function(){
		if (callState){
			$(this).stop().animate({left: '-115px'}, 0);
			$callList.stop().animate({
				left: '-400px'
			}, 500, 'easeInOutQuint', function(){
				$(this).find('ul li').stop().animate({opacity: 1}, 200, function(){
					$callList.css({'z-index':'0'});
				});
			});
			callState = false;
		}
		else
		{
			$(this).stop().animate({left: '0'}, 300);
			$callList.find('ul li').stop().animate({opacity: 0.8}, 200);
			$callList.stop().animate({
				left: '115px'
			}, 300).css({'z-index':'9000'});
			callState = true;
		}
	});
	$callOrder.trigger("click");
	
	$callList.find('li:last').bind("click", function(){
		$callOrder.trigger("click");
	});
	
	$callList.find('ul li').each(function(i){
		$(this).bind("click", function(){
			$(this).css('opacity','1').siblings().css('opacity','0.8');
			var simpleCall = $(this).index();
		})
	})
}

/**
 * 
 * ?�어 변??
 * lang ?�?�으�?검???�정.
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
			$(this).find('p').html(title);
			$(this).find('div.thumDesc').html(thumbDesc);
		});
		
		$("div.orderlistBlock").each(function(i){
			$(this).find("ul.orderContainer").children("li.order_name").html(orderListData[i].selectMenu[langNum]);
		})
		
		$("#viewDetailContainer ul li").each(function(i){
			if (detailListData[i] != null || detailListData[i] != undefined){ 
				$(".detailDiv_1 div.currentMenuName").html(detailListData[i].currentMenu[langNum]);
			}
		});
		var totalMenus = [];
		// alert(rawData[0].menu[0][0])
		/*
		
		$(getData()).find('section').find('menuType').find('item').find('menuName').each(function(i){
			if (rawData[i] != null || rawData[i] != undefined){
				totalMenus.push($(this).children('type').text());
				console.log(rawData[i].menu)
			}
		});
		*/
		for (var j = 0; j < $(".pageCon").children().length; j++){
			if (rawData[j] != null || rawData[j] != undefined){
				$(getData()).find('section').find('menuType').find('item').find('menuName').find('type').each(function(i){
					totalMenus.push($(this).text());
					
					if (billsTotalList[i] != undefined){
					console.log(billsTotalList[i].billsName);	
						// console.log(totalMenus[i] + " : " + rawData[j].menu[i][0] + " : " + billsTotalList[i].billsName);
						// if (rawData[j].menu[i][0] == billsTotalList[i].billsName){
						if (totalMenus[i] == billsTotalList[i].billsName){
							console.log("-----------------------------------");
						}
					}
				});
			}
		}
		// alert(billsTotalList[0].billsName)
		
		
		detailDesc();
	});
}

/**
 * 
 * detail description ingredientList
 * 
 * **/
function detailDesc(){
	if (detailListData[0] == undefined){
		return;
	}
	var ingredientLen = $(".detailDiv_2 ul.ingredient").children().length;
	var descStr = detailListData[0].currentDesc[getLang()];
	var descList = descStr.split(', ');
	
	for(var idx = 0; idx < descList.length; idx++){
		$(".detailDiv_2 ul.ingredient").find('li').eq(idx).html( descList[idx] );
	};
}
/**
 * 
 * ?�세보기 
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
 * ?�이지 ?�이�??�정 
 * 
 * **/
function viewPageSize(){
	var w = $(".pages").width();
	var len = $(getData()).find('section').length;
	maxImages = Math.round(len);
	$("#menuList").css('width',  w * len + 'px');
	
	var h = $("#menuList").height();
	len = h / 750;
	maxHeightImages = Math.abs(len);
}

/**
 * 
 * Add Menu
 *  
 * **/
function viewAddMenu(){
	var orderCnt = 1;
	var page = "p0";
	
	/** Raw Data **/
	$(getData()).find('section').each(function(i){
		var temp = new Object;
		var mnList = [];
		var detailImages = [];
		//?�세보기 ?�명
		var detailDescs = [];
		var orderPrice = [];
		var kcals = [];
		
		$(this).find('menuType').find('item').each(function(){
			
			var languageMenuNameList = [];
			var detailImageList = [];
			var detailDescList = [];
			var detailKcalList = [];
			
			/** menuList **/
			$(this).find('menuName').find('type').each(function(){
				var languages = $(this).text();
				languageMenuNameList.push(languages);
			});
			
			/** detailImage **/
			$(this).find('images').find('type').each(function(){
				var detailImage = $(this).text();
				detailImageList.push(detailImage);
			});
			
			/** detailDescription**/
			$(this).find('description').find('type').each(function(){
				var detailDesc = $(this).text();
				detailDescList.push(detailDesc);
			});
			
			/** detailKacl**/
			$(this).find('kcal').each(function(){
				var detailKcal = $(this).text();
				detailKcalList.push(detailKcal);
			});
			
			/** menuList **/
			mnList.push(languageMenuNameList);
			/** priceList **/
			orderPrice.push($(this).children('price').text());
			/** detailImageList **/
			detailImages.push(detailImageList);
			/** detailDescription **/
			detailDescs.push(detailDescList);
			/** detailKcal **/
			kcals.push(detailKcalList);
			
			temp.price = orderPrice;
			temp.menu = mnList;
			temp.detailImage = detailImages;
			temp.detailDesc = detailDescs;
			temp.detailKcal = kcals;
		});
		
		rawData.push(temp);
	});
	/** Raw Data ---->>**/

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
					boo = false;
				}else{
					var orderTemp = new Object;
					
					orderTemp.selectMenu = menuName;
					orderTemp.selectPrice = price;
					orderTemp.counts = 1;
					
					orderListData.push(orderTemp);
					boo = true;
				}
			}
		});
		
		if ($("div.orderlistBlock").length > 0){
			$("#orderStream div.orderlistBlock").remove();
			getOrderView(boo);
		}
		
		if ($("div.orderlistBlock").length == 0){
			getOrderView(boo);
		}
	});
	
	/**
	 * DetailView
	 * **/
	$(".pageList li.mList span.detailMenu").bind("click", function(event){
		$detailModal.animate({left: '0px'}, 600, 'easeInOutQuint');
		
		if(flag_phase=="end" && flag_direction==null){
		}else{
			return false;	
		}
		
		$("#viewDetailContainer").stop().animate({left:'0px'}, 800, 'easeInOutQuint');
		
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
				var detailKcal = rawData[thisPage].detailKcal[idx];
				var result = getSearchOrderData(detailMenuName);
				
				if (result != undefined){
					result.counts += 1;
					boo = false;
				}else{
					var orderTemp = new Object;
					
					orderTemp.selectMenu = detailMenuName;
					orderTemp.selectPrice = price;
					orderTemp.counts = 1;
					
					orderListData.push(orderTemp);
					boo = true;
				}
				
				var detailTemp = new Object;
				
				detailTemp.currentMenu = detailMenuName;
				detailTemp.currentImage = detailImages;
				detailTemp.currentDesc = detailDescs;
				detailTemp.currentkcal = detailKcal;
				
				detailListData.push(detailTemp);
			}
		});
		
		var curNum = 0;
		for (var i = 0; i < detailListData.length; i++)
		{
			if (detailListData[i].currentMenu == null || detailListData[i].currentMenu == undefined){
				return;
			}
			
			$(".detailDiv_1 div.currentMenuName").html(detailListData[i].currentMenu[getLang()]);
			$(".detailDiv_2 span p").html(detailListData[i].currentkcal);
			curNum = i;
		}
		
		loadDetailImage(curNum);
		loadDetailDescription(curNum);
	});
	
	/**
	 * order list Complete
	 * **/
	$("div.orderComplete").on("click", function(){
		viewOrderStream();
		$("#orderStream").stop().animate({bottom: -$("#orderStream").height()+'px'}, 500, 'easeOutExpo');
		$("div.total span").html("");
		$detailModal.animate({left: '-1280px'}, 600, 'easeInOutQuint');
	});
}

/**
 * 
 * create detail description
 * 
 * **/
var descStr;
var descList;
function loadDetailDescription(currNum){
	descStr = detailListData[currNum].currentDesc[getLang()];
	descList = descStr.split(',');
	
	$(".detailDiv_2 ul.ingredient").empty();	
	
	for (var i = 0; i < descList.length; i++){
		$(".detailDiv_2 ul.ingredient").append("<li>" + descList[i] + "</li>");
	}
}

/**
 * 
 * create detail image UI 
 * 
 * **/
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
		if (Math.round($imageCon.position().left) == 0) return;
		$imageCon.stop().animate({
			left: '+=' + $imageCon.find('img').width() + 'px'
		}, 600, 'easeInOutExpo');
	});
	
	var nextLimited = -($imageCon.width() / imageFileList.length) * (imageFileList.length -2);
	$nextBtn.bind("click", function(){
		if (Math.round($imageCon.position().left) < nextLimited) return;
		$imageCon.stop().animate({
			left: '-=' + $imageCon.find('img').width() + 'px'
		}, 600, 'easeInOutExpo');
	});

	$(".detailDiv_3").bind("click", function(){
		nextLimited = 0;
		$("#viewDetailContainer").stop().animate({left:'-785px'}, 600, 'easeOutExpo');
	})
	
	$(".currentOrder").bind("click", function(){
		if ($("div.orderlistBlock").length > 0){
			$("#orderStream div.orderlistBlock").remove();
			getOrderView(boo);
		}
		
		if ($("div.orderlistBlock").length == 0){
			getOrderView(boo);
		}

		$(".detailDiv_3").trigger("click");
	});
}

/**
 * 
 * List Refresh
 * 
 * **/
function refresh(){
	$("#orderStream div.orderlistBlock").remove();
	getOrderView(boo);
}

/**
 * 
 * Create OrderList 
 * 
 * **/
function getOrderView(boo){
	
	for (var i = 0; i < orderListData.length; i++)
	{
		$("div.listMoveCon").append(
				"<div class='orderlistBlock'>" +
				"	<ul class='orderContainer'>" +
				"		<li class='order_name'>" + orderListData[i].selectMenu[getLang()] + "</li>"+
				"		<li class='order_price'>&#8361; " + orderListData[i].selectPrice + "</li>"+
				"		<li class='order_count'><p>" + orderListData[i].counts + "</p></li>"+
				"		<li class='order_added'><img src='./img/btnPlus.gif' /></li>" +
				"		<li class='order_remove'><img src='./img/btnMinus.gif' /></li>" +
				"	</ul>" + 
				"</div>"
		);
	}
	
	/**  orderList manage **/
	$("div.orderlistBlock").each(function(idx){
		$(this).find("ul li.order_added").bind("click", function(){
			var result = getSearchOrderData(orderListData[idx].selectMenu)
			if (result){
				result.counts += 1;
				
				$("div.orderlistBlock").eq(idx).find('li.order_count p').html(result.counts);
				$("#orderStream div.total span").html(getTotalSum());
			}
		});
		
		$(this).find("ul li.order_remove").bind("click", function(){
			var result = getSearchOrderData(orderListData[idx].selectMenu)
			if (result){
				result.counts -= 1;
				$("div.orderlistBlock").eq(idx).find('li.order_count p').html(result.counts);
				if (result.counts <= 0){
					result.counts = 0;
					orderListData.splice(idx, 1);
					refresh();
				}
				$("#orderStream div.total span").html(getTotalSum());
			}
		});
		
		var thisHeight = $(this).height();
		var btnHeight = $("div.orderComplete").height();
		var listHeight = btnHeight + ( thisHeight * idx ) + 48;
		var totalHeight = listHeight + thisHeight;
		
		if (boo){
			$(this).stop().animate({'margin-top': '0px'}, 500, 'easeOutExpo');
		}else{
			$(this).css({'margin-top': '0px'});
		}
		
		$("#orderStream div.total span").html(getTotalSum());
		
		var listContainerHeight = $("div.listContainer").height();
		var orderTopHeight = $("div.orderToggle").height();
		var maxHeight = btnHeight + orderTopHeight + listContainerHeight;
		
		var currentViewHeight = -(83 * (idx+2) - maxHeight) - 44;
		if (83 * (idx+1) > listContainerHeight){
			listMoveCon.css("transform", "translate3d(0px,"+currentViewHeight +"px,0px)");
		}else{
			listMoveCon.css("transform", "translate3d(0px, 0px, 0px)");
		}
		
		if (totalHeight < maxHeight){
			$("#orderStream").css({'height': totalHeight+'px'});
			/*
			if ($("div.listMoveCon").children().length < 7){
				$("div.listContainer").css('height',thisHeight*($("div.listMoveCon").children().length)+'px');
			}
			*/
		}
	});
	
	var isState = false;
	viewOrderListBlock(isState);
	viewBillsUP(isState);
	var listHeight = $(".listContainer").height();
	var listLength = $(".listMoveCon").children().length;
	
	// OrderList Height
	var h = $(".orderlistBlock").height() * listLength;
	$(".listMoveCon").css('height', h+'px');
	maxHeightList = $(".listMoveCon").height() / LIST_HEIGHT;
}

/** 
 * 
 * OrderList Toggle
 * 
 * **/
function viewOrderListBlock(isState){
	$(".orderToggle").bind("click", function(){
		if (isState){
			$("#orderStream").stop().animate({bottom: -$("#orderStream").height() + 97+'px'}, 500, 'easeOutExpo');
			$(this).css({'background': 'url("./img/orderToggle_bottom.png") 0 0 no-repeat'});
			isState = false;
		}else{
			$("#orderStream").stop().animate({bottom: '95px'}, 400, 'easeOutExpo');
			$(this).css({'background': 'url("./img/orderToggle.png") 0 0 no-repeat'});
			isState = true;
		}
	});
	
	$(".orderToggle").trigger("click");
}

/**
 * 
 * 주문?�역 ?�계
 * 
 * **/
function getTotalSum(){
	var total = 0;
	for (var i = 0; i < orderListData.length; i++){
		var won = orderListData[i].selectPrice.replace(",", "");
		var thisCnt = orderListData[i].counts;
		var thisPrice = parseInt(won.substr(0) * thisCnt);
	
		total += thisPrice;
	}
	
	return total;
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
 * ?�시�?주문?�료
 * 
 * **/
function viewOrderStream(){
	var dataHeader = String(
		"<?xml version='1.0'?>" +
		"<OrderCollection xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
		"	<TableNum>1</TableNum>" +
		"	<Date>2013-09-01 11:00:00</Date>" +
		" 	<TotalPrice>0</TotalPrice>" +
		"		<Orders>" +
					 orderNode() +
		"		</Orders>" +
		"</OrderCollection>"
	);
	
	$("div.orderBills").text(dataHeader);
	
	/** console.js function **/
	OrderComplete( dataHeader );
	
	$("div.orderlistBlock").remove();
	orderListData = [];
}

function orderNode(){
	var node = "";
	for (var i = 0; i < orderListData.length; i++)
	{
		var dataContent = String(
			'<Order>' +
			'	<Code>' + i + '</Code>' +
			// '	<Name><![CDATA[' + orderListData[i].selectMenu[getLang()] + ']]></Name>' +
			'	<Name><![CDATA[' + orderListData[i].selectMenu[0] + ']]></Name>' +
			'	<Price><![CDATA[' + orderListData[i].selectPrice + ']]></Price>' +
			'	<Count><![CDATA[' + orderListData[i].counts + ']]></Count>' +
			'</Order>' 
		);
		
		if (orderListData[i].counts > 0)
			node += dataContent;
	}
	return node;
}

/**********************************************************/
/**
* Catch each phase of the swipe.
* move : we drag the div.
* cancel : we animate back to where we were
* end : we animate to the next image
*/			
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
		if (distance > 150){
			if (direction == "right")
			{
				previousImage()
			}
			else if (direction == "left")
			{
				nextImage()
			}
			else if (direction == "down")
			{
				previousImages()
			}
			else if (direction == "up")
			{
				nextImages()
			}
		}else{
			if (direction == "right" || direction == "left")
			{
				scrollImages( IMG_WIDTH * currentImg, speed);
			}
			else if (direction == "down" || direction == "up")
			{
				scrollImagess( IMG_HEIGHT * currentImgs, speed);
			}
		}
		// console.log(distance)
	}
}
		


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
	
/**
* Manuallt update the position of the imgs on drag
*/
var s_speed = 1000;
function scrollImages(distance, duration)
{
	
	menuList.css("-webkit-transition-duration", (duration/s_speed).toFixed(1) + "s");
	menuList.css("-ms-transition-duration", (duration/s_speed).toFixed(1) + "s");
	menuList.css("-moz-transition-duration", (duration/s_speed).toFixed(1) + "s");
	menuList.css("transition-duration", (duration/s_speed).toFixed(1) + "s");
	
	//inverse the number we set in the css
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
	menuList.css("-webkit-transition-duration", (duration/s_speed).toFixed(1) + "s");
	menuList.css("-ms-transition-duration", (duration/s_speed).toFixed(1) + "s");
	menuList.css("-moz-transition-duration", (duration/s_speed).toFixed(1) + "s");
	menuList.css("transition-duration", (duration/s_speed).toFixed(1) + "s");
	
	//inverse the number we set in the css
	var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();
	
	menuList.css("-webkit-transform", "translate3d("+getW()+"px,"+value +"px,0px)");
	menuList.css("-ms-transform", "translate3d("+getW()+"px,"+value +"px,0px)");
	menuList.css("-moz-transform", "translate3d("+getW()+"px,"+value +"px,0px)");
	menuList.css("transform", "translate3d("+getW()+"px,"+value +"px,0px)");
	setH(value);
	$("li").find('div.viewDetail').css('display','none');
}


/**********************************************************/
function listSwipeStatus(event, phase, direction, distance)
{
	if( phase=="move" && ( direction=="up" || direction=="down") )
	{
		var duration=0;
		if (direction == "up")
		{
			if ($(".listMoveCon").height() > LIST_HEIGHT){
				scrollList((LIST_HEIGHT * currentList) + distance, duration);
			}else{
				scrollList(($("div.listMoveCon").height() * currentList) + distance, duration);
			}
		}
		else if (direction == "down"){
			if ($(".listMoveCon").height() > LIST_HEIGHT){
				scrollList((LIST_HEIGHT * currentList) - distance, duration);
			}else{
				scrollList((0 * currentList) - distance, duration);
			}
		}
	}
	
	else if ( phase =="end" )
	{
		if (direction == "down"){
			downList();
		}else if (direction == "up"){
			upList();
		}
	}
	
}

function downList()
{
	currentList = Math.max(currentList-1, 0);
	scrollList( 0 * currentList, speed);
}

function upList()
{
	currentList = Math.min(currentList + 1, maxHeightList - 1);
	if ($(".listMoveCon").height() > LIST_HEIGHT){
		scrollList( -(LIST_HEIGHT - ($(".listMoveCon").height()+$("div.listMoveCon").children().length)), speed);
	}else{
		scrollList( 0, speed);
	}
}
function scrollList(distance, duration)
{
	listMoveCon.css("-webkit-transition-duration", (duration/2000).toFixed(1) + "s");
	listMoveCon.css("-ms-transition-duration", (duration/2000).toFixed(1) + "s");
	listMoveCon.css("-moz-transition-duration", (duration/2000).toFixed(1) + "s");
	listMoveCon.css("transition-duration", (duration/2000).toFixed(1) + "s");
	
	var value = (distance < 0 ? " " : "-") + Math.abs(distance).toString();
	
	listMoveCon.css("-webkit-transform", "translate3d(0px,"+Math.round(value) +"px,0px)");
	listMoveCon.css("-ms-transform", "translate3d(0px,"+Math.round(value) +"px,0px)");
	listMoveCon.css("-moz-transform", "translate3d(0px,"+Math.round(value) +"px,0px)");
	listMoveCon.css("transform", "translate3d(0px,"+Math.round(value) +"px,0px)");
}


