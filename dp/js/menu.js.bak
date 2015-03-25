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
var $detailModal;
var boo = false;
var LIST_HEIGHT = 498; //$("div.listContainer").height();
var currentList = 0;
var mySwiper;
var isOrderComplete = undefined;

var o_list;
var selectedIdx=0;
var $orderComplete;
var $orderDecision;
var s_speed = 2000;
var $transContainer;

$(function()
{
	viewMain();
	creatGnb();
	
	$detailModal = $("div.detailModal");
	$transContainer = $(".transContainer");
	menuList = $("#menuList");
	menuList.swipe( {
        swipeStatus:function(event, phase, direction, distance, duration)
        {
          
          	flag_phase = phase;
			flag_direction = direction;
			
			if( phase=="move" && (direction=="left" || direction=="right" ) )
			{
				var duration=0;
				if (direction == "left"){
					scrollImages((IMG_WIDTH * currentImg) + distance, duration);
				}
				else if (direction == "right"){
					scrollImages((IMG_WIDTH * currentImg) - distance, duration);
				}
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
				}else{
					if (direction == "right" || direction == "left")
					{
						scrollImages( IMG_WIDTH * currentImg, speed);
					}
				}
				setSectionName($('.pages').eq(currentImg).find('div.section').text());
					
					$(getData()).each(function(i){
						if ($(this).find('section').eq(currentImg).attr('id') == "drink"){
							$("#gnb ul:first li").eq(1).stop().animate({left:'-115px'}, 100).addClass('menuActivate').siblings().stop().animate({left:'0px'}, 200).removeClass('menuActivate');
						}else{
							$("#gnb ul:first li").eq(0).stop().animate({left:'-115px'}, 100).addClass('menuActivate').siblings().stop().animate({left:'0px'}, 200).removeClass('menuActivate');
						}
					})
			}
        },
        triggerOnTouchLeave:true,
        allowPageScroll:"vertical",
        threshold:null
      });
	
	listMoveCon = $(".listMoveCon");
	o_list = new iScroll("o_listWrap", {
		hideScrollbar:true,
		lockDirection: true
	});
	
	mySwiper = $('.swiper-container').swiper({ 
		pagination: '.pagination',
		speed:500,
		paginationClickable: true, 
		// loop:true
	});
});
/**********************************************************/

function dataLoad(url){
	$.ajax({
		type: "GET",
		url: url,
		async: false,
		dataType: "xml",
		// dataType: ($.browser.msie) ? "text" : "xml",
		success: function(data){
			// var xml;
			// if( $.browser.msie ){ //ie 가 아닐경우
				// xml = new ActiveXObject("Microsoft.XMLDOM");
				// xml.async = false;
				// xml.loadXML(data);
			// } else {
				// xml = data;
			// }
			responseData(data);
		},
		error: function(){
			alert("fail");
		}
	});
}

function viewMain(){
	var $mainView = $("#mainView");
	$mainView.bind("click", function(){
		$(this).stop().animate({opacity: 0}, 400, function(){
			$(this).css('z-index', '0');
		});
	});
	
	$(".home").bind("click", function(){
		$mainView.css('z-index', '9999').animate({opacity: 1}, 500);
	})
}

