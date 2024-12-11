//导入three.js
import * as THREE from "three";
//导入轨道控制器，使图形可拖拽
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//导入gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

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
const parentmaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//线框模式
material.wireframe = true;
//创建网格
let parentCube = new THREE.Mesh(geometry, parentmaterial);
const cube = new THREE.Mesh(geometry, material);
parentCube.add(cube);

//设置网格放大
cube.scale.set(2, 2, 1);
cube.position.set(2, 0, 0);

//绕着x轴旋转
parentCube.rotation.x = Math.PI / 4;
cube.rotation.x = Math.PI / 4;

//将网格添加入场景
scene.add(parentCube);

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
controls.rotateSpeed = 1;
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

//监听窗口变化
window.addEventListener("resize", () => {
  //重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  //更新相机投影矩阵
  camera.updateProjectionMatrix();
});

let eventObj = {
  Fullscreen: function () {
    document.body.requestFullscreen();
  },
  ExitFullscreen: function () {
    document.exitFullscreen();
  },
};

//创建Gui
const gui = new GUI();
gui.add(eventObj, "Fullscreen");
gui.add(eventObj, "ExitFullscreen"); //ExitFullscreen为上面命名的属性名称，可以自命名
// gui.add(eventObj,"Fullscreen").name("全屏");
// gui.add(eventObj,"ExitFullscreen").name("退出全屏");

//控制网格位置
gui.add(cube.position, "x", -5, 5).name("网格x轴调整"); //-5和5代表范围
gui.add(cube.position, "y", -5, 5).name("网格y轴调整");
gui.add(cube.position, "z", -5, 5).name("网格z轴调整");
// gui.add(cube.position, "x").min(-10).max(10).step(0.2).name("网格x轴step");

//folder
let folder = gui.addFolder("网格位置调整");
folder
  .add(cube.position, "x", -5, 5)
  .name("网格x轴调整")
  .onChange((val) => {
    console.log("x轴", val);
  }); //-5和5代表范围
folder
  .add(cube.position, "y", -5, 5)
  .name("网格y轴调整")
  .onFinishChange((val) => {
    console.log("y轴", val);
  });
folder.add(cube.position, "z", -5, 5).name("网格z轴调整");

gui.add(parentmaterial, "wireframe");
gui.add(material, "wireframe");

let colorParams = {
  cubeColor: "#ff0000",
};

gui.addColor(colorParams, "cubeColor").onChange((val) => {
  cube.material.color.set(val);
});
