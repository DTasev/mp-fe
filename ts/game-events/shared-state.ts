import { CartesianCoords } from "../cartesian-coords";
import { GameState } from "../event-controller";

export class ActiveTank {
    id: number;
    position: CartesianCoords;
    valid_position: boolean = false;

    constructor(id: number, position: CartesianCoords) {
        this.id = id;
        this.position = position;
    }
}

export class TanksSharedState {
    active: SingleAccess<ActiveTank>;
    next: SingleAccess<GameState>;
    constructor() {
        this.active = new SingleAccess<ActiveTank>();
        this.next = new SingleAccess<GameState>();
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
        if (!this.accessed) {
            const x = this.resource;
            this.resource = null;
            return x;
        } else {
            throw new Error("This single access object has already been accessed.");
        }
    }
}