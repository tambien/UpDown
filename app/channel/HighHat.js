define(["Tone/instrument/NoiseSynth", "preset/HighHatSound", 
	"controller/Conductor", "Tone/core/Master", "Tone/core/Transport", 
 "Tone/component/Filter", "Tone/component/PanVol", "interface/GUI", "TERP"], 
function(NoiseSynth, Preset, Conductor, Master, Transport, Filter, PanVol, GUI, TERP){

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

	synth.chain(filt, Master);

	//Effects
	var effectLevels = {
		"reverb" : -50,
		"side" : 0,
		"mid" : -50,
	};

	var revAmount = filt.send("reverb", synth.dbToGain(effectLevels.reverb));

	GUI.addSlider("High Hat", "reverb", effectLevels.reverb, -100, 0, function(val){
		revAmount.gain.value = filt.dbToGain(val);
	});

	//velocity scalar
	var minVelocity = 0.36;

	// GUI.addSlider("High Hat", "min", minVelocity, 0, 1, function(val){
	// 	minVelocity = val;
	// });


	//return obj

	var preset = Preset.get();
	
	return {
		triggerAttackRelease : function(duration, time){
			Preset.update(function(pres){
				synth.set(pres);
			});
			//add a little randomness to the velocity
			synth.triggerAttack(time, TERP.scale(Math.random(), minVelocity, 1));
		},
		output : synth
	};
});