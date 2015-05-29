define(["visuals/Context", "controller/Mediator", "preset/VoiceVisual", "controller/Conductor", "THREE", "TWEEN"], 
	function(Context, Mediator, VoicePreset, Conductor, THREE, TWEEN){

	"use strict";

	var material = new THREE.MeshLambertMaterial({
		transparent: Context.transparent,
		opacity: Context.opacity,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : false,
		depthWrite : false,
		color : 0xff0f00,
		emissive : 0xff0f00
	});

	window.material = material;

	var geometry = new THREE.SphereGeometry(10, 16, 16);

	Mediator.route("B", function(){
		material.color.setRGB(1, 1, 1);
		material.emissive.setRGB(0.5, 0.5, 0.5);
	});

	var duration, attackTime;

	VoicePreset.onupdate(function(preset){
		if (Conductor.getMovement() !== 1){
			var color = preset.color;
			material.color.setRGB(color[0], color[1], color[2]);
			material.emissive.setRGB(color[0], color[1], color[2]);
		}
		duration = preset.duration;
		attackTime = preset.attackTime;
	});

	/**
	 *  the bass visuals singleton
	 */
	var VoiceVisuals = function(){
		this.object = new THREE.Mesh( geometry, material);
		this.object.scale.set(0.01, 0.01, 0.01);
		this.object.position.x = -1000;
		Context.background.add(this.object);
		Mediator.route("voice", this.note.bind(this));
	};

	VoiceVisuals.prototype.note = function(){
		if (Conductor.getMovement() === 1){
			return;
		}
		// new VoiceNote(Context.scene);
		if (this.tween){
			this.tween.stop();
		}
		var object = this.object;
		object.position.x = 0;
		var currentSize = object.scale.x;
		var maxSize = 3;
		this.tween = new TWEEN.Tween({size : maxSize})
			.to({size : 0.001}, duration)
			.easing( TWEEN.Easing.Quadratic.Out)
			.onUpdate(function(){
				object.scale.set(this.size, this.size, this.size);	
			})
			.onComplete(function(){
				object.position.x = -1000;
			});
		var attack = new TWEEN.Tween({size : currentSize})
			.to({size : maxSize}, attackTime)
			.onUpdate(function(){
				object.scale.set(this.size, this.size, this.size);	
			})
			.easing( TWEEN.Easing.Quadratic.Out)
			.chain(this.tween)
			.start();
	};

	VoiceVisuals.prototype.dispose = function(){
		material.dispose();
	};


	return VoiceVisuals;
});