import { Rectangle, Sprite, Texture } from "pixi.js";
import { TextureManager } from "../PixiJSSetup/TextureManager";
import type { TileMap } from "../PixiJSSetup/TileMap";

export abstract class Character {
  name: string;
  textureFile: string;
  texture: Texture[] = [];
  characterTilePos: Position;
  attachmentAboveHead: any;
  walkSpeed: number;
  direction: Direction;
  isMoving: boolean;
  moveProgressToNextTile: number;
  sprite: Sprite | null = null;
  movementAnimationGenerator: Generator;
  waitTimeForNextAnimation: number;
  currentwaitTimeToNextAnimation: number;
  constructor(
    name: string,
    texturefile: string,
    xpos: number,
    ypos: number,
    viewdirection?: Direction,
    animationSequence?: number[],
  ) {
    this.name = name;
    this.textureFile = texturefile;
    this.characterTilePos = {xpos,ypos}
    this.characterTilePos.xpos = xpos;
    this.characterTilePos.ypos = ypos;
    this.attachmentAboveHead = null;
    this.walkSpeed = 4;
    this.direction = viewdirection || "down";
    this.isMoving = false;
    this.moveProgressToNextTile = 0;
    this.movementAnimationGenerator = Character.movementAnimaitonGenerator(
      animationSequence || [1, 0, -1, 0],
    );
    this.waitTimeForNextAnimation = (9 - this.walkSpeed) * 3;
    this.currentwaitTimeToNextAnimation = 0;
  }

  abstract moveCharacter(sprite: Sprite, tilemap: TileMap): Sprite | undefined
  abstract updateMovement(sprite: Sprite, tilemap: TileMap): Sprite

  initPlayerSprite() {
      this.sprite = new Sprite(this.texture[1]);
      this.sprite.position.set(
        this.characterTilePos.xpos * 48,
        this.characterTilePos.ypos * 48
      ); 
    }

  getViewDirection() {
    return this.direction;
  }

  getNextTileInViewDirection():Position {
    let coordinateX = 0;
    let coordinateY = 0;
    if (this.direction === "down") coordinateY++;
    if (this.direction === "up") coordinateY--;
    if (this.direction === "left") coordinateX--;
    if (this.direction === "right") coordinateX++;
    return {xpos: this.characterTilePos.xpos + coordinateX, ypos: this.characterTilePos.ypos + coordinateY}
  }

  static *movementAnimaitonGenerator(
    sequence: number[],
  ): Generator<number, void, string | undefined> {
    let index = 0;
    while (true) {
      let signal = yield sequence[index];
      if (signal === "RESET") {
        index = 3;
      } else {
        index = (index + 1) % sequence.length;
      }
    }
  }

  async initTextureFromString() {
    await TextureManager.loadTextureOnDemand(this.textureFile);
    let fullTextureObject = TextureManager.getAssetOrTextureFromCache(this.textureFile);
    for (let verticalFields = 0; verticalFields < 4; verticalFields++) {
      for (let horzontalFields = 0; horzontalFields < 3; horzontalFields++) {
        this.texture.push(
          new Texture({
            source: fullTextureObject,
            frame: new Rectangle(horzontalFields * 48, verticalFields * 48, 48, 48),
          }),
        );
      }
    }
  }

  distancePerFrame() {
    return Math.pow(2, this.walkSpeed) / 256;
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

