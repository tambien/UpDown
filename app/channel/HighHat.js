define(["Tone/instrument/NoiseSynth", "preset/HighHatSound", 
	"controller/Conductor", "Tone/core/Master", "Tone/core/Transport", 
 "Tone/component/Filter", "Tone/component/PanVol", "interface/GUI", 
 "TERP", "Tone/signal/Signal", "Tone/component/Panner", "Tone/component/Mono", "util/Config"], 
function(NoiseSynth, Preset, Conductor, Master, Transport, 
	Filter, PanVol, GUI, TERP, Signal, Panner, Mono, Config){

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

	var panner = new Panner();

	// CONECTIONS //

	synth.chain(filt, panner, Master);

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
	if (Config.GUI){
		var hhFolder = GUI.getFolder("High Hat");
		GUI.addTone2(hhFolder, "synth", synth).listen();
		GUI.addTone2(hhFolder, "filter", filt).listen();
		hhFolder.add(reverbControl, "value", -100, 1).name("reverb");
		// hhFolder.addSignal(panner, "pan", 0, 1);
	}
	
	return {
		triggerAttackRelease : function(duration, time, velocity, pan){
			Preset.update(function(pres){
				synth.set(pres);
			});
			//random pan
			pan = TERP.scale(pan, 0.2, 0.8);
			panner.pan.rampTo(pan, 0.01);
			synth.triggerAttack(time, velocity);
		},
		volume : synth.volume
	};
});