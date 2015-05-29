define(["visuals/Context", "controller/Mediator", "util/Config", 
	"interface/Window", "controller/Conductor", "interface/Scroll", 
	"TERP", "TWEEN", "THREE"], 
	function(Context, Mediator, Config, Window, Conductor, Scroll, TERP, TWEEN, THREE){

	"use strict";

	var texture = new THREE.Texture();
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(50, 50);

	var blending = "SubtractiveBlending";

	var material = new THREE.SpriteMaterial({
		transparent: true,
		opacity : 1,
		map: texture,
		blending : THREE[blending],
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : false,
		alphaTest : 0.1,
		color : 0xffffff
	});

	var coverMaterial = new THREE.MeshBasicMaterial({
		transparent: Context.transparent,
		opacity: Context.opacity,
		blending : Context.blending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : false,
		depthWrite : false,
		color : 0xffffff,
		emissive : 0x000000
	});

	var geometry = new THREE.PlaneBufferGeometry(1, 1, 2, 2);
	var BBox = new THREE.Mesh( geometry, coverMaterial);
	BBox.scale.setX(-1000);
	BBox.scale.setY(1000);
	window.BBox = BBox;

	var thumbImageCount = 15;
	var starImageCount = 13;
	var heartImageCount = 5;



	var BackgroundImage = function(){
		this.loader = new THREE.ImageLoader();
		this.pic = new THREE.Sprite(material);

		window.pic = this.pic;
		
		this.setSize();
		Window.resize(this.setSize.bind(this));
		this.imageNumber = 0;
		Mediator.route("scroll",this.scroll.bind(this));
		// Mediator.route("rawscroll",this.rawscroll.bind(this));
		Mediator.route("BDrop",this.add.bind(this));
		Mediator.route("B",this.BSetup.bind(this));
		Mediator.route("flip",this.flip.bind(this));
		Mediator.route("C",this.remove.bind(this));

		this.lastPosition = -1;
		this.loadedCount = 0;

		this.section = "heart";

		//preload the images
		this.images = {
			"star" : [],
			"thumb" : [],
			"heart" : []
		};
		var i;
		for (i = 0; i < thumbImageCount; i++){
			this.loader.load("./smallerImages/thumbs/"+i+".png", this.storeImage("thumb", i));
		}
		for (i = 0; i < starImageCount; i++){
			this.loader.load("./smallerImages/star/"+i+".png", this.storeImage("star", i));
		}
		for (i = 0; i < heartImageCount; i++){
			this.loader.load("./smallerImages/heart/"+i+".png", this.storeImage("heart", i));
		}

		this.imagesAdded = false;
	};

	var scrollDist = 0.5;

	BackgroundImage.prototype.setSize = function(){
		var times = 14;
		var max = Math.max(Context.width * times, Context.height * times);
		this.pic.scale.set(max, -max, 1);
	};

	BackgroundImage.prototype.storeImage = function(section, position){
		return function(img){
			this.loadedCount++;
			var progress =  this.loadedCount / (thumbImageCount + starImageCount + heartImageCount);
			this.images[section][position] = img;
		}.bind(this);
	};

	BackgroundImage.prototype.add = function(){
		this.setImage();
		Context.layer1.add(this.pic);
		Context.background.add(BBox);
		this.interval = setInterval(this.updateLoop.bind(this), 100);
	};

	BackgroundImage.prototype.BSetup = function(){
		Context.layer1.remove(this.pic);
	};

	BackgroundImage.prototype.remove = function(){
		// Context.layer1.remove(this.pic);	
		Context.background.remove(BBox);
		clearInterval(this.interval);
	};

	BackgroundImage.prototype.flip = function(dir){
		if (this.section === "thumb"){
			var first = 0; 
			var last = thumbImageCount - 1;
			if (dir > 0){
				first = thumbImageCount - 1;
				last = 0;
			} 
			if (this.tween){
				this.tween.stop();
			}
			var self = this;
			this.tween = new TWEEN.Tween({imgNum : first})
				.to({imgNum : last}, 300)
				.onUpdate(function(){
					var imgNumber = Math.floor(this.imgNum);
					if (self.imageNumber !== imgNumber){
						self.imageNumber = imgNumber;
						self.setImage();
					}
				})
				.easing( TWEEN.Easing.Linear.None)
				.start();
		}
	};

	BackgroundImage.prototype.updateLoop = function(){
		if (Conductor.getMovement() === 1){
			if (this.section !== "thumb"){
				var scrollPos = Scroll.getPosition();
				if (this.lastPosition !== scrollPos){
					this.lastPosition = scrollPos;
					this.imageNumber++;
					this.setImage();
				}
			}
		}
	};

	BackgroundImage.prototype.rawscroll = function(pos){
		if (Conductor.getMovement() === 1){
			
		}
	};

	BackgroundImage.prototype.scroll = function(pos){
		if (Conductor.getMovement() === 1){
			if (Conductor.getBProgress() < 1){
				var order = ["heart", "star", "thumb"];
				var newSec = order[Math.floor(Conductor.getBProgress() * 3)];
				if (newSec !== this.section){
					this.section = newSec;
					if (this.section === "thumb"){
						this.flip(Scroll.getDirection());						
					}
				}
			}
		}
	};

	BackgroundImage.prototype.setImage = function(){
		var imagelen = this.images[this.section].length;
		texture.image = this.images[this.section][this.imageNumber % imagelen];
		texture.needsUpdate = true;
	};

	return BackgroundImage;
});			