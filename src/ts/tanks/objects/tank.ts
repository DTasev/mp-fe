import { GameState } from "../controller";
import { Draw } from "../drawing/draw";
import { DarkTheme } from "../themes/dark";
import { ITheme } from "../themes/iTheme";
import { Point } from "../utility/point";
import { IEffect } from "./effects/iEffect";
import { Player } from "./player";
import { Particles } from "../utility/particles";

export enum TankActState {
    SHOT,
    MOVED,
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
export class TankColor {
    /** Color for when the tank is active/selected */
    readonly active: string;
    /** Color for the outline that shows the action(movement) range */
    readonly activeOutline: string;
    /** Color for the label of the tank */
    readonly label: string;
    /** Color for the tank, when not selected */
    readonly alive: string;
    /** Color for when the tank has been disabled, and is not selected */
    readonly disabled: string;
    /** Color for when the tank has been killed */
    readonly dead: string;
    /** Color for the tank's shot line */
    readonly shootingLine: string;
    /** Color for the tank's movement line */
    readonly movementLine: string;

    constructor(active: string, activeOutline: string, label: string, alive: string, disabled: string, dead: string, shootingLine: string, movementLine: string) {
        this.active = active;
        this.activeOutline = activeOutline;

        this.label = label;

        this.alive = alive;
        this.disabled = disabled;
        this.dead = dead;

        this.shootingLine = shootingLine;
        this.movementLine = movementLine;
    }
}

export class Tank {

    /** The width of the dot when drawing the tank */
    static readonly WIDTH = 12;

    /** The zone around the tank that will cause it to be disabled instead of killed */
    static readonly DISABLED_ZONE = 0.5;

    /** The width of the line when drawing the tank */
    static readonly LINE_WIDTH = 1;

    /** How far can the tank move */
    static readonly DEFAULT_MOVEMENT_RANGE = 100;

    /** The width of the movement line */
    static readonly MOVEMENT_LINE_WIDTH = 3;

    /** How far can the shot line reach */
    static readonly SHOOTING_RANGE = 409;

    /** How fast must the player move for a valid shot */
    static readonly SHOOTING_SPEED = 15;

    /** The deadzone allowed for free mouse movement before the player shoots.
     * This means that the player can wiggle the cursor around in the tank's space
     * to prepare for the shot.
     */
    static readonly SHOOTING_DEADZONE = Tank.WIDTH + 2;

    /** Opacity for the tank's label */
    private readonly LABEL_OPACITY = 0.7;

    /** Opacity for the player color when the tank is disabled */
    private readonly DISABLED_OPACITY = 0.7;

    /** How many pixels to offset the label so that it appears in the center of the tank */
    private readonly LABEL_OFFSET = 10.5;

    readonly color: TankColor;

    readonly id: number;
    readonly player: Player;

    position: Point;

    healthState: TankHealthState;
    actionState: TankActState;
    effects: IEffect[];

    movementRange = Tank.DEFAULT_MOVEMENT_RANGE;

    label: string;

    constructor(id: number, player: Player, x: number, y: number, theme: ITheme) {
        this.id = id;
        this.player = player;
        this.position = new Point(x, y);
        this.healthState = TankHealthState.ALIVE;
        this.actionState = TankActState.NOT_ACTED;
        this.label = "";
        this.effects = [];

        // initialise colors for each of the tank's states
        this.color = new TankColor(
            theme.game.tankActive().rgba(),
            theme.game.tankActiveOutline().rgba(),
            theme.game.tankLabel().rgba(this.LABEL_OPACITY),
            this.player.color.rgba(),
            this.player.color.rgba(this.DISABLED_OPACITY),
            theme.game.tankDead().rgba(),
            theme.game.tankShootingLine().rgba(),
            theme.game.tankMovementLine().rgba()
        );
    }

    draw(context: CanvasRenderingContext2D): any {
        let [label, color] = this.uiElements();
        Draw.circle(context, this.position, Tank.WIDTH, Tank.LINE_WIDTH, color);
        this.showStatus(context, label);
    }

    private showStatus(context: CanvasRenderingContext2D, label: string) {
        context.fillStyle = this.color.label;
        context.font = "16px Calibri";
        // put the text in the middle of the tank
        context.fillText(label, this.position.x - this.LABEL_OFFSET, this.position.y + 5);
    }

    private uiElements(): [string, string] {
        let color: string;
        let label = this.label;
        switch (this.actionState) {
            case TankActState.SHOT:
                label += "🚀";
                break;
            case TankActState.MOVED:
                label += "⚓";
                break;
        }
        switch (this.healthState) {
            case TankHealthState.ALIVE:
                color = this.color.alive;
                break;
            case TankHealthState.DISABLED:
                color = this.color.disabled;
                label += "♿";
                break;
            case TankHealthState.DEAD:
                color = this.color.dead;
                label += "💀";
                break;
        }
        return [label, color];
    }

    highlight(context: CanvasRenderingContext2D, drawRange = true): any {
        Draw.dot(context, this.position, Tank.WIDTH + 1, this.color.active);
        if (drawRange) {
            Draw.circle(context, this.position, this.movementRange, Tank.LINE_WIDTH, this.color.activeOutline);
        }
        let [label, color] = this.uiElements();
        this.showStatus(context, label);
    }

    active() {
        return this.healthState !== TankHealthState.DEAD && this.actionState !== TankActState.SHOT;
    }

    nextState(): GameState {
        // if the tank is disabled, then movement will be skipped
        if (this.healthState == TankHealthState.DISABLED) {
            this.actionState = TankActState.MOVED;
        }
        switch (this.actionState) {
            case TankActState.NOT_ACTED:
                return GameState.TANK_MOVEMENT;
            case TankActState.MOVED:
                return GameState.TANK_SHOOTING;
            case TankActState.SHOT:
                return GameState.TANK_SELECTION;
        }
    }

    /**
     * Apply any effects to the tank before teh beginning of the turn
     */
    beforeTurnEffects() {
        for (const effect of this.effects) {
            effect.before(this);
        }
    }
    /**
     * Expires any effects that are due to expire at the end of the turn.
     */
    afterTurnEffects() {
        for (const effect of this.effects) {
            effect.after(this);
        }
        // clear all effects that don't have the duration
        this.effects = this.effects.filter((effect) => effect.duration > 0);
    }

    static premadeTank(x = 0, y = 0, player: Player = null): Tank {
        return new Tank(0, player || Player.premadePlayer(), x, y, new DarkTheme());
    }

    /**
     * Change tank status to reflect death and show animation
     */
    die() {
        this.healthState = TankHealthState.DEAD;
        Particles.explosion(this);
    }

}