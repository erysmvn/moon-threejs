import './style.css'
import * as THREE from 'three'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const render = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

render.setPixelRatio( window.devicePixelRatio );
render.setSize( window.innerWidth, window.innerHeight );

camera.position.setZ(30);

render.render( scene, camera );
