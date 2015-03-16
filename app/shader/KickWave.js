define(["text!shader/kickwave.frag",  "text!shader/kickwave.vert", "visuals/Context"], 
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
		side: THREE.DoubleSide,
		// wireframe : true,

		uniforms: {
			"amplitude":   { type: "f", value: 0 },
			"height":   { type: "f", value: 9 },
			"time":   { type: "f", value: 0 },
			"color" : { type: "c", value: new THREE.Color( 0xffaa00 ) }
		},
		vertexShader: vertShader,
		fragmentShader: fragShader

	});
});