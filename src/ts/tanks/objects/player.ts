import { Color } from "../drawing/color";
import * as Limit from '../limiters/index';
import { Point } from "../utility/point";
import { SingleAccess } from "../utility/singleAccess";
import { Tank, TankHealthState, TankActState } from "./tank";
import { Statistics } from "../stats";


export class Player {
    readonly id: number;
    readonly name: string;

    readonly tanks: Tank[];
    readonly color: Color;
    readonly stats: Statistics;

    /** Keeps track of how many of the player's tanks have already shot */
    tanksShot: SingleAccess<Limit.Actions>;
    activeTank: SingleAccess<Tank>
    viewportPosition: Point;

    constructor(id: number, name: string, color: Color) {
        this.id = id;
        this.name = name;
        this.tanks = new Array<Tank>();
        this.color = color;
        this.stats = new Statistics();
        this.tanksShot = new SingleAccess();
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
        this.tanksShot.clear();
        for (const tank of this.tanks) {
            tank.actionState = TankActState.NOT_ACTED;
        }
    }
    setViewportPosition(viewportPosition: Point): void {
        this.viewportPosition = viewportPosition;
    }
    static premadePlayer(): Player {
        return new Player(0, "Test", Color.red());
    }
}