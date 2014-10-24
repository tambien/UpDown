define(["preset/Interpolator"], function(Interpolator){

	var VoiceVizSmooth = new Interpolator([
		//bottom
		{
			"duration" : 2400,
			"attackTime" : 300,
			"color" : [0.6, 0.6, 0],
		},
		//middle
		{
			"duration" : 1600,
			"color" : [0, 0.5, 0],
			"attackTime" : 200,
		},
		//top
		{
			"attackTime" : 100,
			"duration" : 1000,
			"color" : [1, 0, 0],
		},
	], "smooth");

	return VoiceVizSmooth;
});