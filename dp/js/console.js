// =============================================================
// 디지털뷰 자바스크립트 연동 인터페이스
// =============================================================

/**
 * Flash 초기화가 완료되면 호출한다. ( 호출되기전에는 Loading 이미지를 노출 )
 */
function init()
{
    //alert( 'Javascript init() called.' );
    ftcallback( "INIT", "STATUS" );
};


/**
 * 사용자 이벤트를 전달한다.
 */
function user_event()
{
    //alert( 'Javascript user_event() called.' );
    ftcallback( "Click", "EVENT" );
};


/**
 * 사용자 이벤트에 대한 특정 Tag 로그를 저장한다.
 */
function user_tagevent( tag )
{
    //alert( 'Javascript user_tagevent() called. Tag Name : ' + tag );
    ftcallbackinputTag ( "Click", "EVENT", tag );
};


/**
 * 에러가 발생했을 경우 호출 ( 에러 메시지를 콘솔에 출력 )
 */
function error()
{
    //alert( 'Javascript error() called.' );
    ftcallback( "ERROR", "STATUS" );
};


/**
 * 콘솔에 정의된 메소드를 호출 하며 스케쥴 대기 시간을 늘려준다.
 */
function ftcallback( key, type )
{
    try
    {
        window.external.KIOSK_EVENT( key, type );    
    }
    catch ( e ) {}
};


/**
 * 클릭이벤트에 대한 로그를 남기고 싶을 때 (Tag 형)
 */
function ftcallbackinputTag( key, type, tag )
{
    try
    {
    	//alert(requestDeviceID()+tag);
    	var msg = getRequestDeviceID()+tag
        window.external.KIOSK_TAGEVENT( key, type, msg );    
    }
    catch ( e ) {}
};


/**
 * 콘솔에 장비 아이디를 요청한다. 
 */
function getRequestDeviceID()
{	
	try
    {
		if ( window.external )
        { 	
			return window.external.GetDeviceID();
        }
    }
    catch ( e )
	{
				
	}
}


/**
 * Get 방식 파라미터로 제공된 장비 아이디 또는 옥수역의 장비 아이디를 지정.
 */
function applyDefaultDeviceID()
{
	var deviceID = getHttpParam( 'deviceID' );
	subway_code( ( deviceID != "" ) ? deviceID : "K1011-0101-1F||0" );
}


/**
 * 플래쉬 오브젝트 리턴
 */
function getFlashObject( movieName ) 
{
    if ( navigator.appName.indexOf( "Microsoft" ) != -1 ) 
    {
        return window[ movieName ];
    } 
    else 
    {
        return document[ movieName ];
    }
};


/**
 * Get방식 URL 파라미터 추출
 */
function getHttpParam( name )
{
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.href);
	if (results == null) return "";
	else return results[1];
}


/***************************************************************************************
* 콘솔 카메라 연동 제어
* 
***************************************************************************************/

/**
 * 콘솔에 카메라 아이디를 요청한다. 
 */
function getRequestDeviceID()
{	
	try
    {
		if ( window.external )
        { 	
			var key = window.external.GetCameraServiceKey();
			//alert("getRequestDeviceID "+key);
			return key;
			
        }
    }
    catch ( e )
	{
				
	}
}


/**
 * 콘솔에 카메라 아이피를 요청한다. 
 */
function getRequestLocalIP()
{
	try
	{
		if ( window.external )
        { 	
			var ipinfo = window.external.GetLocalIP();
			//alert("getRequestDeviceID "+key);
			return ipinfo;
			
        }
	}
	catch (e)
	{
	}
}


/**
 * 콘솔 카메라를 요청한다. 
   즉시리턴
 */
function getRequestCamera( srtReq, deviceID, fileName)
{	
	try
    {
    	//alert(srtReq+":"+deviceID+":"+fileName);
		if ( window.external )
        { 	
			//alert(srtReq+":"+deviceID+":"+fileName);
			//var rtn = window.external.ReqCameraService( srtReq, deviceID, fileName);
			//alert("return >> " + rtn);
			return window.external.ReqCameraService( srtReq, deviceID, fileName);
			
        }
    }
    catch ( e )
	{
		alert("catch ---->>> "+ srtReq+":"+deviceID+":"+fileName);
	}
}


/**
 * 콘솔 카메라가 이 함수를 호출한다.
   얼굴등록 정상여부/
 */    
function setCamera_ResponseCode( event, status  )
{
    if ( event == null && status  == null )
    {
        error();
        return;
    }
    //alert("setCamera_ResponseCode ---->>> "+ event+":"+status );

    //플래쉬로 코드 리턴
    setResponseCameraStatus( event, status  );
}



