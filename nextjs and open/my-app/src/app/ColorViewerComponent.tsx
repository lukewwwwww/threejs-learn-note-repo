"use client";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import { useEffect, useRef } from "react";
import { FragmentsGroup } from "@thatopen/fragments";
import * as FRAGS from "@thatopen/fragments";

interface IfcGUIDData {
  fileId: string;
  elementId: string;
}

interface PathGroup {
  ifcPath: string;
  resultPath: string;
}
export default function ColorViewerComponent({
  pathGroup,
}: {
  pathGroup: PathGroup[];
}) {
  async function getIfcLoader(components: OBC.Components) {
    const fragments = components.get(OBC.FragmentsManager);
    const fragmentIfcLoader = components.get(OBC.IfcLoader);
    await fragmentIfcLoader.setup();

    fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

    return fragmentIfcLoader;
  }

  async function loadIfc(
    world: OBC.SimpleWorld,
    fragmentIfcLoader: OBC.IfcLoader,
    ifcPath: string,
    resultPath: string
  ) {
    //load Ifc
    const file = await fetch(ifcPath);
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await fragmentIfcLoader.load(buffer);
    model.name = "example";
    world.scene.three.add(model);
    // console.log("FragmentGroup", model);

    //getBim
    const resultFile = await fetch(resultPath);
    const resultData = await resultFile.json();
    return { model, resultData };
  }

  function getElementDataGuid(resultData: any) {
    const successIfcGUIDList: IfcGUIDData[] = [];
    const failIfcGUIDList: IfcGUIDData[] = [];

    const subProbeResultList = resultData.result.subProbeResults;
    for (let subProbeResult of subProbeResultList) {
      const elementDataList = subProbeResult.elements;
      // console.log("elementDataList",elementDataList);
      for (let elementData of elementDataList) {
        const fileId = elementData.fileId;
        const elementId = elementData.elementId;
        const status = elementData.status;

        if (status === "PASS") {
          successIfcGUIDList.push({ fileId, elementId });
        } else {
          failIfcGUIDList.push({ fileId, elementId });
        }
      }
    }

    // console.log("SuccessIfcGUIDList", successIfcGUIDList);
    return { successIfcGUIDList, failIfcGUIDList };
  }

  async function getExpressId(model: FragmentsGroup, idList: IfcGUIDData[]) {
    const expressIds: number[] = [];
    const fragmentIdMapResult: FRAGS.FragmentIdMap = {};

    for (const data of idList) {
      const item: any = await OBC.IfcPropertiesUtils.findItemByGuid(
        model,
        data.elementId
      );
      if (item) {
        expressIds.push(item.expressID as number);
      }
    }

    const fragmentMapFound = model.getFragmentMap(expressIds);

    for (const fragmentId in fragmentMapFound) {
      fragmentIdMapResult[fragmentId] = new Set<number>(
        fragmentMapFound[fragmentId]
      );
    }

    return fragmentIdMapResult;
  }

  function enableClassifier(
    model: FragmentsGroup,
    ifcGUIDList: IfcGUIDData[],
    classifier: OBC.Classifier,
    status: boolean
  ) {
    const passedColor = new THREE.Color("#43E71B");

    const failedColor = new THREE.Color("#E73F1B");
    getExpressId(model, ifcGUIDList).then((fragmentIdMapResult) => {
      if (fragmentIdMapResult) {
        if (status) {
          classifier.setColor(fragmentIdMapResult, passedColor, true);
        } else {
          classifier.setColor(fragmentIdMapResult, failedColor, true);
        }
      }
    });
  }

  // async function loadModelByStreamer(
  //   loader: OBCF.IfcStreamer,
  //   world: OBC.World,
  //   geometryURL: string,
  //   propertiesURL?: string
  // ) {
  //   loader.world = world;
  //   loader.url =
  //     "https://thatopen.github.io/engine_components/resources/streaming/";

  //   const rawGeometryData = await fetch(geometryURL);
  //   const geometryData = await rawGeometryData.json();

  //   let propertiesData;
  //   if (propertiesURL) {
  //     const rawPropertiesData = await fetch(propertiesURL);
  //     propertiesData = await rawPropertiesData.json();
  //   }

  //   const model = await loader.load(geometryData, true, propertiesData);
  //   console.log(model);
  // }

  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    //set the dom element
    if (!containerRef.current) return;
    const container = containerRef.current;

    //init the scene
    const components = new OBC.Components();

    const worlds = components.get(OBC.Worlds);

    const world = worlds.create<
      OBC.SimpleScene,
      OBC.SimpleCamera,
      OBC.SimpleRenderer
    >();

    world.scene = new OBC.SimpleScene(components);
    world.renderer = new OBC.SimpleRenderer(components, container);
    world.camera = new OBC.SimpleCamera(components);

    components.init();

    world.scene.three.background = null;

    const grids = components.get(OBC.Grids);
    const grid = grids.create(world);

    world.scene.setup();

    world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);

    //Load the Ifc file
    const classifier = components.get(OBC.Classifier);

    const loadAllModels = async () => {
      const fragmentIfcLoader = await getIfcLoader(components);
      if (!fragmentIfcLoader) {
        throw new Error("Failed to initialize fragmentIfcLoader");
      }

      for (const path of pathGroup) {
        try {
          const { model, resultData } = await loadIfc(
            world,
            fragmentIfcLoader,
            path.ifcPath,
            path.resultPath
          );
          const { successIfcGUIDList, failIfcGUIDList } =
            getElementDataGuid(resultData);

          enableClassifier(model, successIfcGUIDList, classifier, true);
          enableClassifier(model, failIfcGUIDList, classifier, false);
        } catch (error) {
          console.error("Error loading model:", error);
        }
      }
    };
    loadAllModels().catch((error) => {
      console.error("Error in loadAllModels:", error);
    });

    //streamer
    // const loader = components.get(OBCF.IfcStreamer);
    // loadModelByStreamer(loader,world,ifcPath);
    // world.camera.controls.addEventListener("sleep", () => {
    //   loader.culler.needsUpdate = true;
    // });
    // loader.useCache = true;

    // async function clearCache() {
    //   await loader.clearCache();
    //   window.location.reload();
    // }

    //Because of the useEffect load twice,we need to dispose the model manually
    return () => {
      if (world.renderer) {
        world.renderer.dispose();
      }
      if (world.camera) {
        world.camera.dispose();
      }
      if (world.scene) {
        world.scene.dispose();
      }
      if (classifier) {
        classifier.dispose();
      }
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "100vh",
      }}
    >
      <div
        id="container"
        ref={containerRef}
        style={{ width: "60vw", height: "60vh" }}
      >
        {/* <div
          id="bim-panel-container"
          style={{
            position: "absolute",
            // top: 10,
            // left: 10,
            zIndex: 10, // Ensure the panel is above the canvas
          }}
        ></div> */}
      </div>
    </div>
  );
}
