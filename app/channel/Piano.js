define(["Tone/instrument/MonoSynth", "Tone/core/Master", "Tone/instrument/PolySynth", 
	"Tone/component/PanVol", "preset/PianoSound"], 
function(MonoSynth, Master, PolySynth, PanVol, Preset){

	"use strict";

	var monoSynth = new PolySynth(4, MonoSynth);
	var panner = new PanVol();
	monoSynth.connect(panner);
	panner.toMaster();

	panner.setPan(0.2);

	panner.send("reverb", 0.1);

	monoSynth.set({
		"volume" : -10,
		"oscillator" : {
			"type" : "sine"
		},
		"envelope" : {
			"attack" : 0.01,
			"decay" : 0.01,
			"sustain" : 1,
			"release" : 0.5
		},
		"filterEnvelope" : {
			"attack" : 0.01,
			"decay" : 0.0,
			"sustain" : 1,
			"release" : 0.5,
			"min" : 20000,
			"max" : 20000,
		}
	});

	var monoSynthSet = monoSynth.set.bind(monoSynth);

	return {
		triggerAttackRelease : function(note, duration, time){
			Preset.stepwise.update(monoSynthSet);
			Preset.smooth.update(monoSynthSet);
			monoSynth.triggerAttackRelease(note, duration, time);
		},
		output : panner
	};
});