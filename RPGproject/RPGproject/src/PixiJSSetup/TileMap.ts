import { CompositeTilemap } from "@pixi/tilemap";
import { Requester } from "../JSUtils/request";
import { TextureManager, type textureMetaData } from "./TextureManager";

interface MapData {
  textures: string[];
  height: number;
  width: number;
  groundData: number[];
  objectTiles: number[];
  blockedTiles: number[],
}

export class TileMap extends CompositeTilemap {
  columns!: number;
  rows!: number;
  texturesStrings!: string[];
  groundTiles!: number[];
  groundTextures!: Record<number,textureMetaData>
  objectTiles!: number[];
  blockedTiles!: number[];
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
    this.blockedTiles = mapdata.blockedTiles;
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

  isBlocked(x: number, y: number) {
    return this.isOutOfBounds(x,y) || this.isBlockedTile(x,y)
  }

  isBlockedTile(x: number, y: number) {
    return this.blockedTiles[y * this.rows + x]
  }

  isOutOfBounds(x: number, y: number){
    return x < 0 || y < 0 || x >= this.columns || y >= this.rows;
  }

  createGrid() {
    
    let tilecounter = 0
    this.groundTiles.forEach((textureID, arrayIndex) => {
      let xPosOfTile = (arrayIndex % this.columns) * 48
      let yPosOfTile = (arrayIndex / this.rows >> 0) * 48
      let tileData = this.groundTextures[textureID]
      this.tile(tileData.file, xPosOfTile, yPosOfTile, {
        u: tileData.posX,
        v: tileData.posY,
        tileWidth: 48,
        tileHeight: 48
      })
      tilecounter++
    })
  }
}
