import { CartesianCoords } from "./cartesian-coords";

export class LineLimiter {
    public limit: number;
    current: number;

    /**
     * Calcualtes and keeps track of the total length of a line.
     * 
     * @param limit Maximum length of each line, in canvas pixels
     */
    constructor(limit: number = 200) {
        this.limit = limit;
        this.current = 0;
    }
    reset() {
        this.current = 0;
    }

    /**
     * Calculate distance of Cartesian coordinates, and increment the total length of the line.
     * 
     * @param x X position of the start
     * @param y Y position of the start
     * @param x1 X position of the end
     * @param y1 Y position of the end
     * @returns true if the line is below the limit, false if the line is longer than the limit
     */
    add(start: CartesianCoords, end: CartesianCoords): boolean {
        const delta_x = end.X - start.X;
        const delta_y = end.Y - start.Y;

        this.current += Math.sqrt(Math.abs(delta_x * delta_x + delta_y * delta_y));
        return this.current <= this.limit;
    }
}