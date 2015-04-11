define(["visuals/Context", "controller/Mediator", "util/Config", 
	"interface/Window", "controller/Conductor", "interface/Scroll"], 
	function(Context, Mediator, Config, Window, Conductor, Scroll){

	"use strict";

	var images = ["mountain", "subway"];

	var texture = new THREE.Texture();
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestMipMapNearestFilter;

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

	var BackgroundImage = function(){
		this.loader = new THREE.ImageLoader();
		this.pic = new THREE.Sprite(material);
		this.setSize();
		Window.resize(this.setSize.bind(this));
		this.imageNumber = 0;
		Mediator.route("scroll",this.scroll.bind(this));
		Mediator.route("B",this.add.bind(this));
		Mediator.route("C",this.remove.bind(this));
	};

	var scrollDist = 0.5;

	BackgroundImage.prototype.setSize = function(){
		var max = Math.max(Context.width, Context.height);
		this.pic.scale.set(max, -max, 1);
	};

	BackgroundImage.prototype.add = function(){
		this.setImage();
		Context.layer1.add(this.pic);
	};

	BackgroundImage.prototype.remove = function(){
		Context.layer1.remove(this.pic);	
	};

	BackgroundImage.prototype.scroll = function(pos){
		if (Conductor.getMovement() === 1){
			var imgNumber = Math.floor(Scroll.getDistance() / scrollDist) % images.length;
			if (this.imageNumber !== imgNumber){
				this.imageNumber = imgNumber;
				this.setImage();
			}
		}
	};

	BackgroundImage.prototype.setImage = function(){
		this.loader.load("./images/background/"+images[this.imageNumber]+".jpg", function(img){
			texture.image = img;
			texture.needsUpdate = true;
		});
	};

	return BackgroundImage;
});			