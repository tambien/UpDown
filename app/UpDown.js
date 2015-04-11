require.config({
	baseUrl : "./app",
	paths : {
		"text" : "../deps/text",
		"domReady" : "../deps/domReady",
		"jquery" : "../deps/jquery-2.1.1.min",
		"jquery.mousewheel" : "../deps/jquery.mousewheel",
		"TERP" : "../deps/TERP",
		"Tone" : "../../Tone.js/Tone",
		"TWEEN" : "../deps/tween.min",
		"Stats" : "../deps/Stats",
		"requestAnimationFrame" : "../deps/requestAnimationFrame",
		"dat" : "../deps/dat.gui",
		"THREE" : "https://cdnjs.cloudflare.com/ajax/libs/three.js/r71/three.js"
	},
	shim : {
		"dat" : {
			exports : "dat"
		},
		"TWEEN" : {
			exports : "TWEEN"
		},
		"Stats" : {
			exports : "Stats"
		},
		"THREE" : {
			exports : "THREE"
		}
	}
});

require(["jquery", "Tone/core/Transport", "controller/Mediator", "util/Config", "Tone/core/Buffer", 
	"visuals/Main", "score/Main", "interface/Main", "effect/Main", "channel/Main", 
	"interface/StartButton", "controller/Analytics"],
 function($, Transport, Mediator, Config, Buffer){
	var coloring = "background: rgb(248, 177, 173); color: rgb(63, 172, 203)";
	console.log("%c      UP/DOWN      ", coloring);
	console.log("%c        2015       ", coloring);
	console.log("%c     Yotam Mann    ", coloring);
	console.log("%c  Sarah Rothberg   ", coloring);

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

	if (!Config.PASSWORD){
		Mediator.send("ready");
	}
});