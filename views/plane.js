var width = window.innerWidth;
var height = window.innerHeight;

var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
camera.position.y = 0;
camera.position.z = 10;

var startTime = Date.now();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();
var uniforms = {
  time: { value: 1.0 },
  resolution: { value: new THREE.Vector2() }

}


var geometry = new THREE.PlaneBufferGeometry( 4, 4, 2,2);

  material = new THREE.ShaderMaterial( {
    uniforms: {
      "time": { value: 0.0 },
      "resolution": { type: "v2", value: new THREE.Vector2() }
    },
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,

  } );

  material.uniforms["resolution"].value.x = width;
  material.uniforms["resolution"].value.y = height;


var plane = new THREE.Mesh( geometry, material );
scene.add( plane );


plane.rotation.x = -1.2 ;

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    var time = performance.now() * 0.00005;
    material.uniforms[ "time" ].value = time;
  
  } 

window.addEventListener('resize', onWindowResize, false);
animate();
