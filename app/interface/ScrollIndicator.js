define(["controller/Mediator", "TERP", "interface/Window", "jquery"], function(Mediator, TERP, Window, $){

	var scrollContainer = $("#ScrollContainer");
	var scrollChannel = $("<div>", {"id" : "Channel"}).appendTo(scrollContainer);
	var indicator = $("<div>", {"id" : "Indicator"}).appendTo(scrollChannel);
	var body = $("body");

	var indicatorHeight = indicator.height();

	var channelWidth = scrollChannel.width();

	var inside = false;
	var mousedown = false;
	var ontop = false;

	scrollContainer.on("mousemove", function(e){
		if (Window.width() - e.clientX < channelWidth && !inside){
			inside = true;
			scrollChannel.addClass("Hover");
			body.css({
				"cursor" : "pointer"
			});
		} else if (Window.width() - e.clientX > channelWidth && inside){
			inside = false;
			scrollChannel.removeClass("Hover");
			body.css({
				"cursor" : "default"
			});
		}
	});

	scrollContainer.on("mousedown", function(e){
		if (Window.width() - e.clientX < channelWidth && !mousedown){
			mousedown = true;
			indicator.addClass("Click");
		} 
	});

	scrollContainer.on("mouseup", function(e){
		if (mousedown){
			mousedown = false;
			indicator.removeClass("Click");
		} 
	});

	Mediator.route("rawscroll", function(position){
		var top = TERP.scale(position, Window.height() - indicatorHeight, 0);
		indicator.css({
			"top" : top,
		});
		if (position >= 0.5 && !ontop){
			ontop = true;
			scrollChannel.addClass("Top");
		} else if (position < 0.5 && ontop){
			ontop = false;
			scrollChannel.removeClass("Top");
		}
	});
	
});