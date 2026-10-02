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
  npcData: npcData[]
}

interface npcData {
  id: number
  x: number
  y: number
}

interface OneNPCOfGlobalNPCsData {
    name: string
    texture: string
}