function creatGnb(){
	var $gnb = $("#gnb ul:first li");
	var $callOrder = $("div.callOrder div");
	var callState = true;
	var $callList = $("div.callList");
	
	//var foodMenu = "res/menu.xml";
	var foodMenu = "http://61.111.61.85/M2CASTContents/FTDM/dp/res/menu.xml";

	dataLoad(foodMenu);
	
	$gnb.each(function(){
		var index = $(this).index();
		$(this).bind("click", function(){
			
			if ($(this).hasClass('menuActivate')){
				return;
			}else{
				selectedIdx = index;
				$(this).stop().animate({left:'-115px'}, 100).addClass('menuActivate').siblings().stop().animate({left:'0px'}, 200).removeClass('menuActivate');
				switch(index)
				{
					case 0:
							currentImg = Math.max(0, 0);
							scrollImages( IMG_WIDTH * currentImg, speed);
						break;
					case 1:
							currentImg = Math.min($(getData()).find('section').size(), maxImages-1);
							scrollImages( IMG_WIDTH * currentImg, speed);
						break;
					case 2:
						break;
				}
			}
		});
	});
	
	// $gnb.eq(0).trigger("click");
	
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
			if (isCallReturn){
				if ($(this).index() == $callList.find('ul li').size() -1){
					return;
				}
				$(this).css('opacity','1').siblings().css('opacity','0.8');
				var simpleCallNum = $(this).index();
				CallEmployee(_tableNum, parseInt(simpleCallNum));
				
				$callOrder.stop().animate({left: '-115px'}, 0);
			}else{
				alert("네트워크 상태가 불안합니다. 직원을 호출해 주세요.");
			}
			
			$callList.stop().animate({
				left: '-400px'
			}, 500, 'easeInOutQuint', function(){
				$(this).find('ul li').stop().animate({opacity: 1}, 200, function(){
					$callList.css({'z-index':'0'});
				});
			});
			callState = false;
		})
	})
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
var iscroll;
/**
 * 
 * response raw data
 * 
 * **/
function responseData(data){
	setData(data);
	$(".mList").empty();
	$(data).find('section').each(function(i){
		$(".pageCon").append(	"<li class='pages " + $(this).attr('id') + "'>"+
								"	<div id='pageWrap" + i + "' class='clearfix' style='position: relative; height: 750px;'>" +
								"		<div class='transContainer' style='position: relative; margin-top: -30px;'>"+
								"			<div class='section'>" +
								"				<p></p>" +
								"			</div>" +
								"			<ul class='clearfix pageList " + "p" + i + "'></ul>" +
								"		</div>" +
								"	</div>" +
								"</li>");
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
					"	<div><span class='detailMenu detailImg'><img src='./img/menu/" + thumb + "' /></span></div>" + 
					"	<p>" + menuName + "</p>" +
					"	<div class='thumDesc'>" + thumbDesc + "</div>" +
					"	<div class='detailMenuContainer'><span class='detailMenu'><img src='./img/btnView.png' /></span></div>" +
					"	<div class='addMenuContainer'><span class='addMenu'><img src='./img/btnOrder.png' /></span></div>" +
					"	<span class='price'><img src='./img/icoPrice.png' />" + price + "</span>" +
					"</li>"
				);
				$(".viewDetail").hide();
			});
		});
		
		/**
		 * 
		 * sub category 
		 * 
		 * **/
		var d = [];
		
		$(".p" + i + " li.cate").each(function(index)
		{
			if ( $(this).index() != 0)
			{
				var thumbTotalHeight = Math.ceil( ( $( this ).index() - 1 ) / 2 );
				var distanceBar = ( thumbTotalHeight * 244 ) + 10;
				d.push($( this ).index())
				// var marginContent = 244*(index-2);
				
				if (index > 1){
					console.log(">> "+Math.ceil(d[index-2]/2)+"--" + ((Math.ceil(d[index-2]/2)) * 244))
					var result = Math.ceil(d[index-2]/2);
					if (result % 2 != 0){
						result = result - 1;
					}
					console.log(result)
					// console.log('distance : ' + distanceBar + ', index : ' + $(this).index() + ", index : "+d[index-2]/2 +" -- "+ + ((Math.ceil(d[index-2]/2)) * 244)+10 + " ::" + 244*(index-2));
					$(".p" + i + " li").eq($(this).index()).css( 'margin-top', distanceBar - (result * 244) + 'px' );
				}else{
					$(".p" + i + " li").eq($(this).index()).css( 'margin-top', distanceBar + 'px' );
				}
			}
			
			if ($(this).find('div.mType').text() == ""){
				$(this).css( 'height', '0' );
				$("div.mType").css( 'height', '0' );
			}else{
				$(this).css( 'height', '60px' );
				$("div.mType").css( 'margin', '20px 0' );
			} 
		});
		
		switch ($(this).attr('id'))
		{
			case 'food':
				$('li.food li.cate').css({'background': '#e3d9ce'});
				$('li.food li.cate div.mType').css('color', '#c0a892');
				break;
			case 'drink':
				$('li.drink li.cate').css('background', '#cde4e9');
				$('li.drink li.cate div.mType').css('color', '#85bbc6');
				break;
		}
		
		/**
		 * 
		 * content h scroll
		 * 
		 * **/
		var iscroll = new iScroll("pageWrap"+i, {
			hScroll:false,
			vScrollbar:false
		});
		
		iscroll.refresh();
	});
	
	$('div.section').find('p').each(function(){
		if ($(this).text() == 'DRINK'){
			$(this).parent().css('background', 'url("./img/top_bg_d.gif") 0 0 no-repeat');
		}
	})
	
	// viewDetail();
	viewPageSize();
	viewAddMenu();
	viewTransLanguage();
	
	viewOrderListBlock(isState);
	// viewBillsUP(isState);
}

