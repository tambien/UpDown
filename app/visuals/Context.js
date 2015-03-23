define(["interface/Window", "jquery", "TWEEN", "Stats", 
	"controller/Mediator", "shader/ColorShift", "shader/Noise", "util/Config"], 
function(Window, $, TWEEN, Stats, Mediator, ColorShiftShader, NoiseShader, Config){

	/**
	 *  the threejs context
	 */
	var Context = function(){
		this.camera = new THREE.PerspectiveCamera( 40, Window.width() / Window.height(), 1, 20000 );
		this.scene = new THREE.Scene();
		// this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0025);
		this.renderer = new THREE.WebGLRenderer({
			precision : "lowp",
			alpha : false,
			premultipliedAlpha: false,
			stencil : false,
		});
		this.renderer.autoClearStencil = false;
		// this.renderer.sortObjects = false;

		if (Config.MOBILE){
			this.renderer.setClearColor( 0xffffff , 0);
		} else {
			this.renderer.setClearColor( 0x000000 , 0);
		}
		this.renderer.setSize(Window.width(), Window.height());
		Window.container.append(this.renderer.domElement);

		//camera positioning
		this.camera.position.setZ(-100);
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));

		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		this.light = new THREE.PointLight( 0xffffff );
		this.light.position.setX(-100);
		this.light.position.setY(-100);
		this.light.position.setZ(-100);
		this.light.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));
		this.scene.add( this.light );

		//the stats
		if (Config.STATS){
			this.stats = new Stats();
			this.stats.setMode(0);
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.left = '0px';
			this.stats.domElement.style.top = '0px';
			Window.container.append(this.stats.domElement);
		}
		
		//the background and foreground layers		
		this.background = new THREE.Object3D();
		this.scene.add(this.background);
		this.background.position.setZ(-1);

		//listen for events
		Mediator.route("half", this.flipCamera.bind(this));
		Mediator.route("update", this.animate.bind(this));
		Window.resize(this.resize.bind(this));

		this.computeBounding();
		Window.resize(this.computeBounding.bind(this));

		//drawing setup
		this.transparent = true;
		this.opacity = 0.7;
		if (Config.MOBILE){
			this.blending = THREE.SubtractiveBlending;
		} else {
			this.blending = THREE.CustomBlending;
		}
		this.blendSrc = THREE.SrcColorFactor;
		this.blendDst = THREE.DstColorFactor;
		this.blendEq = THREE.SubtractEquation;

		//the background shapes for testing
		// this.backgroundShape();
		// this.backgroundImage();
		if (!Config.MOBILE){
			this.addComposer();
		}

		//start animating
		this.animate();
	};

	//drawing setup

	Context.prototype.flipCamera = function(half){
		if (this.tween){
			this.tween.stop();
		}
		var self = this;
		this.tween = new TWEEN.Tween({rotation : this.background.rotation.z})
			.to({rotation : Math.PI * (1 - half)}, 500)
			.onUpdate(function(){
				self.background.rotation.z = this.rotation;
				self.background.rotation.x = this.rotation * 2;
			})
			.onComplete(function(){
				self.tween = null;
				self.flipped = half;
				Mediator.send("flipped", half);
			})
			.easing( TWEEN.Easing.Quadratic.InOut)
			.start();
	};

	Context.prototype.resize = function(width, height){
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( width, height);
	};

	Context.prototype.createGrid = function(){
		var gridTexture = THREE.ImageUtils.loadTexture("./images/grid.png");
		// gridTexture.wrapS = THREE.RepeatWrapping;
		// gridTexture.wrapT = THREE.RepeatWrapping;
		// gridTexture.repeat.set( 10, 10 );
		var gridMaterial = new THREE.SpriteMaterial({
			map: gridTexture,
			depthTest : false,
			blending: THREE.NormalBlending,
			transparent: true,
			opacity: 0.8
		});
		this.grid = new THREE.Sprite(gridMaterial);
		this.grid.scale.set(100, 100, 100);
		this.scene.add(this.grid);
		window.grid = this.grid;
		window.gridTexture = gridTexture;

	};

	Context.prototype.backgroundImage = function(){
		var material = new THREE.SpriteMaterial({
			transparent: true,
			opacity : 1,
			map: THREE.ImageUtils.loadTexture("./images/mountain.png"),
			side: THREE.DoubleSide,
			blending : THREE.SubtractiveBlending,
			blendSrc : this.blendSrc,
			blendDst : this.blendDst,
			blendEquation : this.blendEq,
			depthTest : false,
			color : 0xffffff
		});
		var pic = new THREE.Sprite(material);
		this.scene.add(pic);
		pic.position.setZ(20);
		pic.scale.set(100, 100, 1);
	};

	Context.prototype.backgroundShape = function(){

		var boxMaterial = new THREE.MeshNormalMaterial({
			transparent: this.transparent,
			opacity: this.opacity,
			blending : this.blending,
			blendSrc : this.blendSrc,
			blendDst : this.blendDst,
			blendEquation : this.blendEq,
			depthTest : false,
			depthWrite : false,
			color : 0x00ff00
		});
		// material.depthTest = false;
		this.square = new THREE.Mesh( new THREE.BoxGeometry( 100, 10, 10), boxMaterial);
		this.square.geometry.computeVertexNormals();
		this.scene.add(this.square);

		var sphereMaterial = new THREE.MeshBasicMaterial({
			transparent: this.transparent,
			opacity: this.opacity,
			blending : this.blending,
			blendSrc : this.blendSrc,
			blendDst : this.blendDst,
			blendEquation : this.blendEq,
			depthTest : false,
			depthWrite : false,
			color : 0x0000ff
		});
		// material.depthTest = false;
		this.sphere = new THREE.Mesh( new THREE.SphereGeometry( 25, 25, 25), sphereMaterial);
		this.sphere.geometry.computeVertexNormals();
		this.scene.add(this.sphere);

		var sphereMaterial2 = new THREE.MeshBasicMaterial({
			transparent: this.transparent,
			opacity: this.opacity,
			blending : this.blending,
			blendSrc : this.blendSrc,
			blendDst : this.blendDst,
			blendEquation : this.blendEq,
			depthTest : false,
			depthWrite : false,
			color : 0xff0000
		});
		// material.depthTest = false;
		this.sphere = new THREE.Mesh( new THREE.SphereGeometry( 25, 25, 25), sphereMaterial2);
		this.sphere.geometry.computeVertexNormals();
		this.sphere.position.x += 20;
		this.scene.add(this.sphere);
	};

	Context.prototype.animate = function(time) {
		if (!Config.MOBILE){
			this.composer.render();
		} else {
			this.renderer.render(this.scene, this.camera);
		}
		TWEEN.update(time);
		if (Config.STATS){
			this.stats.update();
		}
	};

	Context.prototype.computeBounding = function(){
		var vector = new THREE.Vector3(-1, -1, 1);
		vector.unproject( this.camera );
		var dir = vector.sub( this.camera.position ).normalize();
		var distance = - this.camera.position.z / dir.z;
		var pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
		this.width = Math.abs(vector.x * 2);
		this.height = Math.abs(vector.y * 2);
	};

	Context.prototype.addComposer = function() {
		this.composer = new THREE.EffectComposer( this.renderer );
		var renderPass = new THREE.RenderPass(  this.scene, this.camera );
		this.composer.addPass( renderPass );
		var effect = new THREE.ShaderPass( ColorShiftShader );
		effect.renderToScreen = true;
		this.composer.addPass( effect );
	};

	Context.prototype.dispose = function(){

	};

	return new Context();
});