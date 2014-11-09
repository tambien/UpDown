define(["preset/Interpolator", "channel/Bass"], function(Interpolator, Bass){

	var BassSynthStep = new Interpolator([
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
	], "step");

	var BassSynthSmooth = new Interpolator([
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
	], "smooth", 2);

	return {
		stepwise : BassSynthStep,
		smooth : BassSynthSmooth
	};
});