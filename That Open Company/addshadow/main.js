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

const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1.5, 0);

scene.background = new THREE.Color("gray");
scene.add(cube);
components.meshes.add(cube); //存储cube 更好管理

//添加shadow
const shadows = new OBC.ShadowDropper(components);

shadows.shadowExtraScaleFactor = 15;
shadows.darkness = 2;
shadows.shadowOffset = 0.1;

//渲染阴影
shadows.renderShadow([cube], "example"); //‘example’为id，unique

components.scene.setup();
