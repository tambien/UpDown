define(["visuals/Context", "controller/Mediator", "shader/KickWave", 
	"TWEEN", "requestAnimationFrame", "interface/Window"], 
	function(Context, Mediator, KickMaterial, TWEEN, requestAnimationFrame, Window){

	"use strict";

	var geometry = new THREE.PlaneBufferGeometry(1, 1, 4, 16);

	/**
	 *  the bass visuals singleton
	 */
	var KickVisuals = function(){

		var objectScale = new THREE.Vector3(0.5, 75, 1);
		var objectPosition = -Window.width() / 30;

		this.object = new THREE.Mesh( geometry, KickMaterial);
		Context.background.add(this.object);
		this.object.scale.set(objectScale.x, objectScale.y, 1);
		this.object.position.setX(objectPosition);

		//second stripe
		this.object2 = new THREE.Mesh( geometry, KickMaterial);
		Context.background.add(this.object2);
		this.object2.scale.set(objectScale.x * 2, objectScale.y, 1);
		this.object2.position.setX(objectPosition + 3);

		this.amplitude = KickMaterial.uniforms.amplitude;
		this.time = KickMaterial.uniforms.time;
		window.height = KickMaterial.uniforms.height;

		Mediator.route("kick", this.note.bind(this));
		this.update();
	};

	KickVisuals.prototype.note = function(){
		var maxAmp = 5;
		var amplitude = this.amplitude;
		this.tween = new TWEEN.Tween({amp : maxAmp})
			.to({amp: 0}, 200)
			.onUpdate(function(){
				amplitude.value = this.amp;
			})
			.easing( TWEEN.Easing.Quadratic.Out );
		var attack = new TWEEN.Tween({amp : amplitude.value})
			.to({amp : maxAmp}, 20)
			.onUpdate(function(){
				amplitude.value = this.amp;
			})
			.easing( TWEEN.Easing.Linear.None)
			.chain(this.tween)
			.start();
	};

	KickVisuals.prototype.update = function(){
		requestAnimationFrame(this.update.bind(this));
		if (this.amplitude.value > 0.0001){
			this.time.value += 1;
		}
	};

	KickVisuals.prototype.dispose = function(){
		material.dispose();
	};

	return KickVisuals;
});