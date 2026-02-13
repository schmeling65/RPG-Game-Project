import { Application } from "pixi.js";
import { PixiJSEnvironment } from "./PixiJSSetup/pixiJSSetupFunctions";
import { Keybindings } from "./JSUtils/controlsAndKeybidings";

const app = new Application();
PixiJSEnvironment.initApp(app);
Keybindings.setupKeyDown((event) => {
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)
  ) {
    event.preventDefault();
  }
  Keybindings.keys.set(event.code, true);
});
Keybindings.setupKeyUp((event) => {
  Keybindings.keys.set(event.code, false);
});
