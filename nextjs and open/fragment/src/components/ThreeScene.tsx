import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import * as OBC from "openbim-components";

//fragment function
async function loadFragments(fragments: OBC.FragmentManager) {
  if (fragments.groups.length) return;
  const file = await fetch("/resources/small.frag");
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const group = await fragments.load(buffer);
  console.log(group);
  // const scene = components.scene.get();
  // scene.add(model);
}

//export and download
function exportFragments(fragments: OBC.FragmentManager) {
  if (!fragments.groups.length) return;
  const group = fragments.groups[0];
  const data = fragments.export(group);
  const blob = new Blob([data]);
  const file = new File([blob], "small.frag");
  download(file);
}

function download(file: File) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

//delete function
function disposeFragments(fragments: OBC.FragmentManager) {
  fragments.dispose();
}

//import function
function importExternalFragment(fragments: OBC.FragmentManager) {
  if (fragments.groups.length) return;
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (file && file.name.includes(".frag")) {
      const url = URL.createObjectURL(file);
      const result = await fetch(url);
      const data = await result.arrayBuffer();
      const buffer = new Uint8Array(data);
      if (fragments) {
        fragments.load(buffer);
      }
    }
    input.remove();
  };
  input.click();
}

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

      //fragment manager
      let fragments = new OBC.FragmentManager(components);

      //toolbar
      const toolbar = new OBC.Toolbar(components);
      components.ui.addToolbar(toolbar);

      //load button
      const loadButton = new OBC.Button(components);
      loadButton.materialIcon = "download";
      loadButton.tooltip = "Load model";
      toolbar.addChild(loadButton);
      loadButton.onClick.add(() => loadFragments(fragments));

      //export button
      const exportButton = new OBC.Button(components);
      exportButton.materialIcon = "exit_to_app";
      exportButton.tooltip = "Export model";
      toolbar.addChild(exportButton);
      exportButton.onClick.add(() => exportFragments(fragments));

      //delete button
      const disposeButton = new OBC.Button(components);
      disposeButton.materialIcon = "delete";
      disposeButton.tooltip = "Delete model";
      toolbar.addChild(disposeButton);
      disposeButton.onClick.add(() => disposeFragments(fragments));

      //import button
      const openButton = new OBC.Button(components);
      openButton.materialIcon = "folder_open";
      openButton.tooltip = "Import model";
      toolbar.addChild(openButton);
      openButton.onClick.add(() => importExternalFragment(fragments));

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
