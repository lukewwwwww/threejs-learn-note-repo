"use client";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import { useEffect, useRef } from "react";

interface Marker {
  name: string;
  description: string;
  x: number;
  y: number;
  z: number;
}

interface PathGroup {
  ifcPath: string;
  resultPath: string;
}

export default function MarkerViewerComponent({
  pathGroup,
}: {
  pathGroup: PathGroup[];
}) {
  async function getIfcLoader(components: OBC.Components) {
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
    const resultFile = await fetch("/ifcFiles/dummyresult.json");
    const resultData = await resultFile.json();
    return { model, resultData };
  }

  function addMarker(marker: OBCF.Marker, world: OBC.World) {
    marker.threshold = 10;
    const markers = [];

    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 5;
      const y = Math.random() * 5;
      const z = Math.random() * 5;
      const vector = new THREE.Vector3(x, y, z);
      marker.create(world, "🚀", vector);
      markers.push(vector);
    }

    return markers;
  }

  async function fetchResults(resultPath: string) {
    const resultFile = await fetch(resultPath);
    const resultData = await resultFile.json();

    const markers: Marker[] = [];
    const subProbeResultList = resultData.result.subProbeResults;
    for (let subProbeResult of subProbeResultList) {
      const elementDataList = subProbeResult.elements;

      for (let elementData of elementDataList) {
        let markerList = elementData.markers;
        if (Array.isArray(markerList)) {
          for (let marker of markerList) {
            markers.push(marker);
          }
        }
      }

      let markerList = subProbeResult.markers;
      if (Array.isArray(markerList)) {
        for (let marker of markerList) {
          markers.push(marker);
        }
      }
    }
    return markers;
  }

  function drawMarkers(x: number, y: number, z: number) {
    const markerMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
    const coneGeometry = new THREE.ConeGeometry(0.2, 0.5, 32);

    const pointer = new THREE.Mesh(coneGeometry, markerMaterial);

    pointer.rotation.x = Math.PI;
    pointer.position.set(x, y, z);
    pointer.scale.set(1 / 2, 1 / 2, 1 / 2);

    return pointer;
  }

  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

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
    const fragments = components.get(OBC.FragmentsManager);

    // getIfcLoader(components).then((fragmentIfcLoader) => {
    //   loadIfc(world, fragmentIfcLoader, ifcPath).then(
    //     ({ model, resultData }) => {
    //       console.log("resultData", resultData);
    //     }
    //   );
    // });
    const pointers: THREE.Mesh[] = [];

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

          fetchResults(path.resultPath).then((markers) => {
            for (let marker of markers) {
              const pointer = drawMarkers(marker.x, marker.y, marker.z);
              world.scene.three.add(pointer);
              pointer.userData = marker;
              pointers.push(pointer);
            }
          });
        } catch (error) {
          console.error("Error loading model:", error);
        }
      }
    };
    loadAllModels().catch((error) => {
      console.error("Error in loadAllModels:", error);
    });

    const markerMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
    const greenMaterial = new THREE.MeshStandardMaterial({ color: "#BCF124" });

    //raycaster
    const casters = components.get(OBC.Raycasters);

    const caster = casters.get(world);

    let previousSelection: THREE.Mesh | null = null;

    function handleDoubleClick(event: any) {
      if (previousSelection) {
        const marker = previousSelection.userData as Marker;
        console.log("marker", marker);
      }
    }

    window.onmousemove = () => {
      const result = caster.castRay(pointers);
      if (previousSelection) {
        previousSelection.material = markerMaterial;
        window.removeEventListener("dblclick", handleDoubleClick);
      }
      if (!result || !(result.object instanceof THREE.Mesh)) {
        return;
      }
      result.object.material = greenMaterial;
      window.addEventListener("dblclick", handleDoubleClick);
      previousSelection = result.object;
    };

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
      if (fragments) {
        fragments.dispose();
      }
    };
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        id="container"
        ref={containerRef}
        style={{ width: "60vw", height: "60vh" }}
      ></div>
    </div>
  );
}
