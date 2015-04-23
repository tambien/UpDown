define(["Tone/instrument/MonoSynth", "Tone/core/Master", "Tone/component/Filter", 
	"preset/BassSoundA", "preset/BassSoundB", "controller/Conductor", "interface/GUI", "Tone/component/Compressor", 
	"Tone/component/LFO", "Tone/signal/Expr", "Tone/source/Oscillator", "controller/Mediator", "util/Config"], 
function(MonoSynth, Master, Filter, PresetA, PresetB, Conductor, GUI, 
	Compressor, LFO, Expr, Oscillator, Mediator, Config){

	var filter = new Filter({
		"frequency": "G3",
		"type": "lowpass",
		"Q": 1.5
	});

	/*var compressor = new Compressor({
	 	"threshold": -12,
	 	"attack": 0.0102,
	 	"release": 0.01,
	 	"ratio": 4.6,
	 	"knee" : 4
	});*/

	var monoSynth = new MonoSynth({
		"oscillator": {
			"type": "sawtooth"
		},
		"envelope": {
			"attack": 0.214,
			"decay": 0.098,
			"sustain": 1,
			"release": 0.5
		},
		"filterEnvelope": {
			"attack": 0.01,
			"decay": 0.1,
			"sustain": 0.4,
			"release": 0.5,
			"min": 9000,
			"max": 2000
		},
		"filter" : {
			"type" : "lowpass",
			"rolloff" : -12,
			"Q" : 4,
		}
	});
	
	// var lfo = new LFO("8n", 0, 200);
	// lfo.connect(filter.frequency);
	// filter.frequency.value = "G2";
	// lfo.sync();


	var volume = filter.context.createGain();

	if (!Config.MOBILE) {
		var ampLFO = new LFO({
			"frequency": "16n", 
			"type": "triangle", 
			"min" : 1,
			"max" : 0
		}).connect(volume.gain).sync();
		ampLFO.amplitude.value = 0;
		
		Mediator.route("scroll", function(position, rampTime){
			if (Conductor.getMovement() === 0){
				var progress = Conductor.getBTransitionProgress();
				if (progress > 0){
					// ampLFO.amplitude.rampTo(progress / 1.5, Config.SLOW_UPDATE);
					ampLFO.amplitude.value = progress / 1.5;
				}
			} 
		});

		Mediator.route("replay", function(){
			ampLFO.amplitude.value = 0;
		});
	}

		
	monoSynth.chain(filter, volume, Master);

	//GUI
	if (Config.GUI){
		var bassFolder = GUI.getFolder("Bass");
		GUI.addTone2(bassFolder, "filter", filter);
		// GUI.addTone2(bassFolder, "compressor", compressor);
		GUI.addTone2(bassFolder, "synth", monoSynth);
	}

	return {
		triggerAttackRelease : function(note, duration, time, velocity){
			var Preset;
			if (Conductor.getMovement() === 1){
				Preset = PresetB;
			} else {
				Preset = PresetA;
			}
			Preset.update(function(preset){
				monoSynth.set(preset.synth);
			});
			//add some randomness in the duration
			monoSynth.triggerAttackRelease(note, duration, time, velocity);
		},
		volume : monoSynth.volume
	};
});