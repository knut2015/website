/* --------------------------------------------- */
/* Author: http://codecanyon.net/user/CodingJack */
/* --------------------------------------------- */

(function($) {
	
	var touchStop, touchMove, touchStart, modern = 'addEventListener' in window,
	
	methods = {
		
		on: function($this, cb) {
			
			$this.cjCallback = cb;
			$this.addEventListener(touchStart, startIt);
			
		},
		
		off: function($this) {
			
			$this.removeEventListener(touchStart, startIt);
			$this.removeEventListener(touchMove, moveIt);
			$this.removeEventListener(touchStop, endIt);
			
			delete $this.cjSwipeLeft;
			delete $this.cjSwipeRight;		
			delete $this.cjNewPageX;
			delete $this.cjPageX;
			
		}
		
	};
	
	if('ontouchend' in document) {
	
		touchStop = 'touchend';
		touchMove = 'touchmove';
		touchStart = 'touchstart';
		
	}
	else {
	
		touchStop = 'MSPointerUp';
		touchMove = 'MSPointerMove';
		touchStart = 'MSPointerDown';
		
	}
	
	$.fn.cjSwipe = function(type, cb) {
		
		if(!modern) return;
		return this.each(cycleEach, [type, cb]);
		
	};
	
	function cycleEach(type, cb) {
		
		methods[type](this, cb);
		
	}
	
	function startIt(event) {
		
		var pages = event.touches ? event.touches[0] : event;
		
		this.cjPageX = pages.pageX;
		this.addEventListener(touchStop, endIt);
		this.addEventListener(touchMove, moveIt);
		
	}
	
	function moveIt(event) {
		
		var pages = event.touches ? event.touches[0] : event,
		newPageX = this.cjNewPageX = pages.pageX;
		
		if(Math.abs(this.cjPageX - newPageX) > 10) event.preventDefault();
		
	}
	
	function endIt() {
		
		this.removeEventListener(touchMove, moveIt);
		this.removeEventListener(touchStop, endIt);
		
		var newPageX = this.cjNewPageX, pageX = this.cjPageX;
		if(Math.abs(pageX - newPageX) > 30) this.cjCallback(pageX > newPageX);
		
	}
		
})(jQuery);




