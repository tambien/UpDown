define(["domReady!", "jquery.mousewheel", "controller/Mediator"], function(ready, mousewheel, Mediator){

	/**
	 *  the current scroll position
	 *  @type {Number}
	 */
	var scrollPosition = 0.5;

	/**
	 *  if the scroll value has changed
	 *  @type {Boolean}
	 */
	var needsUpdate = false;

	/**
	 *  the amount of time it should take of constant scrolling to hit
	 *  the top or the bottom
	 *  @type {Number}
	 */
	var scrollingSeconds = 5;
	var scrollingDivisor = scrollingSeconds * 5000;

	var maxDelta = 500;

	$("#Container").on("mousewheel", function(e){
		e.preventDefault();
		needsUpdate = true;
		var deltaY = -e.deltaY;
		if (deltaY > 0){
			deltaY = Math.min(maxDelta, deltaY);
		} else {
			deltaY = Math.max(-maxDelta, deltaY);
		}
		scrollPosition -= deltaY / scrollingDivisor;
		if (scrollPosition >= 1){
			console.log("TOPPPPP");
			scrollPosition = 0.999;
		} else if (scrollPosition <= 0){
			console.log("BOTTOM");
			scrollPosition = 0.0;
		}
		Mediator.send("rawscroll", scrollPosition);
	});

	Mediator.route("slowUpdate", function(updateRate){
		if (needsUpdate){
			Mediator.send("scroll", scrollPosition, updateRate);
			needsUpdate = false;
		}
	});

	window.setScroll = function(position){
		scrollPosition = position;
		needsUpdate = true;
	};

	return {
		/**
		 *  get the position of the scroll
		 *  @return {number} a number -1 at the bottom and 1 at the top
		 */
		getPosition : function() {
			return scrollPosition;
		}
	};
});