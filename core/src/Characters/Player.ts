import { Sprite } from "pixi.js";
import type { TileMap } from "../PixiJSSetup/TileMap";
import { Character } from "./Character";
import type { MapKeybindings, Direction } from "../controls/Mapkeybindings";

export class Player extends Character {
  private keybindingsReference: MapKeybindings
  constructor(
    name: string,
    texturefile: string,
    xpos: number,
    ypos: number,
    keybindingsReference: MapKeybindings,
    viewdirection?: Direction,
  ) {
    super(name, texturefile, xpos, ypos, viewdirection);
    this.keybindingsReference = keybindingsReference
  }

  static async createPlayer(keybindingsReference: MapKeybindings) {
    let playerObject = new Player("Player","player",0,0, keybindingsReference)
    await playerObject.initTextureFromString()
    playerObject.initPlayerSprite()
    return playerObject
  }

  initPlayerSprite(): Sprite {
    this.sprite = new Sprite(this.texture[1]);
    this.sprite.position.set(
      this.characterTilePos.xpos * 48,
      this.characterTilePos.ypos * 48
    ); 
    return this.sprite;
  }

  updateMovement(sprite: Sprite, tilemap: TileMap) {
    this.moveProgressToNextTile += this.distancePerFrame();
    let resetToStay;

    if (this.moveProgressToNextTile >= 1) {
      if (this.direction === "up") this.characterTilePos.ypos--;
      if (this.direction === "down") this.characterTilePos.ypos++;
      if (this.direction === "left") this.characterTilePos.xpos--;
      if (this.direction === "right") this.characterTilePos.xpos++;

      this.moveProgressToNextTile = 0;
      
      if (this.keybindingsReference.checkMovementInput() === this.direction) {
        if (!tilemap!.isBlocked(this.getNextPosition(this.direction))) {
          this.isMoving = true;
        } else {
          this.isMoving = false;
          resetToStay = "RESET";
        }
      } else {
        this.isMoving = false;
        resetToStay = "RESET";
      }
      this.currentwaitTimeToNextAnimation = this.waitTimeForNextAnimation;
    }
    this.updateMovementAnimation(resetToStay);
    let spriteUpdatedScreenPos = this.updateScreenPosition(sprite);
    return spriteUpdatedScreenPos;
  }

  updateMovementAnimation(resetFlag: string | undefined) {
    if (resetFlag !== undefined) {
      let currentDirectionAsIndex = this.getTextureIndexFromDirection();
      let number = this.movementAnimationGenerator.next(resetFlag).value;
      this.sprite!.texture = this.texture[currentDirectionAsIndex! - number];
      this.resetAnimationTimer();
      return;
    }
    if (this.waitForAnimation()) {
      let currentDirectionAsIndex = this.getTextureIndexFromDirection();
      let number = this.movementAnimationGenerator.next().value;
      this.sprite!.texture = this.texture[currentDirectionAsIndex! - number];
    }
  }

  resetAnimationTimer() {
    this.currentwaitTimeToNextAnimation = 0;
  }

  waitForAnimation() {
    this.currentwaitTimeToNextAnimation -= 1.5;
    if (this.currentwaitTimeToNextAnimation <= 0) {
      this.currentwaitTimeToNextAnimation = this.waitTimeForNextAnimation;
      return true;
    } else {
      return false;
    }
  }

  updateScreenPosition(sprite: Sprite) {
    let offsetX = 0;
    let offsetY = 0;

    if (this.direction === "down") offsetY = this.moveProgressToNextTile;
    if (this.direction === "up") offsetY = -this.moveProgressToNextTile;
    if (this.direction === "left") offsetX = -this.moveProgressToNextTile;
    if (this.direction === "right") offsetX = this.moveProgressToNextTile;
    console.log(sprite.x)
    sprite.y = (this.characterTilePos.ypos + offsetY) * 48;
    sprite.x = (this.characterTilePos.xpos + offsetX) * 48;
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
    if (this.isCharacterMoving()) {
      return this.updateMovement(sprite, tilemap);
    }
    const input = this.keybindingsReference.checkMovementInput() as Direction;
    if (input === "none") {
      return;
    }
    this.direction = input;
    this.setLookDirectionWhileMoving();
    if (tilemap.isBlocked(this.getNextPosition(input))) {
      return;
    }
    this.isMoving = true;
    this.moveProgressToNextTile = 0;
    return this.updateMovement(sprite,tilemap);
  }
  
  getNextPosition(input: Direction): Position {
    let coordinateX = 0;
    let coordinateY = 0;
    if (input === "down") coordinateY++;
    if (input === "up") coordinateY--;
    if (input === "left") coordinateX--;
    if (input === "right") coordinateX++;
    return {
      xpos: this.characterTilePos.xpos + coordinateX,
      ypos: this.characterTilePos.ypos + coordinateY
    };
  }
}
