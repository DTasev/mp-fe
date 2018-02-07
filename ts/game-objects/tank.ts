import { Player } from "./player";
import { CartesianCoords } from "../cartesian-coords";
import { Draw } from "../draw";
import { IGameObject } from './igame-object'

export class Tank implements IGameObject {
    static DEFAULT_WIDTH = 12;
    static DEFAULT_MOVEMENT_RANGE = 100;
    static DEFAULT_MOVEMENT_LINE_WIDTH = 3;

    health: number;
    player: Player;
    position: CartesianCoords;

    constructor(x: number, y: number) {
        this.position = new CartesianCoords(x, y);
    }

    draw(context: CanvasRenderingContext2D, draw: Draw): any {
        draw.dot(context, this.position, Tank.DEFAULT_WIDTH);
    }
    highlight(context: CanvasRenderingContext2D, draw: Draw): any {
        draw.dot(context, this.position, Tank.DEFAULT_WIDTH + 5, true, 5);
    }

}