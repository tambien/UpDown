define(["shader/kickwave.frag",  "shader/kickwave.vert", "visuals/Context", "THREE"], 
function(fragShader, vertShader, Context, THREE){

	return new THREE.ShaderMaterial({

		transparent: Context.transparent,
		opacity: Context.opacity,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		// side: THREE.DoubleSide,
		depthTest : false,
		depthWrite : false,
		// wireframe : true,

		uniforms: {
			"amplitude":   { type: "f", value: 0 },
			"time":   { type: "f", value: 0 },
			"color" : { type: "c", value: new THREE.Color( 0xffaa00 ) }
		},
		vertexShader: vertShader,
		fragmentShader: fragShader

	});
});