define(["visuals/Context", "TERP", "controller/Mediator", 
	"TWEEN", "util/Config", "interface/Scroll", "preset/PictureFrame", "interface/Window"], 
	function(Context, TERP, Mediator, TWEEN, Config, Scroll, PictureFramePreset, Window){

	"use strict";


	// MATERIALS

	var texture = new THREE.Texture();
	/*texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestMipMapNearestFilter;*/

	var blending = "SubtractiveBlending";
	// var blending = "CustomBlending";
	if (Config.MOBILE){
		// blending = "NormalBlending";
		blending = "MultiplyBlending";
	}

	var material = new THREE.SpriteMaterial({
		transparent: true,
		opacity : 0.5,
		map: texture,
		blending : THREE[blending],
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : true,
		alphaTest : 0.1,
		color : 0xffffff
	});


	var frameBlending = "CustomBlending";
	/*if (Config.MOBILE){
		frameBlending = "CustomBlending";
	}*/

	var frameMaterial = new THREE.MeshBasicMaterial({
		transparent: Context.transparent,
		opacity: 0.2,
		blending : THREE[frameBlending],
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : false,
		depthWrite : false,
		// side: THREE.DoubleSide,
		color : 0x00ED00,
	});


	var frameGeometry = new THREE.PlaneBufferGeometry(1, 1, 2, 2);

	//set the initial values
	var pre = PictureFramePreset.get();
	// if (!Config.MOBILE){
		var color = pre.frame;
		frameMaterial.color.setRGB(color[0], color[1], color[2]);
	// }

	Mediator.route("scroll", function(){
		var pre = PictureFramePreset.get();
		// if (!Config.MOBILE){
			var color = pre.frame;
			frameMaterial.color.setRGB(color[0], color[1], color[2]);
		// }
	});

	//reset the color after the B sectiono
	Mediator.route("C", function(){
		material.map = texture;
		var pre = PictureFramePreset.get();
		var color = pre.frame;
		frameMaterial.color.setRGB(color[0], color[1], color[2]);
	});

	Mediator.route("B", function(){
		material.map = new THREE.Texture();
	});


	// PICTURES

	var Pictures = function(parameters){
		this.pictures = new THREE.Object3D();

		if (!Config.MOBILE){
			this.scale = Context.pictureWidth;
		} else {
			this.scale = Context.width - 8;
		}

		this.level = 0;
		this.loader = new THREE.ImageLoader();		
		this.images = [];
		this.scrollMultipler = 100;
		this.previousPosition = 0.5;
		this.pictureCount = 3;
		this.distance = 1.2;
		this.modDistance = this.distance * this.pictureCount;

		this.makePictures();

		//load the first one
		this.load(7);

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
		//original 3590 × 3615 pixels 1.006
		var frameTopMargin = 0.55;
		var frameWidth = 0.1;
		var picScale = 1 - frameWidth * 2;
		var frameScaleX = 1 + frameWidth * 2;
		var frameLeftMargin = 0.55;
		for(var i = 0; i < pictureCount; i++){
			var pic = new THREE.Sprite(material);
			//make the frame
			var frame = new THREE.Object3D();
			//top
			var top = new THREE.Mesh(frameGeometry, frameMaterial);
			top.position.y = frameTopMargin;
			top.scale.setX(frameScaleX);
			top.scale.setY(frameWidth);
			frame.add(top);
			//left
			var left = new THREE.Mesh(frameGeometry, frameMaterial);
			left.position.x = frameLeftMargin;
			left.scale.setX(frameWidth);
			left.scale.setY(frameTopMargin * 2 - frameWidth);
			frame.add(left);
			//right
			var right = new THREE.Mesh(frameGeometry, frameMaterial);
			right.position.x = -frameLeftMargin;
			right.scale.setX(frameWidth);
			right.scale.setY(frameTopMargin * 2 - frameWidth);
			frame.add(right);
			//bottom
			var bottom = new THREE.Mesh(frameGeometry, frameMaterial);
			bottom.position.y = -frameTopMargin;
			bottom.scale.setX(frameScaleX);
			bottom.scale.setY(frameWidth);
			frame.add(bottom);
			frame.scale.setX(-1);
			pic.scale.setX(picScale);
			pic.scale.setY(picScale);
			pic.add(frame);
			pic.position.setY(((i * this.distance + increment) % (this.modDistance)));
			this.pictures.add(pic);
		}
		this.pictures.position.y = -Context.height / 3 - this.scale;
		//picture original size 680 x 1163. 
		this.pictures.scale.set(this.scale, this.scale, 1);
		//and make the frames
		Context.layer2.add(this.pictures);
		this.scroll(0.5);
	};

	Pictures.prototype.resize = function(){
		this.pictures.scale.set(this.scale, this.scale, 1);
	};

	Pictures.prototype.scroll = function(position) {
		position += 0.00515;
		//load the level
		var level = Math.round(Scroll.getDirectionPosition() * 13);
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
		var picO = "./images/"+level+"_a.png";
		var picOo = "./images/"+level+"_o.png";
		var picDow = "./images/"+level+"_d.png";
		var picOwn = "./images/"+level+"_w.png";
		// var picC =  "./images/X1_0002.png";
		// var picO =  "./images/X1_0002.png";
		// var picOo =  "./images/X1_0002.png";
		// var picDow = "./images/X1_0002.png";
		// var picOwn = "./images/X1_0002.png";
		this.loader.load(picC, onLoad(0));
		this.loader.load(picO, onLoad(1));
		this.loader.load(picOo, onLoad(2));
		if (level < 7){
			this.loader.load(picDow, onLoad(3));
			this.loader.load(picOwn, onLoad(4));
		}
	};

	Pictures.prototype.setWord = function(word, duration) {
		var start = word.substr(word.indexOf(".") + 1, 1);
		duration *= 1000;
		if (start === "l"){
			this.setImage(2, 0);
		} else if (start === "d"){
			this.setImage(3, 0);
			this.setImage(4, duration / 10);
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
		setTimeout(function(){
			texture.image = this.images[pos];
			texture.needsUpdate = true;
		}.bind(this), wait);
	};

	Pictures.prototype.dispose = function(){
			
	};

	Pictures.frameMaterial = frameMaterial;

	return Pictures;
});			