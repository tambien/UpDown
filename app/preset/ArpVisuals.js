define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator([
		{
			"color" : [0.5, 0, 1],
			"size" : 1,
		},
		{
			"color" : [0.5, 0, 1],
			"size" : 1,
		},
	], "Arp Visuals", GUI);
});