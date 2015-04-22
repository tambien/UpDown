define(["jquery", "controller/Mediator", "interface/Window", "interface/Scroll", "controller/Analytics"], 
	function($, Mediator, Window, Scroll, Analytics){

	var wentUp = false;

	var wentDown = false;

	var sawNotification = false;

	var notification = $("<div>").attr("id", "Notification")
		.appendTo(Window.container)
		.text("Try scrolling the other way.");

	Mediator.route("scroll", function(position){
		if (position > 0.75 && !wentUp){
			wentUp = true;
		} else if (position < 0.25 && !wentDown){
			wentDown = true;
		}
		if (!sawNotification && (!wentUp || !wentDown) && Scroll.getDistance() > 2){
			Analytics.event("interface", "notifications", "otherDirection", wentUp ? 1: 0);
			sawNotification = true;
			notification.fadeTo(500, 1, function(){
				setTimeout(function(){
					notification.fadeTo(500, 0);
				}, 1000);
			});
		}
	});
});