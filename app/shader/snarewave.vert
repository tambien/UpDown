uniform float amplitude;
uniform float time;


void main() {
	vec3 squiggle = position;
	float sinAmp = sin(time) * amplitude;
	if (mod(position.y, 0.0625) == 0.0){
		squiggle.x += sinAmp;
	} else {
		squiggle.x -= sinAmp;
	}
	gl_Position = projectionMatrix * modelViewMatrix * vec4(squiggle, 1.0 );
}