define(["Tone/effect/Convolver", "Tone/core/Bus", "interface/GUI", 
	"effect/Delay", "util/Config", "effect/Master", "effect/Drums"], 
	function(Reverb, Bus, GUI, Delay, Config, MasterEffects, Drums){

	//reverb
	if (!Config.MOBILE){
		/*var reverb = new Reverb({
			"roomSize" : 0.55,
			"dampening" : 5000,
		});*/
		var reverb = new Reverb("./audio/IR4.wav");
		reverb.receive("reverb");
		reverb.toMaster();
		window.reverb = reverb;

		if (Config.GUI){
			var effectFolder = GUI.getFolder("Effect");
			// GUI.addTone2(effectFolder, "Reverb", reverb, ["roomSize", "dampening"]);
		}
	}
});