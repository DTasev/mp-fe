import GameEvents from "./game-events";

export default class Canvas {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    events: GameEvents;

    constructor(id: string) {
        debugger;
        this.canvas = <HTMLCanvasElement>document.getElementById(id);
        this.context = this.canvas.getContext("2d");
        this.events = new GameEvents();

        // The callback needs to be wrapped in a function, otherwise the `this` scope is lost
        // yay JavaScript
        // https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#red-flags-for-this
        this.canvas.addEventListener('mousedown', this.events.mouseDown, false);
        this.canvas.addEventListener('mousemove', this.events.mouseMove, false);
        // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
        window.addEventListener('mouseup', this.events.mouseUp, false);

        this.canvas.addEventListener('touchstart', this.events.touchStart, false);
        this.canvas.addEventListener('touchend', this.events.touchEnd, false);
        this.canvas.addEventListener('touchmove', this.events.touchMove, false);
    }
}