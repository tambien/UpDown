define(["text!shader/colorshift.frag",  "text!shader/colorshift.vert"], 
function(fragShader, vertShader){

	var ColorShader = {

		uniforms: {

			"tDiffuse": { type: "t", value: null },

		},

		vertexShader: vertShader,

		fragmentShader: fragShader

	};

	return ColorShader;
});