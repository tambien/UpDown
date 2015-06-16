require(["jquery", "Tone/core/Transport", "controller/Mediator", "util/Config", "Tone/core/Buffer", "interface/Window",
	"visuals/Main", "score/Main", "interface/Main", "effect/Main", "channel/Main", 
	"interface/StartButton", "controller/Analytics", "main.scss"],
 function($, Transport, Mediator, Config, Buffer, Window){
	var coloring = "background: rgb(248, 177, 173); color: rgb(63, 172, 203)";
	console.log("%c   Jazz.Computer   ", coloring);
	console.log("%c        2015       ", coloring);
	console.log("%c     Yotam Mann    ", coloring);
	console.log("%c  Sarah Rothberg   ", coloring);

	console.log("src: https://github.com/tambien/UpDown");

	if (Config.STATS){
		setInterval(function(){
			$("#TransportPosition").text(Transport.position);
		}, 400);
	}

	var firstScroll = false;
	Mediator.route("scroll", function(){
		if (!firstScroll){
			firstScroll = true;
			Mediator.send("firstScroll");
		}
	});

	Mediator.route("replay", function(){
		firstScroll = false;
	});

	//add the logo
	$("<div>", {
		"id" : "Logo"
	}).appendTo(Window.container);

	if (!Config.PASSWORD){
		Mediator.send("ready");
	}
});