define(["text!shader/kickwave.frag",  "text!shader/snarewave.vert"], 
function(fragShader, vertShader){

	return new THREE.ShaderMaterial({

		transparent: transparent,
		opacity: opacity,
		blending : THREE[ blending ],
		blendSrc : THREE[ blendSrc ],
		blendDst : THREE[ blendDst ],
		blendEquation : THREE[ blendEq ],
		depthTest : false,
		depthWrite : false,
		side: THREE.DoubleSide,
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