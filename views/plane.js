var width = window.innerWidth;
var height = window.innerHeight;

var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
camera.position.y = 0;
camera.position.z = 5;

var startTime = Date.now();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();
var uniforms = {
  time: { value: 1.0 },
  resolution: { value: new THREE.Vector2() }

}

var gui = new dat.GUI();
var guiData = {"cR": 0., "cI": 0.};

gui.add(guiData, 'cR', -2., 2.);
gui.add(guiData, 'cI', -2., 2.);

var controls = new THREE.OrbitControls(camera, renderer.domElement);


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
      uniform float cR;
      uniform float cI;
      varying vec2 vUv;

      vec3 bump3 (vec3 x) {
        vec3 y = vec3(1.,1.,1.) - x * x;
        y = max(y, vec3(0.,0.,0.));
        return y;
      }

      vec3 spectralGems (float x) {
        return bump3
        (   vec3
            (
                4. * (x - 0.7), // Red
                4. * (x - 0.5), // Green
                4. * (x - 0.23) // Blue
            )
        );
      }

      void main() {
        vec2 c = vec2(cR,cI);
        vec2 v = vUv;
        v = v *4. - 2.;
        float scale = 0.01;
        float w;

        int count = 255;

        for ( int i = 0 ; i < 255; i++ ) {
          v = c + vec2(v.x * v.x - v.y * v.y, v.x * v.y * 2.0);
          if ( dot( v, v ) > 4.0 ) {
            count = i;
            break;
          }
        }

        w = float(count);
        gl_FragColor = vec4( spectralGems( float(count) / 255. ), 1.);
      }
  `
}


var geometry = new THREE.PlaneBufferGeometry( 4, 4, 2,2);

  material = new THREE.ShaderMaterial( {
    uniforms: {
      "time": { value: 0.0 },
      "resolution": { type: "v2", value: new THREE.Vector2() },
      "cI": { type: "f", value: guiData.cI },
      "cR": { type: "f", value: guiData.cR },
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
    material.uniforms[ "cI" ].value = guiData.cI;
    material.uniforms[ "cR" ].value = guiData.cR;
//    plane.rotation.x += .005;
  
  } 

window.addEventListener('resize', onWindowResize, false);
animate();
