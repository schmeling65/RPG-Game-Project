export type Direction = "none" | "up" | "down" | "left" | "right";

export const Keybindings = new (class {
  private keysPressed: Map<string, boolean> = new Map<string, boolean>();
  private registeredKeys: Map<string,boolean> = new Map<string,boolean>();
  constructor() {
    document.addEventListener("keydown",this.pressingKey);
    document.addEventListener("keyup",this.releasingKey)
  }

  init(){
    this.setupKey("ArrowUp");
    this.setupKey("ArrowDown");
    this.setupKey("ArrowLeft");
    this.setupKey("ArrowRight");
    //this.setupKey("Space");
  }

  pressingKey = (event:KeyboardEvent) =>  {
    if (this.registeredKeys.has(event.code)){
      event.preventDefault()
    }
    this.keysPressed.set(event.code,true);
  }
  
  releasingKey = (event: KeyboardEvent) => {
    this.keysPressed.set(event.code,false);
  }

  //Reference: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
  setupKey(keyCode: string) {
    this.registeredKeys.set(keyCode,true)
  }

  checkInteractionInput(): boolean {
    return this.keysPressed.get("Space")!
  }

  checkMovementInput(): string {
    let newDirection: Direction = "none";
    if (this.keysPressed.get("ArrowUp")) newDirection = "up";
    else if (this.keysPressed.get("ArrowDown")) newDirection = "down";
    else if (this.keysPressed.get("ArrowLeft")) newDirection = "left";
    else if (this.keysPressed.get("ArrowRight")) newDirection = "right";
    return newDirection;
  }
})();
