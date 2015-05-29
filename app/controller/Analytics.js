define(["controller/Mediator", "interface/Scroll", "controller/Conductor", "util/Config"], 
	function(Mediator, Scroll, Conductor, Config){

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

	/**
	 *  error listening
	 */
	window.onerror = function(msg, file, lineno){
		var filePath = file.split("/");
		file = filePath[filePath.length - 1];
		sendEvent("error", msg, file +" "+ lineno);
	};

	var lastSection = Date.now();

	//setup some timed events
	Mediator.route("start", function(){
		sendEvent("user", "start", "click", Date.now() - lastSection);
		lastSection = Date.now();
	});

	Mediator.route("B", function(){
		sendEvent("song", "B", "change", Date.now() - lastSection);
		lastSection = Date.now();
	});

	Mediator.route("C", function(){
		sendEvent("song", "C", "change", Date.now() - lastSection);
		lastSection = Date.now();
	});

	Mediator.route("end", function(){
		sendEvent("song", "end", "change", Date.now() - lastSection);
		lastSection = Date.now();
	});

	Mediator.route("pause", function(){
		sendEvent("user", "pause", "any");
	});

	Mediator.route("HD", function(){
		sendEvent("user", "HD", "turned"+Config.HD ? "on" : "off");
	});

	Mediator.route("play", function(){
		sendEvent("user", "play", "any");
	});

	Mediator.route("flip", function(){
		sendEvent("song", "flip", "change");
	});

	var startLoading = Date.now();
	Mediator.route("loaded", function(){
		sendEvent("system", "loaded", "done", Date.now() - startLoading);
	});

	return {
		event : sendEvent
	};
});