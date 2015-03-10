define(["visuals/Context", "controller/Mediator", "shader/KickWave", 
	"TWEEN", "interface/Window", "preset/KickVisual"], 
	function(Context, Mediator, KickMaterial, TWEEN, Window, Preset){

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

		Mediator.route("kick", this.note.bind(this));
		Mediator.route("update", this.update.bind(this));
		Preset.onupdate(this.presetUpdate.bind(this));
	};

	KickVisuals.prototype.note = function(){
		var maxAmp = 5;
		var amplitude = this.amplitude;
		this.tween = new TWEEN.Tween({amp : maxAmp})
			.to({amp: 0}, 240)
			.onUpdate(function(){
				amplitude.value = this.amp;
			})
			.easing( TWEEN.Easing.Quadratic.Out );
		var attack = new TWEEN.Tween({amp : amplitude.value})
			.to({amp : maxAmp}, 40)
			.onUpdate(function(){
				amplitude.value = this.amp;
			})
			.easing( TWEEN.Easing.Linear.None)
			.chain(this.tween)
			.start();
	};

	KickVisuals.prototype.update = function(){
		if (this.amplitude.value > 0.0001){
			this.time.value += 1;
		}
	};

	KickVisuals.prototype.dispose = function(){
		material.dispose();
	};

	KickVisuals.prototype.presetUpdate = function(pre){
		this.object.scale.setX(pre.width);
		this.object2.scale.setX(pre.width * 2);
		var color = pre.color;
		KickMaterial.uniforms.color.value.setRGB(color[0], color[1], color[2]);
	};

	return KickVisuals;
});