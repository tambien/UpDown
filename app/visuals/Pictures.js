define(["visuals/Context", "TERP", "controller/Mediator", 
	"TWEEN", "util/Config", "interface/Scroll", "preset/PictureFrame", "interface/Window"], 
	function(Context, TERP, Mediator, TWEEN, Config, Scroll, PictureFramePreset, Window){

	"use strict";


	// MATERIALS

	var texture = new THREE.Texture();
	/*texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestMipMapNearestFilter;*/

	var blending = "SubtractiveBlending";
	if (Config.MOBILE){
		blending = "NormalBlending";
	}

	var material = new THREE.SpriteMaterial({
		transparent: true,
		opacity : 0.9,
		map: texture,
		blending : THREE[blending],
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : false,
		color : 0xffffff
	});

	//make the frame canvas

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
	frameTexture.magFilter = THREE.NearestFilter;
	frameTexture.minFilter = THREE.NearestMipMapNearestFilter;

	var frameBlending = "AdditiveBlending";
	if (Config.MOBILE){
		frameBlending = "NormalBlending";
	}

	var frameMaterial = new THREE.SpriteMaterial({
		transparent: true,
		opacity : 1,
		depthTest : false,
		map: frameTexture,
		blending : THREE[ frameBlending ],
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		color: 0x000000
	});

	PictureFramePreset.onupdate(function(pre){
		if (!Config.MOBILE){
			var color = pre.frame;
			frameMaterial.color.setRGB(color[0], color[1], color[2]);
		}
	});


	// PICTURES

	var Pictures = function(parameters){
		this.pictures = new THREE.Object3D();

		if (!Config.MOBILE){
			this.scale = Context.width / 2 - 4;
		} else {
			this.scale = Context.width - 8;
		}

		this.level = 0;
		this.loader = new THREE.ImageLoader();		
		this.images = [];
		this.scrollMultipler = 100;
		this.previousPosition = 0.5;
		this.pictureCount = 3;
		this.distance = 0.8;
		this.modDistance = this.distance * this.pictureCount;

		this.makePictures();

		//load the first one
		this.load(0);

		//setup the events
		Mediator.route("rawscroll", this.scroll.bind(this));
		Mediator.route("voice", this.setWord.bind(this));
		Window.resize(this.resize.bind(this));
	};

	Pictures.prototype.makePictures = function() {
		//make the pictures
		var pictureCount = this.pictureCount;
		//make all of the images
		var scale = this.scale;
		this.picDist = scale * pictureCount * 0.8;
		var increment = this.previousPosition * this.scrollMultipler;
		var frameScaleY = 2;
		var frameScaleX = 2;
		for(var i = 0; i < pictureCount; i++){
			var pic = new THREE.Sprite(material);
			var frame = new THREE.Sprite(frameMaterial);
			frame.scale.set(frameScaleX, frameScaleY * 0.7, 1);
			pic.scale.setX(1 / frameScaleX);
			pic.scale.setY(1 / frameScaleY);
			pic.add(frame);
			pic.position.setY(((i * this.distance + increment) % (this.modDistance)));
			this.pictures.add(pic);
		}
		this.pictures.position.y = -Context.height / 3 - this.scale;
		//picture original size 680 x 1163. 
		this.pictures.scale.set(this.scale, this.scale * 1.71, 1);
		window.object = this.pictures;
		//and make the frames
		Context.scene.add(this.pictures);
	};

	Pictures.prototype.resize = function(){
		if (!Config.MOBILE){
			this.scale = Context.width / 2 - 4;
			this.pictures.scale.set(this.scale, this.scale * 1.71, 1);
		} 
	};

	Pictures.prototype.scroll = function(position) {
		//load the level
		var level = Math.round(TERP.scale(Scroll.getDirectionPosition(), -8, 8));
		if (this.level !== level){
			this.load(level);
		}
		//set the position of the individual frames
		position = 1 - position;
		var max = this.modDistance;
		var increment = (position * this.scrollMultipler);
		var children = this.pictures.children;
		var currentPos = this.previousPosition * this.scrollMultipler;
		this.previousPosition = position;
		var distance = this.distance;
		for (var i = 0; i < children.length; i++){
			var child = children[i];
			var newY = i * distance + increment;
			child.position.setY((newY % max));
		}
	};

	Pictures.prototype.load = function(level){
		this.level = level;
		if (level < 0){
			level = "n" + Math.abs(level);
		}
		var images = [];
		var count = 0;
		var self = this;
		var onLoad = function(position){
			var pos = position;
			return function(img){
				count++;
				images[pos] = img;
				if (count === 3){
					self.images = images;
					texture.image = self.images[0];
					texture.needsUpdate = true;
				}
			};
		};
		var picC = "./images/"+level+"_c.png";
		var picO = "./images/"+level+"_o.png";
		var picOo = "./images/"+level+"_oo.png";
		this.loader.load(picC, onLoad(0));
		this.loader.load(picO, onLoad(1));
		this.loader.load(picOo, onLoad(2));
	};

	Pictures.prototype.setWord = function(word, duration) {
		var start = word.substr(word.indexOf(".") + 1, 1);
		duration *= 1000;
		if (start === "l"){
			this.setImage(2, 0);
		} else if (start === "d"){
			this.setImage(1, 0);
			this.setImage(2, duration / 10);
			this.setImage(0, duration / 1.7);
		} else if (start === "u"){
			this.setImage(1, 0);
			this.setImage(0, duration / 1.5);
		} else {
			this.setImage(1, 0);
			this.setImage(0, duration / 3);
		}
	};

	Pictures.prototype.setImage = function(pos, wait){
		var self = this;
		setTimeout(function(){
			texture.image = self.images[pos];
			texture.needsUpdate = true;
		}, wait);
	};

	Pictures.prototype.dispose = function(){
			
	};

	Pictures.frameMaterial = frameMaterial;

	return Pictures;
});			