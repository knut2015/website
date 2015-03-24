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
		CreateWork();
	}
}

var CreateWork = CreateWork || function(){
	var workData = jsonResultModule.getJsonData()[1].work;

	var Works = function(){

	}

	Works.prototype = {
		thumb : function(){
			var i;
			for ( i = 0; i < workData.length; i++ ){
				console.log(workData[i].w_Thumb);
			}
		}
	}

	var work = new Works();

	work.thumb();
}