import { CartesianCoords } from "../cartesian-coords";
import { GameState } from "../event-controller";

export class ActiveTank {
    id: number;
    position: CartesianCoords;
    valid_position: boolean = true;

    constructor(id: number, position: CartesianCoords) {
        this.id = id;
        this.position = position;
    }
}

export class TanksSharedState {
    active: ActiveTank;
    next: GameState;
}