import { Player } from "../Characters/Player";
import { Scene } from "./Scene";
import { TileMap } from "../PixiJSSetup/TileMap";
import type { Application } from "pixi.js";
import { MapEventManager } from "../Events/MapEventManager";
import { MapKeybindings } from "../Controls/Mapkeybindings";
import { NPC } from "../Characters/NPC";
import { Requester } from "../JSUtils/request";

export class MapScene extends Scene {
  static globalNPCdata: OneNPCOfGlobalNPCsData[];
  private player!: Player;
  private tilemap!: TileMap;
  private eventManager!: MapEventManager
  private keyBindings!: MapKeybindings
  private npcs!: NPC[]
  constructor(name: string) {
    super(name);
  }

  static async loadNPCsdata() {
    this.globalNPCdata = await Requester.makeXMLHttpRequest<OneNPCOfGlobalNPCsData[]>("/data/npcs/npcs.json")
  }

  async create(levelfile: string) {
    let filedata = await Requester.loadLevelInformationsFromJsonFile(levelfile);
    this.keyBindings = new MapKeybindings()
    this.tilemap = new TileMap();
    this.container.addChild(this.tilemap)
    await this.tilemap.initData(filedata.tilemapData);
    this.player = await Player.createPlayer(this.keyBindings);
    this.container.addChild(this.player.sprite!);
    this.npcs = await NPC.createNPCs(filedata.npcData, MapScene.globalNPCdata)
    this.eventManager = new MapEventManager(this.keyBindings)
  }

  update(app: Application): void {
    this.eventManager.triggerEvent(this.player, this.tilemap)
    //handle NPCS befor player?
    this.player.handlePlayer(this.tilemap)
    this.npcs.forEach((npc) => npc.handleNPC())
    this.handleCamera(app)
  }
  render(): void {
    this.container!.visible = true;
  }
  destroy(): void {}

  handleCamera(app: Application) {
    let camX = this.player.sprite!.x - app.screen.width / 2;
    let camY = this.player.sprite!.y - app.screen.height / 2;

    camX = Math.max(0, Math.min(camX, this.tilemap.columns * 48 - app.screen.width));
    camY = Math.max(0, Math.min(camY, this.tilemap.rows * 48 - app.screen.height));

    this.container!.position.set(-camX, -camY);
  }
}
