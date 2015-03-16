define(["jquery", "controller/Mediator", "util/Config", "Tone/core/Tone"], function($, Mediator, Config, Tone){
	var startButton = $("<div>").attr("id", "StartButton").appendTo("body");
	var triangle = $("<div>").attr("id", "Triangle").appendTo(startButton);
	var pause0 = $("<div>").attr("id", "Pause0").addClass("PauseBar").appendTo(startButton);
	var pause1 = $("<div>").attr("id", "Pause1").addClass("PauseBar").appendTo(startButton);

	var started = false;

	var playing = false;

	$(document).keydown(function(e){
		if (started && e.keyCode === 32){ //space bar
			e.preventDefault();
			if (playing){
				Mediator.send("pause");
			} else {
				Mediator.send("play");
			}
		}
	});

	Mediator.route("play", function(){
		startButton.addClass("Playing");
		playing = true;

	});

	Mediator.route("pause", function(){
		startButton.removeClass("Playing");
		playing = false;
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
			if (started){
				if (playing){
					Mediator.send("pause");
				} else {
					Mediator.send("play");
				}
			}
		});
	});
});