define(["controller/Mediator", "visuals/Context", "interface/Window", "TERP"], function(Mediator, Context, Window, TERP){

	"use strict";

	var PianoVisuals = function(parameters){
		Mediator.route("piano", this.note.bind(this));
	};

	PianoVisuals.prototype.note = function(vals){
		for (var i = 0; i < vals.length; i++){
			var speed = TERP.scale(vals[i], 250, 800, 1500, 2000);
			new PianoNote(Context.background, speed, TERP.scale(i, 0, vals.length, -10, 10));
		}
	};

	/**
	 *  bass bar helper class
	 */
	
	var material = new THREE.MeshBasicMaterial({
		transparent: true,
		opacity : 0.2,
		side: THREE.DoubleSide,
		blending: THREE.SubtractiveBlending,
		// blending: THREE.NormalBlending,
		depthTest : false,
		color : 0xff0f00
	});

	var geometry = new THREE.PlaneGeometry(20, 3, 32);

	var PianoNote = function(scene, speed, offset){
		// var preset = BassPreset.get(Scroll.getPosition());
		var object = new THREE.Mesh( geometry, material);
		var angle = (Window.width() / Window.height());
		object.rotation.z = -angle * (Math.PI / 4);
		var startX = -40;
		var endX = 40;
		//y = mx + b
		var startY = -(startX * angle + offset);
		var endY = -(endX * angle + offset);
		object.position.x = startX;
		object.position.y = startY;
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
			.easing( TWEEN.Easing.Linear.None)
			.start();
	};

	return PianoVisuals;
});