define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator([
		//top
		{
			"accent" : [0, 1, 1], 
			"color" : [1, 0, 1],
		},
		//bottom
		{
			"accent" : [0, 0, 1], 
			"color" : [1, 1, 0],
		},
	], "Scroll Bar", GUI);
});