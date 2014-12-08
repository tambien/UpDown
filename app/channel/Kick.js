define(["Tone/source/Oscillator", "controller/Mediator",
 "preset/KickSound", "controller/Conductor", "Tone/core/Master", "Tone/component/Compressor", 
 "interface/GUI", "Tone/component/Filter", "Tone/component/AmplitudeEnvelope", "Tone/component/ScaledEnvelope"], 
function(Oscillator, Mediator, Preset, Conductor, Master, Compressor, GUI, Filter,
 AmplitudeEnvelope, ScaledEnvelope){

	var comp = new Compressor();

	GUI.addTone("Kick", "Compressor", comp, {
		"attack": 0.14,
		"release": 0.98,
		"threshold": -36,
		"ratio": 4
	});

	var filter = new Filter({
		"type" : "highpass"
	});

	GUI.addTone("Kick", "Filter", filter, {
		"frequency": "C2",
		"Q": 6.8
	});

	//oscillator
	var oscillator = new Oscillator({
		"type" : "sine",
	});
	oscillator.start();

	//amplitude env

	var ampEnv = new AmplitudeEnvelope({
		"sustain" : 0,
		"attack" : 0.0005
	});

	// CONECTIONS //

	oscillator.chain(ampEnv, filter, comp, Master);

	var hasChanged = false;
	var position = 0.5;
	Mediator.route("scroll", function(pos){
		position = pos;
		hasChanged = true;
	});

	var kickFreqEnv = {
		"startMult": 10,
		"attack": 0.035
	};
	GUI.addObject("Kick", "Freq Env", kickFreqEnv);

	var ampEnvSet = ampEnv.set.bind(ampEnv);
	
	return {
		triggerAttackRelease : function(duration, time, note){
			Preset.update(ampEnvSet);
			ampEnv.triggerAttack(time);
			//the frequency ramp
			var freq = oscillator.noteToFrequency(note);
			oscillator.frequency.setValueAtTime(freq * kickFreqEnv.startMult, time);
			oscillator.frequency.exponentialRampToValueAtTime(freq, time + kickFreqEnv.attack);
		},
		output : oscillator
	};
});