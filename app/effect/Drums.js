define(["Tone/core/Bus", "interface/GUI", "Tone/component/Compressor", 
	"controller/Mediator", "util/Config"], 
	function(Bus, GUI, Compressor, Mediator, Config){

	var comp = new Compressor({
		"attack": 0.2,
		"release": 0.4,
		"threshold": -13,
		"ratio": 2.8,
		"knee" : 8
	}).toMaster().receive("drums");

	if (Config.GUI){
		var effectFolder = GUI.getFolder("Effect");
		GUI.addTone2(effectFolder, "Drums Compressor", comp);
	}
});