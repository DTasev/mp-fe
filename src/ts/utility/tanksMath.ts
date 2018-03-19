
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
     * Check if a line intersects the lines formed by every two poitns from the points list.
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
     */
    closestTwo(start: Point, end: Point, points: Point[]): [Point, Point] {
        // TODO this should be moved into an external function
        // This stores the filter function that will be used to filter the point list. 
        // This allows us to only once do the branching for the function selection
        // let filterFunction;

        // find out where the external point is in relation to the center
        // if the points are not exactly above/below each other
        // if (p.x !== center.x) {
        //     // then compare the x axis values
        //     if (p.x < center.x) {
        //         // the point is on the LEFT of the center
        //         filterFunction = (point: Point) => point.x <= center.x;
        //     } else {
        //         // the point is on the RIGHT of the center
        //         filterFunction = (point: Point) => center.x <= point.x;
        //     }
        // } else {
        //     // if the points are on the same X position, then compare the Y values
        //     // check if the point is above the center, i.e. y is larger
        //     if (p.y > center.y) {
        //         // the point is on the TOP of the center
        //         filterFunction = (point: Point) => center.y <= point.y;
        //     } else {
        //         // the point is on the BOTTOM of the center
        //         filterFunction = (point: Point) => point.y <= center.y;
        //     }
        // }

        // filter out ONLY the points that are between the center and the external point p
        // const relevantPoints = points.filter(filterFunction);
        const length = points.length;
        let p1: Point, p2: Point;

        for (let i = 0, j: number; i < length; i++) {
            // this condition will set j to 0 on the last indice, so that the
            // line from the last to the first point is also checked
            j = i == length - 1 ? 0 : i + 1;
            // find the which obstacle line is intersected by the 
            // line from the centre point to the external point
            p1 = points[i];
            p2 = points[j];
            // make sure that the line does NOT go through the center
            if (p1.x == p2.x && p1.x == end.x
                || p1.y == p2.y && p1.y == end.y) {
                continue;
            }
            if (TanksMath.line.intersect(end, start, p1, p2)) {
                return [p1, p2];
            }
        }

        return [null, null];
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
     * Checks if the two lines described by their start/end points intersect
     * @param start1 Start of the first line
     * @param end1 End of the first line
     * @param start2 Start of the second line
     * @param end2 End of the second line
     * @returns true if th lines intersect, false otherwise
     */
    intersect(start1: Point, end1: Point, start2: Point, end2: Point): boolean {
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
                const t = dx2 * dy3 - dx3 * dy2;
                if ((t <= 0 && det < 0 && t > det) || (t >= 0 && det > 0 && t < det)) {
                    return true;
                    // t = t / d;
                    // collisionDetected = 1;
                    // ix = p0x + t * dx1;
                    // iy = p0y + t * dy1;
                }
            }
        }
        return false;
    }

    // intersectPoint(start1: Point, end1: Point, start2: Point, end2: Point): Point {
    //     // https://stackoverflow.com/a/35457290/2823526
    //     const dx1 = end1.x - start1.x;
    //     const dy1 = end1.y - start1.y;
    //     const dx2 = end2.x - start2.x;
    //     const dy2 = end2.y - start2.y;
    //     const dx3 = start1.x - start2.x;
    //     const dy3 = start1.y - start2.y;
    //     const det = dx1 * dy2 - dx2 * dy1;

    //     if (det !== 0) {
    //         const s = dx1 * dy3 - dx3 * dy1;
    //         if ((s <= 0 && det < 0 && s >= det) || (s >= 0 && det > 0 && s <= det)) {
    //             let t = dx2 * dy3 - dx3 * dy2;
    //             if ((t <= 0 && det < 0 && t > det) || (t >= 0 && det > 0 && t < det)) {
    //                 t = t / det;
    //                 return new Point(start1.x + t * dx1, start1.y + t * dy1);
    //             }
    //         }
    //     }
    //     return null;
    // }
    // intersect(start1: Point, end1: Point, start2: Point, end2: Point): boolean {
    //     // http://ericleong.me/research/circle-line/
    //     const A1 = end1.y - start1.y,
    //         B1 = start1.x - end1.x,
    //         C1 = A1 * start1.x + B1 * start1.y,
    //         A2 = end2.y - start2.y,
    //         B2 = start2.x - end2.x,
    //         C2 = A2 * start2.x + B2 * start2.y,
    //         det = A1 * B2 - A2 * B1;

    //     if (det != 0) {
    //         const x = (B2 * C1 - B1 * C2) / det;
    //         if (x >= Math.min(start1.x, end1.x) && x <= Math.max(start1.x, end1.x)
    //             && x >= Math.min(start2.x, end2.x) && x <= Math.max(start2.x, end2.x)) {
    //             const y = (A1 * C2 - A2 * C1) / det;
    //             if (y >= Math.min(start1.y, end1.y) && y <= Math.max(start1.y, end1.y)
    //                 && y >= Math.min(start2.y, end2.y) && y <= Math.max(start2.y, end2.y)) {
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }
}

export class TanksMath {
    static point: PointMath = new PointMath();
    static line: LineMath = new LineMath();
}