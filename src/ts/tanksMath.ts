import { CartesianCoords } from "./cartesianCoords";

class Point {
    /**
     * Calculate the distance between two points, on a 2D plane using Pythogorean Theorem
     * @param start First point with 2D coordinates
     * @param end Second point with 2D coordinates
     */
    dist2d(start: CartesianCoords, end: CartesianCoords): number {
        const delta_x = end.X - start.X;
        const delta_y = end.Y - start.Y;

        return Math.sqrt(Math.abs(delta_x * delta_x + delta_y * delta_y));
    }

    /**
     * Calculate if the point collides with the circle.
     * @param point The coordinates of the point (user's click)
     * @param object The coordinates of the object
     * @param radius The radius of the object
     * @returns true if there is collision, false otherwise
     */
    collide_circle(point: CartesianCoords, object: CartesianCoords, radius: number): boolean {
        const distance = this.dist2d(point, object);
        if (distance > radius) {
            return false;
        }
        return true;
    }
}

export class TanksMath {
    static point: Point = new Point();
}