define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"ampEnv": {
				"attack": 0.00083,
				"decay": 0.0572
			}
		},
		{
			"ampEnv": {
				"attack": 0.005,
				"decay": 0.37
			}
		}
	], "Snare Preset", GUI);
});