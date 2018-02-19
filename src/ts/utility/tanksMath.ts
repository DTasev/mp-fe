import { Point } from "./point";

class PointMath {
    /**
     * Calculate the distance between two points, on a 2D plane using Pythogorean Theorem
     * @param start First point with 2D coordinates
     * @param end Second point with 2D coordinates
     */
    dist2d(start: Point, end: Point): number {
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;

        return Math.sqrt(Math.abs(deltaX * deltaX + deltaY * deltaY));
    }

    /**
     * Calculate if the point collides with the circle.
     * @param point The coordinates of the point (user's click)
     * @param center The centre of the circle
     * @param radius The radius of the circle
     * @returns true if there is collision, false otherwise
     */
    collideCircle(point: Point, center: Point, radius: number): boolean {
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
    within(point: Point, start: Point, end: Point): boolean {
        // Initial implementation: https://stackoverflow.com/a/328122/2823526
        // Optimisation and correction: https://stackoverflow.com/a/328110/2823526

        // as the point is guaranteed to be on the line by Line::closestPoint, we just check if the point is within the line
        const within = (start: number, point: number, end: number) => (start <= point && point <= end) || (end <= point && point <= start);
        return start.x !== end.x ? within(start.x, point.x, end.x) : within(start.y, point.y, end.y);
    }

}

class Line {

    /** Find the closest point on a line. The closest point to 
     * 
     * @param start Start point of the line
     * @param end End point of the line
     * @param point Point for which the closest point on the line will be found.
     */
    closestPoint(start: Point, end: Point, point: Point): Point {
        const A1 = end.y - start.y,
            B1 = start.x - end.x;

        // turn the line ito equation of the form Ax + By = C
        const C1 = A1 * start.x + B1 * start.y;
        // find the perpendicular line that passes through the line and the outside point
        const C2 = -B1 * point.x + A1 * point.y;

        // find the determinant of the two equations algebraically
        const det = A1 * A1 + B1 * B1;
        const closestPoint: Point = new Point();
        // use Cramer's Rule to solve for the point of intersection
        if (det != 0) {
            closestPoint.x = (A1 * C1 - B1 * C2) / det;
            closestPoint.y = (A1 * C2 + B1 * C1) / det;
        } else { // the point is on the line already
            closestPoint.x = point.x;
            closestPoint.y = point.y;
        }

        return closestPoint;
    }

    /** 
     * Return the distance from the line to the center of the circle. 
     * This is done by finding the length of the perpendicular line that passes through the line and circle's center
     * 
     * @param start Start coordinates of the line
     * @param end End coordinates of the line
     * @param center Center of the circle
     * @returns If the circle's center is within the line, then the distance between them will be returned, 
     *          if the circle's center is not within the line, -1 will be returned
     */
    distCircleCenter(start: Point, end: Point, center: Point): number {
        // find the closest point to the circle, on the line
        const closestPoint = this.closestPoint(start, end, center);

        // check if the closest point is within the start and end of the line, 
        // and not somewhere along its infinite extension
        if (TanksMath.point.within(closestPoint, start, end)) {
            return TanksMath.point.dist2d(closestPoint, center);
        } else {
            return -1;
        }
    }

    /**
     * Check if the circle is colliding with the line
     * @param start Start coordinates of the line
     * @param end End coordinates of the line
     * @param center Center point of the circle
     * @param radius Radius of the circle
     */
    collideCircle(start: Point, end: Point, center: Point, radius: number): boolean {
        const dist = this.distCircleCenter(start, end, center);
        // if distance is undefined, or is further than the radius, return false
        return dist === -1 || dist > radius ? false : true;
    }
}

export class TanksMath {
    static point: PointMath = new PointMath();
    static line: Line = new Line();
}