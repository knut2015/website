/**
 * @author gy
 */

var orderComplete;
var maxBillsHeightList = 0;
var BILLS_HEIGHT = 773; //$("div.listContainer").height();

var isData = true;
var toggleState= false;
var compScroll;

$(document).ready(function(){
	orderComplete = $(".moveBillsContainer");
	var $utilMenu = $("ul.utilMenu");
	$viewOrderCom = $("div.viewOrderComplete");
	var $window = $(window);
	$viewOrderCom.hide();
	
	$utilMenu.unbind("click");
	$utilMenu.bind("click", function(){
		// alert(OrderComplete( dataHeader ))
		alert(totalDataList)
		if (isOrderComplete){
			$("div.viewOrderComplete").stop().slideDown(300, 'easeInOutCubic');
			$("div.viewOrderComplete").css('opacity','1')

			if ($("#orderStream").position().top >= 800){
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

/**
 * 
 * response raw data
 * 
 * **/
var billsTotalList = [];
var totalHeights;
var $viewOrderCom;

function responseOrderData(data){
	billsTotalList = [];
	
	$(data).find("Order").each(function(i){
		var b_name = $(this).children('Name').text();
		var b_price = $(this).children('Price').text();
		var b_count = $(this).children('Count').text();
		
		var billsObject = new Object;
		
		billsObject.billsName = b_name;
		billsObject.billsPrice = b_price;
		billsObject.billsCount = b_count;
		
		billsTotalList.push(billsObject);
	});
	
	createOrderCompleteList(data);
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
			"		<li class='b_menuName'>" + billsTotalList[i].billsName + "<p>" + commify(parseInt(billsTotalList[i].billsPrice)) + "</p>" + "</li>" +
			"		<li class='b_menuCount'><p>" + billsTotalList[i].billsCount + "</p></li>" +
			"	</ul>" +
			"</div>"
		);
	}
	
	$("div.viewOrders").append(
			"<div class='totalBills'>" + 
			"	<ul>" +
			"		<li class='billsTotalPrices'>Total "+commify(parseInt($(data).find("TotalPrice").text())) +"</li>"+
			"		<li class='btnOrderClose'><img src='./img/closeOrderList.gif' /></li>"+
			" 	</ul>" + 
			"</div>"
		);
		
	
	
	$(".btnOrderClose").bind("click", function(){
		$("div.viewOrderComplete").stop().slideUp(600, 'easeInOutCubic');
		toggleState = false;
	});

	var heightBlock = $("div.orderCompletelistBlock").height();
	var listLen = billsTotalList.length;
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

