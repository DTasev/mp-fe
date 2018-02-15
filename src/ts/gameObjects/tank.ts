import { Player } from "./player";
import { CartesianCoords } from "../cartesianCoords";
import { Draw } from "../drawing/draw";
import { IGameObject } from './iGameObject'
import { Color } from "../drawing/color";


export enum TankState {
    /** Tank can do everything */
    ALIVE,

    /** Tank can't move */
    DISABLED,

    /** Tank can't do anything */
    DEAD
}
export class Tank implements IGameObject {

    /** The width of the dot when drawing the tank */
    static WIDTH = 12;

    /** The zone around the tank that will cause it to be disabled instead of killed */
    static DISABLED_ZONE = 0.5;

    /** The width of the line when drawing the tank */
    static LINE_WIDTH = 1;

    /** How far can the tank move */
    static MOVEMENT_RANGE = 100;

    /** The width of the movement line */
    static MOVEMENT_LINE_WIDTH = 3;

    /** How far can the shot line reach */
    static SHOOTING_RANGE = 250;

    /** How fast must the player move for a valid shot */
    static SHOOTING_SPEED = 30;
    /** The deadzone allowed for free mouse movement before the player shoots.
     * This means that the player can wiggle the cursor around in the tank's space
     * to prepare for the shot.
     */
    static SHOOTING_DEADZONE = Tank.WIDTH + 2;

    private highlight_color: string = Color.red();
    private highlight_outline_color: string = Color.green();

    health: number;
    player: Player;
    position: CartesianCoords;
    state: TankState;
    id: number;

    constructor(id: number, player: Player, x: number, y: number) {
        this.id = id;
        this.player = player;
        this.position = new CartesianCoords(x, y);
        this.state = TankState.ALIVE;
    }

    draw(context: CanvasRenderingContext2D, draw: Draw): any {
        let color;
        switch (this.state) {
            case TankState.ALIVE:
                color = this.player.color;
                break;
            case TankState.DISABLED:
                color = Color.pink();
                break;
            case TankState.DEAD:
                color = Color.gray();
                break;
        }
        draw.circle(context, this.position, Tank.WIDTH, Tank.LINE_WIDTH, color);
        context.fillStyle = Color.black(0.5);
        context.font = "18px Calibri";
        context.fillText(this.id + "", this.position.X, this.position.Y + 5);
    }

    highlight(context: CanvasRenderingContext2D, draw: Draw): any {
        draw.dot(context, this.position, Tank.WIDTH, this.highlight_color);
        draw.circle(context, this.position, Tank.MOVEMENT_RANGE, Tank.LINE_WIDTH, this.highlight_outline_color);
    }
}