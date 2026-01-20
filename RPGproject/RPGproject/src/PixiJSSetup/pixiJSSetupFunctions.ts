import { Application, Assets, Container, Rectangle, Sprite, Texture } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";
import { TextureManager } from "./TextureManager";
import { TileMap } from "./TileMap";
import { Keybindings } from "../JSUtils/controlsAndKeybidings";

export const PixiJSEnvironment = new (class {
  private SceneManager:
    | (typeof import("../Scenes/SceneManager"))["SceneManager"]
    | null;
  constructor() {
    this.SceneManager = null;
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
    //this.setupMainMenuScene();
    //this.setupBattleScene();
    //loadButtonAsset(app);
  }

  async setupMapScene(app: Application) {
    this.SceneManager = (await import("../Scenes/SceneManager")).SceneManager;
    this.SceneManager.getScene("map")!.container = new Container();
    app.stage.addChild(this.SceneManager.getScene("map")!.container as Container)
    this.SceneManager.setActiveScene("map");
    //app.stage.addChild(this.SceneManager.getScene("map")!.container)
    console.log(app.stage)
    this.loadMapAssets(app);
  }

  async loadMapAssets(app: Application) {
    await Assets.load(["SienceFictionDrausenA3", "imgTanks"]).then(
      async () => {},
    );
    this.createMap(app);
  }

  createMap(app: Application) {
    let scene = this.SceneManager!.getScene("map")!;
    scene.tilemap = new TileMap();
    //let tilemap = scene.tilemap.createTileMap()
    scene.container!.addChild(scene.tilemap);
    let playersprite = scene.tilemap.createPlayerOnTileMap(Assets.get("imgTanks"))
    scene.playersprite = playersprite;
    scene.container!.addChild(playersprite);
    this.startTicker(app);
    //createTilemap(app);

    //this.createTileMap(app);
  }
  /*
  createTileMap(app: Application) {
    const tilemap = new CompositeTilemap();
    this.SceneManager?.getScene("map")?.container.addChild(tilemap);

    let tileColumns = 50;
    let tileRows = 50;
    for (let x = 0; x < tileColumns; x++) {
      for (let y = 0; y < tileRows; y++) {
        if ((x + y) % 2 == 0) {
          tilemap.tile("SienceFictionDrausenA3", x * 48, y * 48, {
            u: 0 * 48,
            v: 4 * 48,
            tileWidth: 48,
            tileHeight: 48,
          });
        } else {
          tilemap.tile("SienceFictionDrausenA3", x * 48, y * 48, {
            u: 1 * 48,
            v: 4 * 48,
            tileWidth: 48,
            tileHeight: 48,
          });
        }
      }
    }
  }
    */

  async initAssetsEnvironment() {
    await Assets.init().then(async () => {});
  }

  startTicker(app: Application) {
     app.ticker.add(() => {
      const speed = 4;
      let playerSprite = this.SceneManager!.getScene("map")!.playersprite
      let tilemap = this.SceneManager!.getScene("map")!.tilemap
      if (Keybindings.keys.get("ArrowUp")) playerSprite.y -= speed;
      if (Keybindings.keys.get("ArrowDown")) playerSprite.y += speed;
      if (Keybindings.keys.get("ArrowLeft")) playerSprite.x -= speed;
      if (Keybindings.keys.get("ArrowRight")) playerSprite.x += speed;

      playerSprite.x = Math.max(0,Math.min(playerSprite.x, (tilemap.columns-1) * 48))
      playerSprite.y = Math.max(0,Math.min(playerSprite.y, (tilemap.rows-1)*48))

      let camX = playerSprite.x - this.SceneManager!.getScene("map")!.container!.width / 2;
      let camY = playerSprite.y - this.SceneManager!.getScene("map")!.container!.height / 2;

      camX = Math.max(0, Math.min(camX, tilemap.columns * 48 - this.SceneManager!.getScene("map")!.container!.width))
      camY = Math.max(0, Math.min(camY, tilemap.columns * 48 - this.SceneManager!.getScene("map")!.container!.height))

      this.SceneManager!.getScene("map")!.container!.position.set(-camX, -camY);
    });
  }
})();

async function loadButtonAsset(app: Application) {}

function createTilemap(app: Application) {
  const tilemap = new CompositeTilemap();
  app.stage.addChild(tilemap);

  //tilemap.position.set(app.canvas.width / 2 - 24, app.canvas.height / 2 - 24);
  //let tileColumns = Math.ceil(app.canvas.height / 48) + 1;
  //let tileRows = Math.ceil(app.canvas.width / 48) + 1;
  let tileColumns = 50;
  let tileRows = 50;
  for (let x = 0; x < tileColumns; x++) {
    for (let y = 0; y < tileRows; y++) {
      if ((x + y) % 2 == 0) {
        tilemap.tile("SienceFictionDrausenA3", x * 48, y * 48, {
          u: 0 * 48,
          v: 4 * 48,
          tileWidth: 48,
          tileHeight: 48,
        });
      } else {
        tilemap.tile("SienceFictionDrausenA3", x * 48, y * 48, {
          u: 1 * 48,
          v: 4 * 48,
          tileWidth: 48,
          tileHeight: 48,
        });
      }
    }
  }

  const PlayerTexture = Assets.get("imgTanks");
  var texture = new Texture({
    source: PlayerTexture,
    frame: new Rectangle(0, 0, 48, 48),
  });
  var playerTankSprite = new Sprite(texture);
  //playerTankSprite.x = Math.ceil(app.canvas.width / 2) - 24;
  //playerTankSprite.y = Math.ceil(app.canvas.height / 2) - 24;
  //playerTankSprite.anchor.set(0.5)
  //playerTankSprite.position.set(tileColumns * 48 / 2, tileRows * 48 / 2)
  playerTankSprite.position.set(0, 0);
  app.stage.addChild(playerTankSprite);

  const keys = new Map();
  document.addEventListener("keydown", (event) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)
    ) {
      event.preventDefault();
    }
    keys.set(event.code, true);
  });
  document.addEventListener("keyup", (event) => {
    keys.set(event.code, false);
  });

  console.log("screen height:", app.screen.height);
  console.log("map height:", tileRows * 48);

  app.ticker.add(() => {
    const speed = 4;
    if (keys.get("ArrowUp")) playerTankSprite.y -= speed;
    if (keys.get("ArrowDown")) playerTankSprite.y += speed;
    if (keys.get("ArrowLeft")) playerTankSprite.x -= speed;
    if (keys.get("ArrowRight")) playerTankSprite.x += speed;

    playerTankSprite.x = Math.max(
      0,
      Math.min(playerTankSprite.x, tileColumns * 48),
    );
    playerTankSprite.y = Math.max(
      0,
      Math.min(playerTankSprite.y, tileRows * 48),
    );

    let camX = playerTankSprite.x - app.screen.width / 2;
    let camY = playerTankSprite.y - app.screen.height / 2;

    camX = Math.max(0, Math.min(camX, tileColumns * 48 - app.screen.width));
    camY = Math.max(0, Math.min(camY, tileRows * 48 - app.screen.height));

    app.stage.position.set(-camX, -camY);
  });

  /*
  function gameLoop() {
    player.y -= 0;
    tilemap.pivot.set(player.x, player.y);
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
  */
}
