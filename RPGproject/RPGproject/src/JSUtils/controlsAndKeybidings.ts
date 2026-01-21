export type Direction = "none" | "up" | "down" | "left" | "right";

export const Keybindings = new class{
    keys: Map<string, boolean>;
    constructor() {
        this.keys = new Map<string,boolean>();
    }
    setupKeyDown(handler: (event: KeyboardEvent) => void) {
        document.addEventListener("keydown", handler)
    }
    setupKeyUp(handler: (event: KeyboardEvent) => void) {
        document.addEventListener("keyup", handler)
    }
    checkInput(): string {
        let newDirection: Direction = "none"
        if (this.keys.get("ArrowUp")) newDirection = "up"
        else if (this.keys.get("ArrowDown")) newDirection = "down"
        else if (this.keys.get("ArrowLeft")) newDirection = "left"
        else if (this.keys.get("ArrowRight")) newDirection = "right"
        return newDirection
    }
}