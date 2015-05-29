define(["Tone/core/Master", "util/Config", "Tone/component/Filter", "controller/Mediator", 
	"Tone/component/Compressor", "interface/GUI", "TERP", "controller/Conductor" ,"Tone/component/EQ3", 
	"Tone/component/LFO", "Tone/effect/Distortion"], 
	function(Master, Config, Filter, Mediator, Compressor, GUI, TERP, Conductor, EQ3, LFO, Distortion){

	if (!Config.MOBILE){
		var compressor = new Compressor({
			"attack" : 0.6,
			"release" : 0.1,
			"threshold" : -8,
			"ratio" : 3.4,
			"knee" : 24
		});

		var filter = new Filter(20000, "lowpass");
		filter.Q.value = 1;

		var saturation = new Distortion({
			"distortion" : 0.1,
			"wet" : 0.1
		});

		window.saturation = saturation;

		//master filtering


		var lowBump = new Filter({
			"frequency" : 220,
			"type" : "lowshelf",
			"Q" : 2.1,
			"gain" : 6,
		});

		Master.chain(filter, compressor, lowBump, saturation);

		Master.volume.value = 2;

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
			Master.mute = true;
		});
		Mediator.route("play", function(){
			Master.mute = false;
		});

		if (Config.GUI){
			var folder = GUI.getFolder("Master Effects");
			GUI.addTone2(folder, "Compressor", compressor);
			GUI.addTone2(folder, "lowBump", lowBump);
			GUI.addTone2(folder, "saturation", saturation);
		}
	}

});