import { Draw, DrawState } from './draw';

/**
 * Implementation for the actions that will be executed according to player actions.
 * 
 * Functions are wrapped to keep `this` context. This is the (e:MouseEvent) => {...} syntax.
 * 
 * In short, because the methods are added as event listeners (and are not called directly), the `this` reference starts pointing
 * towards the `window` object. The closure keeps the `this` to point towards the proper instance of the object.
 * 
 * For more details: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#red-flags-for-this
 */
export default class GameEvents {
    draw: Draw;
    context: CanvasRenderingContext2D;

    constructor(context) {
        this.draw = new Draw();
        this.context = context;
    }

    mouseDown = (e: MouseEvent) => {
        this.draw.state = DrawState.DRAWING;
        this.draw.line(this.context);
    }

    mouseUp = (e: MouseEvent) => {
        this.draw.state = DrawState.STOPPED;

        // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
        this.draw.last.X = -1;
        this.draw.last.Y = -1;
    }
    mouseMove = (e: MouseEvent) => {
        this.draw.updateMousePosition(e);
        // Draw a dot if the mouse button is currently being pressed
        if (this.draw.state == DrawState.DRAWING) {
            this.draw.line(this.context);
        }
    }

    touchStart = (e: MouseEvent) => { }
    touchEnd = (e: MouseEvent) => { }
    touchMove = (e: MouseEvent) => { }
}