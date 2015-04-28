define(["Tone/core/Master", "util/Config", "Tone/component/Filter", "controller/Mediator", 
	"Tone/component/Compressor", "interface/GUI", "TERP", "controller/Conductor"], 
	function(Master, Config, Filter, Mediator, Compressor, GUI, TERP, Conductor){

	var compressor = new Compressor({
		"attack" : 0.6,
		"release" : 0.01,
		"threshold" : -8,
		"ratio" : 5,
		"knee" : 8
	});
	var filter = new Filter(20000, "lowpass");
	filter.Q.value = 0;
	filter.connect(compressor);

	//master send/recv
	Master.send(filter);
	Master.receive(compressor);

	//events
	Mediator.route("B", function(time){
		filter.frequency.setCurrentValueNow(time);
		filter.frequency.exponentialRampToValueAtTime(20000, time + " + 2n");
	});

	//test if it's time to transition to the B section
	Mediator.route("scroll", function(){
		var movement = Conductor.getMovement();
		if (movement === 0){
			var bTransition = Conductor.getBTransitionProgress();
			if (bTransition > 0){
				var filterFreq = TERP.scale(bTransition, 20000, 350, 0.5);
				filter.frequency.value = filterFreq;
			}
		} else if (movement === 2) {
			var endTransition = Conductor.getEndTransitionProgress();
			if (endTransition > 0){
				var endFilterFreq = TERP.scale(endTransition, 20000, 350, 0.5);
				filter.frequency.value = endFilterFreq;
			}
		}

	});

	Mediator.route("replay", function(){
		Master.volume.value = 0;
	});

	Mediator.route("pause", function(){
		Master.mute();
	});
	Mediator.route("play", function(){
		Master.unmute();
	});

	if (Config.GUI){
		var folder = GUI.getFolder("Master Effects");
		GUI.addTone2(folder, "Compressor", compressor);
	}
});