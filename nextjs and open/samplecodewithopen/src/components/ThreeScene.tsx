import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import * as OBC from "openbim-components";
const ThreeScene: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
      const viewerContainer = document.getElementById(
        "viewerContainer"
      ) as HTMLDivElement;

      const components = new OBC.Components();

      //scene
      const componentsscene = new OBC.SimpleScene(components);
      components.scene = componentsscene;
      const scene = components.scene.get();

      //renderer
      components.renderer = new OBC.SimpleRenderer(
        components,
        viewerContainer,
        {
          canvas,
          antialias: true,
        }
      );

      //camera
      const componentscamera = new OBC.SimpleCamera(components);
      components.camera = componentscamera;
      componentscamera.controls.setLookAt(10, 10, 10, 0, 0, 0);

      //raycaster
      components.raycaster = new OBC.SimpleRaycaster(components);

      //grid
      const grid = new OBC.SimpleGrid(components);

      components.init();

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

      viewerContainer.ondblclick = () => dimensions.create();

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
      componentsscene.setup();
    }
  }, []);

  return (
    <>
      <div id="viewerContainer" className="flex-1">
        <canvas id="mycanvas"></canvas>
      </div>
    </>
  );
};

export default ThreeScene;
