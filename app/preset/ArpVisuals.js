define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator([
		{
			"color" : [0.5, 0, 1],
			"angle" : -Math.PI/2,
		},
		{
			"color" : [1, 0.5, 0],
			"angle" : 0,
		},
	], "Arp Visuals", GUI);
});