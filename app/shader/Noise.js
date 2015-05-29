define(["shader/noise.frag",  "shader/colorshift.vert"], 
function(fragShader, vertShader){

	var ColorShader = {

		uniforms: {

			"tDiffuse": { type: "t", value: null },
			"amount": { type: "f", value: 5 },

		},

		vertexShader: vertShader,

		fragmentShader: fragShader

	};

	return ColorShader;
});