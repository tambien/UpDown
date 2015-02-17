define(["Tone/instrument/MonoSynth", "Tone/core/Master", "Tone/component/Filter", 
	"preset/BassSound", "controller/Conductor", "interface/GUI", "Tone/component/Compressor", 
	"Tone/component/LFO", "Tone/signal/Expr", "Tone/source/Oscillator"], 
function(MonoSynth, Master, Filter, Preset, Conductor, GUI, Compressor, LFO, Expr, Oscillator){

	var filter = new Filter({
		"frequency": 940,
		"type": "lowpass",
		"Q": 1.5
	});

	var compressor = new Compressor({
	 	"threshold": -24,
	 	"attack": 0.0102,
	 	"release": 0.2,
	 	"ratio": 3.6
	});

	var monoSynth = new MonoSynth({
		"oscillator": {
			"type": "triangle"
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
	
	var lfo = new Oscillator({
		"frequency" : "4n",
	 	"type" : "square"
	});

	var expr = new Expr("if(gt0($0), 0.5, 1) * $1");

	var osc2 = new Oscillator({
		"type": "sawtooth",
		"volume": -20,
		"frequency": 0
	});
	osc2.sync();
	osc2.connect(monoSynth.envelope);

	monoSynth.chain(filter, compressor, Master);
	expr.connect(osc2.frequency);
	lfo.connect(expr, 0, 0);
	monoSynth.frequency.connect(expr, 0, 1);
	lfo.sync();
	lfo.syncFrequency();

	//GUI
	if (USE_GUI){
		var bassFolder = GUI.getFolder("Bass");
		window.synth = monoSynth;
		GUI.addTone2(bassFolder, "filter", filter).listen();
		GUI.addTone2(bassFolder, "compressor", compressor);
		GUI.addTone2(bassFolder, "synth", monoSynth).listen();
		GUI.addTone2(bassFolder, "osc2", osc2, ["type"]).listen();
	}

	return {
		triggerAttackRelease : function(note, duration, time){
			Preset.update(function(preset){
				monoSynth.set(preset.synth);
				osc2.set(preset.osc2);
			}, true);
			//add some randomness in the duration
			monoSynth.triggerAttackRelease(note, duration, time);
		},
		volume : monoSynth.volume
	};
});