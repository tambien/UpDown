define(["preset/Interpolator"], function(Interpolator){

	var PianoVisSmooth = new Interpolator([
		//top
		{
			"minSpeed" : 1000,
			"maxSpeed" : 2000,
			"color" : [0.5, 0, 1],
			"size" : 0.5
		},
		//middle
		{
			"minSpeed" : 1400,
			"maxSpeed" : 2400,
			"color" : [0.8, 0.4, 1],
			"size" : 0.8
		},
		//bottom
		{
			"minSpeed" : 2000,
			"maxSpeed" : 3000,
			"color" : [1, 0.2, 0],
			"size" : 1
		},
	], "smooth");

	return PianoVisSmooth;
});