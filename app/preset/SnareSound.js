define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	return new Interpolator([
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
	], "Snare Preset", GUI);
});