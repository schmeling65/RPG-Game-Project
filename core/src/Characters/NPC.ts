import type { Sprite } from "pixi.js";
import { Character } from "./Character";
import type { TileMap } from "../PixiJSSetup/TileMap";

export class NPC extends Character {
  private commands: string[]
  constructor(
    name: string,
    texturefile: string,
    xpos: number,
    ypos: number,
    viewdirection?: Direction,
  ) {
    super(name, texturefile, xpos, ypos, viewdirection);
    this.commands = []
  }

  handleNPC() {

  }

  updateMovement(tilemap: TileMap): Sprite {
    this.moveProgressToNextTile += this.distancePerFrame();
    let resetToStay;
    if (this.moveProgressToNextTile >= 1) {
      if (this.direction === "up") this.characterTilePos.ypos--;
      if (this.direction === "down") this.characterTilePos.ypos++;
      if (this.direction === "left") this.characterTilePos.xpos--;
      if (this.direction === "right") this.characterTilePos.xpos++;

      this.moveProgressToNextTile = 0;
      //here other directives from somewhere
      //@ts-ignore
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
    let spriteUpdatedScreenPos = this.updateScreenPosition();
    return spriteUpdatedScreenPos;
  }

  moveCharacter(tilemap: TileMap) {
    if (this.isCharacterMoving()) {
      return this.updateMovement(tilemap);
    }
    if (this.commands.length <= 0) {
      return;
    }
    this.setLookDirectionWhileMoving();
    let spriteUpdatedScreenPos = this.updateScreenPosition();
    return spriteUpdatedScreenPos;
  }
}
