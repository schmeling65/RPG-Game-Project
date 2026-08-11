export abstract class EventManager{
    eventFunctions: Map<string, Function>;
    suppressEvents: boolean;
    currentEvent: string;
    constructor() {
        this.currentEvent = ""
        this.suppressEvents = false
        this.eventFunctions = new Map<string,Function>();
    }
    abstract addEventCallback(funcName: string, func: Function): void
    abstract triggerEvent(...args: any[]): void;
}