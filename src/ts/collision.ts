import { IGameObject } from "./gameObjects/iGameObject";
import { TankHealthState, Tank } from "./gameObjects/tank";
import { Line } from "./utility/line";
import { TanksMath } from "./utility/tanksMath";
import { Point } from "./utility/point";
import { S } from "./utility/stringFormat";
import { Obstacle } from "./gameMap/obstacle";

export class Collision {
    static debugShot(line: Line, start: Point, end: Point, tank: IGameObject, distance: number) {
        for (const segment of line.points) {
            console.log(S.format("%s,%s", segment.x, -segment.y));

        }

        console.log(S.format("Collision versus line:\n%s,%s\n%s,%s", start.x, -start.y, end.x, -end.y));
        console.log(S.format("Tank ID: %s\nPosition: (%s,%s)", tank.id, tank.position.x, -tank.position.y));
        console.log("Distance: ", distance);
    }
    static shooting(line: Line, numPoints: number, tanks: IGameObject[]): void {
        // loop over all their tanks
        for (const tank of tanks) {
            // only do collision detection versus tanks that have not been already killed
            if (tank.healthState !== TankHealthState.DEAD) {
                // check each segment of the line for collision with the tank
                for (let i = 1; i < numPoints; i++) {
                    const start = line.points[i - 1];
                    const end = line.points[i];
                    const dist = TanksMath.line.distCircleCenter(start, end, tank.position);

                    this.debugShot(line, start, end, tank, dist);
                    if (dist === -1) {
                        continue;
                    }
                    console.log("Shot hit the tank.");

                    // if the line glances the tank, mark as disabled. DISABLED_ZONE gives some wiggle
                    // room for the line, so that it doesn't have to be pixel perfect on the width line
                    if (Tank.WIDTH - Tank.DISABLED_ZONE <= dist && dist <= Tank.WIDTH + Tank.DISABLED_ZONE) {
                        tank.healthState = TankHealthState.DISABLED;
                        console.log("Tank", tank.id, "disabled!");
                        // stop checking collision for this tank, and go on the next one
                        break;
                    } // if the line passes through the tank, mark dead
                    else if (dist < Tank.WIDTH) {
                        tank.healthState = TankHealthState.DEAD;
                        console.log("Tank", tank.id, "dead!");
                        // stop checking collision for this tank, and go on the next one
                        break;
                    }
                }
            }
        }
    }

    static terrain(point: Point, radius: number, obstacles: Obstacle[]): boolean {
        for (const obstacle of obstacles) {
            // find closest two points of obstacle to point
            const [left, right] = TanksMath.point.closestTwo(point, obstacle.points);
            // calculate D (distance) from obstacle.center to point
            // TODO optimise to account for the circle's radius, this might eliminate the need
            // for the else branch that does line collision
            const distToPoint = TanksMath.point.dist(obstacle.center, point);
            // calculate D from obstacle.center to the two end points
            // if the distance is smaller, then the circle's center is inside the obstacle, thus it is colliding
            if (distToPoint < TanksMath.point.dist(obstacle.center, left) ||
                distToPoint < TanksMath.point.dist(obstacle.center, right)) {
                return true;
            } else {
                // the center circle is outside the obstacle, but check if its radius collides
                // TODO this check might be removed if we account for the radius when calculating the distance
            }
        }
        return false;
    }
}