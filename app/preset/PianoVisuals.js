define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator([
		//top
		{
			"minSpeed" : 1800,
			"color" : [0.5, 0, 1],
			"width" : 1,
			"length" : 3,
			// "startingWidth" : 1
		},
		//middle
		{
			"minSpeed" : 1400,
			"color" : [0.8, 0.4, 1],
			"width" : 0.7,
			"length" : 4
		},
		//bottom
		{
			"minSpeed" : 2000,
			"color" : [1, 0.2, 0],
			"width" : 0.2,
			"length" : 6
		},
	], "Piano Visuals", GUI);
});