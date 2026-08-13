import { Container } from "pixi.js";

export abstract class Scene {
  [key: string]: any;
  id: string;
  container: Container;
  constructor(_name: string) {
    this.id = _name;
    this.container = new Container;
  }
  abstract start(): Promise<void> | void
  abstract update(...args: any[]): void
  abstract render(): void
  abstract destroy(): void
}
