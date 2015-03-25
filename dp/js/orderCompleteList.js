/**
 * @author gy
 */

var orderComplete;
var maxBillsHeightList = 0;
var BILLS_HEIGHT = 773; //$("div.listContainer").height();

var isData = true;
var toggleState= false;
var compScroll;

var billsTotalList = [];
var totalHeights;
var $viewOrderCom;

var _billsname;
var _billList = [];

$(document).ready(function(){
	orderComplete = $(".moveBillsContainer");
	var $utilMenu = $("ul.utilMenu");
	$viewOrderCom = $("div.viewOrderComplete");
	var $window = $(window);
	$viewOrderCom.hide();
	
	$utilMenu.unbind("click");
	$utilMenu.bind("click", function(){
		// alert(OrderComplete( dataHeader ))
		if (totalDataList != undefined){
			if (isOrderComplete == false){
				var xmlData = $.createXMLDocument(totalDataList);
				xmlData = $(xmlData);
				
		    	responseOrderData(xmlData);
			}
			
			$viewOrderCom.stop().slideDown(300, 'easeInOutCubic');
			$viewOrderCom.css('opacity','1')
			console.log($("#orderStream").position().top)
			if ($("#orderStream").position().top >= 700){
				return;
			}else{
				$("#orderStream").stop().animate({bottom: -$("#orderStream").height() + 97+'px'}, 500, 'easeOutExpo');
			}
		}
	});

	compScroll = new iScroll("orderWrap", {
		hideScrollbar:true
	});
});	

function viewCompletePopup(){
	$(".compPop").addClass("viewPop").css('opacity', '0').stop().animate({opacity : 1, top: 0}, 500, 'easeOutBack');
	setTimeout('rmeoveCompletePopup()', 2500);
}

function rmeoveCompletePopup(){
	$(".compPop").stop().animate({opacity: 0, top: '100px'}, 400, 'easeInBack', function(){
		$(this).removeClass("viewPop");
	});
}

/**
 * 
 * response raw data
 * 
 * **/
function responseOrderData(data){
	billsTotalList = [];
	_billList = [];
	
	$(data).find("Order").each(function(i){
		var b_code = $(this).children('Code').text();
		var b_name = $(this).children('Name').text();
		var b_price = $(this).children('Price').text();
		var b_count = $(this).children('Count').text();
		
		for (var k = 0; k < rawData.length; k++){
			for (var j = 0; j < rawData[k].menu.length; j++){
				if (b_name == rawData[k].menu[j][0]){
					b_name = rawData[k].menu[j];
					console.log("b_name : " + b_name)
					break;
				}
			}
		}
		
		var billsObject = new Object;
		
		billsObject.billsCode = b_code;
		billsObject.billsName = b_name;
		billsObject.billsPrice = b_price;
		billsObject.billsCount = b_count;
		
		billsTotalList.push(billsObject);
	});
	
	createOrderCompleteList(data);
	viewOrderCompeLanguage();
}

function getBillsName() { return _billList; }
function setBillsName(billsName) 
{ 
	_billsname = billsName;
	// _billList = [];
	_billList.push(billsName); 
}
function viewOrderCompeLanguage(){
	for (var i = 0; i < billsTotalList.length; i++){
		console.log("------ " + billsTotalList[i].billsName);
		setBillsName(billsTotalList[i].billsName)
	}
}

function createOrderCompleteList(data){
	$("div.totalBills").remove()
	
	for (var i = 0; i < billsTotalList.length; i++)
	{
		$("div.moveBillsContainer").empty();
		$("div.orderCompletelistBlock").remove();
	}
	
	for (var i = 0; i < billsTotalList.length; i++)
	{
		$("div.moveBillsContainer").append(
			"<div class='orderCompletelistBlock'>" +
			"	<ul class='billsContainer'>" +
			"		<li class='b_menuName'>" + billsTotalList[i].billsName[0] + "</li>" +
			" 		<li class='b_price'>" + ((billsTotalList[i].billsPrice)) + "</li>"+
			"		<li class='b_menuCount'><p>" + billsTotalList[i].billsCount + "</p></li>" +
			"	</ul>" +
			"</div>"
		);
	}
	
	$("div.viewOrders").append(
			"<div class='totalBills'>" + 
			"	<ul>" +
			"		<li class='billsTotalPrices'>Total "+(($(data).find("TotalPrice").text())) +"</li>"+
			"		<li class='btnOrderClose'><img src='./img/closeOrderList.gif' /></li>"+
			" 	</ul>" + 
			"</div>"
		);
		
	$(".btnOrderClose").bind("click", function(){
		$("div.viewOrderComplete").stop().slideUp(600, 'easeInOutCubic');
		toggleState = false;
	});

	var heightBlock = $("div.orderCompletelistBlock").height();
	// var listLen = billsTotalList.length;
	var listLen = $("div.moveBillsContainer").children().length;
	var priceHeight = $("li.btnOrderClose").height() + 7;
	totalHeights = heightBlock * listLen + priceHeight; 
	
	$("div.viewOrders").css('height', totalHeights-3 + 'px');

	var listLength = $(".moveBillsContainer").children().length;
	var h = listLength * heightBlock;
	$(".moveBillsContainer").css('height', h+'px');
	
	viewToOrderComplete();
}

function viewToOrderComplete(){
	var listBlockLen = $(".moveBillsContainer div").length;
	var blockHeight = $(".orderCompletelistBlock").height();
	var totalBillHeight = $(".totalBills").height();
	
	$viewOrderCom.css('height', totalBillHeight  + (listBlockLen*blockHeight) + 'px');
	
	if ($viewOrderCom.height() > 773)
	{
		$viewOrderCom.css('height', 773-50+'px');
		$("div.orderCompletebg").css('height', ($viewOrderCom.height() - 102)+'px');
	}
	
	$("div.viewOrderComplete").css('display', 'block');
	$("div.viewOrderComplete").css('opacity','0')
	toggleState = true;	
	
	compScroll.refresh();
}

