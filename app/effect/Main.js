define(["Tone/effect/JCReverb", "Tone/core/Bus", "interface/GUI", 
	"effect/Delay", "util/Config", "effect/Master"], 
	function(Reverb, Bus, GUI, Delay, Config, MasterEffects){

	//reverb
	if (!Config.MOBILE){
		var reverb = new Reverb();
		reverb.receive("reverb");
		reverb.toMaster();

		if (Config.GUI){
			var effectFolder = GUI.getFolder("Effect");
			GUI.addTone2(effectFolder, "Reverb", reverb, ["roomSize"]);
		}
	}
});