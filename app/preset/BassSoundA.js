define(["preset/Interpolator", "channel/Bass", "interface/PresetGUI"], function(Interpolator, Bass, GUI){

	return new Interpolator([
		{
			"volume": -7.5,
			"synth": {
				"envelope": {
					"attack": 0.085,
					"decay": 0.2,
					"sustain": 0.4,
					"release": 0.077
				},
				"filterEnvelope": {
					"attack": 0.002,
					"decay": 0.201,
					"sustain": 0.01,
					"release": 0.13,
					"min": 120,
					"max": 4800
				},
				"filter": {
					"Q": 3.4
				}
			},
		},
		{
			"volume": -2,
			"synth": {
				"envelope": {
					"attack": 0.1,
					"decay": 0.45,
					"sustain": 0.06,
					"release": 0.83
				},
				"filterEnvelope": {
					"attack": 0.096,
					"decay": 0.31,
					"sustain": 0.19,
					"release": 0.03,
					"min": 70,
					"max": 6500
				},
				"filter": {
					"Q": 5.2
				}
			}
		}
	], "Bass Preset A", GUI);
});