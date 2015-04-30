define(["Tone/effect/Convolver", "Tone/core/Bus", "interface/GUI", 
	"effect/Delay", "util/Config", "effect/Master", "effect/Drums", "Tone/component/Filter", "Tone/core/Master"], 
	function(Reverb, Bus, GUI, Delay, Config, MasterEffects, Drums, Filter, Master){

	//reverb
	if (!Config.MOBILE){
		var filter = new Filter({
			"type" : "highpass",
			"frequency" : 300,
			"Q" : 1,
		}).toMaster();
		var reverb = new Reverb("./audio/IR4.wav");
		reverb.receive("reverb");
		reverb.connect(filter);
		
		Master.volume.value = 2;

		if (Config.GUI){
			var effectFolder = GUI.getFolder("Effect");
			GUI.addTone2(effectFolder, "filter", filter);
		}
	}
});