define(["jquery", "controller/Mediator", "util/Config", "interface/Window", "controller/Analytics"], 
function($, Mediator, Config, Window, Analytics){

	var endContainer = $("<div>").attr("id", "End").appendTo(Window.container);

	var fbook = $("<div>").addClass("icon-facebook-squared social")
		.attr("id", "Facebook")
		.appendTo(endContainer)
		.on("click", function(e){
			e.preventDefault();
			Analytics.event("interface", "social", "facebook");
			window.open("https://www.facebook.com/dialog/share?"+
				"app_id=825781467502888"+
				"&display=popup"+
				"&href=http%3A%2F%2Fjazz.computer%2F"+
				"&redirect_uri=http%3A%2F%2Fjazz.computer%2F", 'facebookwindow', 'height=260, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
		});

	var twitter = $("<div>").addClass("icon-twitter-squared social")
		.attr("id", "Twitter")
		.appendTo(endContainer)
		.on("click", function(e){
			e.preventDefault();
			Analytics.event("interface", "social", "twitter");
			window.open('http://twitter.com/share?url=' + "http://jazz.computer", 'twitterwindow', 'height=260, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
		});

	var replay = $("<div>")
		.attr("id", "Replay")
		.appendTo(endContainer)
		.text("REPLAY")
		.on("click", function(e){
			e.preventDefault();
			Analytics.event("interface", "transport", "replay");
			Mediator.send("replay");
			endContainer.removeClass("Visible");
		});

	Mediator.route("end", function(){
		endContainer.addClass("Visible");
	});

});

/*

 */