import React from "react";
import { Vector3, HemisphericLight, ArcRotateCamera, SceneLoader, StandardMaterial, Texture, Color4, GlowLayer, Color3 } from "@babylonjs/core";
import SceneComponent from "../../components/BabylonJS/SceneComponent";
import '@babylonjs/loaders/glTF';
import { useRouter } from "next/router";
import config from '../../config'

let camera;
let rotation = 0.0;

const onRender = (scene) => {
  if (camera !== undefined) {
    let deltaTimeInMillis = scene.getEngine().getDeltaTime();

    rotation += 0.5 * (deltaTimeInMillis / 1000);

    rotation = rotation % (2 * Math.PI);

    camera.alpha = rotation;
  }
};

const ShipDetail = () => {
  const router = useRouter();

  const onSceneReady = (scene) => {

    scene.clearColor = new Color4(0, 0, 0, 0);
    const canvas = scene.getEngine().getRenderingCanvas();

    camera = new ArcRotateCamera("Camera", 200, -45, 2500, Vector3.Zero(), scene);

    let shipType = router.query.ship ?? 0;
    let skinId = router.query.skin ?? 10;
    let scale = -1;

    if (shipType == 0) {
      scale = 50;
    }
    else if (shipType == 1) {
      scale = 20;
    }
    else if (shipType == 2) {
      scale = 100;
    }
    else if (shipType == 3) {
      scale = 15;
    }

    SceneLoader.LoadAssetContainer(`${config.ASSETS_BASE_URI}ships/${shipType}/models/`, "0.gltf?nocache", scene, function (container) {
      var meshes = container.meshes;
      var materials = container.materials;

      let shipMesh = meshes[1];
      shipMesh.scaling = new Vector3(scale, scale, scale);
      var material = new StandardMaterial("shipTexture", scene);
      // See https://www.notion.so/dpsteam/Ships-382bc75a07d8462f97d3c7fe0931b355

      // Base Texture = 0
      material.diffuseTexture = new Texture(`${config.ASSETS_BASE_URI}ships/${shipType}/skins/${skinId}/0.png`, scene, null, false);

      // Some of these skins don't exist, so it looks funky
      // Ambient Oclusion = 1
      //material.ambientTexture = new BABYLON.Texture(`https://storage.googleapis.com/deepspace-assets-dev/ships/${shipType}/skins/${skinId}/1.png`, scene, null, false);

      // Emissive = 2
      // Emissive material missing for fighter
      if (shipType != 0) {

        material.emissiveTexture = new Texture(`${config.ASSETS_BASE_URI}ships/${shipType}/skins/${skinId}/2.png`, scene, null, false);
        material.emissiveColor = new Color3(1, 1, 0.53)

        var gl = new GlowLayer("glow", scene);
        gl.blurKernelSize = 0;
        gl.intensity = 0.5;
      }

      // Height = 3 (unsure of this)
      //material. = new BABYLON.Texture(`https://storage.googleapis.com/deepspace-assets-dev/ships/${shipType}/skins/${skinId}/3.png`, scene, null, false);

      // Metallic = 4
      material.reflectionTexture = new Texture(`${config.ASSETS_BASE_URI}ships/${shipType}/skins/${skinId}/4.png`, scene, null, false);
      material.reflectionTexture.level = 0.15;

      // Normal = 5
      material.bumpTexture = new Texture(`${config.ASSETS_BASE_URI}ships/${shipType}/skins/${skinId}/5.png`, scene, null, false);

      shipMesh.material = material;
      container.addAllToScene();
    });

    camera.setTarget(new Vector3(180, 0, -45));
    camera.attachControl(canvas, true);

    var light = new HemisphericLight("light", new Vector3(0.5, 0.5, 0.5), scene);
    light.intensity = 0.9;

    return scene;
  };

  return (
    <div>
      <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
    </div>
  )
};
export default ShipDetail