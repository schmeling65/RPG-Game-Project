import { CompositeTilemap } from "@pixi/tilemap";

export class TileMap extends CompositeTilemap {
  columns: number;
  rows: number;
  constructor() {
    super();
    this.columns = 50;
    this.rows = 23;
    this.createGrid(this.columns, this.rows);
  }

  createGrid(columns: number, rows: number) {
    for (let columncounter = 0; columncounter < columns; columncounter++) {
      for (let rowcounter = 0; rowcounter < rows; rowcounter++) {
        //TODO: Read TextureData, for now dummydata
        if ((rowcounter + columncounter) % 2 == 0) {
          this.tile(
            "SienceFictionDrausenA3",
            columncounter * 48,
            rowcounter * 48,
            {
              u: 0 * 48,
              v: 4 * 48,
              tileWidth: 48,
              tileHeight: 48,
            },
          );
        } else {
          this.tile(
            "SienceFictionDrausenA3",
            columncounter * 48,
            rowcounter * 48,
            {
              u: 1 * 48,
              v: 4 * 48,
              tileWidth: 48,
              tileHeight: 48,
            },
          );
        }
      }
    }
  }
}
