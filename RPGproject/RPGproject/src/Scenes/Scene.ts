//TODO: Need to make a normal Scene class with global objects in the SceneManager
export interface Scene {
  id: string;
  init(): void;
  update(dt: number): void;
  render(): void;
  destroy(): void;
}
