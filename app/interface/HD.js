define(["jquery", "controller/Mediator", "util/Config", "interface/Window"], function ($, Mediator, Config, Window) {

	if (!Config.MOBILE){
		var button = $("<div>").prop("id", "HDButton").appendTo(Window.container).text("HD");

		if (Config.HD){
			button.addClass("HD");
		}

		button.on("click", function(e){
			e.preventDefault();
			if (button.hasClass("HD")){
				button.removeClass("HD");
			} else {
				button.addClass("HD");
			}
			Config.HD = button.hasClass("HD");
			Mediator.send("HD");
		});
	}
});