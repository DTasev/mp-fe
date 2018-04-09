import { Tank } from "../tank";
import { IEffect } from "./iEffect";

export class SlowEffect implements IEffect {
    duration;
    constructor(duration = 1) {
        this.duration = duration;
    }
    before(tank: Tank) {
        tank.movementRange = Tank.DEFAULT_MOVEMENT_RANGE / 2;
        this.duration--;
    }
    after(tank: Tank) {
        tank.movementRange = Tank.DEFAULT_MOVEMENT_RANGE;
    }
}