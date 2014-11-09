define(["preset/Interpolator"], function(Interpolator){

	var KickSmooth = new Interpolator([
		//top
		{
			"filter" : {
				"Q" : 10,
			},
			"envelope" : {
				"attack" : 0.005,
				"decay" : 0.2,
			},
			"filterEnvelope" : {
				"attack" : 0.006,
				"decay" : 0.1,
				"min" : 20,
				"max" : 350,
			}
		},
		//bottom
		{
			"filter" : {
				"Q" : 4,
			},
			"envelope" : {
				"attack" : 0.04,
				"decay" : 0.1,
			},
			"filterEnvelope" : {
				"attack" : 0.004,
				"decay" : 0.1,
				"min" : 10,
				"max" : 500,
			}
		},
	], "smooth", 2);

	return KickSmooth;
});