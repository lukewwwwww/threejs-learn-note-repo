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

//v1-create a grid with the cube
// const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
// const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
// const cube = new THREE.Mesh(boxGeometry, boxMaterial);
// cube.position.set(0, 1.5, 0);
// scene.add(cube);

//v2-mouseclick on cube
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const greenMaterial = new THREE.MeshStandardMaterial({ color: "#BCF124" });
const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
const cube1 = new THREE.Mesh(boxGeometry, cubeMaterial);
const cube2 = new THREE.Mesh(boxGeometry, cubeMaterial);
const cube3 = new THREE.Mesh(boxGeometry, cubeMaterial);
scene.add(cube1, cube2, cube3);
const cubes = [cube1, cube2, cube3];

cube2.position.x = 5;
cube3.position.x = -5;

//rotate the cube
const oneDegree = Math.PI / 180;
function rotateCubes() {
  cube1.rotation.x += oneDegree;
  cube1.rotation.y += oneDegree;
  cube2.rotation.x += oneDegree;
  cube2.rotation.z += oneDegree;
  cube3.rotation.y += oneDegree;
  cube3.rotation.z += oneDegree;
}
components.renderer.onBeforeUpdate.add(rotateCubes); //off()关闭

//光线投射器
let previousSelection;
window.onmousemove = () => {
  const result = components.raycaster.castRay(cubes);
  if (previousSelection) {
    previousSelection.material = cubeMaterial;
  }
  if (!result) {
    return;
  }
  result.object.material = greenMaterial;
  previousSelection = result.object;
};

components.scene.setup();
