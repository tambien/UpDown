define(["visuals/Context", "controller/Mediator", "interface/Window", 
	"TERP", "preset/HighHatVisual", "controller/Conductor", "THREE", "TWEEN"],
 function(Context, Mediator, Window, TERP, Preset, Conductor, THREE, TWEEN){

	"use strict";

	var material = new THREE.MeshBasicMaterial({
		transparent: Context.transparent,
		opacity: 0.6,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		// side: THREE.DoubleSide,
		depthTest : false,
		depthWrite : false,
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

	Mediator.route("B", function(){
		material.color.setRGB(1, 1, 1);
	});

	Preset.onupdate(function(pre){
		horizontalScale = pre.width;
		if (Conductor.getMovement() !== 1){
			var color = pre.color;
			material.color.setRGB(color[0], color[1], color[2]);
		}
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
		object.position.setX(TERP.scale(pan, -Context.width/6, Context.width/2.5));
		object.position.setY(TERP.scale(Math.random(), Context.height/3, 0));
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
			.to({scale : scale}, scale * 20)
			.onUpdate(function(){
				object.scale.set(this.scale/horizontalScale, this.scale, this.scale);
			})
			.onComplete(function(){
				attack = null;
			})
			.easing( TWEEN.Easing.Elastic.Out)
			.chain(tween)
			.start();
	};
	

	return HighHatVisuals;
});