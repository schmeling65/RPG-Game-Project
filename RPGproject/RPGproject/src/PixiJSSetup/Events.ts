import type { TileMap } from "./TileMap";

type EventType = "steppedOnEvents" | "interactionEvents";

export const EventManager = new (class {
  private eventFunctions: Map<string, Function>;
  constructor() {
    this.eventFunctions = new Map<string, Function>();
    this.addKnownFunction("testCallback", this.testCallback);
  }
  addKnownFunction(funcName: string, func: Function) {
    this.eventFunctions.set(funcName, func);
  }

  isEventOnTile(x: number, y: number, tilemap: TileMap, typeOfEvent: EventType) {
    let tile = tilemap.getTileID(x, y);
    let events = tilemap[typeOfEvent];
    return [events[tile].length > 0, events[tile][0]];
  }

  testCallback() {
    alert("steppedOnEvent Proced");
  }
  executeEvent(x: number, y: number, tilemap: TileMap, typeOfEvent: EventType) {
    console.log("event: " + typeOfEvent + " procced");
    let [hasEvent, callback] = this.isEventOnTile(x, y, tilemap, typeOfEvent);
    console.log(hasEvent);
    console.log(callback);
    if (hasEvent && callback) {
      let eventFunction = this.eventFunctions.get(callback as string);
      if (eventFunction) {
        try {
          eventFunction();
        } catch (error) {
          alert(`Fehler bei der Ausführung von "${callback}":\n\n${error}`);
        }
      } else {
        // Hier greift die Warnung, wenn die Funktion in der Map fehlt
        alert(`Event-Fehler: Die Funktion "${callback}" ist nicht registriert!`);
      }
    }
  }
})();
