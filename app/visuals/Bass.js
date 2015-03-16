define(["visuals/Context", "controller/Mediator", "preset/BassVisual", "controller/Conductor"], 
function(Context, Mediator, BassPreset, Conductor){

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
		transparent: Context.transparent,
		opacity: Context.opacity,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : false,
		depthWrite : false,
		// wireframe : true,
		color : 0x00ff00,
		emissive : 0x000000
	});

	var geometry = new THREE.BoxGeometry( 200, 10, 10, 1, 1);

	var startSize, endSize, rotation, duration;

	Mediator.route("B", function(){
		material.color.setRGB(1, 1, 1);
		material.emissive.setRGB(0.5, 0.5, 0.5);
	});

	BassPreset.onupdate(function(preset){
		if (Conductor.getMovement() !== 1){
			var color = preset.color;
			material.color.setRGB(color[0], color[1], color[2]);
			material.emissive.setRGB(color[0] - 0.5, color[1] - 0.5, color[2] - 0.5);
		}
		startSize = preset.startSize;
		endSize = preset.endSize;
		rotation = preset.rotation;
		duration = preset.duration;
	});

	var BassNote = function(scene){
		var object = new THREE.Mesh( geometry, material);
		var initialSize = 0.001;
		var initialY = -30;
		object.scale.set(1, initialSize, initialSize);
		object.position.y = initialY;
		scene.add(object);
		var tween = new TWEEN.Tween({y : initialY, rotation : 0, size : startSize})
			.to({y : 50, rotation : rotation, size : endSize}, duration)
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
			})
			.easing( TWEEN.Easing.Linear.None);
		var attack = new TWEEN.Tween({size : initialSize})
			.to({size : startSize}, 300)
			.onUpdate(function(){
				object.scale.set(1, this.size, this.size);	
			})
			.easing( TWEEN.Easing.Elastic.Out)
			.chain(tween)
			.start();
	};

	return BassVisuals;
});