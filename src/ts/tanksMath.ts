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
}

class Line {
    /** Find the closest point on a line. The closest point to 
     * 
     * @param start Start point of the line
     * @param end End point of the line
     * @param point Point for which the closest point on the line will be found.
     */
    closest_point(start: CartesianCoords, end: CartesianCoords, point: CartesianCoords): CartesianCoords {
        // turn the line ito equation of the form Ax + By = C
        const A1 = end.Y - start.Y,
            B1 = start.X - end.X;

        // find the perpendicular lines to the initial line segment
        const C1 = A1 * start.X + B1 * start.Y,
            C2 = -B1 * point.X + A1 * point.Y;

        // use Cramer's Rule to solve for the point of intersection
        const det = A1 * A1 + B1 * B1;
        const closest_point: CartesianCoords = new CartesianCoords();
        if (det != 0) {
            closest_point.X = (A1 * C1 - B1 * C2) / det;
            closest_point.Y = (A1 * C2 + B1 * C1) / det;
        } else { // the point is on the line already
            closest_point.X = point.X;
            closest_point.Y = point.Y;
        }

        return closest_point;
    }
    collide_circle(start: CartesianCoords, end: CartesianCoords, center: CartesianCoords, radius: number): boolean {
        const closest_point = this.closest_point(start, end, center);

        return TanksMath.point.collide_circle(closest_point, center, radius);
    }
}

export class TanksMath {
    static point: Point = new Point();
    static line: Line = new Line();
}