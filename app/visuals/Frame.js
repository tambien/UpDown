define(["visuals/Context","controller/Mediator", "util/Config", "interface/Window", "preset/PictureFrame", "visuals/Frame"], 
	function(Context, Mediator, Config, Window, PicturePreset, Frame){

	"use strict";

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
		opacity: Context.opacity,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		// map: frameTexture,
		depthTest : false,
		depthWrite : false,
		color : 0xffffff,
		emissive : 0xff0000
	});


	var materialB = new THREE.MeshBasicMaterial({
		transparent: Context.transparent,
		opacity: Context.opacity,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		// map: frameTexture,
		depthTest : false,
		depthWrite : false,
		color : 0xffffff,
		emissive : 0xff0000
	});

	PicturePreset.onupdate(function(preset){
		var frame = preset.frame;
		var accent = preset.accent;
		materialA.color.setRGB(frame[0], frame[1], frame[2]);
		// materialA.emissive.setRGB(frame[0] - 0.5, frame[1] - 0.5, frame[2] - 0.5);
		materialB.color.setRGB(accent[0], accent[1], accent[2]);
		// materialB.emissive.setRGB(accent[0] - 0.5, accent[1] - 0.5, accent[2] - 0.5);
	});

	var geometry = new THREE.PlaneBufferGeometry(1, 1, 2, 2);

	var FrameVisuals = function(){
		//topbar
		this.topbar = new THREE.Mesh( geometry, materialB);
		Context.layer1.add(this.topbar);
		//left size
		this.leftTop = new THREE.Mesh( geometry, materialA);
		Context.layer1.add(this.leftTop);
		this.leftBottom = new THREE.Mesh( geometry, materialA);
		Context.layer1.add(this.leftBottom);
		//right size
		this.rightTop = new THREE.Mesh( geometry, materialB);
		Context.layer1.add(this.rightTop);
		this.rightBottom = new THREE.Mesh( geometry, materialB);
		Context.layer1.add(this.rightBottom);
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
		var sideHeight = 45;
		var bottomSideHeight = 10;
		var centerWidth = Context.pictureWidth;
		var sideWidth = Context.sidebarWidth;

		var topSideHeight = sideHeight - bottomSideHeight;
		var leftSideHeight = Context.height - topbarHeight - 3;
		this.leftTop.scale.setX(sideWidth);
		this.leftTop.scale.setY(-leftSideHeight);
		this.leftTop.position.x =  centerWidth / 2 + sideWidth / 2 + 1;
		this.leftTop.position.y = Context.height / 2 - topbarHeight - 2 - leftSideHeight / 2;
		//left / bottom
		// window.leftBottom = this.leftBottom;
		// this.leftBottom.scale.setX(sideWidth);
		// this.leftBottom.scale.setY(-bottomSideHeight);
		// this.leftBottom.position.x = centerWidth / 2 + sideWidth / 2 + 1;
		// this.leftBottom.position.y = Context.height / 2 - topbarHeight - 3 - topSideHeight - bottomSideHeight / 2;
		//right
		var tmp = bottomSideHeight;
		bottomSideHeight = topSideHeight;
		topSideHeight = tmp;
		this.rightTop.scale.setX(sideWidth);
		this.rightTop.scale.setY(-topSideHeight);
		this.rightTop.position.x = -(centerWidth / 2 + sideWidth / 2 + 1);
		this.rightTop.position.y = Context.height / 2 - topbarHeight - 2 - topSideHeight / 2;
		//left / bottom
		this.rightBottom.scale.setX(sideWidth);
		this.rightBottom.scale.setY(-bottomSideHeight);
		this.rightBottom.position.x = -(centerWidth / 2 + sideWidth / 2 + 1);
		this.rightBottom.position.y = Context.height / 2 - topbarHeight - 3 - topSideHeight - bottomSideHeight / 2;

	};

	return FrameVisuals;
});			