(function($){
	$.fn.menuActive = function($index, position, duration){
		return this.each(function(){
			var $element = $(this);
			if($index == $element.index())
			{
				$(this).find("img").stop().animate({top:position}, duration)
			}else{
				$(this).find("img").stop().animate({top:'0px'}, 100)
			}
		})
	};
	$.fn.defaultMenuActive = function($index, position, duration){
		return this.each(function(){
			var $element = $(this);
			if($index == $element.index())
			{
				$(this).find("img").stop().animate({top:position}, duration)
			}else{
				$(this).find("img").stop().animate({top:'0px'}, 100)
			}
		})
	};
}) (jQuery)
