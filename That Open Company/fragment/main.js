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
let fragments = new OBC.FragmentManager(components);
const toolbar = new OBC.Toolbar(components);
components.ui.addToolbar(toolbar);
async function loadFragments() {
  if (fragments.groups.length) return;
  const file = await fetch("./resources/small.frag");
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const group = await fragments.load(buffer);
  console.log(group);
  // const scene = components.scene.get();
  // scene.add(model);
}
const loadButton = new OBC.Button(components);
loadButton.materialIcon = "download";
loadButton.tooltip = "Load model";
toolbar.addChild(loadButton);
loadButton.onClick.add(() => loadFragments());

components.scene.setup();
