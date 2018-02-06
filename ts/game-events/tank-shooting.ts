import { TanksGameEvent } from "./event";

export class ShootingEvent implements TanksGameEvent {

    addEventListeners(canvas: HTMLCanvasElement) {

    }
    removeEventListeners(canvas: HTMLCanvasElement) {

    }

    // mouseDown = (e: MouseEvent) => {
    //     this.draw.state = DrawState.DRAWING;
    //     this.draw.line(this.context);
    // }

    // mouseUp = (e: MouseEvent) => {
    //     this.draw.state = DrawState.STOPPED;

    //     // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
    //     this.draw.last.X = -1;
    //     this.draw.last.Y = -1;
    //     this.line.reset();

    //     // if we're out of actions, change the color
    //     if (!this.turn.action()) {
    //         this.draw.color.next();
    //         this.turn.next();
    //     }
    // }

    // mouseMove = (e: MouseEvent) => {
    //     this.draw.updateMousePosition(e);
    //     // Draw a dot if the mouse button is currently being pressed
    //     if (this.draw.state == DrawState.DRAWING && this.line.add(this.draw.last, this.draw.mouse)) {
    //         this.draw.line(this.context);
    //     }
    // }

    // touchMove = (e: TouchEvent) => {
    //     // Update the touch co-ordinates
    //     this.draw.updateTouchPosition(e);

    //     // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
    //     this.draw.line(this.context);

    //     // Prevent a scrolling action as a result of this touchmove triggering.
    //     event.preventDefault();
    // }

    // penMove = (e: PointerEvent) => {
    //     this.draw.updateMousePosition(e);
    //     if (this.draw.state == DrawState.DRAWING) {
    //         this.draw.line(this.context);
    //     }
    //     event.preventDefault();
    // }
}