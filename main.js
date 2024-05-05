import { add, faceDirection } from 'three/examples/jsm/nodes/Nodes.js';
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const render = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

render.setPixelRatio( window.devicePixelRatio );
render.setSize( window.innerWidth, window.innerHeight );

camera.position.setZ(34);
camera.position.setX(-5);

render.render( scene, camera );

//without light we won't se our shape
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, render.domElement);

// let's add some stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  const star = new THREE.Mesh( geometry, material )

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

const background = new THREE.TextureLoader().load('background.jpg');
scene.background = background;

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const moonDepth = new THREE.TextureLoader().load('depth.jpg'); // doing so we can give to the moon a realistic texture

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( {
    map: moonTexture,
    normalMap: moonDepth
  } )
)

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-7); // quite the same as using the equal

function moveCamera(){
  const p = document.body.getBoundingClientRect().top() // reading where the user is scrolling to check how far we are from the top
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
  camera.position.z = t * -0.01;
}

document.body.onscroll = moveCamera // to call the func every time the user scrolls

// let's create a function to automate this action
function animate(){
  requestAnimationFrame( animate );

  moon.rotation.x += 0.001;
  moon.rotation.y += 0.0005;
  moon.rotation.z += 0.001;

  controls.update();

  render.render( scene, camera );
}

animate()