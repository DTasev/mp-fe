import { CartesianCoords } from "../utility/cartesianCoords";
import { TanksMath } from "../utility/tanksMath";
export class Length {
    private limit: number;
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
     * @param start Start coordinates
     * @param end End coordinates
     * @returns true if the line is below the limit, false if the line is longer than the limit
     */
    add(start: CartesianCoords, end: CartesianCoords): boolean {
        this.current += TanksMath.point.dist2d(start, end);
        console.log("Shot total distance: ", this.current);
        return this.current <= this.limit;
    }

    /**
     * Check if the distance between the two points is greater than the limit.
     * 
     * @param start Start coordinates
     * @param end End coordinates
     * @returns true if the line is below the limit, false otherwise
     */
    in(start: CartesianCoords, end: CartesianCoords): boolean {
        const distance = TanksMath.point.dist2d(start, end);
        return distance <= this.limit;
    }
}