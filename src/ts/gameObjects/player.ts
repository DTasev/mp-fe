import { Tank, TankHealthState, TankTurnState } from "./tank";
import { IGameObject } from "./iGameObject";
import { Color } from "../drawing/color";
import * as Limit from '../limiters/index'
import { SingleAccess } from "../utility/singleAccess";
import { Point } from "../utility/point";


export class Player {
    readonly id: number;
    readonly name: string;

    readonly tanks: IGameObject[];
    readonly color: Color;

    /** Keeps track of how many of the player's tanks have already shot */
    tanksShot: SingleAccess<Limit.Actions>;
    activeTank: SingleAccess<IGameObject>
    viewportPosition: Point;

    constructor(id: number, name: string, color: Color) {
        this.id = id;
        this.name = name;
        this.tanks = new Array<IGameObject>();
        this.color = color;
        this.tanksShot = new SingleAccess();
        this.activeTank = new SingleAccess();
        this.viewportPosition = new Point(0, 0);
    }

    activeTanks(): IGameObject[] {
        return this.tanks.filter((tank) => tank.healthState !== TankHealthState.DEAD);
    }
    resetTanksActStates(): any {
        for (const tank of this.tanks) {
            tank.actionState = TankTurnState.NOT_ACTED;
        }
    }
    setViewportPosition(viewportPosition: Point): void {
        this.viewportPosition = viewportPosition;
    }
}