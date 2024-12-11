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
//创建顶点数据,有顺序正面逆时针

// const vertices = new Float32Array([
//   -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
// ]);

//两个三角形，6个点 写成一个面
// const vertices = new Float32Array([
//   -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
//   -1.0, -1.0, 1.0,
// ]);

//使用索引值，4个点写成一个面
const vertices = new Float32Array([
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
]);
//创建顶点属性//vertices代表数据源，3代表三个数字为一组
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

//对于索引创建，多一步
const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
//0，1，2代表第1，2，3个点坐标，形成一个三角形，0，2，3代表第2，3，0形成第二个三角形
//创建索引
geometry.setIndex(new THREE.BufferAttribute(indices, 1));

//创建材质
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
  side: THREE.DoubleSide, //正反两面可见
});
const plane = new THREE.Mesh(geometry, material);

scene.add(plane);

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
