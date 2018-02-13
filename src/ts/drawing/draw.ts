import { CartesianCoords } from "../cartesianCoords";
import { Color } from "./color";

export class Draw {
    state: DrawState;
    mouse: CartesianCoords;
    last: CartesianCoords;
    color: Color;

    constructor() {
        this.mouse = new CartesianCoords();
        this.last = new CartesianCoords();
        this.color = new Color();
    }

    dot(context: CanvasRenderingContext2D, coords: CartesianCoords, width: number, outline: boolean = false) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        context.fillStyle = this.color.toRGBA();
        context.lineWidth = width;

        // Draw a filled circle
        context.beginPath();
        context.arc(coords.X, coords.Y, width, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();

        if (outline) {
            context.strokeStyle = this.color.toRGBA();
            context.stroke();
        }
    }

    circle(context: CanvasRenderingContext2D, coords: CartesianCoords, width: number, line_width) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        context.strokeStyle = this.color.toRGBA();
        context.lineWidth = line_width;

        // Draw a filled circle
        context.beginPath();
        context.arc(coords.X, coords.Y, width, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
    }
    /**
     * Draw a line between the last known position of the mouse, and the current position.
     * @param context The canvas context that we're drawing on
     * @param update_last Whether to update the last position of the mouse
     */
    line(context: CanvasRenderingContext2D, width: number, update_last: boolean = true) {
        // If lastX is not set, set lastX and lastY to the current position 
        if (this.last.X == -1) {
            this.last.X = this.mouse.X;
            this.last.Y = this.mouse.Y;
        }

        // Select a fill style
        context.strokeStyle = this.color.toRGBA();

        // Set the line "cap" style to round, so lines at different angles can join into each other
        context.lineCap = "round";
        context.lineJoin = "round";

        // Draw a filled line
        context.beginPath();

        // First, move to the old (previous) position
        context.moveTo(this.last.X, this.last.Y);

        // Now draw a line to the current touch/pointer position
        context.lineTo(this.mouse.X, this.mouse.Y);

        // Set the line thickness and draw the line
        context.lineWidth = width;
        context.stroke();

        context.closePath();

        if (update_last) {
            // Update the last position to reference the current position
            this.last.X = this.mouse.X;
            this.last.Y = this.mouse.Y;
        }
    }
    /**
     * Draw a line between the last known position of the mouse, and the current position.
     * @param context The canvas context that we're drawing on
     * @param update_last Whether to update the last position of the mouse
     */
    lineFromPoints(context: CanvasRenderingContext2D, start: CartesianCoords, end: CartesianCoords, width: number) {
        // Select a fill style
        context.strokeStyle = this.color.toRGBA();

        // Set the line "cap" style to round, so lines at different angles can join into each other
        context.lineCap = "round";
        context.lineJoin = "round";

        // Draw a filled line
        context.beginPath();

        // First, move to the old (previous) position
        context.moveTo(start.X, start.Y);

        // Now draw a line to the current touch/pointer position
        context.lineTo(end.X, end.Y);

        // Set the line thickness and draw the line
        context.lineWidth = width;
        context.stroke();

        context.closePath();
    }

    updateMousePosition(e: MouseEvent) {
        // if the browser hasn't passed a parameter, but has set the global event variable
        if (!e) {
            var e = <MouseEvent>event;
        }

        if (e.offsetX) {
            this.mouse.X = e.offsetX;
            this.mouse.Y = e.offsetY;
        }
    }

    updateTouchPosition(e: TouchEvent) {
        // if the browser hasn't passed a parameter, but has set the global event variable
        if (!e) {
            var e = <TouchEvent>event;
        }
        if (e.touches) {
            // Only deal with one finger
            if (e.touches.length == 1) {
                // Get the information for finger #1
                const touch: Touch = e.touches[0];
                // the 'target' will be the canvas element
                this.mouse.X = touch.pageX - (<HTMLCanvasElement>touch.target).offsetLeft;
                this.mouse.Y = touch.pageY - (<HTMLCanvasElement>touch.target).offsetTop;
            }
        }
    }
}

export enum DrawState {
    DRAWING,
    STOPPED
}