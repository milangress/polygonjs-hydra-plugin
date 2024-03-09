import { SceneDataManifestImporter } from "@polygonjs/polygonjs/dist/src/engine/io/manifest/import/SceneData";
const manifest = {
  properties: "1675552563896",
  root: "1675552563896",
  nodes: {
    geo1: "1675552563896",
    "geo1/MAT": "1675552563896",
    ground: "1675552563896",
    "ground/MAT": "1675552563896",
    "ground/MAT/meshStandardBuilder1": "1675552563896",
    COP: "1675552563896",
    lights: "1675552563896",
    cameras: "1675552563896",
    "cameras/cameraControls1": "1675552563896",
  },
  shaders: {
    "/ground/MAT/meshStandardBuilder1": {
      vertex: "1675552563896",
      fragment: "1675552563896",
      "customDepthMaterial.vertex": "1675552563896",
      "customDepthMaterial.fragment": "1675552563896",
      "customDistanceMaterial.vertex": "1675552563896",
      "customDistanceMaterial.fragment": "1675552563896",
      "customDepthDOFMaterial.vertex": "1675552563896",
      "customDepthDOFMaterial.fragment": "1675552563896",
    },
  },
};

export const loadSceneData_scene_01 = async (options = {}) => {
  const sceneDataRoot = options.sceneDataRoot || "./polygonjs/scenes";
  return await SceneDataManifestImporter.importSceneData({
    sceneName: "scene_01",
    urlPrefix: sceneDataRoot + "/scene_01",
    manifest: manifest,
    onProgress: options.onProgress,
  });
};
