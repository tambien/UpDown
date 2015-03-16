define(["controller/Mediator", "visuals/Context", "interface/Window", 
	"TERP", "preset/PianoVisuals", "controller/Conductor"], 
	function(Mediator, Context, Window, TERP, Preset, Conductor){

	"use strict";

	var position = 0.5;
	
	var PianoVisuals = function(parameters){
		Mediator.route("piano", this.note.bind(this));
	};

	PianoVisuals.prototype.note = function(vals){
		for (var i = 0; i < vals.length; i++){
			var speed = TERP.scale(vals[i], 250, 800, minSpeed, minSpeed * 1.5);
			var offset = TERP.scale(i, 0, vals.length, -10, 10);
			new PianoNote(Context.background, speed, offset, width, length);
		}
	};

	/**
	 *  bass bar helper class
	 */
	
	var material = new THREE.MeshBasicMaterial({
		transparent: Context.transparent,
		opacity: Context.opacity,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : false,
		depthWrite : false,
		side: THREE.DoubleSide,
		color : 0xff0f00,
		emissive : 0x000000
	});

	var geometry = new THREE.PlaneBufferGeometry(10, 3, 32);

	var minSpeed, maxSpeed, width, length;

	Mediator.route("B", function(){
		material.color.setRGB(1, 1, 1);
	});

	Preset.onupdate(function(pre){
		if (Conductor.getMovement() !== 1){
			var color = pre.color;
			material.color.setRGB(color[0], color[1], color[2]);
		}
		minSpeed = pre.minSpeed;
		length = pre.length;
		width = pre.width;
	});

	var PianoNote = function(scene, speed, offset, width, length){
		// var preset = BassPreset.get(Scroll.getPosition());
		var object = new THREE.Mesh( geometry, material);
		var angle = (Window.height() / Window.width());
		object.rotation.z = -angle * (Math.PI / 4);
		var startX = -Window.width() * 0.08;
		var endX = Window.width() * 0.12;
		//y = mx + b
		var startY = -(startX * angle + offset);
		var endY = -(endX * angle + offset);
		object.position.x = startX;
		object.position.y = startY;
		object.scale.setX(length);
		object.scale.setY(width);
		scene.add(object);
		var tween = new TWEEN.Tween({x : startX, y : startY})
			.to({x : endX, y : endY}, speed)
			.onUpdate(function(){
				object.position.set(this.x, this.y, 0);	
			})
			.onComplete(function(){
				scene.remove(object);
				object = null;
				scene = null;
				tween = null;
			})
			.easing( TWEEN.Easing.Quartic.Out )
			.start();
	};

	return PianoVisuals;
});