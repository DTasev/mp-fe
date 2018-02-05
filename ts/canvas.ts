import GameEvents from "./game-events";

export class Canvas {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    events: GameEvents;

    constructor(id: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(id);
        this.context = this.canvas.getContext("2d");
        this.events = new GameEvents(this.context);

        this.canvas.addEventListener('mousedown', this.events.mouseDown, false);
        this.canvas.addEventListener('mousemove', this.events.mouseMove, false);
        // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
        window.addEventListener('mouseup', this.events.mouseUp, false);

        this.canvas.addEventListener('touchstart', this.events.touchMove, false);
        this.canvas.addEventListener('touchend', this.events.mouseUp, false);
        this.canvas.addEventListener('touchmove', this.events.touchMove, false);
    }

    setDOMResolution(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}