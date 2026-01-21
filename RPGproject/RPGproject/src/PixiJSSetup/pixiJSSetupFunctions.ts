import { Application, Assets, Container } from "pixi.js";
import { TextureManager } from "./TextureManager";
import { TileMap } from "./TileMap";
import { Player } from "./Player";

export const PixiJSEnvironment = new (class {
  private SceneManager:
    | (typeof import("../Scenes/SceneManager"))["SceneManager"]
    | null;
    private player: Player | null
  constructor() {
    this.SceneManager = null;
    this.player = null;
  }
  async initApp(app: Application) {
    await app
      .init({ background: "#000000", resizeTo: window })
      .then(async () => {
        document.body.appendChild(app.canvas);
        this.loadEnvironment(app);
      });
  }

  async loadEnvironment(app: Application) {
    this.initAssetsEnvironment();
    await TextureManager.loadTextureInformation().then(
      async (_resolved: string[]) => {
        _resolved.forEach((element: string) => {
          Assets.add({ alias: element, src: "/tilessets/" + element + ".png" });
        });
      },
    );
    this.setupMapScene(app);
  }

  async setupMapScene(app: Application) {
    this.SceneManager = (await import("../Scenes/SceneManager")).SceneManager;
    this.SceneManager.getScene("map")!.container = new Container();
    app.stage.addChild(this.SceneManager.getScene("map")!.container as Container)
    this.SceneManager.setActiveScene("map");
    this.loadMapAssets(app);
  }

  async loadMapAssets(app: Application) {
    await Assets.load(["SienceFictionDrausenA3", "imgTanks"]).then(
      async () => {},
    );
    this.createMap();
    await this.createPlayer()
    this.startTicker(app);
  }

  async createPlayer() {
    this.player = new Player(Assets.get("imgTanks"))
    let scene = this.SceneManager!.getScene("map")!
    scene.playersprite = this.player.initPlayer()
    scene.container!.addChild(scene.playersprite)
  }

  createMap() {
    let scene = this.SceneManager!.getScene("map")!;
    scene.tilemap = new TileMap();
    scene.container!.addChild(scene.tilemap);
  }
  
  async initAssetsEnvironment() {
    await Assets.init().then(async () => {});
  }

  /*
  startTicker(app: Application) {
     app.ticker.add(() => {
      //const speed = this.player!.scrollSpeed;
      const speed = 4;
      let playerSprite = this.SceneManager!.getScene("map")!.playersprite
      let tilemap = this.SceneManager!.getScene("map")!.tilemap
      if (Keybindings.keys.get("ArrowUp")) playerSprite.y -= speed;
      if (Keybindings.keys.get("ArrowDown")) playerSprite.y += speed;
      if (Keybindings.keys.get("ArrowLeft")) playerSprite.x -= speed;
      if (Keybindings.keys.get("ArrowRight")) playerSprite.x += speed;

      playerSprite.x = Math.max(0,Math.min(playerSprite.x, (tilemap.columns-1) * 48))
      playerSprite.y = Math.max(0,Math.min(playerSprite.y, (tilemap.rows-1)*48))

      let camX = playerSprite.x - app.screen.width / 2;
      let camY = playerSprite.y - app.screen.height / 2;

      camX = Math.max(0, Math.min(camX, (tilemap.columns) * 48 - app.screen.width))
      camY = Math.max(0, Math.min(camY, (tilemap.rows) * 48 - app.screen.height))

      this.SceneManager!.getScene("map")!.container!.position.set(-camX, -camY);
    });
  }
    */
    startTicker(app: Application) {
     app.ticker.add(() => {
      //const speed = this.player!.scrollSpeed;
      let playerSprite = this.SceneManager!.getScene("map")!.playersprite
      let tilemap = this.SceneManager!.getScene("map")!.tilemap
      playerSprite = this.player!.movePlayer(playerSprite) || playerSprite;
      //if (Keybindings.keys.get("ArrowUp")) playerSprite.y -= speed;
      //if (Keybindings.keys.get("ArrowDown")) playerSprite.y += speed;
      //if (Keybindings.keys.get("ArrowLeft")) playerSprite.x -= speed;
      //if (Keybindings.keys.get("ArrowRight")) playerSprite.x += speed;

      playerSprite.x = Math.max(0,Math.min(playerSprite.x, (tilemap.columns-1) * 48))
      playerSprite.y = Math.max(0,Math.min(playerSprite.y, (tilemap.rows-1)*48))

      let camX = playerSprite.x - app.screen.width / 2;
      let camY = playerSprite.y - app.screen.height / 2;

      camX = Math.max(0, Math.min(camX, (tilemap.columns) * 48 - app.screen.width))
      camY = Math.max(0, Math.min(camY, (tilemap.rows) * 48 - app.screen.height))

      this.SceneManager!.getScene("map")!.container!.position.set(-camX, -camY);
    });
  }
})();
