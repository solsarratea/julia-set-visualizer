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


function vertexShader() {
  return `
    varying vec2 vUv;

    void main()
    {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_Position = projectionMatrix * mvPosition;
    }
  `
}

function fragmentShader() {
  return `
      uniform float time;
      varying vec2 vUv;

      void main() {
        vec2 c = vec2( 0.285, 0.01 + sin(time) );
        vec2 v = vUv;
        float scale = 0.01;

        int count = 255;

        for ( int i = 0 ; i < 255; i++ ) {
          v = c + vec2(v.x * v.x - v.y * v.y, v.x * v.y * 2.0);
          if ( dot( v, v ) > 4.0 ) {
            count = i;
            break;
          }
        }
          
        gl_FragColor = vec4( float( count ) * scale);
      }
  `
}


var geometry = new THREE.PlaneBufferGeometry( 4, 4, 2,2);

  material = new THREE.ShaderMaterial( {
    uniforms: {
      "time": { value: 0.0 },
      "resolution": { type: "v2", value: new THREE.Vector2() }
    },
    fragmentShader: fragmentShader(), //document.getElementById( 'fragmentShader' ).textContent,
    vertexShader: vertexShader(), //document.getElementById( 'vertexShader' ).textContent,

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

    var time = performance.now() * 0.0005;
    material.uniforms[ "time" ].value = time;
//    plane.rotation.x += .005;
  
  } 

window.addEventListener('resize', onWindowResize, false);
animate();
