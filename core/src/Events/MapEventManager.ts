import { Keybindings } from "../JSUtils/controlsAndKeybidings";
import type { Player } from "../PixiJSSetup/Player";
import type { TileMap } from "../PixiJSSetup/TileMap";
import { EventManager } from "./EventManager";

type EventType = "steppedOnEvents" | "interactionEvents";

export class MapEventManager extends EventManager {
  constructor() {
    super();
    this.addEventCallback("steppedOnEvents", this.steppedOnCallback);
    this.addEventCallback("interactionEvents", this.interactedCallback);
    this.setupInteractionEvent();
  }
  addEventCallback(funcName: string, func: Function) {
    this.eventFunctions.set(funcName, func);
  }

  setupInteractionEvent() {
    Keybindings.setupKey("Space");
  }

  getEventOnTile(x: number, y: number, tilemap: TileMap) {
    const tile = tilemap.getTileID(x, y);
    const events = tilemap[this.currentEvent as EventType];
    return events[tile];
  }

  isEventOfTypeOnTile(x: number, y: number, tilemap: TileMap) {
    const eventsTileData = this.getEventOnTile(x, y, tilemap);
    if (eventsTileData.length <= 0) return false;
    return true;
  }

  isEventRepeating(x: number, y: number, tilemap: TileMap) {
    const eventsTileData = this.getEventOnTile(x, y, tilemap);
    if (eventsTileData[1] === "1") return true;
    return false;
  }

  removeEvent(x: number, y: number, tilemap: TileMap) {
    const eventsTileData = this.getEventOnTile(x, y, tilemap);
    eventsTileData.length = 0;
  }

  triggerEvent(player: Player, tilemap: TileMap) {
    if (this.suppressEvents) {
      return;
    }
    this.currentEvent = "steppedOnEvents";
    if (this.isEventOfTypeOnTile(player.characterTilePosX, player.characterTilePosY, tilemap)) {
      this.eventFunctions.get("steppedOnEvents")!();
      if (!this.isEventRepeating(player.characterTilePosX, player.characterTilePosY, tilemap)) {
        this.removeEvent(player.characterTilePosX, player.characterTilePosY, tilemap);
      }
      return;
    }
    if (Keybindings.checkInteractionInput()) {
      //this.suppressEvents = true
      this.currentEvent = "interactionEvents";
      let tile = player.getNextTileInViewDirection();
      if (this.isEventOfTypeOnTile(tile[0], tile[1], tilemap)) {
        this.eventFunctions.get("interactionEvents")!();
        if (!this.isEventRepeating(player.characterTilePosX, player.characterTilePosY, tilemap)) {
          this.removeEvent(player.characterTilePosX, player.characterTilePosY, tilemap);
        }
        return;
      }
    }
  }

  steppedOnCallback() {
    console.log("Stepped On Tile Event Proced!");
  }
  interactedCallback() {
    console.log("Interaction Event Proced!");
  }
}
