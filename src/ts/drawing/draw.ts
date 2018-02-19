import { Point } from "../utility/point";
import { Color } from "./color";

export class Draw {
    state: DrawState;
    mouse: Point;
    last: Point;

    constructor() {
        this.mouse = new Point();
        this.last = new Point();
    }

    /** Draw a dot (a filled circle) around the point.
     * 
     * @param context Context on which the circle will be drawn
     * @param coords Coordinates for the origin point of the circle
     * @param radius Radius of the dot
     * @param fill_color Color of the fill
     * @param outline Specify whether an outline will be drawn around the circle
     * @param stroke_color Specify color for the outline, if not specified the colour will be the same as the fill color
     */
    dot(context: CanvasRenderingContext2D, coords: Point, radius: number, fill_color: string, outline: boolean = false, stroke_color: string = null) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        context.fillStyle = fill_color;
        context.lineWidth = radius;

        // Draw a filled circle
        context.beginPath();
        context.arc(coords.X, coords.Y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();

        if (outline) {
            context.strokeStyle = stroke_color || fill_color;
            context.stroke();
        }
    }

    /** Draw a circle around a point.
     * 
     * @param context Context on which the circle will be drawn
     * @param coords Coordinates for the origin point of the circle
     * @param radius The radius of the circle
     * @param line_width The line width of the circle
     * @param color The color of the line
     */
    circle(context: CanvasRenderingContext2D, coords: Point, radius: number, line_width: number, color: string) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        context.strokeStyle = color;
        context.lineWidth = line_width;

        // Draw a filled circle
        context.beginPath();
        context.arc(coords.X, coords.Y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
    }
    /**
     * Draw a line between the last known position of the mouse, and the current position.
     * @param context The canvas context that we're drawing on
     * @param update_last Whether to update the last position of the mouse
     */
    mouseLine(context: CanvasRenderingContext2D, width: number, color: string, update_last: boolean = true) {
        // If lastX is not set, set lastX and lastY to the current position 
        if (this.last.X == -1) {
            this.last.X = this.mouse.X;
            this.last.Y = this.mouse.Y;
        }

        // Select a fill style
        context.strokeStyle = color;

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
     * Draw a line between the start and end points.
     * @param context The canvas context that we're drawing on
     * @param start Start point
     * @param end End point
     * @param width Width of the line
     * @param color Color of the line
     */
    line(context: CanvasRenderingContext2D, start: Point, end: Point, width: number, color: string) {
        // Select a fill style
        context.strokeStyle = color;

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