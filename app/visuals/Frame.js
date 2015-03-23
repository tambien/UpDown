define(["visuals/Context","controller/Mediator", "util/Config", "interface/Window", "preset/PictureFrame"], 
	function(Context, Mediator, Config, Window, PicturePreset){

	"use strict";

	Mediator.route("scroll", function(){
		var preset = PicturePreset.get();
		var frame = preset.frame;
		var accent = preset.accent;
		materialA.color.setRGB(frame[0], frame[1], frame[2]);
		materialB.color.setRGB(accent[0], accent[1], accent[2]);
	});

	/**
	 *  texture
	 */
	var frameCanvas = $("<canvas>")[0];
	var frameSize = 256;
	var frameWidth = 16;
	frameCanvas.width = frameSize;
	frameCanvas.height = frameSize;
	var frameContext = frameCanvas.getContext("2d");
	frameContext.fillStyle = "#ffffff";
	//top
	frameContext.rect(0, 0, frameSize, frameWidth);
	//bottom
	frameContext.rect(0, frameSize  - frameWidth, frameSize, frameSize);
	//left
	frameContext.rect(0, 0, frameWidth, frameSize);
	//right
	frameContext.rect( frameSize - frameWidth, 0, frameSize, frameSize);
	frameContext.fill();

	var frameTexture = new THREE.Texture(frameCanvas);
	frameTexture.needsUpdate = true;

	/**
	 *  materials
	 */
	
	var materialA = new THREE.MeshBasicMaterial({
		transparent: Context.transparent,
		opacity: 0.2,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		// map: frameTexture,
		depthTest : false,
		depthWrite : false,
		color : 0x000000,
	});


	var materialB = new THREE.MeshBasicMaterial({
		transparent: Context.transparent,
		opacity: 0.2,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		// map: frameTexture,
		depthTest : false,
		depthWrite : false,
		color : 0x000000,
	});

	var geometry = new THREE.PlaneBufferGeometry(1, 1, 2, 2);

	window.Context = Context;

	var FrameVisuals = function(){
		//topbar
		this.topbar = new THREE.Mesh( geometry, materialB);
		Context.scene.add(this.topbar);
		//left size
		this.leftTop = new THREE.Mesh( geometry, materialA);
		Context.scene.add(this.leftTop);
		this.leftBottom = new THREE.Mesh( geometry, materialA);
		Context.scene.add(this.leftBottom);
		//right size
		this.rightTop = new THREE.Mesh( geometry, materialB);
		Context.scene.add(this.rightTop);
		this.rightBottom = new THREE.Mesh( geometry, materialB);
		Context.scene.add(this.rightBottom);
		this.resize();
		Window.resize(this.resize.bind(this));
	};

	FrameVisuals.prototype.resize = function(){
		//top
		var topbarHeight = 5;
		this.topbar.position.y = Context.height / 2 - topbarHeight / 2 - 1;
		this.topbar.scale.setY(-topbarHeight);
		this.topbar.scale.setX(Context.width - 2);
		//left
		var sideHeight = Context.height * 0.6;
		var sideWidth = Context.width / 4;
		// var sideMargin = Context.width
		var topSideHeight = sideHeight / 4;
		var bottomSideHeight = sideHeight - topSideHeight;
		this.leftTop.scale.setX(sideWidth);
		this.leftTop.scale.setY(-topSideHeight);
		this.leftTop.position.x = Context.width / 2 - 1 - sideWidth / 2;
		this.leftTop.position.y = Context.height / 2 - topbarHeight - 2 - topSideHeight / 2;
		//left / bottom
		window.leftBottom = this.leftBottom;
		this.leftBottom.scale.setX(sideWidth);
		this.leftBottom.scale.setY(-bottomSideHeight);
		this.leftBottom.position.x = Context.width / 2 - 1 - sideWidth / 2;
		this.leftBottom.position.y = Context.height / 2 - topbarHeight - 3 - topSideHeight - bottomSideHeight / 2;
		//right
		var tmp = bottomSideHeight;
		bottomSideHeight = topSideHeight;
		topSideHeight = tmp;
		this.rightTop.scale.setX(sideWidth);
		this.rightTop.scale.setY(-topSideHeight);
		this.rightTop.position.x = -(Context.width / 2 - 1 - sideWidth / 2);
		this.rightTop.position.y = Context.height / 2 - topbarHeight - 2 - topSideHeight / 2;
		//left / bottom
		this.rightBottom.scale.setX(sideWidth);
		this.rightBottom.scale.setY(-bottomSideHeight);
		this.rightBottom.position.x = -(Context.width / 2 - 1 - sideWidth / 2);
		this.rightBottom.position.y = Context.height / 2 - topbarHeight - 3 - topSideHeight - bottomSideHeight / 2;

	};

	return FrameVisuals;
});			