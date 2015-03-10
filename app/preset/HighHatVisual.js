define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator([
		{
			"width" : 2,
			"color" : [0.8, 0.4, 1],
			"decay" : 200,
		},
		{
			"width" : 0.9,
			"color" : [0.8, 0.4, 0],
			"decay" : 700,
		}
	], "HighHat Preset", GUI);
});