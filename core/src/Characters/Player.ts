import type { TileMap } from "../PixiJSSetup/TileMap";
import { Character } from "./Character";
import type { MapKeybindings } from "../Controls/Mapkeybindings";

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

  handlePlayer(tilemap: TileMap) {
    this.moveCharacter(tilemap)
    this.keepPlayerInsideOfBoundries(tilemap)
  }

  keepPlayerInsideOfBoundries(tilemap: TileMap) {
    this.sprite!.x = Math.max(0, Math.min(this.sprite!.x, (tilemap.columns - 1) * 48));
    this.sprite!.y = Math.max(0, Math.min(this.sprite!.y, (tilemap.rows - 1) * 48));
  }

  updateMovement(tilemap: TileMap) {
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
    let spriteUpdatedScreenPos = this.updateScreenPosition();
    return spriteUpdatedScreenPos;
  }

  moveCharacter(tilemap: TileMap) {
    if (this.isCharacterMoving()) {
      return this.updateMovement(tilemap);
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
    return this.updateMovement(tilemap);
  }
}
