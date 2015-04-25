define(["jquery", "controller/Mediator", "interface/Window", "interface/Scroll", "controller/Analytics"], 
	function($, Mediator, Window, Scroll, Analytics){

	var scrollDirection = 0;

	var wentDown = false;

	var wentUp = false;

	var sawNotification = false;

	var notification = $("<div>").attr("id", "Notification")
		.appendTo(Window.container)
		.text("Try scrolling the other way");

	Mediator.route("scroll", function(position){
		if (!sawNotification && !(wentUp && wentDown) && Scroll.getDistance() > 1.5){
			Analytics.event("interface", "notifications", "otherDirection", wentUp ? 1 : 0);
			sawNotification = true;
			/*notification.fadeTo(500, 1, function(){
				setTimeout(function(){
					notification.fadeTo(500, 0);
				}, 1000);
			});*/
		}
	});

	Mediator.route("half", function(half){
		if (half === 0){
			wentDown = true;
		} else if (half === 1){
			wentUp = true;
		}
	});
});