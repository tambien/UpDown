define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"minSpeed": 1800,
			"color": [
				0.5764705882352941,
				1,
				0
			],
			"width": 0.2,
			"length": 3
		},
		{
			"minSpeed": 1400,
			"color": [
				0.14901960784313728,
				0,
				1
			],
			"width": 0.7,
			"length": 4
		},
		{
			"minSpeed": 4200,
			"color": [
				0.06862745098039214,
				0.06862745098039214,
				0.06862745098039214
			],
			"width": 1.6,
			"length": 9.6
		}
	], "Piano Visuals", GUI);
});