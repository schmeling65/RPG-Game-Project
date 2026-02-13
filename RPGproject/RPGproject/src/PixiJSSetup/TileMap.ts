import { CompositeTilemap } from "@pixi/tilemap";
import { Requester } from "../JSUtils/request";
import { TextureManager, type textureMetaData } from "./TextureManager";

interface MapData {
  textures: string[];
  objectstextures: string[];
  height: number;
  width: number;
  groundData: number[];
  objectTiles: number[];
  blockedTiles: number[];
}

export class TileMap extends CompositeTilemap {
  columns!: number;
  rows!: number;
  //texturesStrings!: string[];
  groundTiles!: number[];
  groundTextures!: Record<number, textureMetaData>;
  objectTiles!: number[];
  objectTextures!: Record<number, textureMetaData>;
  blockedTiles!: number[];
  constructor() {
    super();
  }

  async initData(_jsonName: string) {
    let mapdata = await this.loadMapInformationsFromJsonFile(_jsonName);
    //this.texturesStrings = mapdata.textures;
    this.columns = mapdata.width;
    this.rows = mapdata.height;
    this.groundTiles = mapdata.groundData;
    this.objectTiles = mapdata.objectTiles;
    this.blockedTiles = mapdata.blockedTiles;
    this.groundTextures = {};
    let loadingPromises = mapdata.textures.map(async (textureString) => {
      await TextureManager.loadTextureOnDemand(textureString);
      return TextureManager.getAssetOrTextureFromCache(textureString);
    });
    let dataLoaded = await Promise.all(loadingPromises);
    dataLoaded.forEach((asset) => {
      TextureManager.getTexturesFromTextureFile(asset, this.groundTextures);
    });
    this.objectTextures = {};
    loadingPromises = mapdata.objectstextures.map(async (textureString) => {
      await TextureManager.loadTextureOnDemand(textureString);
      return TextureManager.getAssetOrTextureFromCache(textureString);
    });
    dataLoaded = await Promise.all(loadingPromises);
    dataLoaded.forEach((asset) => {
      TextureManager.getTexturesFromTextureFile(asset, this.objectTextures);
    });
    this.createGrid(this.groundTiles, this.groundTextures);
    this.createGrid(this.objectTiles, this.objectTextures);
  }

  async loadMapInformationsFromJsonFile(filename: string) {
    return await Requester.makeXMLHttpRequest(filename).then(
      (resolve: unknown) => {
        let mapdata = resolve as MapData;
        return mapdata;
      },
    );
  }

  isBlocked(x: number, y: number) {
    return this.isOutOfBounds(x, y) || this.isBlockedTile(x, y);
  }

  isBlockedTile(x: number, y: number) {
    return this.blockedTiles[y * this.rows + x];
  }

  isOutOfBounds(x: number, y: number) {
    return x < 0 || y < 0 || x >= this.columns || y >= this.rows;
  }

  createGrid(
    objectOfTiles: number[],
    objectOfTextures: Record<number, textureMetaData>,
  ) {
    let tilecounter = 0;
    objectOfTiles.forEach((textureID, arrayIndex) => {
      if (textureID === 0) {
        return;
      }
      let xPosOfTile = (arrayIndex % this.columns) * 48;
      let yPosOfTile = ((arrayIndex / this.rows) >> 0) * 48;
      let tileData = objectOfTextures[textureID];
      this.tile(tileData.file, xPosOfTile, yPosOfTile, {
        u: tileData.posX,
        v: tileData.posY,
        tileWidth: 48,
        tileHeight: 48,
      });
      tilecounter++;
    });
  }
}
