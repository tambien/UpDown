define(["domReady!", "controller/Mediator", "util/Config", "interface/Window", "TERP", "jquery.mousewheel", "interface/GUI"], 
	function(ready, Mediator, Config, Window, TERP, mousewheel, GUI){

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

	var scrollHeight = 30000;

	var pageHeight = 0;

	var scrollContainer = $("#ScrollContainer");

	if (Config.MOBILE){
		var innerScroll = $("<div>").attr("id", "InnerScroll").appendTo(scrollContainer);
		var scroller = $("<div>").attr("id", "Scroller").appendTo(innerScroll);
		scrollHeight = 5000;
		scroller.height(scrollHeight);
		innerScroll.scrollTop(scrollHeight * 0.5);
		pageHeight = innerScroll.height();
	}

	var lastPosition = scrollHeight * 0.5;

	var scrollTop = lastPosition;

	$(window).mousewheel(function(e, x){
		if (started){
			scrollTop = lastPosition - x;
		}
	});

	//start it off at the right scroll position
	// innerScroll.scrollTop(scrollHeight * 0.5);

	Mediator.route("slowUpdate", function(updateRate){
		if (needsUpdate){
			needsUpdate = false;
			Mediator.send("scroll", scrollPosition, updateRate);
		}
	});

	Mediator.route("B", function(updateRate){
		scrollContainer.addClass("B");
	});

	Mediator.route("C", function(updateRate){
		scrollContainer.removeClass("B");
	});

	Mediator.route("update", function(){
		if (Config.MOBILE){
			scrollTop = innerScroll.scrollTop();
		}
		if (started && scrollTop !== lastPosition){
			scrollDistance += Math.abs(lastPosition - scrollTop) / scrollHeight;
			//the loop position
			scrollPosition = 1 - scrollTop / (scrollHeight - pageHeight);
			var loopOffset = 0.05;
			var loopOffsetMult = 1.5;
			if (scrollTop < lastPosition && 
					scrollDirection !== 1 && 
					scrollPosition > loopOffset * loopOffsetMult){
				scrollDirection = 1;
				// console.log(scrollDirection);
				switchCenterPosition = scrollPosition;
			} else if (scrollTop > lastPosition && 
					scrollDirection !== -1 && 
					scrollPosition < 1 - loopOffset * loopOffsetMult){
				scrollDirection = -1;
				// console.log(scrollDirection);
				switchCenterPosition = scrollPosition;
			}
			lastPosition = scrollTop;
			if (scrollTop <= 1){
				scrollPosition = 1 - loopOffset;
				lastPosition = (1 - scrollPosition) * scrollHeight;
				Mediator.send("scrollEnd");
				if (Config.MOBILE){
					innerScroll.scrollTop(lastPosition);
				}
			} else if (scrollTop >= scrollHeight - pageHeight - 1){
				scrollPosition = loopOffset;
				lastPosition = (1 - scrollPosition) * scrollHeight;
				Mediator.send("scrollEnd");
				if (Config.MOBILE){
					innerScroll.scrollTop(lastPosition - pageHeight);
				}
			}
			needsUpdate = true;
			Mediator.send("rawscroll", scrollPosition);
		} 
	});


	Mediator.route("start", function(updateRate){
		setTimeout(function(){
			started = true;
		}, 100);
	});

	Mediator.route("replay", function(){
		scrollTop = 0.5 * scrollHeight;
		lastPosition = scrollTop;
		scrollDistance = 0;
		scrollPosition = 0.5;
		Mediator.send("rawscroll", 0.5);
		Mediator.send("scroll", 0.5);
	});

	return {
		setPosition : function(pos) {
			scrollDistance = pos;
		},
		/**
		 *  get the position of the scroll
		 *  @return {number} a number 0 at the bottom and 1 at the top
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
				top *= scrollHeight;
				scrollTop = top;
			}
			return scrollTop;
		}
	};
});