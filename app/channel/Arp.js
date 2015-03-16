define(["Tone/instrument/MonoSynth", "Tone/core/Master", "interface/GUI", "preset/ArpSound", 
	"Tone/signal/Signal", "util/Config"], 
function(MonoSynth, Master, GUI, Preset, Signal, Config){

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
			var reverbControl = new Signal(reverbAmount.gain, Signal.Units.Decibels);
			var delayControl = new Signal(delayAmount.gain, Signal.Units.Decibels);
			var arpFolder = GUI.getFolder("ARP");
			GUI.addTone2(arpFolder, "synth", monoSynth).listen();
			arpFolder.add(reverbControl, "value", -100, 1).name("reverb");
			arpFolder.add(delayControl, "value", -100, 1).name("delay");
		}
	}


	return {
		triggerAttackRelease : function(note, duration, time){
			if (!Config.MOBILE){
				Preset.update(function(preset){
					monoSynth.set(preset.synth);
				}, true);
				//add some randomness in the duration
				monoSynth.triggerAttackRelease(note, duration, time);
			}
		},
		volume : volume
	};
});