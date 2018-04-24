import { Line } from "./line";
import { Settings } from "../settings";

export class LineCache {
    lines: Line[];
    /** How many lines should be redrawn */
    size: number = Settings.SHOT_CACHE_SIZE;

    /** Remove lines that are outside of the cache size */
    active() {
        const size = this.lines.length;
        if (size > this.size) {
            return this.lines.slice(size - this.size, size);
        }
        return this.lines;
    }

    constructor(lines: Line[] = []) {
        this.lines = lines;
    }
}