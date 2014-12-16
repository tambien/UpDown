define(["Tone/instrument/MonoSynth", "Tone/core/Master", "Tone/instrument/PolySynth", 
	"Tone/component/PanVol", "preset/PianoSound", "Tone/component/LFO", "interface/GUI"], 
function(MonoSynth, Master, PolySynth, PanVol, Preset, LFO, GUI){

	"use strict";

	var monoSynth = new PolySynth(4, MonoSynth);
	var panner = new PanVol();
	monoSynth.chain(panner, Master);

	panner.setPan(0.2);

	var vibrato = new LFO("32n", -40, 40);
	var vibratoAmount = MonoSynth.prototype.context.createGain();
	vibrato.connect(vibratoAmount);
	vibrato.sync();
	//connect it to each of the voices
	for (var i = 0; i < monoSynth.voices.length; i++){
		var voice = monoSynth.voices[i];
		vibratoAmount.connect(voice.detune);
	}

	// effects
	var effectLevels = {
		"reverb" : -16,
		"autoPanner" : -30,
	};

	var revAmount = panner.send("reverb", panner.dbToGain(effectLevels.reverb));

	GUI.addSlider("Piano", "reverb", effectLevels.reverb, -60, 0, function(val){
		revAmount.gain.value = panner.dbToGain(val);
	});


	//return
	var velocity = 1;
	var vibratoParams = {};
	var oscChanged = true;
	var stepPreset = Preset.stepwise.get();

	return {
		triggerAttackRelease : function(note, duration, time){
			Preset.smooth.update(function(pre){
				monoSynth.set(pre);
				vibratoParams = pre.vibrato;
			});
			Preset.stepwise.update(function(pre){
				//fade it out here for a split second as the oscillator changes
				velocity = pre.velocity;
				oscChanged = true;
				stepPreset = pre;
			});
			vibratoAmount.gain.setValueAtTime(0, time);
			vibratoAmount.gain.linearRampToValueAtTime(vibratoParams.amount, time + vibratoParams.amount);
			monoSynth.triggerAttackRelease(note, duration, time, velocity);
			if (oscChanged){
				oscChanged = false;
				var now = monoSynth.now();
				monoSynth.output.gain.setValueAtTime(1, now);
				monoSynth.output.gain.linearRampToValueAtTime(0, now + 0.01);
				monoSynth.output.gain.setValueAtTime(0, time);
				monoSynth.output.gain.linearRampToValueAtTime(1, time + 0.1);
				monoSynth.set(stepPreset);
			}
		},
		output : panner
	};
});