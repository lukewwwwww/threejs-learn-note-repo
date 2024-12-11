import * as THREE from "three";
import * as OBC from "openbim-components";

const container = document.getElementById("container");

const components = new OBC.Components();
components.scene = new OBC.SimpleScene(components);
components.renderer = new OBC.SimpleRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

const scene = components.scene.get();

components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

const grid = new OBC.SimpleGrid(components);

//裁剪器，控制哪些物品应该渲染
const culler = new OBC.ScreenCuller(components);
await culler.setup();

//数字越大，可见对象越少，但性能越好
culler.elements.threshold = 200;

culler.elements.renderDebugFrame = true; //开启调试模式
const debugFrame = culler.elements.get().domElement; //显示调试模式
document.body.appendChild(debugFrame);
debugFrame.style.position = "fixed";
debugFrame.style.left = "0";
debugFrame.style.bottom = "0";
debugFrame.style.visibility = "collapse";
// debugFrame.style.visibility = "visible";

//生成随机网格
function getRandomNumber(limit) {
  return Math.random() * limit;
}

const cubes = [];
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshLambertMaterial({ color: "#6528D7" });

function regenerateCubes() {
  resetCubes();
  for (let i = 0; i < 300; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = getRandomNumber(10);
    cube.position.y = getRandomNumber(10);
    cube.position.z = getRandomNumber(10);
    cube.updateMatrix();
    scene.add(cube);
    culler.elements.add(cube);
    cubes.push(cube);
  }
}

//删除网格
function resetCubes() {
  for (const cube of cubes) {
    cube.removeFromParent();
  }
  cubes.length = 0;
}

regenerateCubes();

culler.elements.needsUpdate = true;
components.camera.controls.addEventListener("controlend", () => {
  culler.elements.needsUpdate = true;
});

components.scene.setup();
