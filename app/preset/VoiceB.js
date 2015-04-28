define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"envelope": {
				"attack": 0.081,
				"decay": 0.1,
				"release": 0.1,
				"sustain": 0.3
			},
			"filterEnvelope": {
				"attack": 0.006,
				"decay": 0.01,
				"release": 0.17,
				"sustain": 0.97,
				"min": 8000,
				"max": 20
			},
			"filter": {
				"Q": 2
			}
		},
		{
			"envelope": {
				"attack": 0.11,
				"decay": 0.07,
				"release": 0.1,
				"sustain": 0.35
			},
			"filterEnvelope": {
				"attack": 0.12,
				"decay": 0.22,
				"release": 0.18,
				"sustain": 0.84,
				"min": 4500,
				"max": 40
			},
			"filter": {
				"Q": 1
			}
		}
	], "Voice B Preset", GUI);
});