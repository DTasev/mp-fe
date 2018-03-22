import { IGameObject } from "../gameObjects/iGameObject";
import { TankHealthState, Tank } from "../gameObjects/tank";
import { Line } from "./line";
import { TanksMath } from "./tanksMath";
import { Point } from "./point";
import { S } from "./stringFormat";
import { Obstacle } from "../gameMap/obstacle";

export class Collision {
    private static debugCollisionLine(start: Point, end: Point) {
        console.log(S.format("Collision versus line:\n%s,%s\n%s,%s", start.x, -start.y, end.x, -end.y));
    }
    private static debugShot(tank: IGameObject, distance: number) {
        console.log(S.format("Tank ID: %s\nPosition: (%s,%s)", tank.id, tank.position.x, -tank.position.y));
        console.log("Distance: ", distance);
    }
    static shooting(start: Point, end: Point, tanks: IGameObject[]): void {
        this.debugCollisionLine(start, end);
        // loop over all their tanks
        for (const tank of tanks) {
            // only do collision detection versus tanks that have not been already killed
            if (tank.healthState !== TankHealthState.DEAD) {
                // check each segment of the line for collision with the tank
                const dist = TanksMath.line.distCircleCenter(start, end, tank.position);

                this.debugShot(tank, dist);
                if (dist === -1) {
                    continue;
                }

                // if the line glances the tank, mark as disabled. DISABLED_ZONE gives some wiggle
                // room for the line, so that it doesn't have to be pixel perfect on the width line
                if (Tank.WIDTH - Tank.DISABLED_ZONE <= dist && dist <= Tank.WIDTH + Tank.DISABLED_ZONE) {
                    tank.healthState = TankHealthState.DISABLED;
                    console.log("Tank", tank.id, "disabled!");
                } // if the line passes through the tank, mark dead
                else if (dist < Tank.WIDTH) {
                    tank.healthState = TankHealthState.DEAD;
                    console.log("Tank", tank.id, "dead!");
                }
            }
        }
    }

    /**
     * Collide the tank with all points in the obstacle.
     * 
     * @param point Point that is not part of the obstacle, which is checked for collision with the obstacle
     * @param radius The radius around the point
     * @param obstacles 
     */
    static terrain(point: Point, radius: number, obstacles: Obstacle[]): boolean {
        // TODO filter out irrelevant obstacles
        for (const obstacle of obstacles) {
            // TODO filter out irrelevant points
            // find closest two points of obstacle to point
            const [left, right] = TanksMath.line.closestTwo(point, obstacle.center, obstacle.points);
            // if there is no closest line points, then the tank is inside the obstacle
            // if there is closest line points, the line will be collided against the circle
            if (!left || !right || TanksMath.line.collideCircle(left, right, point, radius)) {
                return true;
            }
        }
        return false;
    }
    static lineWithTerrain(start: Point, end: Point, obstacles: Obstacle[]): Point {
        for (const obstacle of obstacles) {
            // collides each segment of the shot line against the obstacle
            // if the shot line goes THROUGH the obstacle, then there will be a collision
            // if the shot line DOES NOT go through the obstacle, then there will be no collision
            const [left, right, intersection] = TanksMath.line.closestTwo(start, end, obstacle.points);
            if (left && right) {
                // the line goes through the obstacle
                // 2 is added to account for being the end of the shot line segment (which would be i + 1, or p2)
                // and another +1 is added for the slice with which the points are filtered later.
                return intersection;
            }
        }
        return null;
    }
}