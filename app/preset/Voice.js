define(["preset/Interpolator"], function(Interpolator){

	var downSampleDuration = "32n";

	var VoiceStepWise = new Interpolator([
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
		}
	], "step");

	var VoiceSmooth = new Interpolator([
		//down
		{
			"envelope" : {
				"sustain" : 0.8
			},
			"filterEnvelope" : {
				"sustain" : 1,
				"min" : 200,
				"max" : 3000
			},
			"filter" : {
				"Q" : 5
			}
		},
		//up
		{
			"envelope" : {
				"sustain" : 0.3
			},
			"filterEnvelope" : {
				"sustain" : 0.4,
				"min" : 200,
				"max" : 10000
			},
			"filter" : {
				"Q" : 8
			}
		}
	], "smooth", 0.5);

	return {
		stepwise : VoiceStepWise,
		smooth : VoiceSmooth
	};
});