/**
 * 플래쉬로 코드 리턴
 */
function setResponseCameraStatus( event, status )
{
	try
	{
		getFlashObject( "DV_GameSection" ).setResponseCameraStatus( event, status );
	}
	catch ( e ) {}
};


/***************************************************************************************
* NFC 콘솔 연동 제어
* 
***************************************************************************************/

/**
 * NFC 콘솔 태그전송
 */
function getDVNFCtagWrite( uri, taginfo )
{
	try
    {
		if ( window.external )
        { 	
			//alert("uri :" + uri + " taginfo :" + taginfo);
			NFCResponse("NFCWRITE", "FAIL");
			return window.external.SetNFCTagUri( uri, taginfo );
        }
    }
    catch ( e )
	{
    	 error();
	}
}


/**
 * NFC SMS 태그전송
 */
function getDVNFCtagWriteSMS( uri, taginfo )
{
	try
    {
		if ( window.external )
        { 	
			alert("uri :" + uri + " taginfo :" + taginfo);
			//NFCResponse("NFCWRITE", "OK");
			return window.external.SetSMSTagUri( uri, taginfo );
        }
    }
    catch ( e )
	{
    	 error();
	}
}


/**
 * NFC 플래쉬로 결과 코드 리턴
 */
function NFCResponse( event, status )
{
	try
	{
		getFlashObject( "DV_GameSection" ).setResponseNFCtagStatus( event, status );
	}
	catch ( e ) {}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
var _tableNum;
function SetTableNum( num )
{
	try
    {
    	_tableNum = num;
    }
    catch(e)
    {
    	error();
    }
}

function OrderComplete( xml )
{
	try
    {
    	// TotalOrdersReceive(xml);
//    	TotalOrdersReceive("<?xml version='1.0'?><OrderCollection xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>	<TableNum>1</TableNum>	<Date>2013-09-01 11:00:00</Date> <TotalPrice>0</TotalPrice>	 <Orders><Order>	<Code>0</Code>	<Name><![CDATA[샤오롱바오]]></Name>	<Price><![CDATA[9,900]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>1</Code>	<Name><![CDATA[부추 새우 샤오롱바오]]></Name>	<Price><![CDATA[13,200]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>2</Code>	<Name><![CDATA[찹쌀 고기 샤오마이]]></Name>	<Price><![CDATA[11,000]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>3</Code>	<Name><![CDATA[게살 샤오롱바오]]></Name>	<Price><![CDATA[15,000]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>4</Code>	<Name><![CDATA[송이 샤오롱바오]]></Name>	<Price><![CDATA[18,000]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>5</Code>	<Name><![CDATA[매운소스 새우 고기 훈툰]]></Name>	<Price><![CDATA[7,700]]></Price>	<Count><![CDATA[1]]></Count></Order><Order> <Code>6</Code>	<Name><![CDATA[새우고기 훈툰탕]]></Name>	<Price><![CDATA[7,700]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>7</Code>	<Name><![CDATA[산라탕]]></Name>	<Price><![CDATA[4,500]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>8</Code>	<Name><![CDATA[게살 송이스프]]></Name>	<Price><![CDATA[4,500]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>9</Code>	<Name><![CDATA[야채 고기 훈툰탕]]></Name>	<Price><![CDATA[7,700]]></Price>	<Count><![CDATA[1]]></Count></Order><Order> <Code>10</Code>	<Name><![CDATA[매운소스 야채 고기 훈툰]]></Name>	<Price><![CDATA[5.00]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>11</Code>	<Name><![CDATA[크림새우]]></Name>	<Price><![CDATA[25,500]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>12</Code>	<Name><![CDATA[찹쌀탕수육]]></Name>	<Price><![CDATA[25,500]]></Price> <Count><![CDATA[1]]></Count></Order><Order>	<Code>13</Code>	<Name><![CDATA[가지 칠리 탕수]]></Name>	<Price><![CDATA[16,500]]></Price>	<Count><![CDATA[1]]></Count></Order><Order> <Code>14</Code>	<Name><![CDATA[유린기]]></Name>	<Price><![CDATA[19,000]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>15</Code>	<Name><![CDATA[새우냉채]]></Name> <Price><![CDATA[22,000]]></Price>	<Count><![CDATA[1]]></Count></Order>	 </Orders></OrderCollection>");
		if ( window.external )
        { 	
        	if(window.external.Order( xml ))
        	{
        		isReturn = true;
        	}
        	else
        	{
        		isReturn = false;
        	}
        }
        return isReturn;
    }
    catch ( e )
	{
    	 error();
	}
}

// total order list
var isReturn = true;
var isCallReturn = true;
//var totalDataList = "<?xml version='1.0'?><OrderCollection xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'>	<TableNum>1</TableNum>	<Date>2013-09-01 11:00:00</Date> <TotalPrice>0</TotalPrice>	 <Orders><Order>	<Code>0</Code>	<Name><![CDATA[샤오롱바오]]></Name>	<Price><![CDATA[9,900]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>1</Code>	<Name><![CDATA[부추 새우 샤오롱바오]]></Name>	<Price><![CDATA[13,200]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>2</Code>	<Name><![CDATA[찹쌀 고기 샤오마이]]></Name>	<Price><![CDATA[11,000]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>3</Code>	<Name><![CDATA[게살 샤오롱바오]]></Name>	<Price><![CDATA[15,000]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>4</Code>	<Name><![CDATA[송이 샤오롱바오]]></Name>	<Price><![CDATA[18,000]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>5</Code>	<Name><![CDATA[매운소스 새우 고기 훈툰]]></Name>	<Price><![CDATA[7,700]]></Price>	<Count><![CDATA[1]]></Count></Order><Order> <Code>6</Code>	<Name><![CDATA[새우고기 훈툰탕]]></Name>	<Price><![CDATA[7,700]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>7</Code>	<Name><![CDATA[산라탕]]></Name>	<Price><![CDATA[4,500]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>8</Code>	<Name><![CDATA[게살 송이스프]]></Name>	<Price><![CDATA[4,500]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>9</Code>	<Name><![CDATA[야채 고기 훈툰탕]]></Name>	<Price><![CDATA[7,700]]></Price>	<Count><![CDATA[1]]></Count></Order><Order> <Code>10</Code>	<Name><![CDATA[매운소스 야채 고기 훈툰]]></Name>	<Price><![CDATA[5.00]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>11</Code>	<Name><![CDATA[크림새우]]></Name>	<Price><![CDATA[25,500]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>12</Code>	<Name><![CDATA[찹쌀탕수육]]></Name>	<Price><![CDATA[25,500]]></Price> <Count><![CDATA[1]]></Count></Order><Order>	<Code>13</Code>	<Name><![CDATA[가지 칠리 탕수]]></Name>	<Price><![CDATA[16,500]]></Price>	<Count><![CDATA[1]]></Count></Order><Order> <Code>14</Code>	<Name><![CDATA[유린기]]></Name>	<Price><![CDATA[19,000]]></Price>	<Count><![CDATA[1]]></Count></Order><Order>	<Code>15</Code>	<Name><![CDATA[새우냉채]]></Name> <Price><![CDATA[22,000]]></Price>	<Count><![CDATA[1]]></Count></Order>	 </Orders></OrderCollection>";
var totalDataList = undefined;
var eventState = null;

function TotalOrdersReceive( xml, isReceive )
{
	try
    {
    	var xmlData = $.createXMLDocument(xml);
		xmlData = $(xmlData);
		totalDataList = xmlData;
    	responseOrderData(xmlData);
    	
    	if ( isReceive ){
    		viewCompletePopup();
    	}
    }
    catch ( e )
	{
    	 error();
	}
}

$.createXMLDocument = function(string)
{
	var browserName = navigator.appName;
	var doc;
	if (browserName == 'Microsoft Internet Explorer')
	{
		doc = new ActiveXObject('Microsoft.XMLDOM');
		doc.async = 'false'
		doc.loadXML(string);
	} else {
		doc = (new DOMParser()).parseFromString(string, 'text/xml');
	}
		return doc;
}

function CallEmployee( tableNumber, code )
{
	try
    {
    	/*
		if ( window.external )
        {
			return window.external.CallEmployee( tableNumber, code );
        }
        */
        if ( window.external )
        { 	
        	if(window.external.CallEmployee( tableNumber, code ))
        	{
        		isCallReturn = true;
        	}
        	else
        	{
        		isCallReturn = false;
        	}
        }
        return isCallReturn;
    }
    catch ( e )
	{
    	 error();
	}
}


/*
$.createXMLDocument = function(string)
{
	var browserName = navigator.appName;
	var doc;
	if (browserName == 'Microsoft Internet Explorer')
	{
		doc = new ActiveXObject('Microsoft.XMLDOM');
		doc.async = 'false'
		doc.loadXML(string);
	} else {
		doc = (new DOMParser()).parseFromString(string, 'text/xml');
	}
		return doc;
}
*/