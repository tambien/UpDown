define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	return new Interpolator([
		{
			"decay": 0.27,
			"startMult": 11,
			"attack": 0.02
		},
		{
			"decay": 4.4,
			"startMult": 8,
			"attack": 0.08
		}
	], "Kick Sound", GUI);
});