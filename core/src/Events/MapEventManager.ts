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

  getEventOnTile(pos: Position, tilemap: TileMap) {
    const tile = tilemap.getTileID(pos);
    const events = tilemap[this.currentEvent as EventType];
    return events[tile];
  }

  isEventOfTypeOnTile(pos: Position, tilemap: TileMap) {
    const eventsTileData = this.getEventOnTile(pos, tilemap);
    if (eventsTileData.length <= 0) return false;
    return true;
  }

  isEventRepeating(pos: Position, tilemap: TileMap) {
    const eventsTileData = this.getEventOnTile(pos, tilemap);
    if (eventsTileData[1] === "1") return true;
    return false;
  }

  removeEvent(pos: Position, tilemap: TileMap) {
    const eventsTileData = this.getEventOnTile(pos, tilemap);
    eventsTileData.length = 0;
  }

  triggerEvent(player: Player, tilemap: TileMap) {
    if (this.suppressEvents) {
      return;
    }
    this.currentEvent = "steppedOnEvents";
    if (this.isEventOfTypeOnTile(player.characterTilePos, tilemap)) {
      this.eventFunctions.get("steppedOnEvents")!();
      if (!this.isEventRepeating(player.characterTilePos, tilemap)) {
        this.removeEvent(player.characterTilePos, tilemap);
      }
      return;
    }
    if (Keybindings.checkInteractionInput()) {
      //this.suppressEvents = true
      this.currentEvent = "interactionEvents";
      let tile = player.getNextTileInViewDirection();
      if (this.isEventOfTypeOnTile(tile, tilemap)) {
        this.eventFunctions.get("interactionEvents")!();
        if (!this.isEventRepeating(player.characterTilePos, tilemap)) {
          this.removeEvent(player.characterTilePos, tilemap);
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
