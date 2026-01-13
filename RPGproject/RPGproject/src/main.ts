import { Application} from "pixi.js";
import { PixiJSEnvironment } from "./PixiJSSetup/pixiJSSetupFunctions";

const app = new Application();
PixiJSEnvironment.initApp(app);
