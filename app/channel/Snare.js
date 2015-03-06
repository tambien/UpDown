define(["Tone/source/Noise", "Tone/core/Master", "Tone/component/Filter", 
	"Tone/component/AmplitudeEnvelope", "interface/GUI", "preset/SnareSound", 
	"Tone/component/Compressor", "Tone/signal/Signal"], 
	function(Noise, Master, Filter, AmplitudeEnvelope, GUI, Preset, Compressor, Signal){

	var noise = new Noise({
		"type" : "pink"
	});
	noise.sync();

	var comp = new Compressor({
		"attack": 0.001,
		"release": 0.05,
		"threshold": -44,
		"ratio": 7.2
	});

	var filter = new Filter({
		"type" : "highpass",
		"Q": 4,
		"rolloff" : -24,
		"frequency": 510
	});
	
	var ampEnv = new AmplitudeEnvelope({
		"sustain" : 0,
	});

	//reverb
	var revAmount = comp.send("reverb");
	var delayAmount = comp.send("delay");

	var reverbControl = new Signal(revAmount.gain, Signal.Units.Decibels);
	reverbControl.value = -50; // OPTIMIZE

	var delayControl = new Signal(delayAmount.gain, Signal.Units.Decibels);
	delayControl.value = -50; // OPTIMIZE


	// GUI
	if (USE_GUI){
		var snareFolder = GUI.getFolder("Snare");
		GUI.addTone2(snareFolder, "compressor", comp).listen();
		GUI.addTone2(snareFolder, "filter", filter).listen();
		GUI.addTone2(snareFolder, "envelope", ampEnv).listen();
		GUI.addTone2(snareFolder, "noise", noise);
		snareFolder.add(reverbControl, "value", -100, 1).name("reverb");
		snareFolder.add(delayControl, "value", -100, 1).name("delay");
	}

	noise.chain(ampEnv, filter, comp, Master);

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