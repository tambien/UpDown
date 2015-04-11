define(["jquery", "controller/Mediator", "util/Config"], function($, Mediator, Config){

	if (Config.SPLASH){

		var background = $("<div>").attr("id", "SplashBackground").appendTo("body");

	/*	var firstPage = $("<div>").attr("id", "First")
			.addClass("SplashPage")
			.appendTo(background);
		var firstText = $("<div>").attr("id", "Text").appendTo(firstPage);*/
			// .text("play interactive music");

		var secondPage = $("<div>").attr("id", "Second")
			.addClass("SplashPage")
			.appendTo(background);
		var secondText = $("<div>").attr("id", "Text").appendTo(secondPage)
			.append("<span class='arrow'>&uarr;</span>scroll to advance the music<span class='arrow'>&darr;</span>");

		if (Config.MOBILE){
			secondText.append("<br><span id='MobileDisclaimer'>for the full experience, use a desktop browser.</span>");
		}

		Mediator.route("ready", function(){
			var fadeTime = 500;
			var waitTime = 2000;
			/*firstPage.fadeTo(fadeTime, 1, function(){
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
			});*/
			secondPage.fadeTo(fadeTime, 1, function(){
				setTimeout(function(){
					background.fadeTo(fadeTime, 0, function(){
						background.remove();
					});
				}, waitTime);
			});
		});
	}

});