define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"velocity": 0.5,
			"oscillator": {
				"type": "pulse",
				"width": 0.5
			},
			"vibrato": {
				"delay": 0.0131,
				"amount": 0.18
			},
			"envelope": {
				"attack": 0.02,
				"decay": 0.005,
				"sustain": 0.47,
				"release": 0.47
			},
			"filterEnvelope": {
				"attack": 0.37,
				"decay": 0.05,
				"sustain": 0.1,
				"release": 1.1,
				"min": 400,
				"max": 1850
			}
		},
		{
			"velocity": 0.2,
			"oscillator": {
				"type": "pulse",
				"width": 0.128
			},
			"vibrato": {
				"delay": 0.06,
				"amount": 1.7
			},
			"envelope": {
				"attack": 0.177,
				"decay": 0.04,
				"sustain": 0.59,
				"release": 0.02
			},
			"filterEnvelope": {
				"attack": 0.005,
				"decay": 0.06,
				"sustain": 0.21,
				"release": 0.1,
				"min": 700,
				"max": 9000
			}
		}
	], "Piano Preset B", GUI);
});