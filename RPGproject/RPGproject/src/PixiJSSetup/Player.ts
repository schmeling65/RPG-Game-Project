import { Rectangle, Sprite, Texture } from "pixi.js";
import { Keybindings, type Direction } from "../JSUtils/controlsAndKeybidings";

export class Player {
    texture: Texture
    scrollSpeed: number
    characterTilePosX: number | null = null
    characterTilePosY: number | null = null
    isMoving: boolean;
    direction: Direction;
    moveProgressToNextTile: number;
    constructor(texture: Texture) {
        this.texture = texture
        this.scrollSpeed = 4
        this.isMoving = false
        this.direction = "none"
        this.moveProgressToNextTile = 0
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
            if (this.direction === "up") this.characterTilePosY!--;
            if (this.direction === "down") this.characterTilePosY!++;
            if (this.direction === "left") this.characterTilePosX!--;
            if (this.direction === "right") this.characterTilePosX!++;

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

        sprite.y = (this.characterTilePosY! + offsetY) * 48
        sprite.x = (this.characterTilePosX! + offsetX) * 48
        return sprite
    }

    isPlayerMoving(): boolean {
        return this.isMoving;
    }
    //entry
    movePlayer(sprite: Sprite) {
        if (!this.isPlayerMoving()) {
            let input = Keybindings.checkInput() as Direction
            if (input != "none") {
                this.direction = input;
                this.isMoving = true
                this.moveProgressToNextTile = 0
                this.updateMovement(sprite)
            }
        }
        else {
            console.log("noi")
            return this.updateMovement(sprite)
        }
    }
}