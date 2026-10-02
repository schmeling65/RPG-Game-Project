type Position = {
    xpos: number
    ypos: number
}

type Direction = "none" | "up" | "down" | "left" | "right";


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

interface levelimport {
  tilemapData: MapData
  npcs: any
}