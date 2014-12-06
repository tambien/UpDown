define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	var HHSmoothPreset = 
	[
		{
			"filter": {
				"Q": 7.1
			},
			"envelope": {
				"attack": 0.0007,
				"decay": 0.009
			},
			"filterEnvelope": {
				"attack": 0.0033,
				"decay": 0.0119
			}
		},
		{
			"filter": {
				"Q": 10
			},
			"envelope": {
				"attack": 0.02,
				"decay": 0.065
			},
			"filterEnvelope": {
				"attack": 0.0002,
				"decay": 0.12
			}
		}
	];

	GUI.addPreset("High Hat Smooth", HHSmoothPreset);
	var HighHatSmooth = new Interpolator(HHSmoothPreset, "smooth");

	return HighHatSmooth;
});