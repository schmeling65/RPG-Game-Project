import type { Scene } from "./Scene"

export const SceneManager = new class {
    private scenes: Map<string, Scene> = new Map()
    private activeSceneID: string | null = null

    addScene(scene: Scene) {
        this.scenes.set(scene.id, scene)
    }

    removeScene(sceneID: string) {

    }

    setActiveScene(sceneID: string) {
        this.activeSceneID = sceneID
        this.scenes.get(sceneID)?.render()
    }
}