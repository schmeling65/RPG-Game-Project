import { MapScene } from "./MapScene";
import { Scene } from "./Scene";

export const SceneManager = new (class {
  private scenes: Map<string, Scene>;
  private currentScene: string | null = null;

  constructor() {
    this.scenes = new Map();
    //TODO:later mainmenu
  }

  async createDefaultScenes() {
    await this.addScene(new MapScene("map"));
  }

  async addScene(scene: Scene) {
    await scene.start()
    this.scenes.set(scene.id, scene);
  }

  removeScene(sceneID: string) {
    this.scenes.delete(sceneID);
  }

  getCurrentScene() {
    return this.getScene(this.currentScene!)
  }

  setActiveScene(sceneID: string) {
    this.currentScene = sceneID
    this.scenes.get(sceneID)?.render();
  }

  getScene(sceneID: string) {
    return this.scenes.get(sceneID);
  }
})();
