import { Container } from "pixi.js";

export class Scene {
  [key: string]: any;
  id: string;
  container: Container | null;
  constructor(_name: string) {
    this.id = _name;
    this.container = null;
    /*
    this.container = new Container();
    this.container.visible = false;
    console.log(this.container.getBounds())
    */
    //create Reactangle that is as big as the canvas
  }

  update(): void {

  };

  render(): void {
    this.container!.visible = true
  };

  destroy(): void {

  };
}
 