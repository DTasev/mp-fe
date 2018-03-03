import { Point } from "../utility/point";

export class Viewport {
    private readonly canvasWidth: number;
    private readonly canvasHeight: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    middle(y: number = 0) {
        this.go(this.canvasWidth / 4, y);
    }

    go(x: number, y: number) {
        console.log("Trying to scroll to", x, y);
        window.scroll(x, y);
    }
    goTo(point: Point) {
        this.go(point.x, point.y);
    }
}