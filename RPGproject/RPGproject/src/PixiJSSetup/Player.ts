import { Rectangle, Sprite, Texture } from "pixi.js";
import { Keybindings, type Direction } from "../JSUtils/controlsAndKeybidings";
import { TextureManager } from "./TextureManager";
import type { TileMap } from "./TileMap";

export class Player {
    textureString: string
    texture!: Texture
    scrollSpeed: number
    characterTilePosX: number
    characterTilePosY: number
    isMoving: boolean;
    direction: Direction;
    moveProgressToNextTile: number;
    constructor(texture: string) {
        this.textureString = texture
        this.scrollSpeed = 4
        this.isMoving = false
        this.direction = "none"
        this.moveProgressToNextTile = 0
        this.characterTilePosX = 0
        this.characterTilePosY = 0
    }

    async initTextureFromString() {
        await TextureManager.loadTextureOnDemand(this.textureString)
        this.texture = TextureManager.getAssetOrTextureFromCache(this.textureString)
    }

    initPlayer(): Sprite {
        let textureObject = new Texture({
            source: this.texture as any,
            frame: new Rectangle(0,0,48,48)
        })
        let playerSprite = new Sprite(textureObject);
        playerSprite.position.set(0,0);
        return playerSprite;
    }

    distancePerFrame() {
        return Math.pow(2, this.scrollSpeed) / 256;
    }

    updateMovement(sprite: Sprite){
        this.moveProgressToNextTile += this.distancePerFrame();

        if (this.moveProgressToNextTile >= 1) {
            if (this.direction === "up") this.characterTilePosY--;
            if (this.direction === "down") this.characterTilePosY++;
            if (this.direction === "left") this.characterTilePosX--;
            if (this.direction === "right") this.characterTilePosX++;

            this.moveProgressToNextTile = 0;
            this.isMoving = false
            this.direction = "none";
        }
        
        return this.updateScreenPosition(sprite)
    }

    updateScreenPosition(sprite: Sprite) {
        let offsetX = 0;
        let offsetY = 0;

        if (this.direction === "down") offsetY = this.moveProgressToNextTile;
        if (this.direction === "up") offsetY = -this.moveProgressToNextTile
        if (this.direction === "left") offsetX = -this.moveProgressToNextTile;
        if (this.direction === "right") offsetX = this.moveProgressToNextTile;

        sprite.y = (this.characterTilePosY + offsetY) * 48
        sprite.x = (this.characterTilePosX + offsetX) * 48
        return sprite
    }

    isPlayerMoving(): boolean {
        return this.isMoving;
    }

    movePlayer(sprite: Sprite, tilemap: TileMap) {
        if (!this.isPlayerMoving()) {
            let input = Keybindings.checkInput() as Direction
            if (input != "none") {
                if (!tilemap.isBlocked(...this.getNextPosition(input)))
                this.direction = input;
                this.isMoving = true
                this.moveProgressToNextTile = 0
                this.updateMovement(sprite)
            }
        }
        else {
            return this.updateMovement(sprite)
        }
    }

    getNextPosition(input: Direction): [number, number] {
        let coordinateX = 0
        let coordinateY = 0
        if (input === "down") coordinateY++;
        if (input === "up") coordinateY--
        if (input === "left") coordinateX--
        if (input === "right") coordinateX++
        return [this.characterTilePosX + coordinateX, this.characterTilePosY + coordinateY]
    }
}