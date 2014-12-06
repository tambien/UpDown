define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	var BassVizSmoothData = [
		//top
		{
			"rotation" : -1,
			"duration" : 1000,
			"color" : [1, 0, 1],
			"startSize" : 0.4,
			"endSize" : 0.001,
			"attackTime" : 300,
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
		//bottom
		{
			"rotation" : 2,
			"duration" : 2400,
			"color" : [0, 1, 0],
			"startSize" : 1,
			"endSize" : 1,
			"attackTime" : 700,
		},
	];
	
	GUI.addPreset("Bass Visuals", BassVizSmoothData);

	var BassVizSmooth = new Interpolator(BassVizSmoothData, "smooth");


	return BassVizSmooth;
});