import { Point } from "../utility/point";
import { TanksMath } from "../utility/tanksMath";
export class Speed {
    private limit: number;

    /**
     * Calcualtes and keeps track of the total length of a line.
     * 
     * @param limit Maximum length of each line, in canvas pixels
     */
    constructor(limit: number = 20) {
        this.limit = limit;
    }

    /**
     * Check if the distance between the two points is greater than the limit.
     * 
     * @param start Start coordinates
     * @param end End coordinates
     * @returns true if the distance is greater than the limit, false otherwise
     */
    enough(start: Point, end: Point): boolean {
        const distance = TanksMath.point.dist(start, end);
        return distance >= this.limit;
    }
}