define(["jquery", "controller/Mediator", "util/Config", "Tone/core/Tone"], function($, Mediator, Config, Tone){
	var startButton = $("<div>").attr("id", "StartButton").appendTo("body");
	var triangle = $("<div>").attr("id", "Triangle").appendTo(startButton);
	var pause0 = $("<div>").attr("id", "Pause0").addClass("PauseBar").appendTo(startButton);
	var pause1 = $("<div>").attr("id", "Pause1").addClass("PauseBar").appendTo(startButton);

	var started = false;

	var playing = false;

	var transportStarted = false;

	Mediator.route("firstScroll", function(){
		transportStarted = true;
	});

	$(document).keydown(function(e){
		if (transportStarted){
			if (started && e.keyCode === 32){ //space bar
				e.preventDefault();
				if (playing){
					Mediator.send("pause");
				} else {
					Mediator.send("play");
				}
			}
		}
	});

	if (Config.PAUSE_ON_BLUR){
		var inFocus = true;

		$(window).blur(function(){
			if (playing && inFocus){
				Mediator.send("pause");
			}
			inFocus = false;
		});

		$(window).focus(function(){
			inFocus = true;
		});
	}

	Mediator.route("play", function(){
		startButton.addClass("Playing");
		playing = true;
	});

	Mediator.route("pause", function(){
		startButton.removeClass("Playing");
		playing = false;
	});

	Mediator.route("end", function(){
		transportStarted = false;
		startButton.fadeTo(500, 0, function(){
			startButton.remove();
		});
	});

	Mediator.route("replay", function(){
		Mediator.send("start");
		startButton.appendTo("body");
		startButton.fadeTo(500, 1);
	});

	startButton.one("mousedown touchstart", function(e){
		e.preventDefault();
		Mediator.send("start");
		if (Config.MOBILE){
			Tone.startMobile();
			startButton.addClass("MobileCorner");
		} else {
			startButton.addClass("Corner");
		}
		startButton.addClass("Playing");
		started = true;
		playing = true;
		startButton.on("mousedown touchstart", function(e){
			e.preventDefault();
			if (started && transportStarted){
				if (playing){
					Mediator.send("pause");
				} else {
					Mediator.send("play");
				}
			}
		});
	});
});