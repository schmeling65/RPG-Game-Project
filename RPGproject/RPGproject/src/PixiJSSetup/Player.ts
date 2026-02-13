import { Sprite } from "pixi.js";
import { Keybindings, type Direction } from "../JSUtils/controlsAndKeybidings";
import type { TileMap } from "./TileMap";
import { Character } from "./Character";

export class Player extends Character {
  constructor(
    name: string,
    texturefile: string,
    xpos: number,
    ypos: number,
    viewdirection?: Direction,
  ) {
    super(name, texturefile, xpos, ypos, viewdirection);
  }

  initPlayer(): Sprite {
    /*
        let textureObject = new Texture({
            source: this.texture[1] as any,
            frame: new Rectangle(0,0,48,48)
        })
            */
    this.sprite = new Sprite(this.texture[1]);
    //position.set(x*48,y*48) und characterTilePosX und Y jeweils 1 2 3 4 setzen
    // -> anderer Startpunkt
    this.sprite.position.set(
      this.characterTilePosX * 48,
      this.characterTilePosY * 48,
    );
    return this.sprite;
  }

  distancePerFrame() {
    return Math.pow(2, this.walkSpeed) / 256;
  }

  updateMovement(sprite: Sprite) {
    this.moveProgressToNextTile += this.distancePerFrame();

    if (this.moveProgressToNextTile >= 1) {
      if (this.direction === "up") this.characterTilePosY--;
      if (this.direction === "down") this.characterTilePosY++;
      if (this.direction === "left") this.characterTilePosX--;
      if (this.direction === "right") this.characterTilePosX++;

      this.moveProgressToNextTile = 0;
      this.isMoving = false;
      this.direction = "none";
    }

    return this.updateScreenPosition(sprite);
  }

  updateScreenPosition(sprite: Sprite) {
    let offsetX = 0;
    let offsetY = 0;

    if (this.direction === "down") offsetY = this.moveProgressToNextTile;
    if (this.direction === "up") offsetY = -this.moveProgressToNextTile;
    if (this.direction === "left") offsetX = -this.moveProgressToNextTile;
    if (this.direction === "right") offsetX = this.moveProgressToNextTile;

    sprite.y = (this.characterTilePosY + offsetY) * 48;
    sprite.x = (this.characterTilePosX + offsetX) * 48;
    return sprite;
  }

  isPlayerMoving(): boolean {
    return this.isMoving;
  }

  setLookDirectionWhileMoving() {
    let index = 0;
    switch (this.direction) {
      case "down":
        index = 1;
        break;
      case "left":
        index = 4;
        break;
      case "right":
        index = 7;
        break;
      case "up":
        index = 11;
        break;
    }
    this.sprite!.texture = this.texture[index];
  }

  movePlayer(sprite: Sprite, tilemap: TileMap) {
    if (!this.isPlayerMoving()) {
      let input = Keybindings.checkInput() as Direction;
      if (input != "none") {
        this.direction = input;
        this.setLookDirectionWhileMoving();
        if (!tilemap.isBlocked(...this.getNextPosition(input))) {
          this.isMoving = true;
          this.moveProgressToNextTile = 0;
          this.updateMovement(sprite);
        }
      }
    } else {
      return this.updateMovement(sprite);
    }
  }

  getNextPosition(input: Direction): [number, number] {
    let coordinateX = 0;
    let coordinateY = 0;
    if (input === "down") coordinateY++;
    if (input === "up") coordinateY--;
    if (input === "left") coordinateX--;
    if (input === "right") coordinateX++;
    return [
      this.characterTilePosX + coordinateX,
      this.characterTilePosY + coordinateY,
    ];
  }
}
