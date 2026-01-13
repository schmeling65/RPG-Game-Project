import { Application, Assets, Rectangle, Sprite, Texture } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";
import { TextureManager } from "./TextureManager";

export const PixiJSEnvironment = new (class {
  constructor() {}
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
    await TextureManager.loadTextureInformation().then(async (_resolved: string[]) => {
      _resolved.forEach((element: string) => {
        console.log(element);
        Assets.add({alias: element, src: "/tilessets/" + element+".png"})
      });
    });


    loadButtonAsset(app);


  }

  async initAssetsEnvironment() {
    await Assets.init().then(async () => {});
  }
})(); 




async function loadButtonAsset(app: Application) {
  await Assets.load(["SienceFictionDrausenA3", "imgTanks"]).then(async () => {});
  createTilemap(app);
}

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
  playerTankSprite.position.set(0,0)
  app.stage.addChild(playerTankSprite);

  const keys = new Map();
  document.addEventListener("keydown", (event) => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.code)) {
      event.preventDefault();
    }
    keys.set(event.code, true)
  })
  document.addEventListener("keyup", (event) => {
    keys.set(event.code,false)
  })

console.log("screen height:", app.screen.height); console.log("map height:", tileRows * 48);


  app.ticker.add(() => {
    const speed = 4;
    if (keys.get("ArrowUp")) playerTankSprite.y -= speed
    if (keys.get("ArrowDown")) playerTankSprite.y += speed
    if (keys.get("ArrowLeft")) playerTankSprite.x -= speed
    if (keys.get("ArrowRight")) playerTankSprite.x += speed

    playerTankSprite.x = Math.max(0, Math.min(playerTankSprite.x, tileColumns * 48))
    playerTankSprite.y = Math.max(0, Math.min(playerTankSprite.y, tileRows * 48))

    let camX = playerTankSprite.x - app.screen.width / 2
    let camY = playerTankSprite.y - app.screen.height / 2

    camX = Math.max(0, Math.min(camX, tileColumns * 48 - app.screen.width))
    camY = Math.max(0, Math.min(camY, tileRows * 48 - app.screen.height))

    app.stage.position.set(-camX,-camY);

    
  })

  /*
  function gameLoop() {
    player.y -= 0;
    tilemap.pivot.set(player.x, player.y);
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
  */
}
