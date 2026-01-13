import { Assets } from "pixi.js";
import { Requester } from "../JSUtils/request";

export const TextureManager = new class {
  constructor() {}

  loadTextureInformation() {
    return Requester.makeXMLHttpRequest(
      "/environmentdata/textures.json")
      /*
      (_response: string[]) => {
        _response.forEach((element: string) => {
          Assets.add({ alias: element, src: "/tilessets/" + element });
        });
      }
        */
  }

  async loadTextureOnDemand(texture: string){
    await Assets.load(texture)
  }
}();
