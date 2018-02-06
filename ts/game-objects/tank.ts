import { Player } from "./player";
import { CartesianCoords } from "../cartesian-coords";

export class Tank {
    health: number;
    player: Player;
    position: CartesianCoords;
    width: number;

    constructor(x: number, y: number, width: number) {
        this.position = new CartesianCoords(x, y);
        this.width = width;
    }
}