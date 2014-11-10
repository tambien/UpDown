define(["Tone/instrument/NoiseSynth", "controller/Mediator",
 "preset/HighHatSound", "controller/Conductor", "Tone/core/Master", "Tone/core/Transport", 
 "Tone/effect/Distortion", "Tone/component/PanVol"], 
function(NoiseSynth, Mediator, Preset, Conductor, Master, Transport, Distortion, PanVol){

	var dist = new Distortion(60);

	var synth = new NoiseSynth({
		"noise" : {
			"type" : "white"
		},
		"filter" : {
			"Q" : 6,
			"type" : "highpass",
			"rolloff" : -12
		},
		"envelope" : {
			"attack" : 0.005,
			"decay" : 0.1,
			"sustain" : 0.0,
			"release" : 0.3,
			"exponent" : 2
		},
		"filterEnvelope" : {
			"attack" : 0.006,
			"decay" : 0.02,
			"sustain" : 0,
			"release" : 0.5,
			"min" : 5000,
			"max" : 10000,
			"exponent" : 2
		}
	});


	// CONECTIONS //

	synth.connect(dist);
	dist.toMaster();
	synth.send("reverb", 0.5);

	window.highhat = synth;

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