define(["interface/Window", "jquery", "TWEEN", "Stats", 
	"controller/Mediator", "shader/ColorShift", "shader/Noise", 
	"util/Config", "controller/Conductor"], 
function(Window, $, TWEEN, Stats, Mediator, ColorShiftShader, NoiseShader, Config, Conductor){

	/**
	 *  the threejs context
	 */
	var Context = function(){
		this.camera = new THREE.PerspectiveCamera( 40, Window.width() / Window.height(), 1, 20000 );
		this.scene = new THREE.Scene();
		// this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0025);
		this.renderer = new THREE.WebGLRenderer({
			precision : "lowp",
			// precision : "mediump",
			alpha : false,
			premultipliedAlpha: true,
			stencil : false,
		});
		window.renderer = this.renderer;
		this.renderer.autoClearStencil = false;
		this.renderer.sortObjects = false;

		if (Config.MOBILE){
			this.renderer.setClearColor( 0xffffff , 0);
		} else {
			this.renderer.setClearColor( 0x000000 , 0);
		}
		// this.renderer.setSize(Window.width(), Window.height());
		this.resize(Window.width(), Window.height());
		Window.container.append(this.renderer.domElement);

		this.$rendererElement = $(this.renderer.domElement);

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
		this.background = this.layer0 = new THREE.Object3D();
		this.layer1 = new THREE.Object3D();
		this.layer2 = new THREE.Object3D();
		// this.background.position.setZ(-1);
		this.scene.add(this.layer2);
		this.scene.add(this.layer1);
		this.scene.add(this.layer0);

		//listen for events
		// Mediator.route("half", this.flipCamera.bind(this));
		Mediator.route("update", this.animate.bind(this));
		Mediator.route("start", this.fadeIn.bind(this));
		Mediator.route("end", this.fadeOut.bind(this));
		Mediator.route("HD", this.resize.bind(this));
		Window.resize(this.resize.bind(this));

		this.computeBounding();
		Window.resize(this.computeBounding.bind(this));

		//drawing setup
		this.transparent = true;
		this.opacity = 0.5;
		if (Config.MOBILE){
			this.blending = THREE.NormalBlending;
		} else {
			this.blending = THREE.CustomBlending;
		}
		this.blendSrc = THREE.SrcColorFactor;
		this.blendDst = THREE.DstColorFactor;
		this.blendEq = THREE.SubtractEquation;

		//the background shapes for testing
		// this.backgroundShape();
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
		/*this.tween = new TWEEN.Tween({rotation : this.background.rotation.z})
			.to({rotation : Math.PI * (1 - half)}, 1000)
			.onUpdate(function(){
				self.background.rotation.z = this.rotation;
				// self.background.rotation.x = this.rotation * 2;
			})
			.onComplete(function(){
				self.tween = null;
				self.flipped = half;
				Mediator.send("flipped", half);
			})
			.easing( TWEEN.Easing.Quadratic.InOut)
			.start();*/
	};

	Context.prototype.resize = function(){
		var width = Window.width();
		var height = Window.height();
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		var resolutionMult = 1;
		if (!Config.HD || Config.MOBILE){
			resolutionMult = 0.8;
		}
		this.renderer.setSize( width * resolutionMult, height * resolutionMult);
	};

	Context.prototype.fadeIn = function(){
		this.$rendererElement.animate({
			"opacity" : 1
		}, 500);
	};

	Context.prototype.fadeOut = function(){
		// var opacity = Math.pow(1 - endTransition, 1.5);
		/*this.$rendererElement.animate({
			"opacity" : 0
		}, 1000);*/
		/*if (Conductor.getMovement() === 2) {
			var endTransition = Conductor.getEndTransitionProgress();
			if (endTransition > 0){
				// var opacity = Math.pow(1 - endTransition, 1.5);
				// this.$rendererElement.css("opacity", opacity);
			} 
		}*/
	};

	Context.prototype.animate = function(time) {
		if (Config.VISUALS){
			if (!Config.MOBILE){
				this.composer.render();
			} else {
				this.renderer.render(this.scene, this.camera);
			}
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

	Context.prototype.pictureWidth = 50;

	Context.prototype.sidebarWidth = 25;

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