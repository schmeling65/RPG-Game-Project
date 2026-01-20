import { CompositeTilemap } from "@pixi/tilemap";
import type { Scene } from "../Scenes/Scene";
import { Rectangle, Sprite, Texture } from "pixi.js";

export class TileMap {
  columns: number;
  rows: number;
  constructor() {
    this.columns = 50;
    this.rows = 50;
  }
  createTileMap(): CompositeTilemap {
    const tilemap = new CompositeTilemap();
    //Scene.container.addChild(tilemap);
    this.GetAndUseColumns(tilemap);
    console.log(tilemap)
    return tilemap;
  }

  GetAndUseColumns(tilemap: CompositeTilemap) {
    let tileColumns = 50;
    this.GetAndUseRows(tilemap, tileColumns);
  }

  GetAndUseRows(tilemap: CompositeTilemap, columns: number) {
    let tileRows = 50;
    this.createGrid(tilemap, columns, tileRows);
  }

  createGrid(tilemap: CompositeTilemap, columns: number, rows: number) {
    this.createCloumns(tilemap, columns, rows);
  }

  createCloumns(tilemap: CompositeTilemap, columns: number, rows: number) {
    for (let columncounter = 0; columncounter < columns; columncounter++) {
      this.createRows(tilemap, columncounter, rows);
    }
  }

  createRows(tilemap: CompositeTilemap, columncounter: number, rows: number) {
    for (let rowcounter = 0; rowcounter < rows; rowcounter++) {
      //TODO: Read TextureData, for now dummydata
      if ((rowcounter + columncounter) % 2 == 0) {
        tilemap.tile("SienceFictionDrausenA3", columncounter * 48, rows * 48, {
          u: 0 * 48,
          v: 4 * 48,
          tileWidth: 48,
          tileHeight: 48,
        });
      } else {
        tilemap.tile("SienceFictionDrausenA3", columncounter * 48, rows * 48, {
          u: 1 * 48,
          v: 4 * 48,
          tileWidth: 48,
          tileHeight: 48,
        });
      }
    }
  }

  createPlayerOnTileMap(playertexture: any): Sprite {
    var textureObject = new Texture({
      source: playertexture,
      frame: new Rectangle(0,0,48,48)
    })
    var playerSprite = new Sprite(textureObject);
    playerSprite.position.set(0,0)
    return playerSprite;

  }
}
