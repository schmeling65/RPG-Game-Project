import { Rectangle, Sprite, Texture } from "pixi.js";
import type { Direction } from "../JSUtils/controlsAndKeybidings";
import { TextureManager } from "./TextureManager";

export abstract class Character {
  name: string;
  textureFile: string;
  texture: Texture[] = [];
  characterTilePosX: number;
  characterTilePosY: number;
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
    animationSequence?: number[]
  ) {
    this.name = name;
    this.textureFile = texturefile;
    this.characterTilePosX = xpos;
    this.characterTilePosY = ypos;
    this.attachmentAboveHead = null;
    this.walkSpeed = 4;
    this.direction = viewdirection || "down";
    this.isMoving = false;
    this.moveProgressToNextTile = 0;
    this.movementAnimationGenerator = Character.movementAnimaitonGenerator(animationSequence || [1, 0, -1, 0])
    this.waitTimeForNextAnimation = (9 - this.walkSpeed) * 3
    this.currentwaitTimeToNextAnimation = 0
  }

  static *movementAnimaitonGenerator(sequence: number[]): Generator<number, void, string | undefined> {
    let index = 0;
    while (true) {
      let signal = yield sequence[index]
      if (signal === "RESET") {
        index = 3
      }
      else {
        index = (index + 1) % sequence.length
      }
    }
  }


  async initTextureFromString() {
    await TextureManager.loadTextureOnDemand(this.textureFile);
    let fullTextureObject = TextureManager.getAssetOrTextureFromCache(
      this.textureFile,
    );
    for (let verticalFields = 0; verticalFields < 4; verticalFields++) {
      for (let horzontalFields = 0; horzontalFields < 3; horzontalFields++) {
        this.texture.push(
          new Texture({
            source: fullTextureObject,
            frame: new Rectangle(
              horzontalFields * 48,
              verticalFields * 48,
              48,
              48,
            ),
          }),
        );
      }
    }
  }

  distancePerFrame() {
    return Math.pow(2, this.walkSpeed) / 256;
  }
}
