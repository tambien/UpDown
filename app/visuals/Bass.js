define(["visuals/Context", "controller/Mediator", "preset/BassVisual", "interface/Scroll"], function(Context, Mediator, BassPreset, Scroll){

	"use strict";

	/**
	 *  the bass visuals singleton
	 */
	var BassVisuals = function(){

		Mediator.route("bass", this.note.bind(this));
	};

	BassVisuals.prototype.note = function(){
		new BassNote(Context.background);
	};

	BassVisuals.prototype.dispose = function(){
		material.dispose();
	};

	/**
	 *  bass bar helper class
	 */
	
	var material = new THREE.MeshLambertMaterial({
		transparent: true,
		opacity : 0.1,
		blending: THREE.SubtractiveBlending,
		// blending: THREE.MultiplyBlending,
		depthTest : false,
		// wireframe : true,
		color : 0x00ff00
	});

	var geometry = new THREE.BoxGeometry( 200, 10, 10, 1, 1);

	Mediator.route("scroll", function(position){
		var preset = BassPreset.get(position); 
		var color = preset.color;
		material.color.setRGB(color[0], color[1], color[2]);
	});

	var BassNote = function(scene, onended){
		var preset = BassPreset.get(Scroll.getPosition());
		var object = new THREE.Mesh( geometry, material);
		var initialSize = 0.001;
		var initialY = -30;
		object.scale.set(1, initialSize, initialSize);
		object.position.y = initialY;
		scene.add(object);
		var tween = new TWEEN.Tween({y : initialY, rotation : 0, size : preset.startSize})
			.to({y : 50, rotation : preset.rotation, size : preset.endSize}, preset.duration)
			.onUpdate(function(){
				object.position.y = this.y;
				object.rotation.x = this.rotation;
				object.scale.set(1, this.size, this.size);
			})
			.onComplete(function(){
				scene.remove(object);
				object = null;
				scene = null;
				tween = null;
				attack = null;
				if (onended) {
					onended();
				}
			})
			.easing( TWEEN.Easing.Linear.None);
		var attack = new TWEEN.Tween({size : initialSize})
			.to({size : preset.startSize}, 300)
			.onUpdate(function(){
				object.scale.set(1, this.size, this.size);	
			})
			.easing( TWEEN.Easing.Elastic.Out)
			.chain(tween)
			.start();
	};

	return BassVisuals;
});