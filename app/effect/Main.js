define(["Tone/effect/JCReverb", "Tone/core/Bus", "interface/GUI", "effect/Delay"], 
	function(Reverb, Bus, GUI, Delay){

	//reverb
	var reverb = new Reverb();
	reverb.receive("reverb");
	reverb.toMaster();

	if (USE_GUI){
		var effectFolder = GUI.getFolder("Effect");
		GUI.addTone2(effectFolder, "Reverb", reverb, ["roomSize"]);
	}
});