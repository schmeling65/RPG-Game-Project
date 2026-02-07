import { Assets, Texture } from "pixi.js";
import { Requester } from "../JSUtils/request";

export interface textureMetaData {
  file: string;
  posX: number;
  posY: number;
}

export const TextureManager = new (class {
  constructor() {}

  loadTextureInformation() {
    return Requester.makeXMLHttpRequest("/environmentdata/textures.json");
  }

  async loadTextureOnDemand(texture: string) {
    await Assets.load(texture);
  }

  getAssetOrTextureFromCache(texture: string) {
    return Assets.get(texture);
  }

  getTexturesFromTextureFile(texture: Texture, object: Record<number,textureMetaData>) {
    let numberOfVerticalFields = texture.height / 48;
    let numberOfHorizontalFields = texture.width / 48;
    for (let horzontalFields = 0; horzontalFields < numberOfHorizontalFields; horzontalFields++) {
      for (let verticalFields = 0; verticalFields < numberOfVerticalFields; verticalFields++) {
         let textureMetaData: textureMetaData = {
          file: new URL(texture.label!).pathname.split("/").pop()!.replace('.png', ''),
          posX: horzontalFields * 48,
          posY: verticalFields * 48 
         }
         this.putTexturesIntoRelationToRelativeUniqueID(textureMetaData, object)
      }
    }
  }

  putTexturesIntoRelationToRelativeUniqueID(newData: textureMetaData, object: Record<number,textureMetaData>) {
    object[Object.keys(object).length+1] = newData
  }
})();
