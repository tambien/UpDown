define(["preset/Interpolator"], function(Interpolator){

	var BassVizSmooth = new Interpolator([
		//bottom
		{
			"rotation" : 2,
			"duration" : 2400,
			"color" : [0, 1, 0],
			"startSize" : 1,
			"endSize" : 1,
			"attackTime" : 700,
		},
		//middle
		{
			"rotation" : 0,
			"duration" : 1600,
			"color" : [0, 0, 1],
			"startSize" : 0.6,
			"endSize" : 0.1,
			"attackTime" : 500,
		},
		//top
		{
			"rotation" : -1,
			"duration" : 1000,
			"color" : [1, 0, 1],
			"startSize" : 0.4,
			"endSize" : 0.001,
			"attackTime" : 300,
		},
	], "smooth");

	return BassVizSmooth;
});