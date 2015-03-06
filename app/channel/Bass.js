define(["Tone/instrument/MonoSynth", "Tone/core/Master", "Tone/component/Filter", 
	"preset/BassSound", "controller/Conductor", "interface/GUI", "Tone/component/Compressor", 
	"Tone/component/LFO", "Tone/signal/Expr", "Tone/source/Oscillator"], 
function(MonoSynth, Master, Filter, Preset, Conductor, GUI, Compressor, LFO, Expr, Oscillator){

	var filter = new Filter({
		"frequency": "G3",
		"type": "lowpass",
		"Q": 1.5
	});

	var compressor = new Compressor({
	 	"threshold": -12,
	 	"attack": 0.0102,
	 	"release": 0.01,
	 	"ratio": 4.6,
	 	"knee" : 4
	});

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
	
	var lfo = new LFO("8n", 0, 200);
	lfo.connect(filter.frequency);
	filter.frequency.value = "G2";
	lfo.sync();

	monoSynth.chain(filter, compressor, Master);

	//GUI
	if (USE_GUI){
		var bassFolder = GUI.getFolder("Bass");
		GUI.addTone2(bassFolder, "filter", filter).listen();
		GUI.addTone2(bassFolder, "compressor", compressor);
		GUI.addTone2(bassFolder, "synth", monoSynth).listen();
	}

	return {
		triggerAttackRelease : function(note, duration, time){
			Preset.update(function(preset){
				monoSynth.set(preset.synth);
			}, true);
			//add some randomness in the duration
			monoSynth.triggerAttackRelease(note, duration, time);
		},
		volume : monoSynth.volume
	};
});