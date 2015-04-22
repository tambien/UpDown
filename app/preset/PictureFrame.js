define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"frame": [
				1,
				0,
				0.03529411764705881
			],
			"accent": [
				0,
				1,
				0
			]
		},
		{
			"frame": [
				0.9529411764705882,
				1,
				0
			],
			"accent": [
				0,
				1,
				0.45882352941176474
			]
		},
		{
			"frame": [
				0.8117647058823529,
				1,
				0
			],
			"accent": [
				0.5764705882352941,
				1,
				0
			]
		}
	], "Picture Frame Preset", GUI);
});