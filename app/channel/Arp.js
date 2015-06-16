define(["Tone/instrument/MonoSynth", "Tone/core/Master", "interface/GUI", "preset/ArpSoundA", "preset/ArpSoundB", 
	"Tone/signal/Signal", "util/Config", "controller/Conductor", "Tone/core/Tone"], 
function(MonoSynth, Master, GUI, PresetA, PresetB, Signal, Config, Conductor, Tone){

	var monoSynth, volume;
	if (!Config.MOBILE){
		monoSynth = new MonoSynth({
			"oscillator": {
				"type": "pwm"
			},
			"filter" : {
				"type" : "highpass"
			}
		});
		
		monoSynth.chain(Master);

		volume = monoSynth.volume;

		// EFFECTS //

		var effectLevels = {
			"reverb" : -24,
			"delay" : -5
		};

		var reverbAmount = monoSynth.send("reverb", effectLevels.reverb);
		var delayAmount = monoSynth.send("delay", effectLevels.delay);

		//GUI
		if (Config.GUI){
			var reverbControl = new Signal(reverbAmount.gain, Tone.Type.Decibels);
			var delayControl = new Signal(delayAmount.gain, Tone.Type.Decibels);
			var arpFolder = GUI.getFolder("ARP");
			GUI.addTone2(arpFolder, "synth", monoSynth);
			arpFolder.add(reverbControl, "value", -100, 1).name("reverb");
			arpFolder.add(delayControl, "value", -100, 1).name("delay");
		}
	}

	var velocity = 1;


	return {
		triggerAttackRelease : function(note, duration, time){
			if (!Config.MOBILE){
				var Preset;
				if (Conductor.getMovement() === 1){
					Preset = PresetB;
				} else {
					Preset = PresetA;
				}
				Preset.update(function(preset){
					velocity = preset.velocity;
					monoSynth.set(preset.synth);
				});
				//add some randomness in the duration
				monoSynth.triggerAttackRelease(note, duration, time, velocity);
			}
		},
		volume : volume
	};
});