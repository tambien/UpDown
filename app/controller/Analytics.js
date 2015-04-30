define(["controller/Mediator", "domReady!", "interface/Scroll", "controller/Conductor", "util/Config", "jquery"], 
	function(Mediator, doc, Scroll, Conductor, Config, $){

	(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,"script","//www.google-analytics.com/analytics.js","ga");

	if (ga && Config.ANALYTICS){
		ga("create", "UA-61158479-1", "auto");
		ga("send", "pageview");
	}

	function sendEvent(category, action, label, value){
		if (ga && Config.ANALYTICS){
			ga("send", "event", category, action, label, value);
		}
	}

	window.onerror = function(msg){
		sendEvent("error", "javascript", msg);
	};

	var lastSection = Date.now();

	//setup some timed events
	Mediator.route("start", function(){
		sendEvent("interface", "transport", "start", Date.now() - lastSection);
		lastSection = Date.now();
	});

	Mediator.route("B", function(){
		sendEvent("song", "section", "B", Date.now() - lastSection);
		lastSection = Date.now();
	});

	Mediator.route("C", function(){
		sendEvent("song", "section", "C", Date.now() - lastSection);
		lastSection = Date.now();
	});

	Mediator.route("end", function(){
		sendEvent("song", "section", "end", Date.now() - lastSection);
		lastSection = Date.now();
	});

	Mediator.route("pause", function(){
		sendEvent("interface", "transport", "pause");
	});

	Mediator.route("play", function(){
		sendEvent("interface", "transport", "play");
	});

	Mediator.route("flipped", function(){
		sendEvent("song", "interaction", "flip");
	});

	var startLoading = Date.now();
	Mediator.route("loaded", function(){
		sendEvent("system", "timing", "loaded", Date.now() - startLoading);
	});

	return {
		event : sendEvent
	};
});