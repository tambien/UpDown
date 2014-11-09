define(["Tone/instrument/NoiseSynth", "controller/Mediator",
 "preset/KickSound", "controller/Conductor", "Tone/core/Master", "Tone/component/Compressor"], 
function(NoiseSynth, Mediator, Preset, Conductor, Master, Compressor){

	var comp = new Compressor({
		"attack" : 0.001,
		"release" : 0.001,
		"threshold" : -14,
		"ratio" : 10
	});

	var synth = new NoiseSynth({
		"noise" : {
			"type" : "brown"
		},
		"filter" : {
			"Q" : 6,
			"type" : "lowpass",
			"rolloff" : -48
		},
		"envelope" : {
			"attack" : 0.005,
			"decay" : 0.2,
			"sustain" : 0.0,
			"release" : 0.3,
			"exponent" : 2
		},
		"filterEnvelope" : {
			"attack" : 0.006,
			"decay" : 0.1,
			"sustain" : 0,
			"release" : 0.5,
			"min" : 20,
			"max" : 500,
			"exponent" : 2
		}
	});


	// CONECTIONS //

	synth.connect(comp);
	window.comp = comp;
	comp.toMaster();

	window.kick = synth;

	var hasChanged = false;
	var position = 0.5;
	Mediator.route("scroll", function(pos){
		position = pos;
		hasChanged = true;
	});
	
	return {
		triggerAttackRelease : function(duration, time){
			if (hasChanged){
				hasChanged = false;
				synth.set(Preset.get(position));
			}
			synth.triggerAttack(time);
		},
		output : synth
	};
});