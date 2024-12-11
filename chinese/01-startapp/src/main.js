//导入three.js
import * as THREE from "three";

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
const cube=new THREE.Mesh(geometry,material);

//将网格添加入场景
scene.add(cube);

//设置相机位置
camera.position.z=5;//设置z,xy默认为0，0
camera.lookAt(0,0,0);

//渲染函数
function animate(){
    requestAnimationFrame(animate);

    //旋转
    cube.rotation.x+=0.01;
    cube.rotation.y+=0.01;
    
    //渲染
    renderer.render(scene,camera);
}

animate();

//不使用渲染函数
// renderer.render(scene,camera);不旋转


