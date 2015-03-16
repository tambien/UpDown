define(["jquery", "controller/Mediator", "util/Config"], function($, Mediator, Config){

	var background = $("<div>").attr("id", "SplashBackground").appendTo("body");

	var firstPage = $("<div>").attr("id", "First")
		.addClass("SplashPage")
		.appendTo(background);
	var firstText = $("<div>").attr("id", "Text").appendTo(firstPage)
		.text("interactive music: please adjust your volume");

	var secondPage = $("<div>").attr("id", "Second")
		.addClass("SplashPage")
		.appendTo(background);
	var secondText = $("<div>").attr("id", "Text").appendTo(secondPage)
		.text("scroll to advance the song.");

	Mediator.route("ready", function(){
		var fadeTime = 500;
		var waitTime = 2000;
		firstPage.fadeTo(fadeTime, 1, function(){
			setTimeout(function(){
				firstPage.fadeTo(fadeTime, 0, function(){
					secondPage.fadeTo(fadeTime, 1, function(){
						setTimeout(function(){
							background.fadeTo(fadeTime, 0, function(){
								background.remove();
							});
						}, waitTime);
					});
				});
			}, waitTime);
		});
	});

});