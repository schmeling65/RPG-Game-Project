import { Keybindings } from "./Keybindings";

export class MapKeybindings extends Keybindings{
    constructor(){
        super()
    }
    init(){
    this.setupKey("ArrowUp");
    this.setupKey("ArrowDown");
    this.setupKey("ArrowLeft");
    this.setupKey("ArrowRight");
    //this.setupKey("Space");
  }
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
}