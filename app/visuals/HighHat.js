define(["visuals/Context", "controller/Mediator", "interface/Window", "TERP", "preset/HighHatVisual"],
 function(Context, Mediator, Window, TERP, Preset){

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
		color : 0xf00a0a,
		emissive : 0x000000
	});

	var sideLen = 10;

	var geom = new THREE.Geometry();
	var v1 = new THREE.Vector3(0,sideLen/3,0);
	var v2 = new THREE.Vector3(sideLen/3,-sideLen/3,0);
	var v3 = new THREE.Vector3(-sideLen/3,-sideLen/3,0);
	geom.vertices.push( v1 );
	geom.vertices.push( v2 );
	geom.vertices.push( v3 );
	geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
	geom.computeFaceNormals();

	var horizontalScale = 1;
	var decayTime = 400;

	Preset.onupdate(function(pre){
		horizontalScale = pre.width;
		var color = pre.color;
		material.color.setRGB(color[0], color[1], color[2]);
		decayTime = pre.decay;
	});

	/**
	 *  the bass visuals singleton
	 */
	var HighHatVisuals = function(){
		Mediator.route("highhat", this.note.bind(this));
	};

	HighHatVisuals.prototype.note = function(velocity, pan){
		new HighHatNote(velocity, pan);
	};

	/**
	 *  A highat note
	 */
	var HighHatNote = function(velocity, pan){
		var object = new THREE.Mesh( geom, material);
		object.position.setX(TERP.scale(pan, -8, 42));
		object.position.setY(TERP.scale(Math.random(), 26, 0));
		var scale = TERP.scale(velocity, 0.4, 1);
		Context.background.add(object);
		var tween = new TWEEN.Tween({scale : scale})
			.to({scale : 0}, decayTime)
			.onUpdate(function(){
				object.scale.set(this.scale/horizontalScale, this.scale, this.scale);
			})
			.onComplete(function(){
				Context.background.remove(object);
				object = null;
				tween = null;
				attack = null;
			})
			.easing( TWEEN.Easing.Linear.None);
		var attack = new TWEEN.Tween({scale : 0})
			.to({scale : scale}, 100)
			.onUpdate(function(){
				object.scale.set(this.scale/horizontalScale, this.scale, this.scale);
			})
			.easing( TWEEN.Easing.Elastic.Out)
			.chain(tween)
			.start();
	};
	

	return HighHatVisuals;
});