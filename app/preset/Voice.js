define(["preset/Interpolator"], function(Interpolator){

	var downSampleDuration = "32n";

	var VoiceStepWise = new Interpolator([
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
	], "step");

	var VoiceSmooth = new Interpolator([
		//up
		{
			"envelope" : {
				"sustain" : 0.3
			},
			"filterEnvelope" : {
				"sustain" : 0.4,
				"min" : 400,
				"max" : 4600
			},
			"filter" : {
				"Q" : 10
			}
		},
		//middle
		/*{
			"envelope" : {
				"sustain" : 0.5
			},
			"filterEnvelope" : {
				"sustain" : 1,
				"min" : 200,
				"max" : 4000
			},
			"filter" : {
				"Q" : 3
			}
		},*/
		//down
		{
			"envelope" : {
				"sustain" : 0.8
			},
			"filterEnvelope" : {
				"sustain" : 1,
				"min" : 20,
				"max" : 2000
			},
			"filter" : {
				"Q" : 5
			}
		},
	], "smooth", 2);

	return {
		stepwise : VoiceStepWise,
		smooth : VoiceSmooth
	};
});