define(["Tone/instrument/MonoSynth", "Tone/core/Master", "interface/GUI", "preset/ArpSound", 
	"Tone/signal/Signal"], 
function(MonoSynth, Master, GUI, Preset, Signal){

	var monoSynth = new MonoSynth({
		"oscillator": {
			"type": "pwm"
		},
		"filter" : {
			"type" : "highpass"
		}
	});
	
	monoSynth.chain(Master);
	window.synth = monoSynth;

		// EFFECTS //

	var effectLevels = {
		"reverb" : -24,
		"delay" : -5
	};

	var reverbAmount = monoSynth.send("reverb");
	var reverbControl = new Signal(reverbAmount.gain, Signal.Units.Decibels);
	reverbControl.value = effectLevels.reverb; 

	var delayAmount = monoSynth.send("delay");
	var delayControl = new Signal(delayAmount.gain, Signal.Units.Decibels);
	delayControl.value = effectLevels.delay; 

	//GUI
	if (USE_GUI){
		var arpFolder = GUI.getFolder("ARP");
		GUI.addTone2(arpFolder, "synth", monoSynth).listen();
		arpFolder.add(reverbControl, "value", -100, 1).name("reverb");
		arpFolder.add(delayControl, "value", -100, 1).name("delay");
	}

	return {
		triggerAttackRelease : function(note, duration, time){
			Preset.update(function(preset){
				monoSynth.set(preset.synth);
			}, true);
			//add some randomness in the duration
			monoSynth.triggerAttackRelease(note, duration, time);
		},
		volume : monoSynth.volume
	};
});