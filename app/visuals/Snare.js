define(["visuals/Context", "controller/Mediator", "shader/SnareWave", 
	"TWEEN", "requestAnimationFrame", "interface/Window"], 
	function(Context, Mediator, SnareMaterial, TWEEN, requestAnimationFrame, Window){

	"use strict";

	var geometry = new THREE.PlaneBufferGeometry(1, 1, 2, 32);

	/**
	 *  the bass visuals singleton
	 */
	var SnareVisuals = function(){

		var objectScale = new THREE.Vector3(4, 75, 1);
		var objectPosition = -Window.width() / 25;
		this.object = new THREE.Mesh( geometry, SnareMaterial);
		Context.background.add(this.object);
		this.object.scale.set(objectScale.x, objectScale.y, 1);
		this.object.position.setX(objectPosition);

		this.amplitude = SnareMaterial.uniforms.amplitude;
		this.time = SnareMaterial.uniforms.time;

		Mediator.route("snare", this.note.bind(this));
		this.update();

		window.snare = this;
	};

	SnareVisuals.prototype.note = function(){
		var maxAmp = 1;
		var amplitude = this.amplitude;
		this.tween = new TWEEN.Tween({amp : maxAmp})
			.to({amp: 0}, 400)
			.onUpdate(function(){
				amplitude.value = this.amp;
			})
			.easing( TWEEN.Easing.Quadratic.Out );
		var attack = new TWEEN.Tween({amp : amplitude.value})
			.to({amp : maxAmp}, 100)
			.onUpdate(function(){
				amplitude.value = this.amp;
			})
			.easing( TWEEN.Easing.Elastic.Out)
			.chain(this.tween)
			.start();
	};

	SnareVisuals.prototype.update = function(){
		requestAnimationFrame(this.update.bind(this));
		if (this.amplitude.value > 0.0001){
			this.time.value += 1;
		}
	};

	SnareVisuals.prototype.dispose = function(){
		material.dispose();
	};

	return SnareVisuals;
});