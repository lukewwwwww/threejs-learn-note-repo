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

//创建网格
const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1.5, 0);

scene.add(cube);
components.meshes.add(cube);

//创建尺寸工具
const dimensions = new OBC.LengthMeasurement(components);

dimensions.enabled = true;
dimensions.snapDistance = 1;

container.ondblclick = () => dimensions.create();

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    dimensions.delete();
  }
};

const mainToolbar = new OBC.Toolbar(components, {
  name: "Main Toolbar",
  position: "bottom",
});
//添加dimension工具进入tool栏
mainToolbar.addChild(dimensions.uiElement.get("main"));
//添加tool栏进入page
components.ui.addToolbar(mainToolbar);
components.scene.setup();
