define(["visuals/Context", "controller/Mediator", "shader/KickWave", 
	"TWEEN", "interface/Window", "preset/KickVisual", "controller/Conductor"], 
	function(Context, Mediator, KickMaterial, TWEEN, Window, Preset, Conductor){

	"use strict";

	var geometry = new THREE.PlaneBufferGeometry(1, 1, 4, 16);

	var width = 0.001;

	/**
	 *  the bass visuals singleton
	 */
	var KickVisuals = function(){

		var objectScale = new THREE.Vector3(width, 75, 1);
		var objectPosition = -(Context.width / 2) * 0.66;

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

		this.onscreen = false;

		Mediator.route("kick", this.note.bind(this));
		Mediator.route("update", this.update.bind(this));
		Preset.onupdate(this.presetUpdate.bind(this));

		Window.resize(this.resize.bind(this));
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
		if (!this.onscreen){
			this.onscreen = true;
			var obj = this.object;
			var obj2 = this.object2;
			var tween = new TWEEN.Tween({width : 0.001})
				.to({width: width}, 200)
				.onUpdate(function(){
					obj.scale.setX(this.width);
					obj2.scale.setX(this.width * 2);
				})
				.easing( TWEEN.Easing.Quadratic.Out )
				.start();
		}
	};

	KickVisuals.prototype.update = function(){
		if (this.amplitude.value > 0.0001){
			this.time.value += 1;
		}
	};

	KickVisuals.prototype.dispose = function(){
		material.dispose();
	};

	KickVisuals.prototype.resize = function(w, h){
		var objectPosition = -(Context.width / 2) * 0.66;
		this.object.position.setX(objectPosition);
		this.object2.position.setX(objectPosition + 3);
	};

	Mediator.route("B", function(){
		KickMaterial.uniforms.color.value.setRGB(1, 1, 1);
	});

	KickVisuals.prototype.presetUpdate = function(pre){
		if (this.onscreen){
			this.object.scale.setX(width);
			this.object2.scale.setX(width * 2);
		}
		if (Conductor.getMovement() !== 1){
			var color = pre.color;
			KickMaterial.uniforms.color.value.setRGB(color[0], color[1], color[2]);
			width = pre.width;
		} 
	};

	return KickVisuals;
});