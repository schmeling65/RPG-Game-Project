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
}