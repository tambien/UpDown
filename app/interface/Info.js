define(["jquery", "controller/Mediator", "interface/Window", "controller/Analytics", 
	"Tone/core/Master", "util/Config", "text!fragment/info.html", "text!fragment/infoDetail.html"], 
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
		Analytics.event("interface", "info", "moreinfo");
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
			Analytics.event("interface", "info", "expanded");
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