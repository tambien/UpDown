define(["preset/Interpolator"], function(Interpolator){

	return new Interpolator([
		//top
		{
			"attackTime" : 100,
			"duration" : 1000,
			"color" : [1, 0, 0],
		},
		//middle
		{
			"duration" : 1600,
			"color" : [0, 0.5, 0],
			"attackTime" : 200,
		},
		//bottom
		{
			"duration" : 2400,
			"attackTime" : 300,
			"color" : [0.6, 0.6, 0],
		},
	], "Voice Visuals");
});