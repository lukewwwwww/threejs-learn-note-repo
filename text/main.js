import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";

//创建场景
const scene = new THREE.Scene();

//创建相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  500
);
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

//创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//指定线的材料，蓝色，线为LineBasicMaterial 还有LineDashedMaterial
const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

//指定点的坐标
const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );
points.push( new THREE.Vector3( 11, 10, 10 ) );
points.push( new THREE.Vector3( 15, 10, 10 ) );

//按次序将坐标连接
const geometry = new THREE.BufferGeometry().setFromPoints( points );

//创建线
const line = new THREE.Line( geometry, material );

//渲染线
scene.add( line );
renderer.render( scene, camera );