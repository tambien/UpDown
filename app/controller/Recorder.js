define(["controller/Mediator", "util/Config", "interface/Scroll"], function(Mediator, Config, Scroll){

	"use strict";

	var scrollHistory = [];

	var updateRate = 100;
	var paused = false;
	var recording = false;

	function setScroll(position){
		// if ()
	}

	Mediator.route("start", function(position){
		setInterval(function(){
			if (!paused){
				if (recording){
					scrollHistory.push(Scroll.getPosition());
				} else {
					/*Scroll.setPosition(scrollHistory[historyPosition]);
					historyPosition++;*/
				}
			}
		}, updateRate);
	});

	Mediator.route("play", function(){
		paused = true;
	});

	Mediator.route("pause", function(){
		paused = false;
	});

	Mediator.route("record", function(){
		$(window).on('beforeunload', function(e) {
		    e.returnValue = "You have a recording in progress";
		    return message;
		});
	});

});