define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	var HHSmoothPreset = [
		//top
		{
			"filter" : {
				"Q" : 10,
			},
			"envelope" : {
				"attack" : 0.002,
				"decay" : 0.01,
			},
			"filterEnvelope" : {
				"attack" : 0.006,
				"decay" : 0.01,
				"min" : 8000,
				"max" : 5000,
			}
		},
		//bottom
		{
			"filter" : {
				"Q" : 4,
			},
			"envelope" : {
				"attack" : 0.02,
				"decay" : 0.03,
			},
			"filterEnvelope" : {
				"attack" : 0.005,
				"decay" : 0.05,
				"min" : 14000,
				"max" : 1000,
			}
		},
	];

	GUI.addPreset("High Hat Smooth", HHSmoothPreset);
	var HighHatSmooth = new Interpolator(HHSmoothPreset, "smooth", 2);

	return HighHatSmooth;
});