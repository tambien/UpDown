define(["THREE", "interface/Window", "jquery", "TWEEN", "Stats", "requestAnimationFrame", "controller/Mediator"], 
function(THREE, Window, jquery, TWEEN, Stats, requestAnimationFrame, Mediator){

	/**
	 *  the threejs context
	 */
	var Context = function(){
		this.camera = new THREE.PerspectiveCamera( 40, Window.width() / Window.height(), 1, 20000 );
		this.scene = new THREE.Scene();
		// this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0025);
		this.renderer = new THREE.WebGLRenderer({
			precision : "lowp"
		});
		this.renderer.setClearColor( 0xffffff );
		this.renderer.setSize(Window.width(), Window.height());
		Window.container.append(this.renderer.domElement);

		//camera positioning
		this.camera.position.setZ(-100);
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));

		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		this.light = new THREE.PointLight( 0xffffff );
		this.light.position.copy( this.camera.position );
		this.scene.add( this.light );

		// this.createGrid();

		//the stats
		this.stats = new Stats();
		this.stats.setMode(0);
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.left = '0px';
		this.stats.domElement.style.top = '0px';
		Window.container.append(this.stats.domElement);
		
		//the background and foreground layers		
		this.background = new THREE.Object3D();
		this.scene.add(this.background);

		//listen for events
		Mediator.route("half", this.flipCamera.bind(this));
		Window.resize(this.resize.bind(this));

		//start animating
		this.step = 0;
		this.animate();
	};

	Context.prototype.flipCamera = function(half){
		if (this.tween){
			this.tween.stop();
		}
		var self = this;
		this.tween = new TWEEN.Tween({rotation : this.background.rotation.z})
			.to({rotation : Math.PI * (1 - half)}, 300)
			.onUpdate(function(){
				self.background.rotation.z = this.rotation;
				self.background.rotation.y = this.rotation;
			})
			.onComplete(function(){
				self.tween = null;
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

	Context.prototype.backgroundShape = function(){

		var material = new THREE.MeshNormalMaterial({
			transparent: true,
			opacity: 0.5,
			blending: THREE.NormalBlending,
			depthTest : false,
			color : 0x00ff00
		});
		// material.depthTest = false;
		this.square = new THREE.Mesh( new THREE.BoxGeometry( 100, 10, 10), material);
		this.square.geometry.computeVertexNormals();
		this.background.add(this.square);

		var sphereMaterial = new THREE.MeshBasicMaterial({
			transparent: true,
			blending: THREE.SubtractiveBlending,
			depthTest : false,
			color : 0xff0000
		});
		// material.depthTest = false;
		this.sphere = new THREE.Mesh( new THREE.SphereGeometry( 25, 25, 25), sphereMaterial);
		this.sphere.geometry.computeVertexNormals();
		this.background.add(this.sphere);

		var sphereMaterial2 = new THREE.MeshBasicMaterial({
			transparent: true,
			blending: THREE.SubtractiveBlending,
			depthTest : false,
			color : 0x0000ff
		});
		// material.depthTest = false;
		this.sphere = new THREE.Mesh( new THREE.SphereGeometry( 25, 25, 25), sphereMaterial2);
		this.sphere.geometry.computeVertexNormals();
		this.sphere.position.x += 20;
		this.background.add(this.sphere);
	};

	Context.prototype.animate = function(time) {
		requestAnimationFrame( this.animate.bind(this) );
		this.step = 1;
		this.renderer.render( this.scene, this.camera );
		TWEEN.update(time);
		this.stats.update();
	};

	Context.prototype.dispose = function(){

	};

	return new Context();
});