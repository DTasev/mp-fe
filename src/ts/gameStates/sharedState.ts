import { CartesianCoords } from "../cartesianCoords";
import { GameState } from "../gameStateController";
import * as Limit from "../limiters/index";
import { IGameObject } from "../gameObjects/iGameObject";

export class ActiveTank {
    id: number;
    position: CartesianCoords;
    valid_position: boolean = false;
    tank: IGameObject;

    constructor(id: number, position: CartesianCoords, tank: IGameObject) {
        this.id = id;
        this.position = position;
        this.tank = tank;
    }
}

export class TanksSharedState {
    active: SingleAccess<ActiveTank>;
    next: SingleAccess<GameState>;
    turn: SingleAccess<Limit.Actions>;

    constructor() {
        this.active = new SingleAccess<ActiveTank>();
        this.next = new SingleAccess<GameState>();
        this.turn = new SingleAccess<Limit.Actions>();
    }
}

class SingleAccess<T> {
    private resource: T = null;
    private accessed: boolean = false;

    set(resource: T) {
        this.resource = resource;
        this.accessed = false;
    }
    available(): boolean {
        return !this.accessed && this.resource !== null;
    }
    get(): T {
        if (this.available()) {
            const x = this.resource;
            this.resource = null;
            return x;
        } else if (this.accessed) {
            throw new Error("This object has already been accessed.");
        } else if (this.resource === null) {
            throw new Error("The resource object has not been set.");
        } else {
            throw new Error("Unknown error with single access object");
        }
    }
}