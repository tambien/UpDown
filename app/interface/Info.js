define(["jquery", "controller/Mediator", "interface/Window", "controller/Analytics", 
	"Tone/core/Master", "util/Config", "info.html", "infoDetail.html"], 
function($, Mediator, Window, Analytics, Master, Config, infoFrag, detailedFrag){

	var expanded = false;

	var infoContainer = $("<div>").attr("id", "InfoContainer")
		.appendTo(Window.container);

	var infoButton = $("<div>").attr("id", "InfoButton")
		.appendTo(infoContainer)
		.text("?")
		.on("click", infoClicked);

	var credits = $("<div>").attr("id", "Credits")
		.appendTo(infoContainer)
		.append(infoFrag);

	credits.find("#MoreInfo").on("click", function(){
		Analytics.event("user", "moreinfo", "clicked");
	});

	var fbook = $("<div>").addClass("icon-facebook-squared social")
		.attr("id", "Facebook")
		.appendTo(credits)
		.on("click", function(e){
			e.preventDefault();
			Analytics.event("user", "facebook", "clicked");
			window.open("https://www.facebook.com/dialog/share?"+
				"app_id=825781467502888"+
				"&display=popup"+
				"&href=http%3A%2F%2Fjazz.computer%2F"+
				"&redirect_uri=http%3A%2F%2Fjazz.computer%2F", 'facebookwindow', 'height=260, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
		});

	var twitter = $("<div>").addClass("icon-twitter-squared social")
		.attr("id", "Twitter")
		.appendTo(credits)
		.on("click", function(e){
			e.preventDefault();
			Analytics.event("user", "twitter", "clicked");
			window.open('http://twitter.com/share?url=' + "http://jazz.computer", 'twitterwindow', 'height=260, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
		});

	function infoClicked(e){
		e.preventDefault();
		if (expanded){
			contract();
		} else {
			expand();
		}
	}

	function expand(){
		if (!expanded){
			Analytics.event("user", "info", "open");
			infoButton.text("X");
			expanded = true;
			infoContainer.addClass("Expanded");	
		}
	}

	function contract(){
		if (expanded){
			infoButton.text("?");
			expanded = false;
			infoContainer.removeClass("Expanded");	
		}
	}

	$(window).on("keydown", function(e){
		if (e.which === 27){ //esc
			e.preventDefault();
			contract();
		}
	});

});