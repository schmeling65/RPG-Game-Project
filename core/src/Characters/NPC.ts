import type { Sprite } from "pixi.js";
import { Character } from "./Character";
import type { TileMap } from "../PixiJSSetup/TileMap";

export class NPC extends Character{
      constructor(
    name: string,
    texturefile: string,
    xpos: number,
    ypos: number,
    viewdirection?: Direction,
  ) {
    super(name, texturefile, xpos, ypos, viewdirection);
  }

  moveCharacter(sprite: Sprite, tilemap: TileMap) {
    return sprite
  }

  updateMovement(sprite: Sprite, tilemap: TileMap): Sprite {
    return sprite
  }
}