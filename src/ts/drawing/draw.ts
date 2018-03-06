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
     * @param fillColor Color of the fill
     * @param outline Specify whether an outline will be drawn around the circle
     * @param strokeColor Specify color for the outline, if not specified the colour will be the same as the fill color
     */
    static dot(context: CanvasRenderingContext2D, coords: Point, radius: number, fillColor: string, outline: boolean = false, strokeColor: string = null) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        context.fillStyle = fillColor;
        context.lineWidth = radius;

        // Draw a filled circle
        context.beginPath();
        context.arc(coords.x, coords.y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();

        if (outline) {
            context.strokeStyle = strokeColor || fillColor;
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
    static circle(context: CanvasRenderingContext2D, coords: Point, radius: number, line_width: number, color: string) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        context.strokeStyle = color;
        context.lineWidth = line_width;

        // Draw a filled circle
        context.beginPath();
        context.arc(coords.x, coords.y, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
    }
    /**
     * Draw a line between the last known position of the mouse, and the current position.
     * @param context The canvas context that we're drawing on
     * @param updateLast Whether to update the last position of the mouse
     */
    mouseLine(context: CanvasRenderingContext2D, width: number, color: string, updateLast: boolean = true) {
        // If lastX is not set, set lastX and lastY to the current position 
        if (this.last.x == -1) {
            this.last.x = this.mouse.x;
            this.last.y = this.mouse.y;
        }

        // Select a fill style
        context.strokeStyle = color;

        // Set the line "cap" style to round, so lines at different angles can join into each other
        context.lineCap = "round";
        context.lineJoin = "round";

        // Draw a filled line
        context.beginPath();

        // First, move to the old (previous) position
        context.moveTo(this.last.x, this.last.y);

        // Now draw a line to the current touch/pointer position
        context.lineTo(this.mouse.x, this.mouse.y);

        // Set the line thickness and draw the line
        context.lineWidth = width;
        context.stroke();

        context.closePath();

        if (updateLast) {
            // Update the last position to reference the current position
            this.last.x = this.mouse.x;
            this.last.y = this.mouse.y;
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
    static line(context: CanvasRenderingContext2D, start: Point, end: Point, width: number, color: string) {
        // Select a fill style
        context.strokeStyle = color;

        // Set the line "cap" style to round, so lines at different angles can join into each other
        context.lineCap = "round";
        context.lineJoin = "round";

        // Draw a filled line
        context.beginPath();

        // First, move to the old (previous) position
        context.moveTo(start.x, start.y);

        // Now draw a line to the current touch/pointer position
        context.lineTo(end.x, end.y);

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
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
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
                this.mouse.x = touch.pageX - (<HTMLCanvasElement>touch.target).offsetLeft;
                this.mouse.y = touch.pageY - (<HTMLCanvasElement>touch.target).offsetTop;
            }
        }
    }
}

export enum DrawState {
    DRAWING,
    STOPPED
}