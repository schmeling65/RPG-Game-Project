import { CompositeTilemap } from "@pixi/tilemap";
import { Requester } from "../JSUtils/request";

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
  textures!: string[];
  groundTiles!: number[];
  objectTiles!: number[];
  constructor(_jsonName: string) {
    super();
    this.loadMapInformationsFromJsonFile(_jsonName).then(mapdata => {
      this.textures = mapdata.textures;
      this.columns = mapdata.width;
      this.rows = mapdata.height;
      this.groundTiles = mapdata.groundData
      this.objectTiles = mapdata.objectTiles
      this.createGrid(this.columns, this.rows);
    });
  }

  async loadMapInformationsFromJsonFile(filename: string) {
    return await Requester.makeXMLHttpRequest(filename).then((resolve: unknown) => {
      let mapdata = resolve as MapData
      return mapdata
    })
  }

  createGrid(columns: number, rows: number) {
    for (let columncounter = 0; columncounter < columns; columncounter++) {
      for (let rowcounter = 0; rowcounter < rows; rowcounter++) {
        //TODO: Read TextureData, for now dummydata
        if ((rowcounter + columncounter) % 2 == 0) {
          this.tile("GroundTextures", columncounter * 48, rowcounter * 48, {
            u: 0 * 48,
            v: 4 * 48,
            tileWidth: 48,
            tileHeight: 48,
          });
        } else {
          this.tile("GroundTextures", columncounter * 48, rowcounter * 48, {
            u: 1 * 48,
            v: 4 * 48,
            tileWidth: 48,
            tileHeight: 48,
          });
        }
      }
    }
  }
}
