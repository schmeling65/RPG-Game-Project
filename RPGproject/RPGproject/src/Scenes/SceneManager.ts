import { Scene } from "./Scene";

export const SceneManager = new (class {
  private scenes: Map<string, Scene>;
  private activeSceneID: string | null;

  constructor() {
    this.scenes = new Map();
    //TODO:later mainmenu
    this.activeSceneID = "";
    this.addScene(new Scene("map"));
  }

  addScene(scene: Scene) {
    this.scenes.set(scene.id, scene);
  }

  removeScene(sceneID: string) {
    this.scenes.delete(sceneID);
  }

  setActiveScene(sceneID: string) {
    this.activeSceneID = sceneID;
    this.scenes.get(sceneID)?.render();
  }

  getScene(sceneID: string) {
    return this.scenes.get(sceneID);
  }
})();
