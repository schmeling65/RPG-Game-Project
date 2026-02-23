import { Application, Assets, Container } from "pixi.js";
import { TextureManager } from "./TextureManager";
import { TileMap } from "./TileMap";
import { Player } from "./Player";

export const PixiJSEnvironment = new (class {
  private SceneManager:
    | (typeof import("../Scenes/SceneManager"))["SceneManager"]
    | null;
  private player: Player | null;
  constructor() {
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
    import("../Scenes/SceneManager").then((data) => {
      this.SceneManager = data.SceneManager;
      this.SceneManager.getScene("map")!.container = new Container();
      app.stage.addChild(
        this.SceneManager.getScene("map")!.container as Container,
      );
      this.SceneManager.setActiveScene("map");
      this.loadMapAssets(app);
    });
  }

  loadMapAssets(app: Application) {
    Promise.all([this.createMap(), this.createPlayer()])
      .then(() => {
        this.startTicker(app);
      })
      .catch
      ();
  }

  async createPlayer() {
    this.player = new Player("Player", "player", 0, 0);
    await this.player.initTextureFromString();
    let scene = this.SceneManager!.getScene("map")!;
    scene.playersprite = this.player.initPlayer();
    scene.container!.addChild(scene.playersprite);
  }

  async createMap() {
    let scene = this.SceneManager!.getScene("map")!;
    scene.tilemap = new TileMap();
    scene.container!.addChild(scene.tilemap);
    return scene.tilemap.initData("/levels/level_start.json");
  }

  async initAssetsEnvironment() {
    await Assets.init().then(async () => {});
  }

  startTicker(app: Application) {
    app.ticker.add(() => {
      let playerSprite = this.SceneManager!.getScene("map")!.playersprite;
      let tilemap = this.SceneManager!.getScene("map")!.tilemap;
      playerSprite =
        this.player!.movePlayer(playerSprite, tilemap) || playerSprite;

      playerSprite.x = Math.max(
        0,
        Math.min(playerSprite.x, (tilemap.columns - 1) * 48),
      );
      playerSprite.y = Math.max(
        0,
        Math.min(playerSprite.y, (tilemap.rows - 1) * 48),
      );

      let camX = playerSprite.x - app.screen.width / 2;
      let camY = playerSprite.y - app.screen.height / 2;

      camX = Math.max(
        0,
        Math.min(camX, tilemap.columns * 48 - app.screen.width),
      );
      camY = Math.max(0, Math.min(camY, tilemap.rows * 48 - app.screen.height));

      this.SceneManager!.getScene("map")!.container!.position.set(-camX, -camY);
    });
  }
})();
