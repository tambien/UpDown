define(["preset/Interpolator", "channel/Bass", "interface/PresetGUI"], function(Interpolator, Bass, GUI){

	return new Interpolator(
	[
		{
			"volume": -4,
			"synth": {
				"envelope": {
					"attack": 0.092,
					"decay": 0.011,
					"sustain": 0.62,
					"release": 0.106
				},
				"filterEnvelope": {
					"attack": 0.0149,
					"decay": 0.05,
					"sustain": 0.101,
					"release": 0.13,
					"min": 110,
					"max": 2800
				},
				"filter": {
					"Q": 5.2
				}
			}
		},
		{
			"volume": 0,
			"synth": {
				"envelope": {
					"attack": 0.1308,
					"decay": 0.55,
					"sustain": 0.12,
					"release": 0.35
				},
				"filterEnvelope": {
					"attack": 0.023,
					"decay": 0.107,
					"sustain": 0.45,
					"release": 0.147,
					"min": 263,
					"max": 7000
				},
				"filter": {
					"Q": 4
				}
			}
		}
	], "Bass Preset B", GUI);
});