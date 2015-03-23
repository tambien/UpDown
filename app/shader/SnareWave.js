define(["text!shader/kickwave.frag",  "text!shader/snarewave.vert", "visuals/Context"], 
function(fragShader, vertShader, Context){

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