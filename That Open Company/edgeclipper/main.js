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

//添加网格
const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-2, 1.5, 0);
scene.add(cube);
components.meshes.add(cube);
const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube2.position.set(2, 1.5, 0);
scene.add(cube2);
components.meshes.add(cube2);

//创建裁剪器
const clipper = new OBC.EdgesClipper(components);

clipper.enabled = true;

//设置裁剪平面格式
const blueFill = new THREE.MeshBasicMaterial({ color: "lightblue", side: 2 });
const blueLine = new THREE.LineBasicMaterial({ color: "blue" });
const blueOutline = new THREE.MeshBasicMaterial({
  color: "blue",
  opacity: 0.2,
  side: 2,
  transparent: true,
});
clipper.styles.create(
  "Blue lines",
  new Set([cube]),
  blueLine,
  blueFill,
  blueOutline
);
const salmonFill = new THREE.MeshBasicMaterial({ color: "salmon", side: 2 });
const redLine = new THREE.LineBasicMaterial({ color: "red" });
const redOutline = new THREE.MeshBasicMaterial({
  color: "red",
  opacity: 0.2,
  side: 2,
  transparent: true,
});
clipper.styles.create(
  "Red lines",
  new Set([cube2]),
  redLine,
  salmonFill,
  redOutline
);

//双击开始
container.ondblclick = () => clipper.create();

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    clipper.delete();
  }
  if (event.code === "KeyP") {
    console.log(clipper);
  }
};

//clipper.deleteAll()
components.scene.setup();
