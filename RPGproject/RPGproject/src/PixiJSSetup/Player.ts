import { Rectangle, Sprite, Texture, TextureSource } from "pixi.js";

export class Player {
    texture: Texture
    scrollSpeed: number
    constructor(texture: Texture) {
        this.texture = texture
        this.scrollSpeed = Math.pow(2, 4) / 256;
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
}