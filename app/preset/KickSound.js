define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	return new Interpolator([
		{
			"decay": 0.27,
			"startMult": 10,
			"attack": 0.01
		},
		{
			"decay": 2.4,
			"startMult": 8,
			"attack": 0.08
		}
	], "Kick Sound", GUI);
});