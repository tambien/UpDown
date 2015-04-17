define(["controller/Mediator", "visuals/Context", "interface/Window", 
	"TERP", "preset/PianoVisuals", "controller/Conductor", "util/Config"], 
	function(Mediator, Context, Window, TERP, Preset, Conductor, Config){

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
		// side: THREE.DoubleSide,
		color : 0xff0f00,
		emissive : 0x000000
	});

	var geometry = new THREE.PlaneBufferGeometry(10, 3, 2, 2);

	var minSpeed, maxSpeed, width, length;

	Preset.onupdate(function(pre){
		if (Conductor.getMovement() !== 1){
			var color = pre.color;
			material.color.setRGB(color[0], color[1], color[2]);
		}
		minSpeed = pre.minSpeed;
		length = pre.length;
		width = pre.width;
	});

	var startX, startY, endX, endY, angle;
	startX = -Context.width * 0.4;
	endX = Context.width * 0.4;
	startY = Context.height;
	endY = -Context.height;
	angle = Math.atan2(endY - startY, endX - startX);

	Window.resize(function(){
		startX = -Context.width * 0.4;
		endX = Context.width * 0.4;
		startY = Context.height;
		endY = -Context.height;
		angle = Math.atan2(endY - startY, endX - startX);
	});

	var PianoNote = function(scene, speed, offset, width, length){
		// var preset = BassPreset.get(Scroll.getPosition());
		var object = new THREE.Mesh( geometry, material);
		object.rotation.z = angle;
		object.position.x = startX + offset;
		object.position.y = startY;
		object.scale.setX(-length);
		object.scale.setY(width);
		scene.add(object);
		var tween = new TWEEN.Tween({x : startX + offset, y : startY})
			.to({x : endX + offset, y : endY}, speed)
			.onUpdate(function(){
				object.position.setX(this.x);	
				object.position.setY(this.y);	
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

	/**
	 *  Make a note on the first sustained chord
	 */
	var startKeys = [];
	Mediator.route("start", function(){
		for (var i = 0; i < 4 ; i++){
			var obj = new THREE.Mesh( geometry, material);
			obj.position.x = TERP.scale(i, 0, 3, -10, 10);
			obj.rotation.z = Math.PI / 2;
			startKeys[i] = obj;
			Context.background.add(obj);
			animateInKey(obj);
		}
	});

	function animateInKey(object){
		var tween = new TWEEN.Tween({scale : 0.001})
			.to({scale : Math.random() * 2 + 1.5}, 1500)
			.onUpdate(function(){
				object.scale.setX(-this.scale);	
			})
			.onComplete(function(){
				tween = null;
			})
			.easing( TWEEN.Easing.Elastic.Out)
			.start();
	}

	function animateOutKey(object){
		var currentScale = object.scale.x;
		var tween = new TWEEN.Tween({scale : currentScale})
			.to({scale : -0.001}, 400)
			.onUpdate(function(){
				object.scale.setX(this.scale);	
			})
			.onComplete(function(){
				Context.background.remove(object);
			})
			.easing( TWEEN.Easing.Linear.None)
			.start();
	}

	Mediator.route("firstScroll", function(){
		for (var i = 0; i < startKeys.length ; i++){
			var obj = startKeys[i];
			animateOutKey(obj);
		}
	});

	return PianoVisuals;
});