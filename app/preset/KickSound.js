define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	var KickData = 
	[
		{
			"ampEnv": {
				"decay": 0.27
			}
		},
		{
			"ampEnv": {
				"decay": 4.4
			}
		}
	];

	var KickSmooth = new Interpolator(KickData, "smooth");

	GUI.addPreset("Kick Smooth", KickData);

	return KickSmooth;
});