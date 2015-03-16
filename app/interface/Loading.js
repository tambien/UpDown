define(["jquery", "controller/Mediator", "Tone/core/Buffer"], function($, Mediator, Buffer){

	var loadingScreen = $("<div>").attr("id", "LoadingScreen").appendTo("body");
	var loadingBar = $("<div>").attr("id", "LoadingBar").appendTo(loadingScreen);
	var progressBar = $("<div>").attr("id", "Progress").appendTo(loadingBar);

	Buffer.onprogress = function(progress){
		progressBar.width((progress * 100).toFixed(2) + "%");
	};

	Buffer.onload = function(){
		loadingScreen.remove();
		Mediator.send("loaded");
	};

});