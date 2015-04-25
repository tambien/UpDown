define(["preset/Interpolator", "channel/Bass", "interface/PresetGUI"], function(Interpolator, Bass, GUI){

	return new Interpolator(
		[
			{
				"velocity" : 1,
				"synth": {
					"portamento": 0,
					"oscillator": {
						"modulationFrequency": 0.01
					},
					"envelope": {
						"attack": 0.03,
						"decay": 0.188,
						"sustain": 0.15,
						"release": 0.043
					},
					"filterEnvelope": {
						"attack": 0.0023,
						"decay": 0.14,
						"sustain": 0.12,
						"release": 0.21,
						"min": 300,
						"max": 1530
					},
					"filter": {
						"Q": 5.7
					}
				}
			},
			{
				"velocity" : 1,
				"synth": {
					"portamento": 0.086,
					"oscillator": {
						"modulationFrequency": 0.2
					},
					"envelope": {
						"attack": 0.13,
						"decay": 0.12,
						"sustain": 0.35,
						"release": 0.098
					},
					"filterEnvelope": {
						"attack": 0.58,
						"decay": 0.122,
						"sustain": 0.151,
						"release": 0.49,
						"min": 3500,
						"max": 960
					},
					"filter": {
						"Q": 1.6
					}
				}
			}
		], "Arp Preset B", GUI);
});