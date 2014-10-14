require.config({
	baseUrl : "./app",
	paths : {
		"text" : "../deps/text",
		"domReady" : "../deps/domReady",
		"jquery" : "../deps/jquery-2.1.1.min",
		"jquery.mousewheel" : "../deps/jquery.mousewheel",
		"TERP" : "https://rawgit.com/tambien/TERP/master/TERP",
		"Tone" : "../../Tone.js/Tone"
	},
});

require(["jquery", "Tone/core/Transport", "controller/Conductor", "visuals/ScrollIndicator", 
	"score/Bass", "score/Voice", "interface/Scroll", "effect/Main"],
 function($, Transport, Conductor){
	var coloring = "background: rgb(248, 177, 173); color: rgb(63, 172, 203)";
	console.log("%c↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑", coloring);
	console.log("%c↑      UP/DOWN      ↑", coloring);
	console.log("%c↑        2014       ↑", coloring);
	console.log("%c↓     Yotam Mann    ↓", coloring);
	console.log("%c↓  Sarah Rothberg   ↓", coloring);
	console.log("%c↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓", coloring);


	$("#Container").one("mousedown touchstart", function(e){
		console.log("starting");
		Conductor.start();
	});

	Transport.setInterval(function(){
		$("#TransportPosition").text(Transport.getTransportTime());
	}, "4n");
});