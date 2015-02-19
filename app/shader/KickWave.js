define(["text!shader/kickwave.frag",  "text!shader/kickwave.vert"], 
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
			"height":   { type: "f", value: 9 },
			"time":   { type: "f", value: 0 },
			"color" : { type: "c", value: new THREE.Color( 0xffaa00 ) }
		},
		vertexShader: vertShader,
		fragmentShader: fragShader

	});
});