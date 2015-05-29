define(["shader/kickwave.frag",  "shader/snarewave.vert", "visuals/Context", "THREE"], 
function(fragShader, vertShader, Context, THREE){

	return new THREE.ShaderMaterial({

		transparent: Context.transparent,
		opacity: Context.opacity,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : false,
		depthWrite : false,
		// side: THREE.DoubleSide,
		// wireframe : true,

		uniforms: {
			"amplitude":   { type: "f", value: 0 },
			"time":   { type: "f", value: 0 },
			"color" : { type: "c", value: new THREE.Color( 0xaa00ff ) }
		},
		vertexShader: vertShader,
		fragmentShader: fragShader

	});
});