define(["Tone/instrument/NoiseSynth", "preset/HighHatSound", 
	"controller/Conductor", "Tone/core/Master", "Tone/core/Transport", 
 "Tone/component/Filter", "Tone/component/PanVol", "interface/GUI", 
 "TERP", "Tone/signal/Signal", "Tone/component/Panner", "Tone/component/Mono"], 
function(NoiseSynth, Preset, Conductor, Master, Transport, 
	Filter, PanVol, GUI, TERP, Signal, Panner, Mono){

	var synth = new NoiseSynth({
		"envelope" : {
			"sustain" : 0.0,
			"attack" : 0.005,
			"decay" : 0.1,
		},
		"filterEnvelope" : {
			"sustain" : 0,
			"min": 13000,
			"max": 3900,
			"exponent" : 2
		},
		"filter" : {
			"type" : "highpass",
			"rolloff" : -12
		},
		"noise" : {
			"type" : "white"
		},
	});

	var filt = new Filter( {
		"frequency" : 8500,
		"type" : "highpass",
		"Q" : 4,
	});

	var mono = new Mono();
	// var panner = new Panner({
	// 	"frequency" : "2n",
	// 	"type" : "square"
	// });
	// panner.start();
	// panner.sync();


	// CONECTIONS //

	synth.chain(filt, mono, Master);

	//Effects
	var effectLevels = {
		"reverb" : -50,
		"side" : 0,
		"mid" : -50,
	};

	var revAmount = filt.send("reverb");
	var reverbControl = new Signal(revAmount.gain, Signal.Units.Decibels);
	reverbControl.value = effectLevels.reverb; // OPTIMIZE

	// GUI
	if (USE_GUI){
		var hhFolder = GUI.getFolder("High Hat");
		GUI.addTone2(hhFolder, "synth", synth).listen();
		GUI.addTone2(hhFolder, "filter", filt).listen();
		hhFolder.add(reverbControl, "value", -100, 1).name("reverb");
		// hhFolder.addSignal(panner, "pan", 0, 1);
	}
	
	//velocity scalar
	var minVelocity = 0.36;

	return {
		triggerAttackRelease : function(duration, time){
			Preset.update(function(pres){
				synth.set(pres);
			});
			//add a little randomness to the velocity
			synth.triggerAttack(time, TERP.scale(Math.random(), minVelocity, 1));
		},
		volume : synth.volume
	};
});