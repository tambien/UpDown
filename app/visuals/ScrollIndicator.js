define(["controller/Mediator", "TERP", "interface/Window"], function(Mediator, TERP, Window){

	var indicator = $("<div>", {"id" : "ScrollIndicator"}).appendTo(Window.container);

	Mediator.route("scroll", function(position){
		var top = TERP.scale(position, Window.height(), 0);
		indicator.css("top", top);
	});
	
});