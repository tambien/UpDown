define(["preset/Interpolator"], function(Interpolator){

	var BassVizSmooth = new Interpolator([
		//bottom
		{
			"rotation" : 2,
			"duration" : 12000,
			"color" : [0, 1, 0],
			"startSize" : 0.5,
			"endSize" : 0.3,
		},
		//middle
		{
			"rotation" : 0,
			"duration" : 6000,
			"color" : [0, 0, 1],
			"startSize" : 1,
			"endSize" : 1,
		},
		//top
		{
			"rotation" : 0,
			"duration" : 2000,
			"color" : [1, 0, 1],
			"startSize" : 0.5,
			"endSize" : 0.2,
		},
	], "smooth");

	return BassVizSmooth;
});