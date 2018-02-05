export class Draw {
    public state: DrawState;
    public mouse: CartesianCoords;
    public last: CartesianCoords;

    width: number = 1;

    constructor() {
        this.mouse = new CartesianCoords();
        this.last = new CartesianCoords();
    }

    /**
     * 
     * @param context The canvas context that we're drawing on
     * @param new_x The new X position, to which the line will be
     * @param new_y The new Y position, to which the line will be
     * @param width Width of the stroke
     */
    line(context) {
        // If lastX is not set, set lastX and lastY to the current position 
        if (this.last.X == -1) {
            this.last.X = this.mouse.X;
            this.last.Y = this.mouse.Y;
        }

        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        const r = 0, g = 0, b = 0, a = 255;

        // Select a fill style
        context.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";

        // Set the line "cap" style to round, so lines at different angles can join into each other
        context.lineCap = "round";
        //context.lineJoin = "round";

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

        // Update the last position to reference the current position
        this.last.X = this.mouse.X;
        this.last.Y = this.mouse.Y;
    }

    updateMousePosition(e: MouseEvent) {
        if (!e)
            var e = <MouseEvent>event;

        if (e.offsetX) {
            this.mouse.X = e.offsetX;
            this.mouse.Y = e.offsetY;
        }
        console.log("Mouse pos", this.mouse.X, " ", this.mouse.Y);
    }
}

class CartesianCoords {
    public X: number = -1;
    public Y: number = -1;
}

export enum DrawState {
    DRAWING,
    STOPPED
}