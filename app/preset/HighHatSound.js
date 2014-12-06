define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	var HHSmoothPreset = [
		{
			"filter": {
				"Q": 5
			},
			"envelope": {
				"attack": 0.002,
				"decay": 0.01
			},
			"filterEnvelope": {
				"attack": 0.006,
				"decay": 0.005,
				"min": 4000,
				"max": 200
			}
		},
		{
			"filter": {
				"Q": 20
			},
			"envelope": {
				"attack": 0.001,
				"decay": 0.03
			},
			"filterEnvelope": {
				"attack": 0.005,
				"decay": 0.08,
				"min": 13000,
				"max": 1000
			}
		}
	];

	GUI.addPreset("High Hat Smooth", HHSmoothPreset);
	var HighHatSmooth = new Interpolator(HHSmoothPreset, "smooth", 2);

	return HighHatSmooth;
});