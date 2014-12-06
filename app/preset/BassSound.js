define(["preset/Interpolator", "channel/Bass", "interface/PresetGUI"], function(Interpolator, Bass, GUI){

	var BassSynthStepData = [
		//top
		{
			"oscillator" : {
				"type" : "triangle",
			},
			"envelope" : {
				"attack" : "128n",
				"decay" : "4n",
				"release" : "2n"
			},
			"filterEnvelope" : {
				"attack" : "32n",
				"decay" : "32n",
				"release" : "4n",
			},
		},
		//middle
		{
			"oscillator" : {
				"type" : "square",
			},
			"envelope" : {
				"attack" : "32n",
				"decay" : "8n",
				"release" : "2t"
			},
			"filterEnvelope" : {
				"attack" : "16n",
				"decay" : "32n",
				"release" : "4t",
			},
		},
		//bottom
		{
			"oscillator" : {
				"type" : "pwm",
				"modulationFrequency" : 0.07
			},
			"envelope" : {
				"attack" : "16n",
				"decay" : "8n",
				"release" : "4n"
			},
			"filterEnvelope" : {
				"attack" : "16n",
				"decay" : "16n",
				"release" : "8n",
			},
		},
	];

	var BassSynthSmoothData = [
		//top
		{
			"envelope" : {
				"sustain" : 0.3,
			},
			"filterEnvelope" : {
				"sustain" : 0.05,
				"min" : 120,
				"max" : 8000
			},
			"filter" : {
				"Q" : 30,
				"gain" : 6,
			}
		},
		//bottom
		{
			"envelope" : {
				"sustain" : 0.05,
			},
			"filterEnvelope" : {
				"sustain" : 0.5,
				"min" : 20,
				"max" : 4000
			},
			"filter" : {
				"Q" : 12,
				"gain" : 7,
			}
		},
	];

	GUI.addPreset("Bass Synth Smooth", BassSynthSmoothData);

	var BassSynthStep = new Interpolator(BassSynthStepData, "step");
	var BassSynthSmooth = new Interpolator(BassSynthSmoothData, "smooth", 2);

	return {
		stepwise : BassSynthStep,
		smooth : BassSynthSmooth
	};
});