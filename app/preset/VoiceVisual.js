define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"attackTime": 100,
			"duration": 1000,
			"color": [
				1,
				0,
				0
			]
		},
		{
			"duration": 1600,
			"color": [
				0.8117647058823529,
				1,
				0
			],
			"attackTime": 200
		},
		{
			"duration": 2400,
			"attackTime": 300,
			"color": [
				1,
				1,
				0
			]
		}
	], "Voice Visuals", GUI);
});