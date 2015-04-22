define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"width": 3,
			"color": [
				1,
				0,
				1
			],
			"decay": 120
		},
		{
			"width": 0.89,
			"color": [
				0,
				0.7176470588235294,
				1
			],
			"decay": 470
		},
		{
			"width": 0.29,
			"color": [
				0.8,
				0.4,
				0
			],
			"decay": 700
		}
	], "HighHat Preset", GUI);
});