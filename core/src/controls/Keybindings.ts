export abstract class Keybindings {
  protected keysPressed: Map<string, boolean>;
  protected registeredKeys: Map<string, boolean>;
  constructor() {
    this.keysPressed = new Map<string, boolean>();
    this.registeredKeys = new Map<string, boolean>();
    document.addEventListener("keydown", this.pressingKey);
    document.addEventListener("keyup", this.releasingKey);
  }
  abstract init(): void;
  pressingKey = (event: KeyboardEvent): void => {
    if (this.registeredKeys.has(event.code)) {
      event.preventDefault();
    }
    this.keysPressed.set(event.code, true);
  };
  releasingKey = (event: KeyboardEvent) => {
    this.keysPressed.set(event.code, false);
  };
  abstract setupKey(keyCode: string): void;
}
