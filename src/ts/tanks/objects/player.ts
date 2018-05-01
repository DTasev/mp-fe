import { Color } from "../drawing/color";
import * as Limit from '../limiters/index';
import { Point } from "../utility/point";
import { SingleAccess } from "../utility/singleAccess";
import { Tank, TankHealthState, TankActState } from "./tank";
import { Statistics } from "../stats";
import { ShootingStatistics } from "../states/shooting";


export class Player {
    readonly id: number;
    readonly name: string;

    readonly tanks: Tank[];
    readonly color: Color;
    readonly stats: Statistics;

    activeTank: SingleAccess<Tank>
    viewportPosition: Point;

    constructor(id: number, name: string, color: Color) {
        this.id = id;
        this.name = name;
        this.tanks = new Array<Tank>();
        this.color = color;
        this.stats = new Statistics();
        this.activeTank = new SingleAccess();
        this.viewportPosition = new Point(0, 0);
    }

    /**
     * @returns Tanks that are NOT DEAD and have NOT SHOT this turn
     */
    activeTanks(): Tank[] {
        return this.tanks.filter((tank) => tank.actionState !== TankActState.SHOT && tank.healthState !== TankHealthState.DEAD);
    }
    /**
     * @returns Tanks that are NOT DEAD
     */
    aliveTanks(): Tank[] {
        return this.tanks.filter((tank) => tank.healthState !== TankHealthState.DEAD);
    }
    resetTanksActStates(): any {
        // clears the limiter for how many tanks have shot
        for (const tank of this.tanks) {
            tank.actionState = TankActState.NOT_ACTED;
        }
    }
    setViewportPosition(viewportPosition: Point): void {
        this.viewportPosition = viewportPosition;
    }

    addStatistics(shotStats: ShootingStatistics): void {
        this.stats.tanksKilled += shotStats.tanksKilled;
        this.stats.tanksDisabled += shotStats.tanksDisabled;
    }

    static premadePlayer(): Player {
        const p = new Player(0, "Test", Color.red())
        p.tanks.push(Tank.premadeTank(0, 0, p));
        p.activeTank.set(p.tanks[0]);
        return p;
    }
}