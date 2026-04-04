import type { TileMap } from "./TileMap";

type EventType = "steppedOnEvents" | "interactionEvents";

export const EventManager = new (class {
  private eventFunctions: Map<string, Function>;
  private hasEvent: boolean;
  private eventCallback: string;
  private queueOfCallbacksOfEvents: string[]
  constructor() {
    this.queueOfCallbacksOfEvents = [];
    this.eventFunctions = new Map<string, Function>();
    this.hasEvent = false;
    this.eventCallback = "";
    this.addEventCallback("testCallback", this.testCallback);
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

  testCallback() {
    alert("steppedOnEvent Proced");
  }
  triggerEvents() {
    for (let Eventnumber = 1; Eventnumber <= this.queueOfCallbacksOfEvents.length; Eventnumber++) {
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
})();
