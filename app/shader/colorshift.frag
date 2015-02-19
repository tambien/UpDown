uniform sampler2D tDiffuse;

varying vec2 vUv;

const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec4 white = vec4(1.0, 1.0, 1.0, 1.0);

void main() {
	vec4 color = texture2D(tDiffuse, vUv);
	if (!all(equal(color, black))){
		gl_FragColor = white - color;
	} else {
		gl_FragColor = white;
	}
}