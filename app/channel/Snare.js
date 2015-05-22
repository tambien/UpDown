define(["Tone/source/Noise", "Tone/core/Master", "Tone/component/Filter", 
	"Tone/component/AmplitudeEnvelope", "interface/GUI", "preset/SnareSound", 
	"Tone/component/Compressor", "Tone/signal/Signal", "util/Config"], 
	function(Noise, Master, Filter, AmplitudeEnvelope, GUI, Preset, Compressor, Signal, Config){

	var noise = new Noise({
		"type" : "pink"
	});
	noise.sync();

	/*var comp = new Compressor({
		"attack": 0.001,
		"release": 0.05,
		"threshold": -44,
		"ratio": 7.2
	});*/

	var filter = new Filter({
		"type" : "highpass",
		"Q": 4,
		"rolloff" : -12,
		"frequency": 510
	});
	
	var ampEnv = new AmplitudeEnvelope({
		"sustain" : 0,
	});

	//effects
	var effectLevels = {
		"reverb" : 0,
		"delay" : -30
	};

	// var revAmount = comp.send("reverb", effectLevels.reverb);
	// var delayAmount = comp.send("delay", effectLevels.delay);
	var revAmount = filter.send("reverb", effectLevels.reverb);
	var delayAmount = filter.send("delay", effectLevels.delay);


	// GUI
	if (Config.GUI){
		var reverbControl = new Signal(revAmount.gain, Signal.Units.Decibels);
		reverbControl.value = effectLevels.reverb;
		var delayControl = new Signal(delayAmount.gain, Signal.Units.Decibels);
		delayControl.value = effectLevels.delay;
		var snareFolder = GUI.getFolder("Snare");
		// GUI.addTone2(snareFolder, "compressor", comp);
		GUI.addTone2(snareFolder, "filter", filter);
		GUI.addTone2(snareFolder, "envelope", ampEnv);
		GUI.addTone2(snareFolder, "noise", noise);
		snareFolder.add(reverbControl, "value", -100, 1).name("reverb");
		snareFolder.add(delayControl, "value", -100, 1).name("delay");
	}

	// noise.chain(ampEnv, filter, comp, Master);
	noise.chain(ampEnv, filter);

	filter.send("drums");

	return  {
		triggerAttack : function(time){
			Preset.update(function(pres){
				ampEnv.set(pres.ampEnv);
			});
			ampEnv.triggerAttack(time);
		},
		volume : noise.volume
	};
	
});