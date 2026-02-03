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
    /*
      (_response: string[]) => {
        _response.forEach((element: string) => {
          Assets.add({ alias: element, src: "/tilessets/" + element });
        });
      }
        */
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
        //let frame = new Rectangle(horzontalFields * 48, verticalFields * 48, 48, 48);
         //let newTexture = (new Texture({ source: texture.source, frame }));
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
