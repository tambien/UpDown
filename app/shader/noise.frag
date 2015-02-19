uniform sampler2D tDiffuse;
uniform float amount;

varying vec2 vUv;

void main() {

	// // sample the source
	vec4 cTextureScreen = texture2D( tDiffuse, vUv );

	// // make some noise
	float x = vUv.x * vUv.y * 5.0 *  1000.0;
	x = mod( x, 13.0 ) * mod( x, 123.0 );
	float dx = mod( x, 0.01 );

	// // add noise
	vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * amount, 0.0, 1.0 );

	gl_FragColor =  vec4( cResult, cTextureScreen.a );

}