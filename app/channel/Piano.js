define(["Tone/instrument/MonoSynth", "Tone/core/Master", "Tone/instrument/PolySynth", 
	"Tone/component/Panner", "preset/PianoSoundA", "preset/PianoSoundB", "Tone/component/LFO", "interface/GUI", 
	"Tone/signal/Signal", "controller/Mediator", "controller/Conductor", "util/Config", "Tone/component/Volume", 
	"Tone/component/Meter", "Tone/core/Bus"], 
function(MonoSynth, Master, PolySynth, Panner, PresetA, PresetB, LFO, GUI, Signal, 
	Mediator, Conductor, Config, Volume, Meter, Bus){

	"use strict";

	var monoSynth = new PolySynth(4, MonoSynth, {
		"envelope" : {
			"attack" : 0.1
		}
	});
	var synthVolume = new Volume();

	var volume = monoSynth.context.createGain();

	if (!Config.MOBILE){
		var ampLFO = new LFO({
			"frequency": "8t", 
			"min": 1, 
			"max" : 0
		}).connect(volume.gain).sync();
		ampLFO.amplitude.value = 0;

		Mediator.route("scroll", function(position, rampTime){
			if (Conductor.getMovement() === 0){
				var progress = Conductor.getBTransitionProgress();
				if (progress > 0){
					ampLFO.amplitude.rampTo(progress, 0.25);
				}
			} 
		});
	}

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
		"delay" : -24
	};

	var revAmount, delayAmount, panner;
	if (!Config.MOBILE){
		panner = new Panner(0.2);
		revAmount = panner.send("reverb", effectLevels.reverb);
		delayAmount = panner.send("delay", effectLevels.delay);
		monoSynth.chain(synthVolume, panner, volume, Master);
	} else {
		monoSynth.chain(synthVolume, Master);
	}

	//GUI
	if (Config.GUI){
		var reverbControl = new Signal(revAmount.gain, Signal.Units.Decibels);
		reverbControl.value = effectLevels.reverb;
		var delayControl = new Signal(delayAmount.gain, Signal.Units.Decibels);
		delayControl.value = effectLevels.delay;
		var pianoFolder = GUI.getFolder("Piano");
		GUI.addTone2(pianoFolder, "vibrato", vibrato);
		pianoFolder.add(reverbControl, "value", -100, 1).name("reverb");
		pianoFolder.add(delayControl, "value", -100, 1).name("delay");
	}

	//return
	var velocity = 1;
	var vibratoParams = {};

	//set the preset initially
	var pre = PresetA.get();
	monoSynth.set(pre);
	vibratoParams = pre.vibrato;
	velocity = pre.velocity;

	Mediator.route("start", function(){
		//trigger the attack
		monoSynth.set({
			"envelope" : {
				"release" : 0.1,
			},
			"filterEnvelope" : {
				"release" : 0.1,
			}
		});
		monoSynth.triggerAttack(["C4", "A#4", "E4", "F#4"]);
		vibratoParams = pre.vibrato;
		vibrato.amplitude.setValueAtTime(0, 0);
		vibrato.amplitude.linearRampToValueAtTime(vibratoParams.amount, vibratoParams.amount);
	});

	Mediator.route("firstScroll", function(){
		monoSynth.triggerRelease(["C4", "A#4", "E4", "F#4"]);
	});

	return {
		triggerAttackRelease : function(note, duration, time){
			var Preset;
			if (Conductor.getMovement() === 1){
				Preset = PresetB;
			} else {
				Preset = PresetA;
			}
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
			});
			vibrato.amplitude.setValueAtTime(0, time);
			vibrato.amplitude.linearRampToValueAtTime(vibratoParams.amount, time + vibratoParams.amount);
			monoSynth.triggerAttackRelease(note, duration, time, velocity);
		},
		volume : synthVolume.volume
	};
});