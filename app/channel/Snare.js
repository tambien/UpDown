define(["Tone/source/Noise", "Tone/core/Master", "Tone/component/Filter", 
	"Tone/component/AmplitudeEnvelope", "interface/GUI", "preset/SnareSound", "Tone/component/Compressor"], 
	function(Noise, Master, Filter, AmplitudeEnvelope, GUI, Preset, Compressor){

	var noise = new Noise();
	noise.start();
	GUI.addTone("Snare", "noise", noise, {
		"type" : "pink"
	});

	var comp = new Compressor();

	GUI.addTone("Snare", "Compressor", comp, {
		"attack": 0.001,
		"release": 0.05,
		"threshold": -44,
		"ratio": 7.2
	});

	var filter = new Filter({
		"type" : "highpass",
	});
	GUI.addTone("Snare", "filter", filter, {
		"Q": 4,
		"rolloff" : -24,
		"frequency": 510
	});


	var ampEnv = new AmplitudeEnvelope({
		"sustain" : 0,
	});

	//reverb
	var revAmount = comp.send("reverb", noise.dbToGain(-37));

	GUI.addSlider("Snare", "reverb", -37, -100, 0, function(val){
		revAmount.gain.value = comp.dbToGain(val);
	});

	noise.chain(ampEnv, filter, comp, Master);

	return  {
		triggerAttack : function(time){
			Preset.update(function(pres){
				ampEnv.set(pres.ampEnv);
			}, true);
			ampEnv.triggerAttack(time);
		},
		output : noise,
	};
	
});