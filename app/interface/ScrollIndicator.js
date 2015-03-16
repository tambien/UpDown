define(["controller/Mediator", "TERP", "interface/Window", "jquery", "interface/Scroll"], 
	function(Mediator, TERP, Window, $, Scroll){

	var scrollContainer = $("#ScrollContainer");
	var scrollChannel = $("<div>", {"id" : "Channel"}).appendTo(scrollContainer);
	var indicator = $("<div>", {"id" : "Indicator"}).appendTo(scrollChannel);
	var body = $("body");

	var indicatorHeight = indicator.height();

	var channelWidth = scrollChannel.width();
	var channelHeight = scrollChannel.height();

	var inside = false;
	var mousedown = false;
	var ontop = false;

	var dragging = false;

	Window.resize(function(){
		channelHeight = scrollChannel.height();
	});

	indicator.on("mousedown touchdown", function(e){
		e.preventDefault();
		dragging = true;
		indicator.addClass("Dragging");
	});

	scrollChannel.on("mouseup mouseleave touchend", function(e){
		dragging = false;
		indicator.removeClass("Dragging");
	});

	scrollChannel.on("mousemove touchmove", function(e){
		e.preventDefault();
		if (dragging){
			var position = e.clientY / channelHeight;
			Scroll.scrollTop(position);
		}
	});

	Mediator.route("rawscroll", function(position){
		var top = TERP.scale(position, Window.height() - indicatorHeight, 0);
		indicator.css({
			"top" : top,
		});
	});
	
});