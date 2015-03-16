define(["Tone/source/Oscillator", "controller/Mediator",
 "preset/KickSound", "controller/Conductor", "Tone/core/Master", "Tone/component/Compressor", 
 "interface/GUI", "Tone/component/Filter", "Tone/component/AmplitudeEnvelope",
  "Tone/component/ScaledEnvelope", "util/Config"], 
function(Oscillator, Mediator, Preset, Conductor, Master, Compressor, GUI, Filter,
 AmplitudeEnvelope, ScaledEnvelope, Config){

	/*var comp = new Compressor({
		"attack": 0.14,
		"release": 0.98,
		"threshold": -24,
		"ratio": 4
	});*/

	var filter = new Filter({
		"type" : "highpass",
		"frequency": 40,
		"Q": 16
	});

	//oscillator
	var oscillator = new Oscillator({
		"type" : "sine",
	});
	oscillator.sync();

	//amplitude env

	var ampEnv = new AmplitudeEnvelope({
		"sustain" : 0,
		"attack" : 0.0005
	});

	// CONECTIONS //

	// oscillator.chain(ampEnv, filter, comp, Master);
	oscillator.chain(ampEnv, filter);

	filter.send("drums");

	var kickFreqEnv = {
		"startMult": 10,
		"attack": 0.035
	};

	//GUI
	if (Config.GUI){
		var kickFolder = GUI.getFolder("Kick");
		// GUI.addTone2(kickFolder, "Compressor", comp);
		GUI.addTone2(kickFolder, "Filter", filter);
		GUI.addObject(kickFolder, "Freq Env", kickFreqEnv);
	}
	
	return {
		triggerAttackRelease : function(duration, time, note){
			Preset.update(ampEnv.set.bind(ampEnv));
			ampEnv.triggerAttack(time);
			//the frequency ramp
			var freq = oscillator.noteToFrequency(note);
			oscillator.frequency.setValueAtTime(freq * kickFreqEnv.startMult, time);
			oscillator.frequency.exponentialRampToValueAtTime(freq, time + kickFreqEnv.attack);
		},
		volume : oscillator.volume
	};
});