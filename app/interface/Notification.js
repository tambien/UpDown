define(["jquery", "controller/Mediator", "interface/Window", "interface/Scroll", "controller/Analytics"], 
	function($, Mediator, Window, Scroll, Analytics){

	var scrollDirection = 0;

	var wentDown = false;

	var wentUp = false;

	var sawNotification = false;

	var notification = $("<div>").attr("id", "Notification")
		.appendTo(Window.container);
		// .text("Try scrolling the other way");

	// Mediator.route("scroll", function(position){
		// if (!sawNotification && !(wentUp && wentDown) && Scroll.getDistance() > 1.5){

			// Analytics.event("system", "onedirection", "notification", wentUp ? 1 : 0);
			// sawNotification = true;
			/*notification.fadeTo(500, 1, function(){
				setTimeout(function(){
					notification.fadeTo(500, 0);
				}, 1000);
			});*/
		// }
	// });

	var endCount = 0;

	Mediator.route("scrollEnd", function(){
		endCount++;
		if (!sawNotification && endCount > 15 && !(wentUp && wentDown)){
			sawNotification = true;
			var dir = Scroll.getDirection();
			var classNames = "Animate ";
			if (dir === 1){
				classNames += "icon-down-big";
			} else {
				classNames += "icon-up-big";
			}
			notification.addClass(classNames).fadeTo(500, 1);
			Analytics.event("user", "scrollend", "notification", dir);
		}
	});

	Mediator.route("half", function(half){
		if (half === 0){
			wentDown = true;
		} else if (half === 1){
			wentUp = true;
		}
		if (sawNotification){
			notification.fadeTo(500, 0, function(){
				notification.remove();
			});
		}
	});

	Mediator.route("flip", function(half){
		if (sawNotification){
			notification.fadeTo(500, 0, function(){
				notification.remove();
			});
		}
	});
});