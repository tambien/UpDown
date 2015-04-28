define(["Tone/core/Bus", "interface/GUI", "Tone/component/Compressor", 
	"controller/Mediator", "util/Config"], 
	function(Bus, GUI, Compressor, Mediator, Config){

	var comp = new Compressor({
		"attack": 0.29,
		"release": 0.07,
		"threshold": -10,
		"ratio": 6,
		"knee" : 8
	}).toMaster().receive("drums");

	if (Config.GUI){
		var effectFolder = GUI.getFolder("Effect");
		GUI.addTone2(effectFolder, "Drums Compressor", comp);
	}
});