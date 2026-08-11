import { CompositeTilemap } from "@pixi/tilemap";
import { Requester } from "../JSUtils/request";
import { TextureManager, type textureMetaData } from "./TextureManager";

interface MapData {
  textures: string[];
  objectstextures: string[];
  height: number;
  width: number;
  groundData: number[];
  objectTiles: number[][];
  blockedTiles: number[];
  events: {
    steppedOnTile: string[][];
    interaction: string[][];
  };
}

export class TileMap extends CompositeTilemap {
  columns!: number;
  rows!: number;
  groundTiles!: number[];
  groundTextures!: Record<number, textureMetaData>;
  objectTiles!: number[][];
  objectTextures!: Record<number, textureMetaData>;
  blockedTiles!: number[];
  steppedOnEvents!: string[][];
  interactionEvents!: string[][];
  constructor() {
    super();
  }

  async initData(_jsonName: string) {
    let mapdata = await this.loadMapInformationsFromJsonFile(_jsonName);
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
    this.steppedOnEvents = mapdata.events.steppedOnTile;
    this.interactionEvents = mapdata.events.interaction;
    this.createGrid(this.groundTiles, this.groundTextures);
    this.createGrid(this.objectTiles, this.objectTextures);
  }

  async loadMapInformationsFromJsonFile(filename: string) {
    return await Requester.makeXMLHttpRequest(filename).then((resolve: unknown) => {
      let mapdata = resolve as MapData;
      return mapdata;
    });
  }

  isBlocked(pos: Position) {
    return this.isOutOfBounds(pos) || this.isBlockedTile(pos);
  }

  getTileID(pos: Position) {
    return pos.ypos * this.rows + pos.xpos;
  }

  setTileBlocking(pos: Position) {
    this.blockedTiles[this.getTileID(pos)] = 1;
  }

  removeTileBlocking(pos: Position) {
    this.blockedTiles[this.getTileID(pos)] = 0;
  }

  isBlockedTile(pos: Position) {
    return this.blockedTiles[this.getTileID(pos)];
  }

  isOutOfBounds(pos: Position) {
    return pos.xpos < 0 || pos.ypos < 0 || pos.xpos >= this.columns || pos.ypos >= this.rows;
  }

  createGrid(
    objectOfTiles: number[] | number[][],
    objectOfTextures: Record<number, textureMetaData>,
  ) {
    objectOfTiles.forEach((textureID, arrayIndex) => {
      if (Array.isArray(textureID)) {
        textureID.forEach((textureID, _) => {
          this.placeTileOnGrid(textureID, arrayIndex, objectOfTextures);
        });
        return;
      }
      if (textureID === 0) {
        return;
      }
      this.placeTileOnGrid(textureID, arrayIndex, objectOfTextures);
    });
  }

  placeTileOnGrid(
    textureID: number,
    arrayIndex: number,
    objectOfTextures: Record<number, textureMetaData>,
  ) {
    let xPosOfTile = (arrayIndex % this.columns) * 48;
    let yPosOfTile = ((arrayIndex / this.rows) >> 0) * 48;
    let tileData = objectOfTextures[textureID];
    this.tile(tileData.file, xPosOfTile, yPosOfTile, {
      u: tileData.posX,
      v: tileData.posY,
      tileWidth: 48,
      tileHeight: 48,
    });
  }
}

