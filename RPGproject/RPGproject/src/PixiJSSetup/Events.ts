import { Keybindings } from "../JSUtils/controlsAndKeybidings";
import type { Player } from "./Player";
import type { TileMap } from "./TileMap";

type EventType = "steppedOnEvents" | "interactionEvents";

export const EventManager = new (class {
  private eventFunctions: Map<string, Function>;
  private queueOfCallbacksOfEvents: string[]
  private suppressEvents: boolean;
  constructor() {
    this.suppressEvents = false
    this.queueOfCallbacksOfEvents = [];
    this.eventFunctions = new Map<string, Function>();
    this.addEventCallback("steppedOnCallback", this.steppedOnCallback);
    this.addEventCallback("interactedCallback", this.interactedCallback)
    this.setupInteractionEvent();
  }

  setupInteractionEvent() {
    Keybindings.setupKey("Space");
  }

  addEventCallback(funcName: string, func: Function) {
    this.eventFunctions.set(funcName, func);
  }

  checkEventOnTile(x: number, y: number, tilemap: TileMap, typeOfEvent: EventType): [boolean, string] {
    const tile = tilemap.getTileID(x, y);
    const events = tilemap[typeOfEvent];
    return [events[tile].length > 0,events[tile][0]];
  }

  queueEvent(funcName: string){
    this.queueOfCallbacksOfEvents.push(funcName);
  }
  triggerEvents(player: Player, tilemap: TileMap) {
    if (this.suppressEvents) {
      return
    }
    if (Keybindings.checkInteractionInput()) {
      //this.suppressEvents = true
      let tile = player.getNextTileInViewDirection()
      if(this.checkEventOnTile(tile[0],tile[1],tilemap,"interactionEvents")[0]) {
        this.queueEvent("interactedCallback")
      }
    }
    for (let Eventnumber = 1; Eventnumber <=  this.queueOfCallbacksOfEvents.length; Eventnumber++) {
      const funcName = this.queueOfCallbacksOfEvents.shift();
      if (funcName) {
        const callback = this.eventFunctions.get(funcName)
        if (callback) {
          callback()
        }
        else {
          alert(`Callbackfunction ${funcName}`)
        }
      }
      else {
        alert("No Function to be called. EventQueue is Empty!");
      }
    }
  }

  //testfuncs
  steppedOnCallback() {
    console.log("Stepped On Tile Event Proced!")
  }
  interactedCallback() {
    console.log("Interaction Event Proced!")
  }
})();
