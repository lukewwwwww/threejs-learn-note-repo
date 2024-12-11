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

const simpleGrid = await components.tools.get(OBC.SimpleGrid);

//get tools from cloud platform
components.tools.init(OBC);

components.tools.token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiNjUwNmYyZjk0NWM4YmM2YTk0Mzg0NjM4IiwiYSI6IjY1MDhhN2VjZGZjYTQ5Mjc2MmE0YjFlZiJ9.Rr7bq9qJdm4pRUnXF0pUt9QhrtJLOS6koVyZMcf5XoU";
const toolID = "50301542-4c0b-42ca-b2b4-066d45ca6735";
const tool = await components.tools.getPlatformComponent(toolID);

//获取tool的UI
const button = tool.uiElement.get("Measure");
button.materialIcon = "straighten";//editicon

//创建一个工具栏
const toolbar = new OBC.Toolbar(components);
components.ui.addToolbar(toolbar);//add to the components ui

//添加一个按钮
toolbar.addChild(button);

components.scene.setup();
