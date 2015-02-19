define(["controller/Mediator", "visuals/Context", "interface/Window", "TERP", "preset/PianoVisuals"], 
	function(Mediator, Context, Window, TERP, Preset){

	"use strict";

	var position = 0.5;

	var PianoVisuals = function(parameters){
		Mediator.route("piano", this.note.bind(this));
	};

	PianoVisuals.prototype.note = function(vals){
		var preset = Preset.get(position);
		var minSpeed = preset.minSpeed;
		var maxSpeed = preset.maxSpeed;
		var width = preset.size;
		for (var i = 0; i < vals.length; i++){
			var speed = TERP.scale(vals[i], 250, 800, minSpeed, maxSpeed);
			var offset = TERP.scale(i, 0, vals.length, -10, 10);
			new PianoNote(Context.background, speed, offset, width);
		}
	};

	/**
	 *  bass bar helper class
	 */
	
	var material = new THREE.MeshBasicMaterial({
		transparent: transparent,
		opacity: opacity,
		blending : THREE[ blending ],
		blendSrc : THREE[ blendSrc ],
		blendDst : THREE[ blendDst ],
		blendEquation : THREE[ blendEq ],
		depthTest : false,
		depthWrite : false,
		side: THREE.DoubleSide,
		color : 0xff0f00,
		emissive : 0x000000
	});

	var geometry = new THREE.PlaneBufferGeometry(20, 3, 32);

	Mediator.route("scroll", function(pos){
		position = pos;
		var preset = Preset.get(pos); 
		var color = preset.color;
		material.color.setRGB(color[0], color[1], color[2]);
	});

	var PianoNote = function(scene, speed, offset, width){
		// var preset = BassPreset.get(Scroll.getPosition());
		var object = new THREE.Mesh( geometry, material);
		var angle = (Window.height() / Window.width());
		object.rotation.z = -angle * (Math.PI / 4);
		var startX = -Window.width() * 0.08;
		var endX = Window.width() * 0.09;
		//y = mx + b
		var startY = -(startX * angle + offset);
		var endY = -(endX * angle + offset);
		object.position.x = startX;
		object.position.y = startY;
		scene.add(object);
		var tween = new TWEEN.Tween({x : startX, y : startY, scaleX : 1})
			.to({x : endX, y : endY, scaleX : 2}, speed)
			.onUpdate(function(){
				object.position.set(this.x, this.y, 0);	
				object.scale.setX(this.scaleX);
				object.scale.setY(1 / this.scaleX);
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