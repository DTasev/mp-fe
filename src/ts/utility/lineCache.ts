import { Line } from "./line";

export class LineCache {
    points: Line[];
    /** How many lines should be redrawn */
    size: number = 10;

    /** Remove lines that are outside of the cache size */
    lines() {
        const size = this.points.length;
        if (size > this.size) {
            return this.points.slice(size - this.size, size);
        }
        return this.points;
    }

    constructor() {
        this.points = [];
    }
}