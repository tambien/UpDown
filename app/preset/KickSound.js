define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	return new Interpolator([
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
	], "Kick Sound", GUI);
});