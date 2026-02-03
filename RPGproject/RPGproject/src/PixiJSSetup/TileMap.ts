import { CompositeTilemap } from "@pixi/tilemap";
import { Requester } from "../JSUtils/request";
import { TextureManager, type textureMetaData } from "./TextureManager";

interface MapData {
  textures: string[];
  height: number;
  width: number;
  groundData: number[];
  objectTiles: number[];
}

export class TileMap extends CompositeTilemap {
  columns!: number;
  rows!: number;
  texturesStrings!: string[];
  groundTiles!: number[];
  groundTextures!: Record<number,textureMetaData>
  objectTiles!: number[];
  constructor() {
    super();
  }

  async initData(_jsonName: string) {
    const mapdata = await this.loadMapInformationsFromJsonFile(_jsonName)
    this.texturesStrings = mapdata.textures;
    this.columns = mapdata.width;
    this.rows = mapdata.height;
    this.groundTiles = mapdata.groundData;
    this.objectTiles = mapdata.objectTiles;
    this.groundTextures = {}
    let loadingPromises = this.texturesStrings.map(async (textureString) =>  {
      await TextureManager.loadTextureOnDemand(textureString)
      return TextureManager.getAssetOrTextureFromCache(textureString)
    })
    let allAssets = await Promise.all(loadingPromises)
    allAssets.forEach((asset) => {
      TextureManager.getTexturesFromTextureFile(asset, this.groundTextures)
    })
    this.createGrid();
    };

  async loadMapInformationsFromJsonFile(filename: string) {
    return await Requester.makeXMLHttpRequest(filename).then(
      (resolve: unknown) => {
        let mapdata = resolve as MapData;
        return mapdata;
      },
    );
  }

  createGrid() {
    
    let tilecounter = 0
    this.groundTiles.forEach((textureID, arrayIndex) => {
      let xPosOfTile = (arrayIndex % this.columns) * 48
      console.log(xPosOfTile)
      let yPosOfTile = (arrayIndex / this.rows >> 0) * 48
      console.log(yPosOfTile)
      let tileData = this.groundTextures[textureID]
      this.tile(tileData.file, xPosOfTile, yPosOfTile, {
        u: tileData.posX,
        v: tileData.posY,
        tileWidth: 48,
        tileHeight: 48
      })
      tilecounter++
    })
    
    /*
    for (let columncounter = 0; columncounter < this.columns; columncounter++) {
      for (let rowcounter = 0; rowcounter < this.rows; rowcounter++) {
        //TODO: Read TextureData, for now dummydata
        if ((rowcounter + columncounter) % 2 == 0) {
          this.tile("Projekt_Tiles", columncounter * 48, rowcounter * 48, {
            u: 0 * 48,
            v: 0 * 48,
            tileWidth: 48,
            tileHeight: 48,
          });
        } else {
          this.tile("Projekt_Tiles", columncounter * 48, rowcounter * 48, {
            u: 0 * 48,
            v: 1 * 48,
            tileWidth: 48,
            tileHeight: 48,
          });
        }
      }
    }
      */
  }
}
