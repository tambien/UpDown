define(["Tone/effect/JCReverb", "Tone/core/Bus", "Tone/effect/StereoWidener", "interface/GUI", "Tone/effect/AutoPanner"], 
	function(Reverb, Bus, StereoWidener, GUI, AutoPanner){

	//reverb
	var reverb = new Reverb();
	reverb.receive("reverb");
	reverb.toMaster();

	GUI.addTone("Effects", "Reverb", reverb, {
		"roomSize" : 0.4
	});
});