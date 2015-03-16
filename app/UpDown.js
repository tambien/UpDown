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
		"THREE" : "../deps/three.min",
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
	"visuals/Main", "score/Main", "interface/Main", "effect/Main", "channel/Main"],
 function($, Transport, Mediator, Config, Buffer){
	var coloring = "background: rgb(248, 177, 173); color: rgb(63, 172, 203)";
	console.log("%c↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑", coloring);
	console.log("%c↑      UP/DOWN      ↑", coloring);
	console.log("%c↑        2015       ↑", coloring);
	console.log("%c↓     Yotam Mann    ↓", coloring);
	console.log("%c↓  Sarah Rothberg   ↓", coloring);
	console.log("%c↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓", coloring);


	$("#ScrollContainer").one("mousedown touchstart", function(e){
		e.preventDefault();
		console.log("starting");
		Mediator.send("start");
	});

	$(document).keydown(function(e){
		if (e.keyCode === 32){ //space bar
			e.preventDefault();
			Mediator.send("stop");
		}
	});

	Buffer.onload = function(){
		console.log("loaded");
	};

	var inFocus = true;

	/*$(window).blur(function(){
		if (Transport.state !== "paused" && inFocus){
			Mediator.send("stop");
		}
		inFocus = false;
	});

	$(window).focus(function(){
		if (Transport.state === "paused" && !inFocus){
			Mediator.send("stop");
		}
		inFocus = true;
	});*/

	if (!Config.MOBILE){
		setInterval(function(){
			$("#TransportPosition").text(Transport.position);
		}, 400);
	}
});