import { Line } from "./line";

export class LineCache {
    lines: Line[];
    /** How many lines should be redrawn */
    size: number = 10;

    /** Remove lines that are outside of the cache size */
    active() {
        const size = this.lines.length;
        if (size > this.size) {
            return this.lines.slice(size - this.size, size);
        }
        return this.lines;
    }

    constructor() {
        this.lines = [];
    }
}