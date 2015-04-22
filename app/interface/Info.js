define(["jquery", "controller/Mediator", "interface/Window", "controller/Analytics", "Tone/core/Master", "util/Config"], 
function($, Mediator, Window, Analytics, Master, Config){

	var expanded = false;

	var infoContainer = $("<div>").attr("id", "InfoContainer")
		.appendTo(Window.container);

	var infoButton = $("<div>").attr("id", "InfoButton")
		.appendTo(infoContainer)
		.text("?")
		.on("click", infoClicked);

	var credits = $("<div>").attr("id", "Credits")
		.appendTo(infoContainer)
		.append("Up/Down is an interactive song by  <a href='http://yotammann.info'>Yotam Mann</a> with visual design "+
				"by <a href='http://sarahrothberg.com'>Sarah Rothberg</a>.<br><br>"+
				// "Everything you hear is generated live in the browser. No pre-recorded synths or effects.<br><br>"+ 
				"Special thanks to Gabe Liberti for production help.<br><br>" +
				"Up/Down was developed using <a href='http://tonejs.org'>Tone.js</a> and <a href='http://threejs.org'>Three.js</a><br><br>");

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
			infoButton.text("X");
			expanded = true;
			Master.mute();
			infoContainer.addClass("Expanded");	
		}
	}

	function contract(){
		if (expanded){
			infoButton.text("?");
			expanded = false;
			Master.unmute();
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