define(["Tone/core/Master", "util/Config", "Tone/component/Filter", "controller/Mediator", 
	"Tone/component/Compressor", "interface/GUI", "TERP", "controller/Conductor" ,"Tone/component/EQ3", "Tone/component/LFO"], 
	function(Master, Config, Filter, Mediator, Compressor, GUI, TERP, Conductor, EQ3, LFO){

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

		//master filtering
		var midBump = new Filter({
			"frequency" : 540,
			"type" : "peaking",
			"Q" : 0.5
		});


		var lowBump = new Filter({
			"frequency" : 180,
			"type" : "lowshelf",
			"Q" : 2.1,
			"gain" : 6,
		});

		var midLFO = new LFO(3, 3, -10).start();
		var midFreqLFO = new LFO(0.02, 8, 1).start().connect(midLFO.frequency);
		midLFO.connect(midBump.gain);
		// midBump.gain.value = 7;


		window.eq = midBump;
		window.lowBump = lowBump;
		window.midLFO = midLFO;
		// window.highLFO = highLFO;

		Master.chain(filter, midBump, compressor, lowBump);

		//master send/recv
		/*Master.send(filter);
		Master.receive(compressor);*/

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
			GUI.addTone2(folder, "EQ", eq);
			GUI.addTone2(folder, "midLFO", midLFO);
			GUI.addTone2(folder, "lowBump", lowBump);
		}
	}

});