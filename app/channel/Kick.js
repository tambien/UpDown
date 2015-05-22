define(["Tone/source/Oscillator", "controller/Mediator",
 "preset/KickSound", "controller/Conductor", "Tone/core/Master", "Tone/component/Compressor", 
 "interface/GUI", "Tone/component/Filter", "Tone/component/AmplitudeEnvelope",
  "Tone/component/ScaledEnvelope", "util/Config"], 
function(Oscillator, Mediator, Preset, Conductor, Master, Compressor, GUI, Filter,
 AmplitudeEnvelope, ScaledEnvelope, Config){

	var filter = new Filter({
		"type" : "highpass",
		"frequency": 55,
		"Q": 4
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

	// oscillator.chain(ampEnv);

	// ampEnv.send("drums");

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
		triggerAttackRelease : function(duration, time, freq){
			Preset.update(function(pre){
				ampEnv.decay = pre.decay;
				kickFreqEnv.startMult = pre.startMult;
				kickFreqEnv.attack = pre.attack;
			});
			ampEnv.triggerAttack(time);
			//the frequency ramp
			// var freq = oscillator.noteToFrequency(note);
			oscillator.frequency.setValueAtTime(freq * kickFreqEnv.startMult, time);
			oscillator.frequency.exponentialRampToValueAtTime(freq, time + kickFreqEnv.attack);
		},
		volume : oscillator.volume
	};
});