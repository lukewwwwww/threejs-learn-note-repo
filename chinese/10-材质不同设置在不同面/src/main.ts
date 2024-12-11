//导入three.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//创建场景
const scene = new THREE.Scene();

//创建相机
//透视相机，近大远小
const camera = new THREE.PerspectiveCamera(
  45, //视角，越大，看到东西越多
  window.innerWidth / window.innerHeight, //宽高比
  0.1, //近平面
  1000 //远平面
);

//创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//创建几何体
const geometry = new THREE.BufferGeometry(); //基础形，要指明点坐标

const vertices = new Float32Array([
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
]);

geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);

geometry.setIndex(new THREE.BufferAttribute(indices, 1));

//设置顶点组，形成不同材质
geometry.addGroup(0, 3, 0); //第1个点开始，三个一组，使用第一个材质
geometry.addGroup(3, 3, 1); //第三个点开始,三个一组，使用第二个材质
//创建材质
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
  side: THREE.DoubleSide, //正反两面可见
});
const material1 = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});
const plane = new THREE.Mesh(geometry, [material, material1]);

scene.add(plane);

const cubegeometry = new THREE.BoxGeometry(1, 1, 1);
//创建材质
const cubematerial0 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cubematerial1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cubematerial2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cubematerial3 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cubematerial4 = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const cubematerial5 = new THREE.MeshBasicMaterial({ color: 0xff00ff });
//创建网格
const cube = new THREE.Mesh(cubegeometry, [
  cubematerial0,
  cubematerial1,
  cubematerial2,
  cubematerial3,
  cubematerial4,
  cubematerial5,
]);

cube.position.set(5,5,5);
//将网格添加入场景
scene.add(cube);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;
camera.lookAt(0, 0, 0);

function animate() {
  controls.update(); //可选
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
