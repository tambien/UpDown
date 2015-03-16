define(["visuals/Context", "controller/Mediator", "shader/SnareWave", 
	"TWEEN", "interface/Window", "preset/SnareVisuals", "controller/Conductor"], 
	function(Context, Mediator, SnareMaterial, TWEEN, Window, Preset, Conductor){

	"use strict";

	var geometry = new THREE.PlaneBufferGeometry(1, 1, 2, 32);

	var width = 0.001;

	/**
	 *  the bass visuals singleton
	 */
	var SnareVisuals = function(){

		var objectScale = new THREE.Vector3(width, 75, 1);
		var objectPosition = -(Context.width / 2) * 0.76;
		this.object = new THREE.Mesh( geometry, SnareMaterial);
		Context.background.add(this.object);
		this.object.scale.set(objectScale.x, objectScale.y, 1);
		this.object.position.setX(objectPosition);

		this.amplitude = SnareMaterial.uniforms.amplitude;
		this.time = SnareMaterial.uniforms.time;

		Mediator.route("snare", this.note.bind(this));
		Mediator.route("update", this.update.bind(this));
		this.update();

		this.onscreen = false;
		Preset.onupdate(this.presetUpdate.bind(this));
		Window.resize(this.resize.bind(this));
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
		if (!this.onscreen){
			this.onscreen = true;
			var obj = this.object;
			var tween = new TWEEN.Tween({width : 0.001})
				.to({width: width}, 100)
				.onUpdate(function(){
					obj.scale.setX(this.width);
				})
				.easing( TWEEN.Easing.Quadratic.Out )
				.start();
		}
	};

	SnareVisuals.prototype.update = function(){
		if (this.amplitude.value > 0.0001){
			this.time.value += 1;
		}
	};

	SnareVisuals.prototype.resize = function(){
		var objectPosition = -(Context.width / 2) * 0.76;
		this.object.position.setX(objectPosition);
	};

	Mediator.route("B", function(){
		SnareMaterial.uniforms.color.value.setRGB(1, 1, 1);
	});

	SnareVisuals.prototype.presetUpdate = function(pre){
		if (this.onscreen){
			this.object.scale.setX(width);
		}
		if (Conductor.getMovement() !== 1){
			var color = pre.color;
			SnareMaterial.uniforms.color.value.setRGB(color[0], color[1], color[2]);
		}
		width = pre.width;
		this.decayTime = pre.decay;
	};

	SnareVisuals.prototype.dispose = function(){
		material.dispose();
	};

	return SnareVisuals;
});