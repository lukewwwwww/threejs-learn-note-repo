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

const fragments = new OBC.FragmentManager(components);
const file = await fetch("../../../resources/small.frag");
const dataBlob = await file.arrayBuffer();
const buffer = new Uint8Array(dataBlob);
fragments.load(buffer);

const map = new OBC.MiniMap(components);
components.ui.add(map.uiElement.get("canvas"));

map.lockRotation = false;
map.zoom = 0.2;

components.scene.setup();
