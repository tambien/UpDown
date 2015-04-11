define(["jquery", "controller/Mediator", "interface/Window"], function($, Mediator, Window){

	var wentUp = false;

	var wentDown = false;

	var notification = $("<div>").attr("id", "Notification").appendTo(Window.container);

	Mediator.route("scroll", function(position){
		if (position > 0.75 && !wentUp){
			wentUp = true;
		} else if (position < 0.25 && !wentDown){
			wentDown = true;
		}
	});

	Mediator.route("start", function(position){
		//make sure they've scroll both directions
		setTimeout(function(){
			if (!wentUp && !wentDown){
				
			}
		}, 20000);
	});
});