/**
 * 
 * ?�어 변??
 * lang ?�?�으�?검???�정.
 * 
 * **/
function viewTransLanguage(){
	$("ul.language li").bind("click", function(){
		var btns = $(this);
		var langNum = $(this).index();
		var node = $(getData()).find('section').find('menuType');
		
		//top language transition
		$( "#langs li" ).menuActive(langNum, "-34px", 160);
		
		setLang(langNum);
// 		
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
			if (detailListData[i] == null || detailListData[i] == undefined){ 
				return;
			}else{
				$(".detailDiv_1 div.currentMenuName").html(detailListData[i].currentMenu[langNum]);
			}
		});
		
		$(getData()).find('section').find('menuType').find('item').find('menuName').each(function(idx){
			if (getBillsName()[idx] == undefined) { return; }
			console.log(getBillsName()[idx][langNum]);
			$(".b_menuName").eq(idx).html(getBillsName()[idx][langNum]);
		})
		
		
		detailDesc();
	});
	
	// 상단 언어 초기화 
	$("#langs li").defaultMenuActive(0, "-34px", 160);
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
 * ?�이지 ?�이�??�정 
 * 
 * **/
function viewPageSize(){
	var w = $(".pages").width();
	var len = $(getData()).find('section').length;
	maxImages = Math.round(len);
	$("#menuList").css('width',  w * len + 'px');
	
	console.log('width : '+$('ul.pageCon li.pages').eq(currentImg).height);
	
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
		var mnCodeList = [];
		var detailImages = [];
		//?�세보기 ?�명
		var detailDescs = [];
		var orderPrice = [];
		var kcals = [];
		
		$(this).find('menuType').find('item').each(function(){
			
			var languageMenuNameList = [];
			// var menuCodeList = [];
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
			
			/** menuCodeList **/
			mnCodeList.push($(this).attr('code'));
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
			temp.codes = mnCodeList;
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
		$(this).stop().animate({left: '-145px'}, 400);
		$(this).stop(true, true).delay(1000).animate({left:'0'});
		var liNumList = [];

		var clsArray = $(this).closest('ul').attr('class').split(" ");
		var currentPageCls = clsArray[clsArray.length - 1];
		var thisPage = currentPageCls.substr(1);

		//var thisPage = $(this).closest('ul').attr('class').substr(-1);
		var thisAddBtn = $(this).parent().parent().index();
		var pageItemLen = rawData[thisPage].price.length;
		
		$(".p" + thisPage + " li.mList").each(function(idx){
			liNumList.push($(this).index());
			if (liNumList[idx] == thisAddBtn){
				
				var menuCode = rawData[thisPage].codes[idx];
				var menuName = rawData[thisPage].menu[idx];
				var price = rawData[thisPage].price[idx];
				
				var result = getSearchOrderData(menuName);
				
				if (result != undefined){
					result.counts += 1;
					boo = false;
				}else{
					var orderTemp = new Object;
					
					orderTemp.selectCode = menuCode;
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
		orderToggleState(false);
	});
	
	/**
	 * DetailView
	 * **/
	var curNum = 0;
	$(".pageList li.mList span.detailMenu").bind("click", function(event){
		if(flag_phase=="end" && flag_direction==null){
		}else{
			return false;	
		}
		
		$detailModal.animate({left: '0px'}, 600, 'easeInOutQuint');
		
		$("#viewDetailContainer").stop().animate({left:'0px'}, 800, 'easeInOutQuint');
		
		var liNumList = [];

		var clsArray = $(this).closest('ul').attr('class').split(" ");
		var currentPageCls = clsArray[clsArray.length - 1];
		var thisPage = currentPageCls.substr(1);

		// var thisPage = $(this).closest('ul').attr('class').substr(-1);
		// var thisAddBtn = $(this).parent().index();
		var thisAddBtn = $(this).parent().parent().index();
		var pageItemLen = rawData[thisPage].price.length;
		
		if ($(this).parent().hasClass('detailMenuContainer')){
			$(this).stop().animate({left: '-88px'}, 400);
			$(this).stop(true, true).delay(1000).animate({left:'0'});
		}
		
		$(".p" + thisPage + " li.mList").each(function(idx){
			liNumList.push($(this).index());
			
			// console.log($(this).index() + " : " + thisAddBtns);
			if (liNumList[idx] == thisAddBtn){
				var detailMenuCode = rawData[thisPage].codes[idx];
				var detailMenuName = rawData[thisPage].menu[idx];
				var detailImages = rawData[thisPage].detailImage[idx];
				var detailDescs = rawData[thisPage].detailDesc[idx];
				var price = rawData[thisPage].price[idx];
				var detailKcal = rawData[thisPage].detailKcal[idx];
				
				// var result = getSearchOrderData(detailMenuName);
				
				// if (result != undefined){
					// result.counts += 1;
					// boo = false;
				// }else{
					// boo = true;
				// }
				
				var detailTemp = new Object;
				
				detailTemp.currentCode = detailMenuCode;
				detailTemp.currentMenu = detailMenuName;
				detailTemp.currentImage = detailImages;
				detailTemp.currentDesc = detailDescs;
				detailTemp.currentkcal = detailKcal;
				detailTemp.currentPrice = price;
				
				detailListData.push(detailTemp);
			}
		});
		
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
	$("div.orderComplete").bind("click", function(){
		viewOrderStream();
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

function loadDetailImage(curNum){
	var $imageCon = $(".detailDiv_1 div.imageContainer div.imgList");
	var imageFileList = detailListData[curNum].currentImage;

	$imageCon.empty();
	$imageCon.css({'width':imageFileList.length * 512 + 'px' });
	$imageCon.stop().animate({left: '0px'}, 0, 'easeInOutBack');
	
	for (var i = 0; i < imageFileList.length; i++){
		var newSlide = mySwiper.createSlide("<div class='swiper-slide'><img src=./img/menu/detail/" + imageFileList[i] + " /></div>");
		mySwiper.appendSlide(newSlide);
	}
	
	$(".detailDiv_3").bind("click", function(){
		$detailModal.delay(500).animate({left: '-1280px'}, 600, 'easeInOutQuint');
		
		$("#viewDetailContainer").stop().animate({left:'-785px'}, 600, 'easeOutExpo', function(){
			imageFileList = [];
			// orderListData = [];
			$imageCon.css({'width':'0px', '-webkit-transform': 'translate3d(0px,0px,0px)', 'transform': 'translate3d(0px,0px,0px)'});
			// $imageCon.empty();
			detailListData = [];
		});
	});
	
	var result = getSearchOrderData(detailListData[0].currentMenu);

	$(".currentOrder").unbind("click");
	$(".currentOrder").bind("click", function(){
		mySwiper.reInit();
		
		if (result != undefined){
			result.counts += 1;
			boo = false;
		}else{
			var orderTemp = new Object;
		
			orderTemp.selectCode = detailListData[0].currentCode;
			orderTemp.selectMenu = detailListData[0].currentMenu;
			orderTemp.selectPrice = detailListData[0].currentPrice;
			orderTemp.counts = 1;
			
			orderListData.push(orderTemp);
			boo = true;
		}
		
		if ($("div.orderlistBlock").length > 0){
			$("#orderStream div.orderlistBlock").remove();
			getOrderView(boo);
		}
		
		if ($("div.orderlistBlock").length == 0){
			getOrderView(boo);
		}
		
		orderToggleState(false)
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
	o_list.refresh();
	
	if ($(".listMoveCon").children().length <= 0){
		$("#orderStream").stop().animate({bottom: -$("#orderStream").height()+'px'}, 500, 'easeOutExpo');
		$("div.total span").html("");
		isState = true;
	}
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
	o_list.refresh();
	/**  orderList manage **/
	$("div.orderlistBlock").css('height', '83px')
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
		
		if (totalHeight < maxHeight){
			$("#orderStream").css({'height': totalHeight+'px'});
		}else{
			$("#orderStream").css({'height': 532+'px'});
		}
	});
	
	// var isState = false;
	
	var listHeight = $(".listContainer").height();
	var listLength = $(".listMoveCon").children().length;
	
	// OrderList Height
	var h = $(".orderlistBlock").height() * listLength;
	$(".listMoveCon").css('height', h+83+'px');
	maxHeightList = $(".listMoveCon").height() / LIST_HEIGHT;
}

/** 
 * 
 * OrderList Toggle
 * 
 * **/
var isState = false;

function viewOrderListBlock(){
	$(".orderToggle").bind("click", function(){
		orderToggleState(!isState);
		if (isState){
			isState  = false;
		}else{
			isState = true;
		}
		console.log("orderToggle : " + isState);
	});
}

function orderToggleState(isState){
	if (isState){
		$("#orderStream").stop().animate({bottom: -($(".orderlistBlock").height() * $(".listMoveCon").children().length)-13+'px'}, 500, 'easeOutExpo');
		$(".orderToggle").css({'background': 'url("./img/orderToggle_bottom.png") 0 0 no-repeat'});
		// viewBillsUP(isState);
		isState = false;
	}else{
		$("#orderStream").stop().animate({bottom: '121px'}, 400, 'easeOutExpo');
		$(".orderToggle").css({'background': 'url("./img/orderToggle.png") 0 0 no-repeat'});
		$("div.viewOrderComplete").stop().slideUp(600, 'easeInOutCubic');
		toggleState = false;
		isState = true;
	}
	// viewBillsUP
	console.log("isState : " + isState);
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
	
	return commify(total);
}

function commify(n) {
  var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
  n += '';                          // 숫자를 문자열로 변환

  while (reg.test(n))
    n = n.replace(reg, '$1' + ',' + '$2');

  return n;
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
 * Order Date
 * 
 * **/
function getOrderDate(){
	var d = new Date();
	var s =
    leadingZeros(d.getFullYear(), 4) + '-' +
    leadingZeros(d.getMonth() + 1, 2) + '-' +
    leadingZeros(d.getDate(), 2) + ' ' +

    leadingZeros(d.getHours(), 2) + ':' +
    leadingZeros(d.getMinutes(), 2) + ':' +
    leadingZeros(d.getSeconds(), 2);

 	return s;
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

function viewOrderStream(){
	$orderComplete = $(".orderComplete");
	$orderDecision = $(".orderDecision");
	setOrderButtons(-71, 200, 0, 1);

	$orderDecision.find('a.btnOK').unbind("click");
	$orderDecision.find('a.btnOK').bind("click", function(){
		var dataHeader = String(
			"<?xml version='1.0'?>" +
			"<OrderCollection xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
			"	<TableNum>"+_tableNum+"</TableNum>" +
			"	<Date>"+getOrderDate()+"</Date>" +
			" 	<TotalPrice>0</TotalPrice>" +
			"		<Orders>" +
						 orderNode() +
			"		</Orders>" +
			"</OrderCollection>"
		);
		
		$("div.orderBills").text(dataHeader);
		
		OrderComplete( dataHeader );
		
		if (isReturn){
			isOrderComplete = true;
			$("#orderStream").stop().delay(1000).animate({bottom: -$("#orderStream").height()+'px'}, 500, 'easeOutExpo', function(){
				$("div.total span").html("");
				$detailModal.animate({left: '-1280px'}, 600, 'easeInOutQuint');
				$("div.orderlistBlock").remove();
				orderListData = [];
			});
			
			isState = true;
			setOrderButtons(0, 500, 1, 0);
		}else{
			alert("네트워크 상태가 불안합니다. 직원을 호출해 주세요.");
			orderToggleState(false);
		}
	})
	
	$orderDecision.find('a.btnCancel').bind("click", function(){
		setOrderButtons(0, 500, 1, 0);
	})
}

/**
 * 
 * order buttons postion
 * 
 * **/
function setOrderButtons(pos, spd, opt1, opt2){
	$orderComplete.stop().animate({top: pos + 'px'}, spd, 'easeInOutExpo');
	$orderDecision.stop().animate({top: pos + 'px'}, spd, 'easeInOutExpo');
	$(".total").stop().animate({opacity: opt1}, spd);
	$(".infoText").stop().animate({opacity: opt2}, spd);
}

function orderNode(){
	var node = "";
	for (var i = 0; i < orderListData.length; i++)
	{
		var codes = orderListData[i].selectCode;
		// detailListData[i].currentCode;
		var dataContent = String(
			'<Order>' +
			'	<Code>' +  codes + '</Code>' +
			'	<Name><![CDATA[' + orderListData[i].selectMenu[0] + ']]></Name>' +
			'	<Price><![CDATA[' + orderListData[i].selectPrice + ']]></Price>' +
			'	<Count>' + orderListData[i].counts + '</Count>' +
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
var _sectionName;
function getSectionName(){return _sectionName;}
function setSectionName(sectionName){
	_sectionName = sectionName;
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

function scrollImages(distance, duration)
{
	menuList.css("-webkit-transition-duration", (duration/s_speed).toFixed(1) + "s");
	menuList.css("-ms-transition-duration", (duration/s_speed).toFixed(1) + "s");
	menuList.css("-moz-transition-duration", (duration/s_speed).toFixed(1) + "s");
	menuList.css("transition-duration", (duration/s_speed).toFixed(1) + "s");
	
	//inverse the number we set in the css
	var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();
	
	menuList.css("-webkit-transform", "translate3d("+value +"px,"+0+"px,0px)");
	menuList.css("-ms-transform", "translate3d("+value +"px,"+0+"px,0px)");
	menuList.css("-moz-transform", "translate3d("+value +"px,"+0+"px,0px)");
	menuList.css("transform", "translate3d("+value +"px,"+0+"px,0px)");
	setW(value);
	
	$transContainer.css("-webkit-transform", "translate3d(0px,0px,0px)");
	$transContainer.css("-ms-transform", "translate3d(0px,0px,0px)");
	$transContainer.css("-moz-transform", "translate3d(0px,0px,0px)");
	$transContainer.css("transform", "translate3d(0px,0px,0px)");
	
	$("li").find('div.viewDetail').hide();
}
