import { Obstacle, ObstacleType } from "../gameMap/obstacle";
import { Tank, TankHealthState } from "../objects/tank";
import { Point } from "./point";
import { TanksMath } from "./tanksMath";
import { Settings } from "../settings";

export class Collision {
    private static debugCollisionLine(start: Point, end: Point) {
        if (Settings.DEBUG) {
            console.log(`Collision versus line:\n${start.x},${-start.y}\n${end.x},${-end.y}`);
        }
    }
    private static debugShot(tank: Tank, distance: number) {
        if (Settings.DEBUG) {
            console.log(`Tank ID: ${tank.id}\nPosition: (${tank.position.x},${-tank.position.y})`);
            console.log("Distance: ", distance);
        }
    }
    static shooting(start: Point, end: Point, tanks: Tank[]): [number, number] {
        let tanksDisabled = 0;
        let tanksKilled = 0;
        this.debugCollisionLine(start, end);
        // loop over all their tanks
        for (const tank of tanks) {
            // handles friendly fire case, where the start of the shot is the tank's position
            if (start.equals(tank.position)) {
                continue;
            }
            // only do collision detection versus tanks that have not been already killed
            if (tank.healthState !== TankHealthState.DEAD) {
                // check each segment of the line for collision with the tank
                const dist = TanksMath.line.distCircleCenter(start, end, tank.position);

                this.debugShot(tank, dist);
                // the shot is not near the tank at all
                if (dist === -1) {
                    continue;
                }

                // if the line glances the tank, mark as disabled. DISABLED_ZONE gives some wiggle
                // room for the line, so that it doesn't have to be pixel perfect on the width line
                if (Tank.WIDTH - Tank.DISABLED_ZONE <= dist && dist <= Tank.WIDTH + Tank.DISABLED_ZONE) {
                    tank.healthState = TankHealthState.DISABLED;
                    console.log("Tank", tank.id, "disabled!");
                    tanksDisabled += 1;
                } // if the line passes through the tank, mark dead
                else if (dist < Tank.WIDTH) {
                    tank.die();
                    console.log("Tank", tank.id, "dead!");
                    tanksKilled += 1;
                }
            }
        }
        return [tanksDisabled, tanksKilled];
    }

    /**
     * Collide the tank with all points in the obstacle.
     * 
     * @param point Point that is not part of the obstacle, which is checked for collision with the obstacle
     * @param radius The radius around the point
     * @param obstacles 
     */
    static terrain(point: Point, radius: number, obstacles: Obstacle[]): Obstacle {
        for (const obstacle of obstacles) {
            // find closest two points of obstacle to point
            const [left, right, intersection] = TanksMath.line.closestTwo(point, obstacle.center, obstacle.points);
            // if there is no closest line points, then the tank is inside the obstacle
            // if there is closest line points, the line will be collided against the circle
            if (!left || !right || TanksMath.line.collideCircle(left, right, point, radius)) {
                return obstacle;
            }
        }
        return null;
    }
    static lineWithTerrain(start: Point, end: Point, obstacles: Obstacle[]): [Point, Obstacle] {
        for (const obstacle of obstacles) {
            // shots do NOT collide with water
            if (obstacle.type !== ObstacleType.WATER) {
                // collides each segment of the shot line against the obstacle
                // if the shot line goes THROUGH the obstacle, then there will be a collision
                // if the shot line DOES NOT go through the obstacle, then there will be no collision
                const [left, right, intersection] = TanksMath.line.closestTwo(start, end, obstacle.points);
                if (left && right) {
                    // if the obstacle is wood, then don't immediatelly stop the shot, but continue to the end of the line
                    // the line goes through the obstacle
                    // 2 is added to account for being the end of the shot line segment (which would be i + 1, or p2)
                    // and another +1 is added for the slice with which the points are filtered later.
                    return [intersection, obstacle];
                }
            }
        }
        return [null, null];
    }
}