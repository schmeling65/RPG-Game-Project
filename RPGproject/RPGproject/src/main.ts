import { Application } from "pixi.js";
import { PixiJSEnvironment } from "./PixiJSSetup/pixiJSSetupFunctions";
import { Keybindings } from "./JSUtils/controlsAndKeybidings";

const app = new Application();
PixiJSEnvironment.initApp(app);
Keybindings.init();