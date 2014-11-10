define(["preset/Interpolator"], function(Interpolator){

	var PianoSynthStep = new Interpolator([
		//top
		{
			"volume" : -6,
			"oscillator" : {
				"type" : "triangle",
			},
			"envelope" : {
				"release" : "16n"
			},
		},
		//middle
		{
			"volume" : 0,
			"oscillator" : {
				"type" : "sine",
			},
			"envelope" : {
				"release" : "8n"
			},
		},
		//bottom
		{
			"volume" : -10,
			"oscillator" : {
				"type" : "pwm",
				"modulationFrequency" : 0.7
			},
			"envelope" : {
				"release" : "2n"
			},
		},
	], "step");

	var PianoSmooth = new Interpolator([
		//top
		{
			"envelope" : {
				"attack" : 0.01,
				"decay" : 0.01,
				"sustain" : 1,
			},
			"filterEnvelope" : {
				"attack" : 0.01,
				"decay" : 0.0,
				"sustain" : 1,
				"release" : 0.5,
				"min" : 20000,
				"max" : 20000
			}
		},
		//middle
		{
			"envelope" : {
				"attack" : 0.04,
				"decay" : 0.01,
				"sustain" : 0.5,
			},
			"filterEnvelope" : {
				"attack" : 0.07,
				"decay" : 0.1,
				"sustain" : 1,
				"release" : 0.4,
				"min" : 2000,
				"max" : 10000
			}
		},
		//bottom
		{
			"envelope" : {
				"attack" : 0.5,
				"decay" : 0.01,
				"sustain" : 0.8,
			},
			"filterEnvelope" : {
				"attack" : 0.7,
				"decay" : 0.2,
				"sustain" : 0.3,
				"release" : 3,
				"min" : 2000,
				"max" : 20000
			}
		},
	], "smooth", 1);

	return {
		stepwise : PianoSynthStep,
		smooth : PianoSmooth
	};
});