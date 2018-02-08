import { Player } from "./player";
import { CartesianCoords } from "../cartesian-coords";
import { Draw } from "../draw";
import { IGameObject } from './igame-object'

export class Tank implements IGameObject {
    static WIDTH = 12;
    static MOVEMENT_RANGE = 100;
    static MOVEMENT_LINE_WIDTH = 3;
    static SHOOTING_RANGE = 250;
    static SHOOTING_SPEED = 50;
    /** The deadzone allowed for free movement before the player shoots */
    static SHOOTING_DEADZONE = Tank.WIDTH + 2;

    health: number;
    player: Player;
    position: CartesianCoords;

    constructor(x: number, y: number) {
        this.position = new CartesianCoords(x, y);
    }

    draw(context: CanvasRenderingContext2D, draw: Draw): any {
        draw.color.goBlack();
        draw.circle(context, this.position, Tank.WIDTH);
    }

    highlight(context: CanvasRenderingContext2D, draw: Draw): any {
        draw.color.goRed();
        draw.dot(context, this.position, Tank.WIDTH, true, 5);
        draw.color.goGreen();
        draw.circle(context, this.position, Tank.MOVEMENT_RANGE);
        draw.color.goBlack();
    }

}