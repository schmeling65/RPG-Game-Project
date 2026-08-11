import { Application, Assets, Container} from "pixi.js";
import { TextureManager } from "./TextureManager.ts";
import { TileMap } from "./TileMap.ts";
import { Player } from "./Player.ts";
import { startTicker } from "./GameTicker.ts";

export const PixiJSEnvironment = new (class {
  private SceneManager:
    | (typeof import("../Scenes/SceneManager.ts"))["SceneManager"]
    | null;
  private player: Player | null;
  private EventManager: (typeof import("./Events.ts"))["EventManager"] | null;
  constructor() {
    this.EventManager = null;
    this.SceneManager = null;
    this.player = null;
  }
  
  initApp(app: Application) {
    app.init({ background: "#000000", resizeTo: window }).then(() => {
      document.body.appendChild(app.canvas);
      this.loadEnvironment(app);
    });
  }

  loadEnvironment(app: Application) {
    this.initAssetsEnvironment();
    TextureManager.loadTextureInformations().then(
      ([tiletexures, charactertextures]) => {
        tiletexures.forEach((element: string) => {
          Assets.add({ alias: element, src: "/tilessets/" + element + ".png" });
        });
        charactertextures.forEach((element: string) => {
          Assets.add({
            alias: element,
            src: "/characters/" + element + ".png",
          });
        });
        this.setupMapScene(app);
      },
    );
  }

  setupMapScene(app: Application) {
    import("../Scenes/SceneManager.ts").then(async (data) => {
      this.SceneManager = data.SceneManager;
      await this.SceneManager.createDefaultScenes()
      //this.SceneManager.getScene("map")!.container = new Container();
      app.stage.addChild(
        this.SceneManager.getScene("map")!.container as Container,
      );
      this.SceneManager.setActiveScene("map");
      this.loadMapAssets(app);
    });
  }

  loadMapAssets(app: Application) {
    startTicker(app);
    /*
    Promise.all([this.createMap(), this.createPlayer(), this.createEventManager()])
      .then(() => {
        startTicker(app)
      })
      .catch
      ();
      */
  }

  async createEventManager() {
    return import("./Events.ts").then((data) => {
    this.EventManager = data.EventManager;
    })
  }
  /*
  async createPlayer() {
    this.player = new Player("Player", "player", 0, 0);
    await this.player.initTextureFromString();
    let scene = this.SceneManager!.getScene("map")!;
    scene.playersprite = this.player.initPlayer();
    scene.container!.addChild(scene.playersprite);
  }
    */

  async createMap() {
    let scene = this.SceneManager!.getScene("map")!;
    scene.tilemap = new TileMap();
    scene.container!.addChild(scene.tilemap);
    return scene.tilemap.initData("/levels/level_start.json");
  }

  async initAssetsEnvironment() {
    await Assets.init().then(async () => {});
  }
})();
