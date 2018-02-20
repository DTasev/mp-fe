import { Player } from "./player";
import { Point } from "../utility/point";
import { Draw } from "../drawing/draw";
import { IGameObject } from './iGameObject'
import { Color } from "../drawing/color";

export enum TankActState {
    /** The tank has performed an action this turn, e.g. moved or shot */
    ACTED,
    /** The tank hasn't performed an action this turn */
    NOT_ACTED
}
export enum TankHealthState {
    /** Tank can do everything */
    ALIVE,

    /** Tank can't move */
    DISABLED,

    /** Tank can't do anything */
    DEAD
}

/** Provides grouping for all the Tank's colors */
class TankColor {
    /** Color for when the tank is active/selected */
    readonly active: string;
    /** Color for the outline that shows the action(movement) range */
    readonly active_outline: string;
    /** Color for the label of the tank */
    readonly label: string;
    /** Color for the tank, when not selected */
    readonly alive: string;
    /** Color for when the tank has been disabled, and is not selected */
    readonly disabled: string;
    /** Color for when the tank has been killed */
    readonly dead: string;

    constructor(active: string, active_outline: string, label: string, alive: string, disabled: string, dead: string) {
        this.active = active;
        this.active_outline = active_outline;

        this.label = label;

        this.alive = alive;
        this.disabled = disabled;
        this.dead = dead;
    }
}

export class Tank implements IGameObject {

    /** The width of the dot when drawing the tank */
    static readonly WIDTH = 12;

    /** The zone around the tank that will cause it to be disabled instead of killed */
    static readonly DISABLED_ZONE = 0.5;

    /** The width of the line when drawing the tank */
    static readonly LINE_WIDTH = 1;

    /** How far can the tank move */
    static readonly MOVEMENT_RANGE = 100;

    /** The width of the movement line */
    static readonly MOVEMENT_LINE_WIDTH = 3;

    /** The color of the movement line */
    static readonly MOVEMENT_LINE_COLOR = Color.black().toRGBA();

    /** How far can the shot line reach */
    static readonly SHOOTING_RANGE = 250;

    /** How fast must the player move for a valid shot */
    static readonly SHOOTING_SPEED = 30;

    /** The deadzone allowed for free mouse movement before the player shoots.
     * This means that the player can wiggle the cursor around in the tank's space
     * to prepare for the shot.
     */
    static readonly SHOOTING_DEADZONE = Tank.WIDTH + 2;

    /** Opacity for the tank's label */
    private readonly LABEL_OPACITY = 0.7;

    /** Opacity for the player color when the tank is disabled */
    private readonly DISABLED_OPACITY = 0.7;

    private readonly color: TankColor;

    readonly id: number;
    readonly player: Player;

    health: number;
    position: Point;

    healthState: TankHealthState;
    actionState: TankActState;

    label: string;

    constructor(id: number, player: Player, x: number, y: number) {
        this.id = id;
        this.player = player;
        this.position = new Point(x, y);
        this.healthState = TankHealthState.ALIVE;
        this.actionState = TankActState.NOT_ACTED;
        this.label = this.id + ""; // + "" converts to string

        // initialise colors for each of the tank's states
        this.color = new TankColor(
            Color.red().toRGBA(),
            Color.green().toRGBA(),
            Color.black().toRGBA(this.LABEL_OPACITY),
            this.player.color.toRGBA(),
            this.player.color.toRGBA(this.DISABLED_OPACITY),
            Color.gray().toRGBA()
        );
    }

    draw(context: CanvasRenderingContext2D, draw: Draw): any {
        let color: string;
        let label = this.label;
        switch (this.healthState) {
            case TankHealthState.ALIVE:
                color = this.color.alive;
                break;
            case TankHealthState.DISABLED:
                color = this.color.disabled;
                label += "D";
                break;
            case TankHealthState.DEAD:
                color = this.color.dead;
                label += "X";
                break;
        }
        draw.circle(context, this.position, Tank.WIDTH, Tank.LINE_WIDTH, color);
        context.fillStyle = this.color.label;
        context.font = "18px Calibri";
        context.fillText(label, this.position.x, this.position.y + 5);
    }

    highlight(context: CanvasRenderingContext2D, draw: Draw): any {
        draw.dot(context, this.position, Tank.WIDTH, this.color.active);
        draw.circle(context, this.position, Tank.MOVEMENT_RANGE, Tank.LINE_WIDTH, this.color.active_outline);
    }

    active() {
        return this.actionState === TankActState.NOT_ACTED;
    }
}