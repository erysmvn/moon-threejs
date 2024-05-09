import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { gsap } from "gsap";


const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );

const canvas = document.querySelector('canvas.webgl')

const render = new THREE.WebGLRenderer({
    //canvas: document.querySelector('#bg'),
    canvas: canvas,
    antialias: true,
    alpha: true  
});

render.shadowMap.enabled = true
render.shadowMap.type = THREE.PCFSoftShadowMap
render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
render.setSize( sizes.width, sizes.height );

camera.position.setZ(34);
camera.position.setX(-5);

render.render( scene, camera );

// Loaders
const loadingBarElement = document.querySelector('.loading-bar')
const bodyElement = document.querySelector('body')
const loadingManager = new THREE.LoadingManager(
    () => {
        window.setTimeout(() => {
            gsap.to(overlayMaterial.uniforms.uAlpha, {
                duration: 3,
                value: 0,
                delay: 1
            })
            gsap.to(overlayMaterial.uniforms.uAlpha, {
                duration: 3,
                value: 0,
                delay: 1
            })

            loadingBarElement.classList.add('ended')
            bodyElement.classList.add('loaded')
            loadingBarElement.style.transform = ''

        }, 500)
    },
    (itemUrl, itemsLoaded, itemsTotal) => {
        console.log(itemUrl, itemsLoaded, itemsTotal)
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
        console.log(progressRatio)
    },
    () => {

    }
)

//without light we won't se our shape
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 2, 0)
directionalLight.castShadow = true

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(directionalLight, ambientLight)

const controls = new OrbitControls(camera, render.domElement);

// you can easily disable it by using
controls.enabled = false

// let's add some stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.10, 16, 16);
  const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  const star = new THREE.Mesh( geometry, material )

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(220).fill().forEach(addStar) //stars

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

const transformMoon = [
  {
    rotationZ: 0.45,
    positionX: 1.5
  },{
    rotationZ: -0.45,
    positionX: -1.5
  },{
    rotationZ: 0.0314,
    positionX: 0
  }
]

let scrollY = window.scrollY;
let currentSession = 0;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);

  console.log(newSection);

  if (newSection != currentSession){
    currentSession = newSection;

    if (!!moon){
      gsap.to(
        moon.rotation, {
          duration: 1.5,
          ease: 'power2.inOut',
          z: transformMoon[currentSession].rotationZ
        }
      )
      gsap.to(
        moon.position, {
          duration: 1.5,
          ease: 'power2.inOut',
          x: transformMoon[currentSession].positionX
        }
      )
    }
  }
}); 

function onScroll(){
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  moon.position.x += 0.2;
  moon.position.y +=  0.002;
  moon.position.z +=  0.01;
}

//window.addEventListener('scroll', onScroll); // to call the func every time the user scrolls


const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const ElapsedTime = clock.getElapsedTime();
  const deltaTime = ElapsedTime - lastElapsedTime;
  lastElapsedTime = ElapsedTime

  render.render( scene, camera );

  window.requestAnimationFrame(tick)
}

// on reload
window.onbeforeunload = function() {
  window.scrollTo(0, 0);
}

// let's create a function to automate this action
function animate(){
  requestAnimationFrame( animate );

  moon.rotation.x += 0.001;
  moon.rotation.y += 0.0005;
  moon.rotation.z += 0.001;

  controls.update();

  render.render( scene, camera );
}

tick()
animate()