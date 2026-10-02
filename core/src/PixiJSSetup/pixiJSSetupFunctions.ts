import { Application, Assets, Container } from "pixi.js";
import { TextureManager } from "./TextureManager.ts";
import { startTicker } from "./GameTicker.ts";

export const PixiJSEnvironment = new (class {
  private SceneManager: (typeof import("../Scene/SceneManager.ts"))["SceneManager"] | null;
  constructor() {
    this.SceneManager = null;
  }

  initApp(app: Application) {
    app.init({ background: "#000000", resizeTo: window }).then(async () => {
      document.body.appendChild(app.canvas);
      await this.loadEnvironment(app);
    });
  }

  async loadEnvironment(app: Application) {
    this.initAssetsEnvironment();
    let [tiletexures, charactertextures] = await TextureManager.loadTextureInformations();
    tiletexures.forEach((element: string) => {
      Assets.add({ alias: element, src: "/img/tilessets/" + element + ".png" });
    });
    charactertextures.forEach((element: string) => {
      console.log(element)
      Assets.add({
        alias: element,
        src: "/img/characters/" + element + ".png",
      });
    });
    this.setupMapScene(app);
  }

  setupMapScene(app: Application) {
    import("../Scene/SceneManager.ts").then(async (data) => {
      this.SceneManager = data.SceneManager;
      await this.SceneManager.createDefaultScenes();
      app.stage.addChild(this.SceneManager.getScene("map")!.container as Container);
      this.SceneManager.setActiveScene("map");
      this.loadMapAssets(app);
    });
  }

  loadMapAssets(app: Application) {
    startTicker(app);
  }

  async initAssetsEnvironment() {
    await Assets.init().then(async () => {});
  }
})();

