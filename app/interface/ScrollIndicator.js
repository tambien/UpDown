define(["controller/Mediator", "TERP", "interface/Window", "jquery", "interface/Scroll", "util/Config", "scroll.scss"], 
	function(Mediator, TERP, Window, $, Scroll, Config, scrollStyle){

	var scrollContainer = $("#ScrollContainer");
	var scrollChannel = $("<div>", {"id" : "Channel"}).appendTo(scrollContainer);
	var indicator = $("<div>", {"id" : "IndicatorContainer"}).appendTo(scrollChannel);
	var indicatorBar = $("<div>", {"id" : "Indicator"}).appendTo(indicator);
	var buble = $("<div>", {"id" : "Bubble"}).appendTo(indicator);
	var body = $("body");

	var indicatorHeight = indicator.height();

	var channelWidth = scrollChannel.width();
	var channelHeight = scrollChannel.height();

	var inside = false;
	var mousedown = false;
	var ontop = false;

	var dragging = false;

	//initial position
	var top = TERP.scale(0.5, Window.height() - indicatorHeight, 0);
	indicator.css({
		"transform" : "translateY("+top+"px)",
	});

	Window.resize(function(){
		channelHeight = scrollChannel.height();
		if (Scroll.isStarted() && !Config.MOBILE){
			indicator.css({
				"width" : Window.width() + channelWidth
			});
		}
	});

	indicator.on("mousedown", function(e){
		e.preventDefault();
		e.stopPropagation();
		dragging = true;
		indicator.addClass("Dragging");
	});

	scrollContainer.on("mouseup", function(e){
		if (dragging){
			e.preventDefault();
			dragging = false;
			indicator.removeClass("Dragging");
		}
	});

	scrollContainer.on("mousemove", function(e){
		if (dragging){
			e.preventDefault();
			var position = e.clientY / channelHeight;
			Scroll.scrollTop(position);
		}
	});

	Mediator.route("rawscroll", function(position){
		var top = TERP.scale(position, Window.height() - indicatorHeight, 0);
		indicator.css({
			"transform" : "translateY("+top+"px)",
		});
	});

	Mediator.route("start", function(){
		scrollContainer.css("background-color", "rgba(0, 0, 0, 0.0)");
		if (!Config.MOBILE){
			indicator.css({
				"width" : Window.width() + channelWidth
			});
		}
	});

	// Mediator.route("scrollEnd", scrollFlash);
	function scrollFlash(){
		scrollChannel.addClass("Highlight");
		setTimeout(function(){
			scrollChannel.removeClass("Highlight");
		}, 100);
	}
});