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

  updateMovement(sprite: Sprite) {
    this.moveProgressToNextTile += this.distancePerFrame();

    if (this.moveProgressToNextTile >= 1) {
      if (this.direction === "up") this.characterTilePosY--;
      if (this.direction === "down") this.characterTilePosY++;
      if (this.direction === "left") this.characterTilePosX--;
      if (this.direction === "right") this.characterTilePosX++;

      this.moveProgressToNextTile = 0;
      this.isMoving = false;
      //this.direction = "none";
    }
    this.updateMovementAnimation();
    return this.updateScreenPosition(sprite);
  }

  updateMovementAnimation() {
    if (this.waitForAnimation()) {
      let currentDirettionAsIndex = this.getTextureIndexFromDirection()
      let number = this.movementAnimationGenerator.next().value
      this.sprite!.texture = this.texture[currentDirettionAsIndex! - number]
    }
  }

  waitForAnimation() {
    console.log("Animations Update: "+ this.currentwaitTimeToNextAnimation)
    this.currentwaitTimeToNextAnimation -= 1.5
    if (this.currentwaitTimeToNextAnimation <= 0) {
      console.log("Reset")
      this.currentwaitTimeToNextAnimation = this.waitTimeForNextAnimation
      return true
    }
    else {      
      return false
    }
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

  isCharacterMoving(): boolean {
    return this.isMoving;
  }

  setLookDirectionWhileMoving() {
    let index = this.getTextureIndexFromDirection();
    this.sprite!.texture = this.texture[index!];
  }

  getTextureIndexFromDirection() {
    switch (this.direction) {
      case "down":
        return 1;
      case "left":
        return 4;
      case "right":
        return 7;
      case "up":
        return 10;
    }
  }

  movePlayer(sprite: Sprite, tilemap: TileMap) {
    if (!this.isCharacterMoving()) {
      let input = Keybindings.checkInput() as Direction;
      if (input != "none") {
        this.direction = input;
        this.setLookDirectionWhileMoving();
        if (!tilemap.isBlocked(...this.getNextPosition(input))) {
          this.isMoving = true;
          this.moveProgressToNextTile = 0;
          return this.updateMovement(sprite);
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
