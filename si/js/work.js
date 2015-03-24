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
		console.log("success");
	}
}
