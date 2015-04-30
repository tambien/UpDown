define(["visuals/Context", "controller/Mediator", "util/Config", 
	"interface/Window", "controller/Conductor", "interface/Scroll", "TERP"], 
	function(Context, Mediator, Config, Window, Conductor, Scroll, TERP){

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
		blending : THREE.SubtractiveBlending,
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : false,
		color : 0xffffff
	});

	window.background = texture;

	var BackgroundImage = function(){
		this.loader = new THREE.ImageLoader();
		this.pic = new THREE.Sprite(material);
		window.pic = this.pic;
		this.setSize();
		Window.resize(this.setSize.bind(this));
		this.imageNumber = 0;
		Mediator.route("scroll",this.scroll.bind(this));
		Mediator.route("rawscroll",this.rawscroll.bind(this));
		Mediator.route("BDrop",this.add.bind(this));
		Mediator.route("C",this.remove.bind(this));
	};

	var scrollDist = 0.5;

	BackgroundImage.prototype.setSize = function(){
		var max = Math.max(Context.width * 7, Context.height * 7);
		this.pic.scale.set(max, -max, 1);
	};

	BackgroundImage.prototype.add = function(){
		this.setImage();
		Context.layer1.add(this.pic);
	};

	BackgroundImage.prototype.remove = function(){
		Context.layer1.remove(this.pic);	
	};

	BackgroundImage.prototype.rawscroll = function(pos){
		if (Conductor.getMovement() === 1){
			var repeatCount = (Math.sin(Scroll.getDistance() * 20) + 1) / 2;
			// var repeatCount = pos * 15 + 5;
			// repeatCount = repeatCount * 5 + 5;
			// texture.repeat.set(repeatCount, repeatCount);
			this.pic.position.z = TERP.scale(repeatCount, 40, 250);
		}
	};

	BackgroundImage.prototype.scroll = function(pos){
		if (Conductor.getMovement() === 1){
			var imgNumber = 0;
			if (Scroll.getDirection() < 0){
				imgNumber = 6;
			} 
			if (this.imageNumber !== imgNumber){
				this.imageNumber = imgNumber;
				this.setImage();
			}
		}
	};

	BackgroundImage.prototype.setImage = function(){
		this.loader.load("./images/thumbs_test/thumbs_test_0000"+this.imageNumber+".png", function(img){
			texture.image = img;
			texture.needsUpdate = true;
		});
	};

	return BackgroundImage;
});			