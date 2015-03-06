define(["visuals/Context", "controller/Mediator", "interface/Window", "TWEEN"],
 function(Context, Mediator, Window, TWEEN){

	"use strict";

	var material = new THREE.MeshBasicMaterial({
		transparent: transparent,
		opacity: 0.6,
		blending : THREE[ blending ],
		blendSrc : THREE[ blendSrc ],
		blendDst : THREE[ blendDst ],
		blendEquation : THREE[ blendEq ],
		depthTest : false,
		depthWrite : false,
		side: THREE.DoubleSide,
		color : 0xf00a00,
		emissive : 0x000000
	});

	var angle = Math.PI * 2 / 5;
	var sideLen = 30;
	var baseLen = 35.267;

	var geometry = new THREE.PlaneBufferGeometry(10, 10, 32);
	/**
	 *  the bass visuals singleton
	 */
	var ArpVisuals = function(){
		this.object = new THREE.Mesh( geometry, material);
		this.object.position.setX(35);
		this.object.position.setY(-22);
		this.angle = 0;
		Context.background.add(this.object);
		var scale = 0.3;
		this.object.scale.set(scale, scale, scale);
		Mediator.route("arp", this.note.bind(this));
		window.triangle = this.object;
	};

	ArpVisuals.prototype.centerX = 35;

	ArpVisuals.prototype.centerY = -22;

	ArpVisuals.prototype.radius = 5;

	ArpVisuals.prototype.note = function(){
		this.angle += angle;
		var x = Math.sin(this.angle) * this.radius + this.centerX;
		var y = Math.cos(this.angle) * this.radius + this.centerY;
		var obj = this.object;
		this.tween = new TWEEN.Tween({x : this.object.position.x, y : this.object.position.y})
			.to({x : x, y : y}, 100)
			.onUpdate(function(){
				obj.position.set(this.x, this.y, 0);	
			})
			.easing( TWEEN.Easing.Quartic.Out )
			.start();
	};
	

	return ArpVisuals;
});