define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"decay": 230,
			"width": 1.5,
			"color": [
				0.800557477893118,
				0.18627450980392157,
				0.547617432209331
			]
		},
		{
			"decay": 700,
			"width": 4,
			"color": [
				0.7594434832756632,
				0.911284121491734,
				0.303921568627451
			]
		}
	], "Snare Preset", GUI);
});