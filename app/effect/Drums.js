define(["Tone/core/Bus", "interface/GUI", "Tone/component/Compressor", 
	"controller/Mediator", "util/Config"], 
	function(Bus, GUI, Compressor, Mediator, Config){

	var comp = new Compressor({
		"attack": 0.1,
		"release": 0.9,
		"threshold": -12,
		"ratio": 3.1,
		"knee" : 8
	}).toMaster().receive("drums");

	if (Config.GUI){
		var effectFolder = GUI.getFolder("Effect");
		GUI.addTone2(effectFolder, "Drums Compressor", comp);
	}
});