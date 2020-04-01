
var width = window.innerWidth;
var height = window.innerHeight;

var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
camera.position.z = 5;
camera.position.y = -3;

var controls = new THREE.TrackballControls(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();

var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 20, 30, 40 );
scene.add( light );

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );


var PlaneHelper = function(plane) {
    var geom = new THREE.PlaneGeometry( 5, 5, 50, 50 );
    var material = new THREE.MeshBasicMaterial({
      color: '#333',
      side: THREE.DoubleSide,
      wireframe: true
    });
    var obj = new THREE.Mesh( geom, material );
    obj.lookAt(plane.normal);
    obj.translateOnAxis(
      new THREE.Vector3(1, 0, 0).cross(plane.normal).normalize(),
      plane.constant * -1
    );
    return obj;
  };

var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

var planeHelper = new PlaneHelper(plane);
scene.add( planeHelper );


camera.position.z = 2;

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

function animate() {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(animate);
  } 

  controls.addEventListener('change', function() {
    render();
  });

  window.addEventListener('resize', onWindowResize, false);
  animate();
