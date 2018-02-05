import { Draw, DrawState } from './draw';
import { LineLimiter } from "./line-limiter";
import { TurnLimiter } from "./turn-limiter";

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
    line: LineLimiter;
    turn: TurnLimiter;

    constructor(context) {
        this.draw = new Draw();
        this.context = context;
        this.line = new LineLimiter();
        this.turn = new TurnLimiter();
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
        this.line.reset();

        // if we're out of actions, change the color
        if (!this.turn.action()) {
            this.draw.color.next();
            this.turn.next();
        }
    }

    mouseMove = (e: MouseEvent) => {
        this.draw.updateMousePosition(e);
        // Draw a dot if the mouse button is currently being pressed
        if (this.draw.state == DrawState.DRAWING && this.line.add(this.draw.last, this.draw.mouse)) {
            this.draw.line(this.context);
        }
    }

    touchMove = (e: TouchEvent) => {
        // Update the touch co-ordinates
        this.draw.updateTouchPosition(e);

        // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
        this.draw.line(this.context);

        // Prevent a scrolling action as a result of this touchmove triggering.
        event.preventDefault();
    }

    penMove = (e: PointerEvent) => {
        this.draw.updateMousePosition(e);
        if (this.draw.state == DrawState.DRAWING) {
            this.draw.line(this.context);
        }
        event.preventDefault();
    }
}