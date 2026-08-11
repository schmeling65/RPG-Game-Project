import type { Application } from "pixi.js";
import { SceneManager } from "../Scenes/SceneManager";

export function startTicker(app: Application) {
    app.ticker.add(() => {
      SceneManager.getCurrentScene()?.update(app)
      /*
      let playerSprite = pixiJSEnv.getSceneManagerObject()!.getScene("map")!.playersprite;
      let tilemap = pixiJSEnv.getSceneManagerObject()!.getScene("map")!.tilemap;
      pixiJSEnv.getEventManagerObject()!.triggerEvents(pixiJSEnv.getPlayerObject()!,tilemap)
      playerSprite = pixiJSEnv.getPlayerObject()!.movePlayer(playerSprite, tilemap) || playerSprite;
      
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

     pixiJSEnv.getSceneManagerObject()!.getScene("map")!.container!.position.set(-camX, -camY);
      console.log(playerSprite.x)
      */
    });
  }