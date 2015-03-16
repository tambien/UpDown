define(["visuals/Context", "TERP", "controller/Mediator", 
	"TWEEN", "util/Config", "interface/Scroll"], 
	function(Context, TERP, Mediator, TWEEN, Config, Scroll){

	"use strict";


	// MATERIALS

	var texture = new THREE.Texture();

	var blending = "SubtractiveBlending";
	if (Config.MOBILE){
		blending = "NormalBlending";
	}

	var material = new THREE.SpriteMaterial({
		transparent: true,
		opacity : 0.9,
		map: texture,
		side: THREE.DoubleSide,
		blending : THREE[blending],
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		depthTest : false,
		color : 0xffffff
	});

	var radius = 10;

	var frameBlending = "AdditiveBlending";
	if (Config.MOBILE){
		frameBlending = "NormalBlending";
	}

	var frameMaterial = new THREE.SpriteMaterial({
		transparent: true,
		opacity : 1,
		depthTest : false,
		map: THREE.ImageUtils.loadTexture("./images/frame_v02.png"),
		side: THREE.DoubleSide,
		blending : THREE[ frameBlending ],
		blendSrc : Context.blendSrc,
		blendDst : Context.blendDst,
		blendEquation : Context.blendEq,
		color: 0xff00ff
	});

	window.frameMaterial = frameMaterial;


	// PICTURES

	var Pictures = function(parameters){
		this.pictures = new THREE.Object3D();
		this.scale = 25;

		this.level = 0;
		this.loader = new THREE.ImageLoader();		
		this.images = [];
		this.scrollMultipler = 100;
		this.previousPosition = 0.5;
		this.pictureCount = 3;
		this.distance = 1.4;
		this.modDistance = this.distance * this.pictureCount;

		this.makePictures();

		//load the first one
		this.load(0);

		//setup the events
		Mediator.route("rawscroll", this.scroll.bind(this));
		Mediator.route("voice", this.setWord.bind(this));
	};

	Pictures.prototype.makePictures = function() {
		//make the pictures
		var pictureCount = this.pictureCount;
		//make all of the images
		var scale = this.scale;
		this.picDist = scale * pictureCount * 0.8;
		var increment = this.previousPosition * this.scrollMultipler;
		for(var i = 0; i < pictureCount; i++){
			var pic = new THREE.Sprite(material);
			var frame = new THREE.Sprite(frameMaterial);
			frame.scale.set(1.2, 1.3, 1);
			frame.position.setY(-0.15);
			pic.add(frame);
			pic.position.setY(((i * this.distance + increment) % (this.modDistance)) - this.distance);
			this.pictures.add(pic);
		}
		this.pictures.position.y = -Context.height / 2;
		//picture original size 680 x 1163. 
		this.pictures.scale.set(this.scale, this.scale * 1.71, 1);
		window.object = this.pictures;
		//and make the frames
		Context.scene.add(this.pictures);
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
			child.position.setY((newY % max) - distance);
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

	return Pictures;
});			