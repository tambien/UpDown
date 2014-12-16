define(["preset/Interpolator", "interface/PresetGUI"], function(Interpolator, GUI){


	var downSampleDuration = "32n";

	var VoiceSmoothData = 
	[
		{
			"envelope": {
				"sustain": 0.3
			},
			"filterEnvelope": {
				"sustain": 0.4,
				"min": 470,
				"max": 5500
			},
			"filter": {
				"Q": 10
			}
		},
		{
			"envelope": {
				"sustain": 0.9
			},
			"filterEnvelope": {
				"sustain": 1,
				"min": 330,
				"max": 8700
			},
			"filter": {
				"Q": 1.2
			}
		},
		{
			"envelope": {
				"sustain": 0.3
			},
			"filterEnvelope": {
				"sustain": 1,
				"min": 171,
				"max": 2400
			},
			"filter": {
				"Q": 6.2
			}
		}
	];

	var VoiceStepWiseData = 
	[
		//up
		{
			"player" : {
				"loop" : false
			},
			"envelope" : {
				"attack" : "32t",
				"decay" : "16n",
				"release" : "16n",
			},
			"filterEnvelope" : {
				"attack" : "32t",
				"decay" : "16n",
				"release" : "2n",
			},
		},
		//mid - up
		{
			"player" : {
				"loop" : false
			},
			"envelope" : {
				"attack" : "32n",
				"decay" : "8n",
				"release" : "4n",
			},
			"filterEnvelope" : {
				"attack" : "128n",
				"decay" : "16t",
				"release" : "1m",
			}
		},
		//mid -down
		{
			"player" : {
				"loop" : false
			},
			"envelope" : {
				"attack" : "32n",
				"decay" : "8n",
				"release" : "4n",
			},
			"filterEnvelope" : {
				"attack" : "128n",
				"decay" : "16t",
				"release" : "2n",
			}
		},
		//down
		{
			"player" : {
				"loop" : true
			},
			"envelope" : {
				"attack" : "64t",
				"decay" : "64n",
				"release" : "4n",
			},
			"filterEnvelope" : {
				"attack" : "128n",
				"decay" : "16t",
				"release" : "2n",
			}
		},
	];

	var VoiceStepWise = new Interpolator(VoiceStepWiseData, "step");

	var VoiceSmooth = new Interpolator(VoiceSmoothData, "smooth");
	GUI.addPreset("Voice Smooth", VoiceSmoothData);

	return {
		stepwise : VoiceStepWise,
		smooth : VoiceSmooth
	};
});