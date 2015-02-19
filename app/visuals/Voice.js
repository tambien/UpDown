define(["visuals/Context", "controller/Mediator", "preset/VoiceVisual", "interface/Scroll"], 
	function(Context, Mediator, VoicePreset, Scroll){

	"use strict";

	var material = new THREE.MeshLambertMaterial({
		transparent: transparent,
		opacity: opacity,
		blending : THREE[ blending ],
		blendSrc : THREE[ blendSrc ],
		blendDst : THREE[ blendDst ],
		blendEquation : THREE[ blendEq ],
		depthTest : false,
		depthWrite : false,
		color : 0xff0f00,
		emissive : 0xff0f00
	});

	window.material = material;

	var geometry = new THREE.SphereGeometry(10, 32, 32);

	Mediator.route("scroll", function(position){
		var preset = VoicePreset.get(position); 
		var color = preset.color;
		material.color.setRGB(color[0], color[1], color[2]);
		material.emissive.setRGB(color[0], color[1], color[2]);
	});

	/**
	 *  the bass visuals singleton
	 */
	var VoiceVisuals = function(){
		this.object = new THREE.Mesh( geometry, material);
		this.object.scale.set(0.001, 0.001, 0.001);
		Context.background.add(this.object);
		Mediator.route("voice", this.note.bind(this));
	};

	VoiceVisuals.prototype.note = function(){
		var preset = VoicePreset.get(Scroll.getPosition());
		// new VoiceNote(Context.scene);
		if (this.tween){
			this.tween.stop();
		}
		var object = this.object;
		var currentSize = object.scale.x;
		var maxSize = 3;
		this.tween = new TWEEN.Tween({size : maxSize})
			.to({size : 0.001}, preset.duration)
			.easing( TWEEN.Easing.Quadratic.Out)
			.onUpdate(function(){
				object.scale.set(this.size, this.size, this.size);	
			});
		var attack = new TWEEN.Tween({size : currentSize})
			.to({size : maxSize}, preset.attackTime)
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