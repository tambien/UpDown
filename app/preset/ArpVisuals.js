define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"color": [
				1,
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
				0,
				0.03529411764705881
			],
			"angle": 0,
			"growth": 1.9,
			"size": 0.5
		}
	], "Arp Visuals", GUI);
});