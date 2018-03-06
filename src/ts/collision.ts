import { IGameObject } from "./gameObjects/iGameObject";
import { TankHealthState, Tank } from "./gameObjects/tank";
import { Line } from "./utility/line";
import { TanksMath } from "./utility/tanksMath";
import { Point } from "./utility/point";
import { S } from "./utility/stringFormat";

export class Collision {
    static debugShot(line: Line, start: Point, end: Point, tank: IGameObject, distance: number) {
        for (const segment of line.points) {
            console.log(S.format("%s,%s", segment.x, -segment.y));

        }

        console.log(S.format("Collision versus line:\n%s,%s\n%s,%s", start.x, -start.y, end.x, -end.y));
        console.log(S.format("Tank ID: %s\nPosition: (%s,%s)", tank.id, tank.position.x, -tank.position.y));
        console.log("Distance: ", distance);
    }
    static collide(line: Line, numPoints: number, tanks: IGameObject[]) {
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

                    // if the line glances the tank, mark as disabled
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
}