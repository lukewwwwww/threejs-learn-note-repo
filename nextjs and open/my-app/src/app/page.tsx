import Image from "next/image";

import dynamic from "next/dynamic";
import ColorViewerComponent from "./ColorViewerComponent";
import MarkerViewerComponent from "./MarkerViewerComponent";
import XmiViewerComponent from "./XmiViewerComponent";
interface PathGroup {
  ifcPath: string;
  resultPath: string;
}

const pathGroup: PathGroup[] = [
  {
    ifcPath: "/ifcFiles/test0.ifc",
    resultPath: "/ifcFiles/dummyresult.json",
  },
  {
    ifcPath: "/ifcFiles/TSD to Revit.ifc",
    resultPath: "/ifcFiles/TSD to Revit Result.json",
  },
];

const pathGroupForMarker: PathGroup[] = [
  {
    ifcPath: "/ifcFiles/test0.ifc",
    resultPath: "/ifcFiles/dummyresultmarker.json",
  },
  {
    ifcPath: "/ifcFiles/TSD to Revit.ifc",
    resultPath: "/ifcFiles/TSD to Revit Result.json",
  },
];
export default function Home() {
  let viewMode = "color";
  viewMode = "marker";
  return (
    <>
      {viewMode === "color" ? (
        <ColorViewerComponent pathGroup={pathGroup} />
      ) : (
        <MarkerViewerComponent pathGroup={pathGroupForMarker} />
      )}
      {/* <XmiViewerComponent resultPath={"/ifcFiles/output1.json"} filePath={"/ifcFiles/test0-bim1_mod.json"} status="target"/> */}
    </>
  );
}
