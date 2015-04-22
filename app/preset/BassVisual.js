define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"rotation": -1,
			"duration": 1000,
			"color": [
				1,
				0,
				1
			],
			"startSize": 0.13,
			"endSize": 0.001,
			"attackTime": 300
		},
		{
			"rotation": 0,
			"duration": 1600,
			"color": [
				0.5764705882352941,
				1,
				0
			],
			"startSize": 0.43,
			"endSize": 0.14,
			"attackTime": 500
		},
		{
			"rotation": 2,
			"duration": 2400,
			"color": [
				0,
				1,
				0
			],
			"startSize": 1,
			"endSize": 2.2,
			"attackTime": 700
		}
	], "Bass Visuals", GUI);
});