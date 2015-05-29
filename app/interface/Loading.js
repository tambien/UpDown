define(["jquery", "controller/Mediator", "Tone/core/Buffer", "loading.scss"], function($, Mediator, Buffer, loadingStyle){

	var loadingScreen = $("<div>").attr("id", "LoadingScreen").appendTo("body");
	var loadingBar = $("<div>").attr("id", "LoadingBar").appendTo(loadingScreen);
	var progressBar = $("<div>").attr("id", "Progress").appendTo(loadingBar);
	var imagesLoaded = false;

	Buffer.onprogress = function(progress){
		var total = 97;
		if (imagesLoaded){
			total = 100;
		}
		progressBar.width((progress * total).toFixed(2) + "%");
	};

	Mediator.route("imageloaded", function(){
		imagesLoaded = true;
	});

	Buffer.onload = function(){
		testAllLoaded();		
	};

	function testAllLoaded(){
		if (imagesLoaded){
			loadingScreen.fadeTo(200, 0, function(){
				loadingScreen.remove();
			});
			Mediator.send("loaded");
		} else {
			setTimeout(testAllLoaded, 100);
		}
	}

});