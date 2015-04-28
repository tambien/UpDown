define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	return new Interpolator([
		{
			"velocity": 0.5,
			"oscillator": {
				"type": "triangle"
			},
			"vibrato": {
				"delay": 0.195,
				"amount": 0.3
			},
			"envelope": {
				"attack": 0.039,
				"decay": 0.023,
				"sustain": 1,
				"release": 0.05
			},
			"filterEnvelope": {
				"attack": 0.098,
				"decay": 0,
				"sustain": 1,
				"release": 0.08,
				"min": 3000,
				"max": 16000
			}
		},
		{
			"velocity": 0.4,
			"oscillator": {
				"type": "sawtooth"
			},
			"vibrato": {
				"delay": 0.001,
				"amount": 0.5
			},
			"envelope": {
				"attack": 0.234,
				"decay": 0.018,
				"sustain": 0.69,
				"release": 0.76
			},
			"filterEnvelope": {
				"attack": 0.63,
				"decay": 0.7,
				"sustain": 0.1,
				"release": 1.79,
				"min": 1900,
				"max": 100
			}
		},
		{
			"velocity": 0.2,
			"oscillator": {
				"type": "pwm"
			},
			"vibrato": {
				"delay": 0.446,
				"amount": 1
			},
			"envelope": {
				"attack": 0.31,
				"decay": 0.031,
				"sustain": 0.64,
				"release": 3.3
			},
			"filterEnvelope": {
				"attack": 0.7,
				"decay": 0.2,
				"sustain": 0.3,
				"release": 3,
				"min": 2000,
				"max": 20000
			}
		}
	], "Piano Preset A", GUI);
});