import * as THREE from "three";
import * as OBC from "openbim-components";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const container = document.getElementById("container");

const components = new OBC.Components();
components.scene = new OBC.SimpleScene(components);
components.renderer = new OBC.PostproductionRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

const scene = components.scene.get();

components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

const grid = new OBC.SimpleGrid(components);

//add fragment
const fragments = new OBC.FragmentManager(components);
const file = await fetch('../../../resources/small.frag');
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.load(buffer);
const meshes = [];
const culler = new OBC.ScreenCuller(components);
culler.setup();
for (const fragment of model.items) {
meshes.push(fragment.mesh);
culler.elements.add(fragment.mesh);
}
culler.elements.needsUpdate = true;
const controls = components.camera.controls;
controls.addEventListener('controlend', () => {
culler.elements.needsUpdate = true;
});

//后期制作
components.renderer.postproduction.enabled = true;
const postproduction = components.renderer.postproduction;
postproduction.customEffects.excludedMeshes.push(grid.get());
const gui = new GUI();
gui.add(postproduction, 'enabled');
const guiGamma = gui.addFolder('Gamma');
guiGamma.add(postproduction.settings, 'gamma').name("Gamma correction").onChange((value) => {
postproduction.setPasses({gamma: value});
});
const guiCustomEffects = gui.addFolder('Custom effects');
guiCustomEffects.add(postproduction.settings, 'custom').name("Custom effects").onChange((value) => {
postproduction.setPasses({custom: value});
});
guiCustomEffects.add(postproduction.customEffects, 'opacity').name('Line opacity').min(0).max(1).step(0.1);
guiCustomEffects.add(postproduction.customEffects, 'tolerance').name('Line tolerance').min(0).max(6).step(1);
guiCustomEffects.addColor(postproduction.customEffects, 'lineColor').name('Line color');
guiCustomEffects.add(postproduction.customEffects, 'glossEnabled').name('Gloss enabled').min(0).max(2).step(0.1);
guiCustomEffects.add(postproduction.customEffects, 'glossExponent').name('Gloss exponent').min(0).max(5).step(0.1);
guiCustomEffects.add(postproduction.customEffects, 'maxGloss').name('Max gloss').min(-2).max(2).step(0.05);
guiCustomEffects.add(postproduction.customEffects, 'minGloss').name('Min gloss').min(-2).max(2).step(0.05);
const guiAO = gui.addFolder('SAO');
const configuration = postproduction._n8ao.configuration;
guiAO.add(postproduction.settings, 'ao').name("Ambient occlusion").onChange((value) => {
postproduction.setPasses({ao: value});
});
guiAO.add(configuration, 'aoSamples').step(1).min(1).max(16);
guiAO.add(configuration, 'denoiseSamples').step(1).min(0).max(16);
guiAO.add(configuration, 'denoiseRadius').step(1).min(0).max(100);
guiAO.add(configuration, 'aoRadius').step(1).min(0).max(16);
guiAO.add(configuration, 'distanceFalloff').step(1).min(0).max(16);
guiAO.add(configuration, 'intensity').step(1).min(0).max(16);
guiAO.add(configuration, 'halfRes');
guiAO.add(configuration, 'screenSpaceRadius');
guiAO.addColor(configuration, 'color');

components.scene.setup();
