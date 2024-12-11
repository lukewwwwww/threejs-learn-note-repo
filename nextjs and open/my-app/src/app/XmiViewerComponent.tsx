"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { findCenter } from "./utils/CenterFinder";
import { rescale } from "./utils/Rescale";
import { OrbitControls } from "three/examples/jsm/Addons.js";

interface StructuralPointConnection {
  Name: string;
  X: number;
  Y: number;
  Z: number;
}
interface Model {
  beamDetails: Map<string, [number, number, number][]>;
  surfaceDetails: Map<string, [number, number, number][]>;
  centerCoord: [number, number, number];
  id: string;
  description: string;
}
interface matchingPair {
  targetElementId: string;
  sourceElementIds: string[];
  sourceElementRanks: number[];
  entityName: string;
}
export default function XmiViewerComponent({
  resultPath,
  filePath,
  status,
}: {
  resultPath: string;
  filePath: string;
  status: string;
}) {
  const beamDetails: Map<string, [number, number, number][]> = new Map<
    string,
    [number, number, number][]
  >();

  const surfaceDetails: Map<string, [number, number, number][]> = new Map<
    string,
    [number, number, number][]
  >();

  const [targetCoords, setTargetCoords] = useState(new THREE.Vector3(0, 0, 0));

  const newModel: Model = {
    beamDetails: new Map<string, [number, number, number][]>(),
    surfaceDetails: new Map<string, [number, number, number][]>(),
    centerCoord: [0, 0, 0],
    id: "",
    description: "",
  };

  const [models, setModels] = useState<Model>();

  const [scmPassesSubsetForTarget, setScmPassesSubsetForTarget] = useState<
    string[]
  >([]);
  const [ssmPassesSubsetForTarget, setSsmPassesSubsetForTarget] = useState<
    string[]
  >([]);

  const [scmPassesSubsetForSource, setScmPassesSubsetForSource] = useState<
    string[]
  >([]);
  const [ssmPassesSubsetForSource, setSsmPassesSubsetForSource] = useState<
    string[]
  >([]);

  function setSuccessFailSubsetForTarget(matchingPairs: matchingPair[]) {
    const scmTargets: string[] = [];
    const ssmTargets: string[] = [];

    matchingPairs?.forEach((matchingPair) => {
      const targetId = matchingPair.targetElementId;
      const sourceIds = matchingPair.sourceElementIds;
      const entityName = matchingPair.entityName;

      if (entityName === "StructuralCurveMember") {
        if (sourceIds.length !== 0) {
          scmTargets.push(targetId);
        }
      } else if (entityName === "StructuralSurfaceMember") {
        if (sourceIds.length !== 0) {
          ssmTargets.push(targetId);
        }
      }
    });

    setScmPassesSubsetForTarget(scmTargets);
    setSsmPassesSubsetForTarget(ssmTargets);
  }

  function setSuccessFailSubsetForSource(matchingPairs: matchingPair[]) {
    const scmSources: string[] = [];
    const ssmSources: string[] = [];
    matchingPairs?.forEach((matchingPair) => {
      const sourceIds = matchingPair.sourceElementIds;
      const entityName = matchingPair.entityName;

      if (entityName === "StructuralCurveMember") {
        if (sourceIds.length > 0) {
          scmSources.push(sourceIds[0]);
        }
      } else if (entityName === "StructuralSurfaceMember") {
        if (sourceIds.length > 0) {
          ssmSources.push(sourceIds[0]);
        }
      }
    });
    setScmPassesSubsetForSource(scmSources);
    setSsmPassesSubsetForSource(ssmSources);
  }

  function processBeforeRender(data: any, matchingPairs: matchingPair[]) {
    const pointConnectionData = data.StructuralPointConnection;
    const curvemembers = data.StructuralCurveMember;
    const surfaceMembers = data.StructuralSurfaceMember;

    curvemembers.map((curveData: any) => {
      const nodeNameArr = curveData.Nodes.split(";");
      for (let i = 0; i < nodeNameArr.length; i++) nodeNameArr[i].trim();
      const coordsMap: [number, number, number][] = [];
      nodeNameArr.filter((nodeName: any) => {
        pointConnectionData.filter((nodeSPC: StructuralPointConnection) => {
          nodeName === nodeSPC.Name &&
            coordsMap.push([nodeSPC.X, nodeSPC.Y, nodeSPC.Z]);
        });
      });
      beamDetails.set(curveData.ID, coordsMap);
    });

    surfaceMembers.map((surfaceData: any) => {
      const nodeNameArr = surfaceData.Nodes.split(";");
      for (let i = 0; i < nodeNameArr.length; i++) nodeNameArr[i].trim();
      const coordsMap: [number, number, number][] = [];
      nodeNameArr.filter((nodeName: any) => {
        pointConnectionData.filter((nodeSPC: StructuralPointConnection) => {
          nodeName === nodeSPC.Name &&
            coordsMap.push([nodeSPC.X, nodeSPC.Y, nodeSPC.Z]);
        });
      });
      surfaceDetails.set(surfaceData.ID, coordsMap);
    });

    const centerCoord = findCenter(beamDetails);
    setTargetCoords(new THREE.Vector3(...centerCoord));

    newModel.beamDetails = beamDetails;
    newModel.surfaceDetails = surfaceDetails;
    newModel.centerCoord = centerCoord;

    setModels(newModel);

    const coordsMap: [number, number, number][] = [];
    pointConnectionData.filter((nodeSPC: StructuralPointConnection) => {
      coordsMap.push([nodeSPC.X, nodeSPC.Y, nodeSPC.Z]);
    });

    if (status === "target") {
      setSuccessFailSubsetForTarget(matchingPairs);
    } else {
      setSuccessFailSubsetForSource(matchingPairs);
    }

    return {
      centerCoord: newModel.centerCoord,
      targetCoords: targetCoords,
      models: newModel,
    };
  }

  function createLine(
    scene: THREE.Scene,
    beamDetailsRescaled: Map<string, [number, number, number][]>,
    subSet: string[]
  ) {
    const successCurveData: any[] = [];
    const failCurveData: any[] = [];
    beamDetailsRescaled.forEach((value, key: any) => {
      value.forEach((item: any) => {
        if (subSet.includes(key)) {
          successCurveData.push(item);
        } else {
          failCurveData.push(item);
        }
      });
    });

    for (let i = 0; i < successCurveData.length - 1; i += 2) {
      const start = successCurveData[i];
      const end = successCurveData[i + 1];

      const value = new Float32Array([...start, ...end]);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(value, 3));

      const successLineMaterial = new THREE.LineBasicMaterial({
        color: "#00C70F",
        linewidth: 5,
      });

      const lineMesh = new THREE.LineSegments(geometry, successLineMaterial);
      lineMesh.renderOrder = 1;

      scene.add(lineMesh);
    }

    for (let i = 0; i < failCurveData.length - 1; i += 2) {
      const start = failCurveData[i];
      const end = failCurveData[i + 1];

      const value = new Float32Array([...start, ...end]);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(value, 3));

      const failLineMaterial = new THREE.LineBasicMaterial({
        color: "#E81A09",
        linewidth: 5,
      });

      const lineMesh = new THREE.LineSegments(geometry, failLineMaterial);
      lineMesh.renderOrder = 1;
      scene.add(lineMesh);
    }
  }

  function createSurface(
    scene: THREE.Scene,
    surfaceDetailsRescaled: Map<string, [number, number, number][]>,
    subset: string[]
  ) {
    const successSurfaceData: any = [];
    const failSurfaceData: any = [];
    surfaceDetailsRescaled.forEach((value: any, key: any) => {
      const processedValues: number[] = [];
      let start: number = 0;
      let next: number = start + 1;
      let end: number = value.length - 1;
      let isClockwise: boolean = true;
      const totalTriangles: number = value.length - 2;

      for (let i = 1; i <= totalTriangles; i++) {
        processedValues.push(value[start]);
        processedValues.push(value[next]);
        processedValues.push(value[end]);

        let tempN = next;
        start = end;
        next = isClockwise ? end - 1 : start + 1;
        end = tempN;
        isClockwise = !isClockwise;
      }

      if (subset.includes(key)) {
        successSurfaceData.push(processedValues);
      } else {
        failSurfaceData.push(processedValues);
      }
    });

    const successSurfaceMaterial = new THREE.MeshPhongMaterial({
      color: "#90E884",
      side: THREE.DoubleSide,
      opacity: 5,
    });

    const failSurfaceMaterial = new THREE.MeshPhongMaterial({
      color: "#E86D6D",
      side: THREE.DoubleSide,
    });

    const successSurfaceFlatData = successSurfaceData.flat().flat();
    const failSurfaceFlatData = failSurfaceData.flat().flat();

    if (successSurfaceFlatData.length > 0) {
      const successSurfaceGeometry = new THREE.BufferGeometry();
      successSurfaceGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(successSurfaceFlatData), 3)
      );
      successSurfaceGeometry.computeVertexNormals();
      const successSurfaceMesh = new THREE.Mesh(
        successSurfaceGeometry,
        successSurfaceMaterial
      );
      successSurfaceMesh.renderOrder = 2;
      scene.add(successSurfaceMesh);
    }

    if (failSurfaceFlatData.length > 0) {
      const failSurfaceGeometry = new THREE.BufferGeometry();
      failSurfaceGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(failSurfaceFlatData), 3)
      );
      failSurfaceGeometry.computeVertexNormals();

      const failSurfaceMesh = new THREE.Mesh(
        failSurfaceGeometry,
        failSurfaceMaterial
      );
      failSurfaceMesh.renderOrder = 2;
      scene.add(failSurfaceMesh);
    }
  }

  function createObjectFromJson(
    scene: THREE.Scene,
    data: any,
    matchingPairs: matchingPair[]
  ) {
    const { centerCoord, targetCoords, models } = processBeforeRender(
      data,
      matchingPairs
    );

    if (models) {
      const beamDetailsRescaled = rescale(models.beamDetails, centerCoord!);
      const surfaceDetailsRescaled = rescale(
        models.surfaceDetails,
        centerCoord!
      );
    } else {
      console.log("models not found");
    }
  }

  async function fetchAndCreateObjects(scene: THREE.Scene) {
    try {
      const [data, matchingPairsData] = await Promise.all([
        fetch(filePath).then((response) => response.json()),
        fetch(resultPath).then((response) => response.json()),
      ]);

      const curveResults = matchingPairsData.results.StructuralCurveMember;
      const surfaceResults = matchingPairsData.results.StructuralSurfaceMember;

      const matchingPairs: matchingPair[] = [];

      curveResults.forEach((curveResult: any) => {
        const sourceElements = curveResult.sourceElements;
        const sEIds: string[] = [];
        const sERanks: number[] = [];
        sourceElements.forEach((sourceElement: any) => {
          sEIds.push(sourceElement.id);
          sERanks.push(sourceElement.rank);
        });
        matchingPairs.push({
          targetElementId: curveResult.targetElement.id,
          sourceElementIds: sEIds,
          sourceElementRanks: sERanks,
          entityName: "StructuralCurveMember",
        });
      });

      surfaceResults.forEach((surfaceResult: any) => {
        const sourceElements = surfaceResult.sourceElements;
        const sEIds: string[] = [];
        const sERanks: number[] = [];
        sourceElements.forEach((sourceElement: any) => {
          sEIds.push(sourceElement.id);
          sERanks.push(sourceElement.rank);
        });
        matchingPairs.push({
          targetElementId: surfaceResult.targetElement.id,
          sourceElementIds: sEIds,
          sourceElementRanks: sERanks,
          entityName: "StructuralSurfaceMember",
        });
      });
      createObjectFromJson(scene, data, matchingPairs);
    } catch (error) {
      console.error("Error loading JSON or matchingPairs:", error);
      throw error;
    }
  }

  const mountRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (mount) {
      const scene = new THREE.Scene();
      setScene(scene);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.x = targetCoords.x + 2;
      camera.position.y = targetCoords.y - 3;
      camera.position.z = targetCoords.z + 1;
      camera.up.set(0, 0, 1);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mount.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);

      fetchAndCreateObjects(scene);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.dampingFactor = 0.25;
      const animate = () => {
        controls.update();
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        mount.removeChild(renderer.domElement);
      };
    }
  }, []);

  useEffect(() => {
    if (scene) {
      if (models) {
        const beamDetailsRescaled = rescale(
          models.beamDetails,
          models.centerCoord!
        );
        const surfaceDetailsRescaled = rescale(
          models.surfaceDetails,
          models.centerCoord!
        );

        if (status === "target") {
          createLine(scene, beamDetailsRescaled, scmPassesSubsetForTarget);
          createSurface(
            scene,
            surfaceDetailsRescaled,
            ssmPassesSubsetForTarget
          );
        } else {
          createLine(scene, beamDetailsRescaled, scmPassesSubsetForSource);
          createSurface(
            scene,
            surfaceDetailsRescaled,
            ssmPassesSubsetForSource
          );
        }
      }
    }
  }, [
    scmPassesSubsetForTarget,
    ssmPassesSubsetForTarget,
    scmPassesSubsetForSource,
    ssmPassesSubsetForSource,
    scene,
    models,
  ]);

  return <div ref={mountRef} />;
}
