define(["Tone/effect/Convolver", "Tone/core/Bus", "interface/GUI", 
	"effect/Delay", "util/Config", "effect/Master", "effect/Drums", "Tone/component/Filter", "Tone/core/Master"], 
	function(Reverb, Bus, GUI, Delay, Config, MasterEffects, Drums, Filter, Master){

	//reverb
	if (!Config.MOBILE){
		var reverb = new Reverb("./audio/IR4.wav");
		reverb.receive("reverb");

		var filter = new Filter({
			"type" : "highpass",
			"frequency" : 400,
			"Q" : 1,
		}).connect(reverb.context.destination);

		// reverb.connect(filter);
		reverb.connect(reverb.context.destination);
		
		Master.volume.value = 2;

		if (Config.GUI){
			var effectFolder = GUI.getFolder("Effect");
			GUI.addTone2(effectFolder, "filter", filter);
		}
	}
});