define(["Tone/instrument/NoiseSynth", "controller/Mediator",
 "preset/HighHatSound", "controller/Conductor", "Tone/core/Master", "Tone/core/Transport", 
 "Tone/component/Filter", "Tone/component/PanVol", "interface/GUI"], 
function(NoiseSynth, Mediator, Preset, Conductor, Master, Transport, Filter, PanVol, GUI){

	var synth = new NoiseSynth({
		"envelope" : {
			"sustain" : 0.0,
		},
		"filterEnvelope" : {
			"sustain" : 0,
		}
	});

	GUI.addTone("High Hat", "synth", synth, {
		"noise" : {
			"type" : "white"
		},
		"filter" : {
			"type" : "highpass",
			"rolloff" : -12
		},
		"envelope" : {
			"attack" : 0.005,
			"decay" : 0.1,
			"exponent" : 2
		},
		"filterEnvelope" : {
			"min": 13000,
			"max": 3900,
			"exponent" : 2
		}
	});

	var filt = new Filter();

	GUI.addTone("High Hat", "filter", filt, {
		"frequency" : 8500,
		"type" : "highpass",
		"Q" : 4,
	});


	// CONECTIONS //

	synth.connect(filt);
	filt.toMaster();

	//reverb
	var revAmount = filt.send("reverb", synth.dbToGain(-50));

	GUI.addSlider("High Hat", "reverb", -50, -100, 0, function(val){
		revAmount.gain.value = filt.dbToGain(val);
	});


	//scroll tracking
	var hasChanged = false;
	var position = 0.5;
	Mediator.route("scroll", function(pos){
		position = pos;
		hasChanged = true;
	});
	
	return {
		triggerAttackRelease : function(duration, time){
			if (hasChanged){
				// hasChanged = false;
				synth.set(Preset.get(position));
			}
			synth.triggerAttack(time);
		},
		output : synth
	};
});