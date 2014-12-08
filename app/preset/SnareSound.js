define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	var SnareSoundSmooth = 
	[
		{
			"ampEnv": {
				"attack": 0.0007,
				"decay": 0.0572
			}
		},
		{
			"ampEnv": {
				"attack": 0.02,
				"decay": 0.108
			}
		}
	];

	GUI.addPreset("Snare Sound Smooth", SnareSoundSmooth);
	var SnareSmooth = new Interpolator(SnareSoundSmooth, "smooth");

	return SnareSmooth;
});