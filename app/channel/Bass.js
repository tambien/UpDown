define(["Tone/instrument/MonoSynth", "Tone/core/Master", "Tone/component/Filter", 
	"preset/BassSound", "controller/Conductor"], 
function(MonoSynth, Master, Filter, Preset, Conductor){

	var lowpass = new Filter({
		"frequency" : 400, 
		"type" : "lowpass",
		"rolloff": -12,
		"Q": 6,
	});

	var highpass = new Filter({
		"frequency" : 115, 
		"type" : "highpass",
		"rolloff": -24,
		"Q": 12,
	});

	var compressor = lowpass.context.createDynamicsCompressor();
	compressor.threshold.value = -40;
	compressor.release.value = 0.4;
	compressor.attack.value = 0.02;
	compressor.ratio.value = 6;

	var monoSynth = new MonoSynth({
		"oscillator" : {
			"type" : "triangle",
			// "width" : 0.1
		},
		"portamento" : 0,
		"envelope" : {
			"attack" : 0.04,
			"decay" : 0.1,
			"sustain" : 0.3,
			"release" : "4n"
		},
		"filterEnvelope" : {
			"attack" : 0.1,
			"decay" : "32n",
			"sustain" : 0.05,
			"release" : "8n",
			"min" : 120,
			"max" : 8000
		},
		"filter" : {
			"type" : "lowshelf",
			"rolloff" : -48,
			"Q" : 30,
			"gain" : 8,
		}
	});

	monoSynth.chain(lowpass, highpass, compressor, Master);

	//the callback to set the new values
	var setFunction = monoSynth.set.bind(monoSynth);

	return {
		triggerAttackRelease : function(note, duration, time){
			Preset.stepwise.update(setFunction);
			Preset.smooth.update(setFunction);
			//add some randomness in the duration
			monoSynth.triggerAttackRelease(note, duration, time);
		},
		output : monoSynth
	};
});