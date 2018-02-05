export default class Draw {
    mouse: Mouse;
    constructor() {
        this.mouse = new Mouse();
    }
    line() {

    }
    updateMousePosition(e: MouseEvent) {
        if (!e)
            var e = <MouseEvent>event;

        if (e.offsetX) {
            this.mouse.X = e.offsetX;
            this.mouse.Y = e.offsetY;
        }
        else if (e.layerX) { // TODO what does this do?
            this.mouse.X = e.layerX;
            this.mouse.Y = e.layerY;
        }
        console.log("Mouse pos", this.mouse.X, " ", this.mouse.Y);
    }
}

class Mouse {
    public X: number;
    public Y: number;
}