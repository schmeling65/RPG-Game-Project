import { Container } from "pixi.js";

export class Scene {
  [key: string]: any;
  id: string;
  container: Container | null;
  constructor(_name: string) {
    this.id = _name;
    this.container = null;
  }

  update(): void {}

  render(): void {
    this.container!.visible = true;
  }

  destroy(): void {}
}
