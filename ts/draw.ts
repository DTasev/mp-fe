import { CartesianCoords } from "./cartesian-coords";

class Color {
    red: number = 0;
    green: number = 0;
    blue: number = 0;
    alpha: number = 1.0;

    toRGB() {
        return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    }
    toRGBA() {
        return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")";
    }

    set(red: number, green: number, blue: number): void {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    goRed() {
        this.set(255, 0, 0);
    }
    goGreen() {
        this.set(0, 255, 0);
    }
    goBlue() {
        this.set(0, 0, 255);
    }
    goWhite() {
        this.set(255, 255, 255);
    }
    next() {
        if (this.red != 0) {
            this.goGreen();
        } else if (this.green != 0) {
            this.goBlue();
        } else if (this.blue != 0) {
            this.goRed();
        } else {
            this.goRed();
        }
    }
}
export class Draw {
    state: DrawState;
    mouse: CartesianCoords;
    last: CartesianCoords;
    width: number;
    color: Color;

    constructor(width: number = 1) {
        this.mouse = new CartesianCoords();
        this.last = new CartesianCoords();
        this.color = new Color();
        this.width = width;
    }

    dot(context: CanvasRenderingContext2D, coords: CartesianCoords, width: number, outline: boolean = false, outline_width: number = 1) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        // Select a fill style
        this.color.goRed();
        context.fillStyle = this.color.toRGBA();

        // Draw a filled circle
        context.beginPath();
        context.arc(coords.X, coords.Y, width, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        this.color.goGreen();
        if (outline) {
            context.lineWidth = outline_width;
            context.strokeStyle = this.color.toRGBA();
            context.stroke();
        }
    }
    /**
     * Draw a line between the last known position of the mouse, and the current position.
     * @param context The canvas context that we're drawing on
     * @param update_last Whether to update the last position of the mouse
     */
    line(context: CanvasRenderingContext2D, update_last: boolean = true) {
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
        context.lineWidth = this.width;
        context.stroke();

        context.closePath();

        if (update_last) {
            // Update the last position to reference the current position
            this.last.X = this.mouse.X;
            this.last.Y = this.mouse.Y;
        }
    }

    updateMousePosition(e: MouseEvent) {
        if (!e) {
            var e = <MouseEvent>event;
        }

        if (e.offsetX) {
            this.mouse.X = e.offsetX;
            this.mouse.Y = e.offsetY;
        }
    }

    updateTouchPosition(e: TouchEvent) {
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