import { Player } from "../PixiJSSetup/Player";
import { Scene } from "./Scene";
import { TileMap } from "../PixiJSSetup/TileMap";
import type { Application } from "pixi.js";
import { MapEventManager } from "../Events/MapEventManager";

export class MapScene extends Scene {
  private player!: Player;
  private tilemap!: TileMap;
  private eventManager!: MapEventManager
  constructor(name: string) {
    super(name);
  }
  async start() {
    this.tilemap = new TileMap();
    this.container.addChild(this.tilemap)
    await this.tilemap.initData("/levels/level_start.json");
    this.player = await Player.createPlayer();
    this.container.addChild(this.player.sprite!);
    this.eventManager = new MapEventManager()
  }

  update(app: Application): void {
    let playerSprite = this.player.sprite!;
    let tilemap = this.tilemap;
    this.eventManager.triggerEvent(this.player, tilemap)
    //TODO:Eventmanager
    //pixiJSEnv.getEventManagerObject()!.triggerEvents(pixiJSEnv.getPlayerObject()!,tilemap)
    playerSprite = this.player.movePlayer(playerSprite, tilemap) || playerSprite;
    playerSprite.x = Math.max(0, Math.min(playerSprite.x, (tilemap.columns - 1) * 48));
    playerSprite.y = Math.max(0, Math.min(playerSprite.y, (tilemap.rows - 1) * 48));
    let camX = playerSprite.x - app.screen.width / 2;
    let camY = playerSprite.y - app.screen.height / 2;

    camX = Math.max(0, Math.min(camX, tilemap.columns * 48 - app.screen.width));
    camY = Math.max(0, Math.min(camY, tilemap.rows * 48 - app.screen.height));

    this.container!.position.set(-camX, -camY);
    console.log(playerSprite.x);
  }
  render(): void {
    this.container!.visible = true;
  }
  destroy(): void {}
}
