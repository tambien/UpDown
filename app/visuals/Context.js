define(["THREE", "interface/Window", "jquery", "TWEEN", "Stats"], function(THREE, Window, jquery, TWEEN, Stats){

	/**
	 *  the threejs context
	 */
	var Context = function(){
		this.camera = new THREE.PerspectiveCamera( 40, 1, 1, 20000 );
		this.scene = new THREE.Scene();
		// this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0025);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor( 0xffffff );
		this.renderer.setSize(Window.width(), Window.height());
		Window.container.append(this.renderer.domElement);
		window.camera = this.camera;

		//camera positioning
		this.camera.position.setZ(-100);
		this.camera.lookAt(new THREE.Vector3 (0.0, 0.0, 0.0));

		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		this.light = new THREE.PointLight( 0xffffff );
		this.light.position.copy( this.camera.position );
		this.scene.add( this.light );

		//the stats
		this.stats = new Stats();
		this.stats.setMode(0);
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.left = '0px';
		this.stats.domElement.style.top = '0px';
		Window.container.append(this.stats.domElement);

		//add light
		// this.backgroundShape();
		this.animate();
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
		this.scene.add(this.square);
		window.boxMaterial = material;

		var sphereMaterial = new THREE.MeshBasicMaterial({
			transparent: true,
			blending: THREE.SubtractiveBlending,
			depthTest : false,
			color : 0xff0000
		});
		// material.depthTest = false;
		this.sphere = new THREE.Mesh( new THREE.SphereGeometry( 25, 25, 25), sphereMaterial);
		this.sphere.geometry.computeVertexNormals();
		window.sphereMaterial = sphereMaterial;
		this.scene.add(this.sphere);

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
		this.scene.add(this.sphere);
	};

	Context.prototype.animate = function(time) {
		requestAnimationFrame( this.animate.bind(this) );
		this.renderer.render( this.scene, this.camera );
		TWEEN.update(time);
		this.stats.update();
	};

	Context.prototype.dispose = function(){

	};

	return new Context();
});