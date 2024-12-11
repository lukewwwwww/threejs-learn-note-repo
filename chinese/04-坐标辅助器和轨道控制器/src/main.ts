//导入three.js
import * as THREE from "three";
//导入轨道控制器，使图形可拖拽
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
const geometry = new THREE.BoxGeometry(1, 1, 1);
//创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//创建网格
const cube = new THREE.Mesh(geometry, material);

//将网格添加入场景
scene.add(cube);

//设置相机位置
camera.position.z = 5; //设置z,xy默认为0，0
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

//添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
//线段长度为5
scene.add(axesHelper);
//红色x轴，绿色y轴，蓝色z轴

//添加轨道控制器//https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
//const controls = new OrbitControls(camera, document.body);要修改css的body

//设置带阻尼
controls.enableDamping = true;
//设置阻尼系数
controls.dampingFactor = 0.05;
//设置旋转速度
controls.rotateSpeed = 0.05;
//设置自动旋转
controls.autoRotate = true;

//渲染函数
function animate() {
  controls.update(); //可选
  requestAnimationFrame(animate);

  //旋转
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  //渲染
  renderer.render(scene, camera);
}

animate();

//不使用渲染函数
// renderer.render(scene,camera);不旋转
