uniform float amplitude;
uniform float time;
uniform float height;

void main() {
	vec3 squiggle = vec3(position.x + sin(position.y * height + time) * amplitude, position.y, position.z);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(squiggle, 1.0 );
}