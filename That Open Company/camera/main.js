import * as THREE from "three";
import * as OBC from "openbim-components";

const container = document.getElementById("container");

const components = new OBC.Components();
components.scene = new OBC.SimpleScene(components);
components.renderer = new OBC.SimpleRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

// components.init();

const scene = components.scene.get();

// components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

const grid = new OBC.SimpleGrid(components);

//创建立方体网格
const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1.5, 0);

scene.add(cube);
components.meshes.add(cube);

//修改相机
const camera = new OBC.OrthoPerspectiveCamera(components);
components.camera = camera;
camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
components.init();

//切换正交视图与透视图
function toggleProjection() {
  camera.toggleProjection();
}

camera.projectionChanged.add(() => {
  const projection = camera.getProjection();
  grid.fade = projection === "Perspective";
});

//设置导航模式，navMode可为'Orbit' / 'FirstPerson' / 'Plan'
function setNavigationMode(navMode) {
  camera.setNavigationMode(navMode);
}

// toggleProjection();
// setNavigationMode('FirstPerson');

components.scene.setup();
