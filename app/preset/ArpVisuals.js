define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"color": [
				0.5,
				0,
				1
			],
			"angle": -1.5707963267948966,
			"growth": -1.4,
			"size": 1.6
		},
		{
			"color": [
				1,
				0.5,
				0
			],
			"angle": 0,
			"growth": 1.5,
			"size": 0.5
		}
	], "Arp Visuals", GUI);
});