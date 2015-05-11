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
			"length": 3,
			"spread": 0.8
		},
		{
			"minSpeed": 1400,
			"color": [
				0.14901960784313728,
				0,
				1
			],
			"width": 0.7,
			"length": 4,
			"spread": 1
		},
		{
			"minSpeed": 2800,
			"color": [
				0.06862745098039214,
				0.06862745098039214,
				0.06862745098039214
			],
			"width": 4.4,
			"length": 10.7,
			"spread": 6
		}
	], "Piano Visuals", GUI);
});