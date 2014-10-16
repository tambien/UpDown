define(["Tone/instrument/MonoSynth", "Tone/core/Master", "Tone/component/Filter", 
	"controller/Mediator", "preset/BassSound", "controller/Conductor"], 
function(MonoSynth, Master, Filter, Mediator, Preset, Conductor){

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

	monoSynth.chain(monoSynth, lowpass, highpass, compressor, Master);
	monoSynth.setVolume(-25);	

	window.bassSynth = monoSynth;

	// EVENTS //

	var position = 0.5;
	var wasChangedd = false;

	Mediator.route("scroll", function(pos){
		wasChangedd = true;
		position = pos;
	});

	return {
		triggerAttackRelease : function(note, duration, time){
			if (wasChangedd){
				wasChangedd = false;
				monoSynth.set(Preset.stepwise.get(position));
				monoSynth.set(Preset.smooth.get(position));
			}
			monoSynth.triggerAttackRelease(note, duration, time);
		}
	};
});