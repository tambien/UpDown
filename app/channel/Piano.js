define(["Tone/instrument/MonoSynth", "Tone/core/Master", "Tone/instrument/PolySynth", 
	"Tone/component/PanVol", "preset/PianoSound", "Tone/component/LFO", "interface/GUI", 
	"Tone/signal/Signal"], 
function(MonoSynth, Master, PolySynth, PanVol, Preset, LFO, GUI, Signal){

	"use strict";

	var monoSynth = new PolySynth(4, MonoSynth, {
		"envelope" : {
			"attack" : 0.1
		}
	});
	var panner = new PanVol();
	monoSynth.chain(panner, Master);

	panner.pan.value = 0.2;

	var vibrato = new LFO("32n", -40, 40);
	vibrato.sync();
	//connect it to each of the voices
	for (var i = 0; i < monoSynth.voices.length; i++){
		var voice = monoSynth.voices[i];
		vibrato.connect(voice.detune);
	}

	// effects
	var effectLevels = {
		"reverb" : -16,
		"autoPanner" : -30,
	};

	var revAmount = panner.send("reverb");
	var reverbControl = new Signal(revAmount.gain, Signal.Units.Decibels);
	reverbControl.value = effectLevels.reverb; // OPTIMIZE

	//GUI
	if (USE_GUI){
		var pianoFolder = GUI.getFolder("Piano");
		// GUI.addTone2(pianoFolder, "synth", monoSynth).listen();
		GUI.addTone2(pianoFolder, "vibrato", vibrato).listen();
		pianoFolder.add(reverbControl, "value", -100, 1).name("reverb");
	}

	//return
	var velocity = 1;
	var vibratoParams = {};

	return {
		triggerAttackRelease : function(note, duration, time){
			Preset.update(function(pre){
				if (monoSynth.voices[0].oscillator.type !== pre.oscillator.type){
					//duck the volume for a second
					var now = monoSynth.now();
					monoSynth.output.gain.setValueAtTime(1, now);
					monoSynth.output.gain.linearRampToValueAtTime(0, now + 0.01);
					monoSynth.output.gain.setValueAtTime(0, time);
					monoSynth.output.gain.linearRampToValueAtTime(1, time + 0.1);
				}
				monoSynth.set(pre);
				if (pre.oscillator.type === "pwm"){
					monoSynth.set({
						"modulationFrequency" : 0.7
					});
				}
				vibratoParams = pre.vibrato;
				velocity = pre.velocity;
			}, true);
			vibrato.amplitude.setValueAtTime(0, time);
			vibrato.amplitude.linearRampToValueAtTime(vibratoParams.amount, time + vibratoParams.amount);
			monoSynth.triggerAttackRelease(note, duration, time, velocity);
		},
		volume : panner.volume
	};
});