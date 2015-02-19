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

var USE_GUI = false;

require(["jquery", "Tone/core/Transport", "controller/Mediator", "visuals/Main", 
	"score/Main", "interface/Main", "effect/Main", "channel/Main"],
 function($, Transport, Mediator){
	var coloring = "background: rgb(248, 177, 173); color: rgb(63, 172, 203)";
	console.log("%c↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑", coloring);
	console.log("%c↑      UP/DOWN      ↑", coloring);
	console.log("%c↑        2015       ↑", coloring);
	console.log("%c↓     Yotam Mann    ↓", coloring);
	console.log("%c↓  Sarah Rothberg   ↓", coloring);
	console.log("%c↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓", coloring);


	$("#Container").one("mousedown touchstart", function(e){
		console.log("starting");
		Mediator.send("start");
	});

	$(document).keydown(function(e){
		if (e.keyCode === 32){ //space bar
			Mediator.send("stop");
		}
	});

	setInterval(function(){
		$("#TransportPosition").text(Transport.getTransportTime());
	}, 400);
});