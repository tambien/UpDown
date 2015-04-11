define(["domReady!", "controller/Mediator", "util/Config", "interface/Window", "TERP"], 
	function(ready, Mediator, Config, Window, TERP){

	/**
	 *  the total distance traveled by scrolling
	 */
	var scrollDistance = 0;

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

	/**
	 *  the direction it's scrolling in. 
	 *  1 is up. -1 is down. 
	 */
	var scrollDirection = 1;

	/**
	 *  the switching point
	 */
	var switchCenterPosition = 0.5;

	/**
	 *  indicates if scroll polling is started
	 */
	var started = false;


	var innerScroll = $("<div>").attr("id", "InnerScroll").appendTo("#ScrollContainer");
	var scroller = $("<div>").attr("id", "Scroller").appendTo(innerScroll);

	if (Config.MOBILE){
		scroller.height(10000);
	} else {
		scroller.height(50000);
	}

	var scrollSize = scroller.height();
	var scrollHeight = innerScroll.height();

	Window.resize(function(){
		scrollHeight = innerScroll.height();
	});

	//start it off at the right scroll position
	innerScroll.scrollTop(scrollSize * 0.5);

	var lastPosition = scrollSize * 0.5;

	Mediator.route("slowUpdate", function(updateRate){
		if (needsUpdate){
			needsUpdate = false;
			Mediator.send("scroll", scrollPosition, updateRate);
		}
	});

	Mediator.route("update", function(){
		var scrollTop = innerScroll.scrollTop();
		if (started && scrollTop !== lastPosition){
			//the scroll distance
			scrollDistance += Math.abs(lastPosition - scrollTop) / scrollSize;
			//the loop position
			scrollPosition = 1 - scrollTop / scrollSize;
			var loopOffset = 0.05;
			var loopOffsetMult = 1.5;
			if (scrollTop < lastPosition && 
					scrollDirection !== 1 && 
					scrollPosition > loopOffset * loopOffsetMult){
				scrollDirection = 1;
				switchCenterPosition = scrollPosition;
			} else if (scrollTop > lastPosition && 
					scrollDirection !== -1 && 
					scrollPosition < 1 - loopOffset * loopOffsetMult){
				scrollDirection = -1;
				switchCenterPosition = scrollPosition;
			}
			lastPosition = scrollTop;
			if (scrollTop <= 1){
				scrollPosition = 1 - loopOffset;
				innerScroll.scrollTop((1 - scrollPosition) * scrollSize);
			} else if (scrollTop >= scrollSize - scrollHeight - 1){
				scrollPosition = loopOffset;
				innerScroll.scrollTop((1 - scrollPosition) * (scrollSize - scrollHeight));
			}
			needsUpdate = true;
			Mediator.send("rawscroll", scrollPosition);
		} else if (!started){
			innerScroll.scrollTop(lastPosition);
		}
	});


	Mediator.route("start", function(updateRate){
		setTimeout(function(){
			started = true;
		}, 100);
	});

	return {
		/**
		 *  get the position of the scroll
		 *  @return {number} a number -1 at the bottom and 1 at the top
		 */
		getPosition : function() {
			return scrollPosition;
		},
		getDistance : function(){
			return scrollDistance;
		},
		getDirection : function(){
			return scrollDistance;
		},
		getDirectionPosition : function(){
			if (scrollPosition >= switchCenterPosition){
				return TERP.scale(scrollPosition, switchCenterPosition, 1, 0.5, 1);
			} else {
				return TERP.scale(scrollPosition, 0, switchCenterPosition, 0, 0.5);
			}
		},
		scrollTop : function(top){
			if (top){
				top *= scrollSize;
			}
			return innerScroll.scrollTop(top);
		}
	};
});