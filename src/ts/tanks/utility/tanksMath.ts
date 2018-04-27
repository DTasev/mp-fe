import { Point } from "./point";

class PointMath {
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
     * 
     * Source: https://stackoverflow.com/a/328110/2823526
     * @param point Cooridnates of a point
     * @param start Start coordinates of a line
     * @param end End coordinates of a line
     */
    within(point: Point, start: Point, end: Point): boolean {
        // as the point is guaranteed to be on the line by Line::closestPoint, we just check if the point is within the line
        const within = (start: number, point: number, end: number) => (start <= point && point <= end) || (end <= point && point <= start);
        return start.x !== end.x ? within(start.x, point.x, end.x) : within(start.y, point.y, end.y);
    }

}

class LineMath {

    /** 
     * Find the closest point on a line.
     * 
     * Source: http://ericleong.me/research/circle-line/
     * 
     * @param start Start point of the line
     * @param end End point of the line
     * @param point Point for which the closest point on the line will be found.
     */
    closestPoint(start: Point, end: Point, point: Point): Point {
        const A1 = end.y - start.y,
            B1 = start.x - end.x;

        // turn the line into equation of the form Ax + By = C
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
     * Check if a line intersects the lines formed by every two points from the points list.
     * This is used to check if a tank intersects an obstacle during placement and movement.
     * 
     * The approach is to collide the line from the center of the obstacle to the tank, against each 
     * line formed by every two points of the obstacle. If that line collides with ANY of the lines 
     * formed by the points, then the tank is outside of the obstacle. 
     * The line that has collided is also the closest line to the tank.
     * 
     * If no line collides with the line from the center of obstacle to the tank, then the tank is 
     * inside the obstacle. In this case this function returns [null, null]
     * 
     * @param start Start point of line 
     * @param end End point of line
     * @param points List of points that form a convex shape
     * @returns First Point is the left closest, second Point is the right closest, third Point is the intersection point
     */
    closestTwo(start: Point, end: Point, points: Point[]): [Point, Point, Point] {
        const length = points.length;
        let p1: Point, p2: Point;

        for (let i = 0, j: number; i < length; i++) {
            // this condition will set j to 0 on the last indice, so that the
            // line from the last to the first point is also checked
            j = i === length - 1 ? 0 : i + 1;
            // find the which obstacle line is intersected by the 
            // line from the centre point to the external point
            p1 = points[i];
            p2 = points[j];
            // make sure that the line does NOT go through the center
            if (p1.x === p2.x && p1.x === end.x
                || p1.y === p2.y && p1.y === end.y) {
                continue;
            }
            const intersection = TanksMath.line.intersectPoint(end, start, p1, p2)
            if (intersection) {
                return [p1, p2, intersection];
            }
        }

        return [null, null, null];
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
     * @returns true if the circle is colliding with the line, false otherwise
     */
    collideCircle(start: Point, end: Point, center: Point, radius: number): boolean {
        const dist = this.distCircleCenter(start, end, center);
        // if distance is -1, or is further than the radius, return false
        return dist === -1 || dist > radius ? false : true;
    }

    /**
     * Checks if the two lines described by their start/end points intersect.
     * 
     * Original source: https://stackoverflow.com/a/35457290/2823526
     * 
     * Modified to remove the usage of globals and to use the Tanks Point interface.
     * 
     * @param start1 Start of the first line
     * @param end1 End of the first line
     * @param start2 Start of the second line
     * @param end2 End of the second line
     * @returns true if th lines intersect, false otherwise
     */
    intersect(start1: Point, end1: Point, start2: Point, end2: Point): boolean {
        const dx1 = end1.x - start1.x;
        const dy1 = end1.y - start1.y;
        const dx2 = end2.x - start2.x;
        const dy2 = end2.y - start2.y;
        const dx3 = start1.x - start2.x;
        const dy3 = start1.y - start2.y;
        const det = dx1 * dy2 - dx2 * dy1;

        if (det !== 0) {
            const s = dx1 * dy3 - dx3 * dy1;
            if ((s <= 0 && det < 0 && s >= det) || (s >= 0 && det > 0 && s <= det)) {
                const t = dx2 * dy3 - dx3 * dy2;
                if ((t <= 0 && det < 0 && t > det) || (t >= 0 && det > 0 && t < det)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Checks if the two lines described by their start/end points intersect
     * 
     * Original source: https://stackoverflow.com/a/35457290/2823526
     * 
     * Modified to remove the usage of globals and to use the Tanks Point interface.
     * 
     * @param start1 Start of the first line
     * @param end1 End of the first line
     * @param start2 Start of the second line
     * @param end2 End of the second line
     * @returns intersection point, if present, otherwise null
     */
    intersectPoint(start1: Point, end1: Point, start2: Point, end2: Point): Point {
        // https://stackoverflow.com/a/35457290/2823526
        const dx1 = end1.x - start1.x;
        const dy1 = end1.y - start1.y;
        const dx2 = end2.x - start2.x;
        const dy2 = end2.y - start2.y;
        const dx3 = start1.x - start2.x;
        const dy3 = start1.y - start2.y;
        const det = dx1 * dy2 - dx2 * dy1;
        if (det !== 0) {
            const s = dx1 * dy3 - dx3 * dy1;
            if ((s <= 0 && det < 0 && s >= det) || (s >= 0 && det > 0 && s <= det)) {
                let t = dx2 * dy3 - dx3 * dy2;
                if ((t <= 0 && det < 0 && t > det) || (t >= 0 && det > 0 && t < det)) {
                    t = t / det;
                    return new Point(start1.x + t * dx1, start1.y + t * dy1);
                }
            }
        }
        return null;
    }
}

export class TanksMath {
    static point: PointMath = new PointMath();
    static line: LineMath = new LineMath();
}