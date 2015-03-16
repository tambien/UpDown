define(["jquery", "controller/Mediator", "util/Config"], function($, Mediator, Config){

	if (Config.PASSWORD){

		var password = $("<div>").attr("id", "PassWordScreen").appendTo("body");
		var passwordBox = $("<input>").attr("type", "text").attr("id", "Text").appendTo(password);

		passwordBox.on("input", function(e){
			e.preventDefault();
			if (passwordBox.val() === "computerjazz"){
				password.remove();
				Mediator.send("ready");
			}
		});
	}
});