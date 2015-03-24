/**
 * @author gy
 */

/* *
 * 
 * 
 * Data Load
 * 
 * 
 * */


var dataLoadModule = (function(){
	var config = {
		type: 'GET',
		dataType: 'XML',
		url: '/',
		data: {},
		async: true,
		cache: false
	};
	
	function getAjax(){
		$.ajax({
			type: config.type,
			dataType: config.dataType,
			url: config.url,
			data: config.data,
			async: config.async,
			cache: config.cache,
			success: successHandler,
			error: errorHandler
		});
	};
	
	function getType(){ return config.type; };
	function setType(value){ config.type = value; };
	
	function getDataType(){ return config.dataType; };
	function setDataType(value){ config.dataType = value; };
	
	function getURL(){ return config.url; };
	function setURL(value){ config.url = value; };
	
	function getData(){ return config.data; };
	function setData(value){ config.data = value; };
	
	function getAsync(){ return config.async; };
	function setAsync(value){ config.async = value; };
	
	function getCache(){ return config.cache; };
	function setCache(value){ config.cache = value; };
	
	return {
		getType: getType,
		setType: setType,
		getDataType: getDataType,
		setDataType: setDataType,
		getURL: getURL,
		setURL: setURL,
		getData: getData,
		setData: setData,
		getAsync: getAsync,
		setAsync: setAsync,
		getCache: getCache,
		setCache: setCache,
		getAjax: getAjax
	}
})();



/* *
 *                                                                
 * 
 * json parse result
 * 
 * 
 * */
var jsonResultModule = (function(){
	var jsonData;
	var dataLength;
	
	function getJsonData(){ return jsonData; };
	function setJsonData(value){ jsonData = value; };
	
	function getDataLength(){ return dataLength; };
	function setDataLength(value){ dataLength = value; };
	
	return {
		getJsonData: getJsonData,
		setJsonData: setJsonData,
		getDataLength: getDataLength,
		setDataLength: setDataLength
	}
}());


/* *
 *                                                                
 * 
 * App initialize
 * 
 * 
 * */
(function($){
	$.AppInit = function(callback){
		var loading = false;

		if (typeof callback !== "function"){
			callback = false;
		}
		
		if (callback){
			loading = true;
			callback(loading);
		}

		return loading;
	}
})(jQuery);


// navigation
var sp = location.href.split("/");
var len = location.href.split("/").length -1;
var target = sp[len].split(".")[0];

switch ( target ){
	case "work2":
	$("ul.nav li").eq(0).addClass('active');
	break;
	case "casestudy":
	$("ul.nav li").eq(1).addClass('active');
	break;
	case "blog":
	$("ul.nav li").eq(2).addClass('active');
	break;
}


$(".loading").show();
$(window).resize(function(){
	$(".loading").css({'left': ($(window).width() - $(".loading").width()) / 2 + 'px', 'top': ($(window).height() - $(".loading").height()) / 2 + 'px'});
}).resize();

