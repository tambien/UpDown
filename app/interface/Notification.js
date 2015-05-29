define(["jquery", "controller/Mediator", "interface/Window", "interface/Scroll", 
	"controller/Analytics", "notification.html", "buttons.scss", "notification.scss"], 
	function($, Mediator, Window, Scroll, Analytics, notificationHtml, buttonStyle, notificationStyle){

	var scrollDirection = 0;

	var wentDown = false;

	var wentUp = false;

	var notifications = {
		"changeDirection" : false,
		"clicking" : false,
		"faster" : false,
		"nicemoves" : false,
		"bsection" : false,
	};

	var notificationButton = $(notificationHtml).appendTo(Window.container)
		.on("click touchstart", function(){
			$(this).addClass("Expanded");
			$(this).removeClass("Notified");
		})
		.on("mouseleave", function(){
			$(this).removeClass("Expanded");
		});

	function showNotification(text){
		notificationButton.addClass("Notified");
		var notificationBox = $("<div>", {
			"class" : "Notification",
			"text" : text
		}).appendTo(Window.container);

		notificationBox.on("animationend", function(){
			notificationBox.remove();
		});

		setTimeout(function(){
			notificationBox.addClass("Show");
		}, 10);
	}

	/**
	 *  THE NOTIFICATION EVENTS
	 */

	//SCROLL THE OTHER WAY NOTIFICATION
	var endCount = 0;
	Mediator.route("scrollEnd", function(){
		endCount++;
		if (endCount > 8){
			endCount = 0;
			notifications.changeDirection = true;
			var dir = Scroll.getDirection() > 0 ? "top" : "bottom";
			showNotification("you hit the "+dir+". scroll the other way!");
			Analytics.event("user", "notification", "scrollend", dir);
		}
	});
	Mediator.route("half", function(half){
		if (half === 0){
			wentDown = true;
		} else if (half === 1){
			wentUp = true;
		}
	});
	Mediator.route("flip", function(half){
		// if (notifications.changeDirection){
			//notify that they did it right	
			// showNotification("yes. like that");
		// }
		if (wentUp && wentDown && !notifications.nicemoves){
			notifications.nicemoves = true;
			showNotification("nice moves");	
		}
	});

	var started = false;
	Mediator.route("start", function(){
		started = true;
		setTimeout(function(){
			if (Scroll.getDistance() === 0){
				showNotification("scroll to advance the music");
			}
		}, 1000);
		setTimeout(function(){
			if (Scroll.getDistance() === 0){
				showNotification("SCROLL!");
			}
		}, 5000);
	});

	Mediator.route("play", function(){
		showNotification("unpaused");
	});

	Mediator.route("pause", function(){
		showNotification("paused");
	});

	//clicks
	var clickCount = 0;
	$("#ScrollContainer").on("mousedown", function(){
		if (started){
			clickCount++;
			if (clickCount > 5){
				showNotification("don't click. just scroll.");
				Analytics.event("user", "notification", "clicks");
				clickCount = 0;
			}
		}
	});

	//HD
	Mediator.route("HD", function(hd){
		showNotification("high definition "+(hd?"ON" : "OFF"));
	});

	//encouraging messages
	Mediator.route("firstScroll", function(){
		setTimeout(function(){
			if (Scroll.getDistance() < 0.1){
				showNotification("KEEP SCROLLING!");
				Analytics.event("user", "notification", "keepscrolling");
			} else {
				showNotification("good pace. keep scrolling.");
			}
		}, 5000);

		setTimeout(function(){
			if (Scroll.getDistance() < 0.5){
				showNotification("there's more. scroll on.");
				Analytics.event("user", "notification", "scrollon");
			} else {
				showNotification("always be scrolling");
			}
		}, 15000);

		setTimeout(function(){
			if (Scroll.getDistance() < 1){
				showNotification("more scroll. more song.");
				Analytics.event("user", "notification", "moresong");
			} else if (Scroll.getDistance() < 2){
				showNotification("there's more");
				Analytics.event("user", "notification", "theresmore");
			}
		}, 40000);
	});

	Mediator.route("B", function(){
		if (!notifications.bsection){
			notifications.bsection = true;
			showNotification("woah. new section.");
		}
	});

	Mediator.route("C", function(){
		showNotification("back here");
	});
});