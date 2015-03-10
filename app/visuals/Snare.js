define(["visuals/Context", "controller/Mediator", "shader/SnareWave", 
	"TWEEN", "interface/Window", "preset/SnareVisuals"], 
	function(Context, Mediator, SnareMaterial, TWEEN, Window, Preset){

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
		Mediator.route("update", this.update.bind(this));
		this.update();

		Preset.onupdate(this.presetUpdate.bind(this));

		window.snare = this;
	};

	SnareVisuals.prototype.note = function(){
		var maxAmp = 1;
		var amplitude = this.amplitude;
		this.tween = new TWEEN.Tween({amp : maxAmp})
			.to({amp: 0}, this.decayTime)
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
		if (this.amplitude.value > 0.0001){
			this.time.value += 1;
		}
	};

	SnareVisuals.prototype.presetUpdate = function(pre){
		this.decayTime = pre.decay;
		var color = pre.color;
		this.object.scale.setX(pre.width);
		SnareMaterial.uniforms.color.value.setRGB(color[0], color[1], color[2]);
	};

	SnareVisuals.prototype.dispose = function(){
		material.dispose();
	};

	return SnareVisuals;
});