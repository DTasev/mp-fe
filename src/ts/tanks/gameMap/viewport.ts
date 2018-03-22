import { Point } from "../utility/point";

/**
 * The Viewport controls what the user currently sees on the screen. This is done by scrolling
 * to different parts of the page, e.g. each one containing the tanks for different players.
 * This will only work when the canvas is bigger than the user's screen. If the canvas is smaller
 * then scrolling will not do anything, as the user will already be able to see the whole page.
 */
export class Viewport {

    private readonly canvasWidth: number;
    private readonly canvasHeight: number;

    /**
     * The width and height of the canvas are stored so that the middle can be found, and 
     * to navigate the canvas more easily.
     * @param canvasWidth Width of the canvas
     * @param canvasHeight Height of the canvas
     */
    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    middle(y: number = 0) {
        this.go(this.canvasWidth / 4, y);
    }

    go(x: number, y: number) {
        window.scroll(x, y);
    }
    goTo(point: Point) {
        this.go(point.x, point.y);
    }
    static current(): Point {
        return new Point(window.pageXOffset, window.pageYOffset);
    }
}