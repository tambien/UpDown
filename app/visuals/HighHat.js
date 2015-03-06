define(["visuals/Context", "controller/Mediator", "interface/Window"],
 function(Context, Mediator, Window){

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

	var geom = new THREE.Geometry();
	var v1 = new THREE.Vector3(0,0,0);
	var v2 = new THREE.Vector3(baseLen/2,30,0);
	var v3 = new THREE.Vector3(-baseLen/2,30,0);
	geom.vertices.push( v1 );
	geom.vertices.push( v2 );
	geom.vertices.push( v3 );
	geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
	geom.computeFaceNormals();
	/**
	 *  the bass visuals singleton
	 */
	var HighHatVisuals = function(){
		this.object = new THREE.Mesh( geom, material);
		this.object.position.setX(35);
		this.object.position.setY(-22);
		Context.background.add(this.object);
		var scale = 0.3;
		this.object.scale.set(scale, scale, scale);
		Mediator.route("arp", this.note.bind(this));
		window.triangle = this.object;
	};

	HighHatVisuals.prototype.note = function(){
		this.object.rotateZ(angle);
	};
	

	return HighHatVisuals;
});