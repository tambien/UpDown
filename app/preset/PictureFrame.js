define(["preset/Interpolator", "interface/VisualGUI"], function(Interpolator, GUI){

	return new Interpolator(
	[
		{
			"frame": [
				0.3431372549019608,
				0.04036908881199519,
				0
			],
			"accent": [
				0.49778931180315256,
				0.06862745098039214,
				0.39681005043309125
			]
		},
		{
			"frame": [
				0.29099667548680375,
				0.019607843137254943,
				0.404075355632449
			],
			"accent": [
				0,
				0.5098039215686274,
				0
			]
		}
	], "Picture Frame Preset", GUI);
});