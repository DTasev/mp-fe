import { Point } from "./point";

class PointMath {
    closestTwo(p: Point, c: Point, points: Point[]): [Point, Point] {
        let dist: number,
            minDistance1 = Number.MAX_SAFE_INTEGER, minDistance2 = Number.MAX_SAFE_INTEGER,
            closestPoint1: Point = null, closestPoint2: Point = null,
            assigningPointOne = true,
            minIndex1: number, minIndex2: number;

        // find out where the external point is in relation to the center
        let filterFunction;
        // if the points are not exactly above/below each other
        if (p.x !== c.x) {
            // then compare the x axis values
            if (p.x < c.x) {
                // the point is on the LEFT of the center
                filterFunction = (point: Point) => point.x <= c.x;
            } else {
                // the point is on the RIGHT of the center
                filterFunction = (point: Point) => c.x <= point.x;
            }
        } else {
            // if the points are on the same X position, then compare the Y values
            // check if the point is above the center, i.e. y is larger
            if (p.y > c.y) {
                // the point is on the TOP of the center
                filterFunction = (point: Point) => c.y <= point.y;
            } else {
                // the point is on the BOTTOM of the center
                filterFunction = (point: Point) => point.y <= c.y;
            }
        }
        // filter out ONLY the points that are between the center and the external point p
        const relevantPoints = points.filter(filterFunction);

        for (const [i, point] of relevantPoints.entries()) {
            // find the two smallest differences
            dist = this.dist(p, point);
            if (dist <= minDistance1) {
                if (closestPoint1 && minDistance1 < minDistance2) {
                    closestPoint2 = closestPoint1;
                    minDistance2 = minDistance1;
                }
                minDistance1 = dist;
                closestPoint1 = point;
                minIndex1 = i;
                continue;
            }
            if (dist <= minDistance2) {
                minDistance2 = dist;
                closestPoint2 = point;
                minIndex2 = i;
            }
        }

        return [closestPoint1, closestPoint2];
    }
    /**
     * Calculate the distance between two points, on a 2D plane using Pythogorean Theorem
     * @param start First point with 2D coordinates
     * @param end Second point with 2D coordinates
     */
    dist(start: Point, end: Point): number {
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
        const distance = this.dist(point, center);
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

class LineMath {

    /** 
     * Find the closest point on a line.
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
            return TanksMath.point.dist(closestPoint, center);
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
    collide(start1: Point, end1: Point, start2: Point, end2: Point): boolean {
        // http://ericleong.me/research/circle-line/
        const A1 = end1.x - start1.y,
            B1 = start1.x - start1.y,
            C1 = A1 * start1.x + B1 * start1.y,
            A2 = end2.x - start2.y,
            B2 = start2.x - start2.y,
            C2 = A2 * start2.x + B2 * start2.y,
            det = A1 * B2 - A2 * B1;

        if (det != 0) {
            const x = (B2 * C1 - B1 * C2) / det,
                y = (A1 * C2 - A2 * C1) / det;
            if (x >= Math.min(start1.x, end1.x) && x <= Math.max(start1.x, end1.x)
                && x >= Math.min(start2.x, end2.x) && x <= Math.max(start2.x, end2.x)
                && y >= Math.min(start1.y, end1.y) && y <= Math.max(start1.y, end1.y)
                && y >= Math.min(start2.y, end2.y) && y <= Math.max(start2.y, end2.y)) {
                return true;
            }
        }
        return false;
    }
}

export class TanksMath {
    static point: PointMath = new PointMath();
    static line: LineMath = new LineMath();
}