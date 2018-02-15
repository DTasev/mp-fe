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
     * @param center The centre of the circle
     * @param radius The radius of the circle
     * @returns true if there is collision, false otherwise
     */
    collide_circle(point: CartesianCoords, center: CartesianCoords, radius: number): boolean {
        const distance = this.dist2d(point, center);
        if (distance > radius) {
            return false;
        }
        return true;
    }
    /**
     * Check if the point is within the start and end of the line
     * @param point Cooridnates of a point
     * @param start Start coordinates of a line
     * @param end End coordinates of a line
     */
    within(point: CartesianCoords, start: CartesianCoords, end: CartesianCoords): boolean {
        // Initial implementation: https://stackoverflow.com/a/328122/2823526
        // Optimisation and correction: https://stackoverflow.com/a/328110/2823526

        // as the point is guaranteed to be on the line by Line::closest_point, we just check if the point is within the line
        const within = (start: number, point: number, end: number) => (start <= point && point <= end) || (end <= point && point <= start);
        return start.X !== end.X ? within(start.X, point.X, end.X) : within(start.Y, point.Y, end.Y);
    }

}

class Line {

    /** Find the closest point on a line. The closest point to 
     * 
     * @param start Start point of the line
     * @param end End point of the line
     * @param point Point for which the closest point on the line will be found.
     */
    closest_point(start: CartesianCoords, end: CartesianCoords, point: CartesianCoords): CartesianCoords {
        const A1 = end.Y - start.Y,
            B1 = start.X - end.X;

        // turn the line ito equation of the form Ax + By = C
        const C1 = A1 * start.X + B1 * start.Y;
        // find the perpendicular line that passes through the line and the outside point
        const C2 = -B1 * point.X + A1 * point.Y;

        // find the determinant of the two equations algebraically
        const det = A1 * A1 + B1 * B1;
        const closest_point: CartesianCoords = new CartesianCoords();
        // use Cramer's Rule to solve for the point of intersection
        if (det != 0) {
            closest_point.X = (A1 * C1 - B1 * C2) / det;
            closest_point.Y = (A1 * C2 + B1 * C1) / det;
        } else { // the point is on the line already
            closest_point.X = point.X;
            closest_point.Y = point.Y;
        }

        return closest_point;
    }

    /** 
     * Return the distance from the line to the circle. 
     * This is done by finding the length of the perpendicular line that passes through the line and circle's center
     * 
     * @param start Start coordinates of the line
     * @param end End coordinates of the line
     * @param center Center of the circle
     * @param radius Radius of the circle
     * @returns If the circle's center is within the line, then the distance between them will be returned, 
     *          if the circle's center is not within the line, -1 will be returned
     */
    circle_dist(start: CartesianCoords, end: CartesianCoords, center: CartesianCoords, radius: number): number {
        // find the closest point to the circle, on the line
        const closest_point = this.closest_point(start, end, center);

        // check if the closest point is within the start and end of the line, 
        // and not somewhere along its infinite extension
        if (TanksMath.point.within(closest_point, start, end)) {
            return TanksMath.point.dist2d(closest_point, center);
        }
        return -1;
    }

    /**
     * Check if the circle is colliding with the line
     * @param start Start coordinates of the line
     * @param end End coordinates of the line
     * @param center Center point of the circle
     * @param radius Radius of the circle
     */
    collide_circle(start: CartesianCoords, end: CartesianCoords, center: CartesianCoords, radius: number): boolean {
        const dist = this.circle_dist(start, end, center, radius);
        return dist === -1 || dist > radius ? false : true;
    }
}

export class TanksMath {
    static point: Point = new Point();
    static line: Line = new Line();
}