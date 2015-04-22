define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"decay": 230,
			"width": 0.8,
			"color": [
				0.800557477893118,
				0.18627450980392157,
				0.547617432209331
			]
		},
		{
			"decay": 650,
			"width": 5.8,
			"color": [
				0.584313725490196,
				0.7764705882352941,
				0
			]
		}
	], "Snare Preset", GUI);
});