import { LinePath } from "./linePath";
import { Color } from "./drawing/color";

export class LineCache {
    points: LinePath[];
    color: string = Color.gray().toRGBA();
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