define(["visuals/Context", "THREE", "TERP", "controller/Mediator", "TWEEN"], 
	function(Context, THREE, TERP, Mediator, TWEEN){

	"use strict";

	// MATERIALS

	var texture = new THREE.Texture();

	var material = new THREE.SpriteMaterial({
		transparent: true,
		opacity : 0.7,
		map: texture,
		side: THREE.DoubleSide,
		// blending: THREE.AdditiveBlending,
		// blending: THREE.SubtractiveBlending,
		// blending: THREE.MultiplyBlending,
		// depthTest : false,
		color : 0xff00ff
	});

	var radius = 10;

	// var frameMaterial = new THREE.SpriteMaterial({
	// 	map: THREE.ImageUtils.loadTexture("./images/frame.png"),
	// 	depthTest : false,
	// 	color: 0xffffff
	// });

	// PICTURES

	var Pictures = function(parameters){
		this.pictures = new THREE.Object3D();
		this.scale = 30;

		this.level = 0;
		this.loader = new THREE.ImageLoader();		
		this.images = [];

		this.makePictureWheel();

		//load the first one
		this.load(0);

		//setup the events
		// Mediator.route("scroll", this.scroll.bind(this));
		Mediator.route("voice", this.setWord.bind(this));
	};

	Pictures.prototype.makePictures = function() {
		//make the pictures
		var pictureCount = 5;
		//make all of the images
		var period = 25;
		this.picDist = scale * pictureCount * 0.8;
		for(var i = 0; i < pictureCount; i++){
			var pic = new Pic(offset, scale, this.picDist);
			this.pictures.add(pic.obj);
		}
		this.pictures.scale.set(1, 1, 1);
		//and make the frames
		Context.scene.add(this.pictures);
	};

	Pictures.prototype.scroll = function(position) {
		//load the level
		var level = Math.round(TERP.scale(position, -8, 8));
		if (this.level !== level){
			this.load(level);
		}
		var wheel = this.object;
		if(this.tween){
			this.tween.stop();
		}
		this.tween = new TWEEN.Tween({roll : wheel.rotation.z})
			.to({roll : wheel.rotation.z + 0.20}, 250)
			.onUpdate(function(){
				// pics.position.setY(this.position);
				wheel.rotateY(this.roll);
			})
			.easing(TWEEN.Easing.Linear.None)
			.start();
	};

	Pictures.prototype.makePictureWheel = function() {
		// this.object = new THREE.Mesh( geometry, material);
		// Context.scene.add(this.object);
		// // this.object.rotateZ(Math.PI / 2);
		// window.wheel = this.object;
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
		// this.images = images;
		var start = word.substr(0, 1);
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