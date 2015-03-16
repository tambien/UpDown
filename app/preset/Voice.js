define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"player": {
				"volume": -6,
				"loop": false
			},
			"envelope": {
				"attack": "32t",
				"decay": "16n",
				"release": "16n",
				"sustain": 0.3
			},
			"filterEnvelope": {
				"attack": "32t",
				"decay": "16n",
				"release": "2n",
				"sustain": 0.4,
				"min": 470,
				"max": 5500
			},
			"filter": {
				"Q": 10
			}
		},
		{
			"player": {
				"volume": -6,
				"loop": false
			},
			"envelope": {
				"attack": "32n",
				"decay": "8n",
				"release": "4n",
				"sustain": 0.9
			},
			"filterEnvelope": {
				"attack": "128n",
				"decay": "16t",
				"release": "1m",
				"sustain": 1,
				"min": 330,
				"max": 8700
			},
			"filter": {
				"Q": 1.2
			}
		},
		{
			"player": {
				"volume": 0,
				"loop": true
			},
			"envelope": {
				"sustain": 0.2,
				"attack": "64t",
				"decay": "64n",
				"release": "8n"
			},
			"filterEnvelope": {
				"sustain": 1,
				"min": 941,
				"max": 3700,
				"attack": "128n",
				"decay": "16t",
				"release": "4n"
			},
			"filter": {
				"Q": 8.6
			}
		}
	], "Voice Preset", GUI);
});