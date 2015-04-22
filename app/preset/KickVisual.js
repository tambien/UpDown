define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"width": 0.1,
			"color": [
				0.5196078431372549,
				0.5196078431372549,
				0.5196078431372549
			]
		},
		{
			"width": 0.84,
			"color": [
				0.584313725490196,
				0.7764705882352941,
				0
			]
		}
	], "Kick Preset", GUI);
});