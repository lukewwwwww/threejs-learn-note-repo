import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";

//创建场景
const scene = new THREE.Scene();

//创建相机
// new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
const camera = new THREE.PerspectiveCamera(
  75, //
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// camera.position.set(200, 300, 200); //设置相机位置
// camera.lookAt(scene.position); //设置相机方向(指向的场景对象)

//创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); //body元素中插入canvas对象

// renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色

// renderer.render(scene, camera);

//创建正方形
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); //材质对象Material
const cube = new THREE.Mesh(geometry, material); //网格模型对象Mesh
scene.add(cube); //网格模型添加到场景中

camera.position.z = 5;

// var geometry = new THREE.SphereGeometry(60, 40, 40); //创建一个球体几何对象
// var geometry = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry

// 光源设置
// 点光源
// var point = new THREE.PointLight(0xffffff);
// point.position.set(400, 200, 300); //点光源位置
// scene.add(point); //点光源添加到场景中

// 环境光
// var ambient = new THREE.AmbientLight(0x444444);
// scene.add(ambient);

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  //旋转

  renderer.render(scene, camera);
}
//创造渲染function
//不支持该接口的浏览器中能安全回退为setInterval，60Mphz，tab停止

if (WebGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}


