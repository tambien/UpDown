uniform lowp float amplitude;
uniform lowp float time;

void main() {
	vec3 squiggle = vec3(position.x + sin(position.y * 9.0 + time) * amplitude, position.y, position.z);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(squiggle, 1.0 );
}