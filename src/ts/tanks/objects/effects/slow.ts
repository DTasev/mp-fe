import { IEffect } from "./iEffect";
import { Tank } from "../tank";
export class SlowEffect implements IEffect {
    duration: number = 1;
    before(tank: Tank) {
        tank.movementRange = Tank.DEFAULT_MOVEMENT_RANGE / 2;
        this.duration--;
    }
    after(tank: Tank) {
        tank.movementRange = Tank.DEFAULT_MOVEMENT_RANGE;
    }
}