define(["preset/Interpolator", "channel/Bass", "interface/PresetGUI"], function(Interpolator, Bass, GUI){

	return new Interpolator(
		[
			{
				"velocity" : 0.1,
				"synth": {
					"portamento": 0.003,
					"oscillator": {
						"modulationFrequency": 8.6
					},
					"envelope": {
						"attack": 0.005,
						"decay": 0.054,
						"sustain": 0.98,
						"release": 0.064
					},
					"filterEnvelope": {
						"attack": 0.002,
						"decay": 0.29,
						"sustain": 0.276,
						"release": 0.13,
						"min": 7000,
						"max": 810
					},
					"filter": {
						"Q": 4.4
					}
				}
			},
			{
				"velocity" : 0.1,
				"synth": {
					"portamento": 0.015,
					"oscillator": {
						"modulationFrequency": 1.1
					},
					"envelope": {
						"attack": 0.18,
						"decay": 0.04,
						"sustain": 0.034,
						"release": 0.05
					},
					"filterEnvelope": {
						"attack": 0.07,
						"decay": 0.04,
						"sustain": 0.09,
						"release": 0.049,
						"min": 2000,
						"max": 710
					},
					"filter": {
						"Q": 3.5
					}
				}
			}
		], "Arp Preset A", GUI);
});