import { Application } from "pixi.js";
import { PixiJSEnvironment } from "./PixiJSSetup/PixiJSSetupFunctions";

const app = new Application();
PixiJSEnvironment.initApp(app);