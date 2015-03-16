define(["visuals/Context", "controller/Mediator", "interface/Window", "TWEEN", 
	"preset/ArpVisuals", "controller/Conductor"],
 function(Context, Mediator, Window, TWEEN, Preset, Conductor){

	"use strict";

	var material = new THREE.MeshBasicMaterial({
		transparent: Context.transparent,
		opacity: 0.6,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : false,
		depthWrite : false,
		side: THREE.DoubleSide,
		color : 0xf00a00,
		emissive : 0x000000
	});

	var geometry = new THREE.PlaneBufferGeometry(3, 3, 2);

	var offsetX = 35;
	var offsetY = -22;
	var radius = 4;

	/**
	 *  the bass visuals singleton
	 */
	var ArpVisuals = function(){
		this.object = new THREE.Object3D();
		this.object.position.setX(offsetX);
		this.object.position.setY(offsetY);
		Context.background.add(this.object);
		this.index = 0;
		this.scaling = 1;
		this.growth = 1;
		this.squares = [];
		for (var i = 0; i < 5; i++){
			var square = new THREE.Mesh( geometry, material);
			square.scale.set(0.0001, 0.0001, 1);
			this.squares.push(square);
			this.object.add(square);
		}
		Mediator.route("arp", this.note.bind(this));
		Preset.onupdate(this.updatePreset.bind(this));
	};

	ArpVisuals.prototype.note = function(){
		var obj = this.squares[this.index];
		var size = this.scaling + (this.growth * (this.index + 1) / this.squares.length);
		var tween = new TWEEN.Tween({size : size})
			.to({size : 0.0001}, 100)
			.onUpdate(function(){
				obj.scale.set(this.size, this.size, 1);
			})
			.onComplete(function(){
				obj = null;
				tween = null;
			})
			.easing( TWEEN.Easing.Linear.None);
		var attack = new TWEEN.Tween({size : 0.0001})
			.to({size : size}, 60)
			.onUpdate(function(){
				obj.scale.set(this.size, this.size, 1);	
			})
			.easing( TWEEN.Easing.Elastic.Out)
			.chain(tween)
			.start();
		this.index = (this.index + 1) % this.squares.length;
	};

	Mediator.route("B", function(){
		material.color.setRGB(1, 1, 1);
	});

	ArpVisuals.prototype.updatePreset = function(pre){
		if (Conductor.getMovement() !== 1){
			var color = pre.color;
			material.color.setRGB(color[0], color[1], color[2]);
		}
		var angle = pre.angle;
		for (var i = 0; i < this.squares.length; i++){
			var square = this.squares[i];
			var rad = i * radius;
			var x = Math.sin(angle) * rad;
			var y = Math.cos(angle) * rad;
			square.position.set(x, y, 0);
		}
		this.scaling = pre.size;
		this.growth = pre.growth;
	};
	

	return ArpVisuals;
});