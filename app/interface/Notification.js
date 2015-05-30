define(["jquery", "controller/Mediator", "interface/Window", "interface/Scroll", 
	"controller/Analytics", "notification.html", "buttons.scss", "notification.scss", "util/Config"], 
	function($, Mediator, Window, Scroll, Analytics, notificationHtml, buttonStyle, notificationStyle, Config){

	var scrollDirection = 0;

	var wentDown = false;

	var wentUp = false;

	var notifications = {
		"changeDirection" : false,
		"clicking" : false,
		"faster" : false,
		"nicemoves" : false,
		"bsection" : false,
		"bintro" : false,
		"csection" : false
	};

	var notificationButton = $(notificationHtml).appendTo(Window.container)
		.on("click touchstart", function(){
			$(this).addClass("Expanded");
			$(this).removeClass("Notified");
		})
		.on("mouseleave", function(){
			$(this).removeClass("Expanded");
		});

	var onScreenNotifications = [];

	function showNotification(text){
		if (!Config.MOBILE){
			notificationButton.addClass("Notified");
			var notificationBox = $("<div>", {
				"class" : "Notification",
				"html" : text
			}).appendTo(Window.container);

			$("<img>", {
				"src" : "./images/thumb.png"
			}).appendTo(notificationBox);


			var bottomposition = 25;
			if (onScreenNotifications.length > 0){
				var lastNotif = onScreenNotifications[onScreenNotifications.length - 1];
				bottomposition += parseInt(lastNotif.height()) + parseInt(lastNotif.css("bottom")) + 20;
				if (bottomposition > Window.height() - notificationBox.height() - 20){
					bottomposition = 25;
				}
			}

			notificationBox.css("bottom", bottomposition);

			onScreenNotifications.push(notificationBox);

			notificationBox.on("animationend webkitAnimationEnd", function(){
				notificationBox.remove();
				for (var i = 0; i < onScreenNotifications.length; i++){
					if (onScreenNotifications[i] === notificationBox){
						onScreenNotifications.splice(i, 1);
						break;
					}
				}
			});

			setTimeout(function(){
				notificationBox.addClass("Show");
			}, 10);
		}
	}

	/**
	 *  THE NOTIFICATION EVENTS
	 */

	//SCROLL THE OTHER WAY NOTIFICATION
	var endCount = 0;
	Mediator.route("scrollEnd", function(){
		endCount++;
		if (endCount > 12 && !notifications.changeDirection){
			endCount = 0;
			var dir = Scroll.getDirection() > 0 ? "top" : "bottom";
			notifications.changeDirection = true;
			showNotification("Reminder: You can scroll in both directions.");
			Analytics.event("user", "notification", "scrollend", dir);
		}
	});
	Mediator.route("half", function(half){
		endCount = 0;
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
			// showNotification("<strong>Jazz.Computer</strong> commented on your scroll.");
			// Analytics.event("user", "notification", "nicemoves");
		}
	});

	var started = false;
	Mediator.route("start", function(){
		started = true;
		setTimeout(function(){
			if (Scroll.getDistance() === 0){
				showNotification("Scroll to advance the song.");
			}
		}, 1500);
		setTimeout(function(){
			if (Scroll.getDistance() === 0){
				showNotification("Reminder: Don't forget to scroll.");
			}
		}, 6000);
	});

	Mediator.route("play", function(){
		showNotification("Unpaused");
	});

	Mediator.route("pause", function(){
		showNotification("Paused");
	});

	//clicks
	var clickCount = 0;
	$("#ScrollContainer").on("mousedown", function(){
		if (started){
			clickCount++;
			if (clickCount > 3){
				showNotification("Reminder: Don't forget to scroll.");
				Analytics.event("user", "notification", "clicks");
				clickCount = 0;
			}
		}
	});

	//HD
	Mediator.route("HD", function(hd){
		showNotification("High Definition "+(hd?"ON." : "OFF."));
	});

	//encouraging messages
	Mediator.route("firstScroll", function(){
		setTimeout(function(){
			if (Scroll.getDistance() < 0.1){
				showNotification("Reminder: Keep Scrolling.");
				Analytics.event("user", "notification", "keepscrolling");
			} else {
				showNotification("<strong>Jazz.Computer</strong> liked your scroll.");
			}
		}, 5000);

		setTimeout(function(){
			if (Scroll.getDistance() < 0.5){
				showNotification("<strong>Jazz.Computer</strong> invited you to an event <strong>Scroll Faster</strong>. ");
				Analytics.event("user", "notification", "scrollon");
			} else {
				showNotification("<strong>Jazz.Computer</strong> commented on your scroll: \"nice!\"");
			}
		}, 15000);

		setTimeout(function(){
			if (Scroll.getDistance() < 1){
				showNotification("<strong>Jazz.Computer</strong> shared a link: <strong>www.scrollmore.com</strong>");
				Analytics.event("user", "notification", "moresong");
			} else if (Scroll.getDistance() < 2){
				showNotification("<strong>Jazz.Computer</strong> commented on your scroll: \"there's more.\"");
				Analytics.event("user", "notification", "theresmore");
			}
		}, 40000);
	});

	Mediator.route("B", function(){
		if (!notifications.bsection){
			notifications.bsection = true;
			showNotification("Today is <strong>Jazz.Computer</strong>'s Birthday!");
		}
	});

	Mediator.route("BTransitionStart", function(){
		if (!notifications.bintro){
			notifications.bintro = true;
			showNotification("You'll never believe what happens next.");
		}
	});

	Mediator.route("C", function(){
		if (!notifications.csection){
			notifications.csection = true;
			showNotification("<strong>Jazz.Computer</strong> is going to an event <strong>Welcome Back</strong>.");
		}
	});
});