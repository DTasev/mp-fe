import { IGameActionState } from "./event";
import { EventController, GameState } from "../event-controller";
import { Player } from "../game-objects/player";
import { Draw, DrawState } from "../draw";
import { LengthLimiter } from "../limiters/line-limiter";
import { ActionLimiter } from "../limiters/action-limiter";
import { SpeedLimiter } from "../limiters/speed-limiter";
import { ActiveTank } from "./shared-state";
import { Tank } from "../game-objects/tank";
import { CartesianCoords } from "../cartesian-coords";
import { IGameObject } from "../game-objects/igame-object";
import { TanksMath } from "../tanks-math";

export class ShootingState implements IGameActionState {

    context: CanvasRenderingContext2D;
    controller: EventController;
    player: Player;

    draw: Draw;
    line: LengthLimiter;
    shot_line: LengthLimiter;
    speed: SpeedLimiter;
    turn: ActionLimiter;
    active: ActiveTank;

    constructor(controller: EventController, context: CanvasRenderingContext2D, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;

        this.draw = new Draw();
        this.line = new LengthLimiter(Tank.SHOOTING_DEADZONE);
        this.shot_line = new LengthLimiter(Tank.SHOOTING_RANGE);
        this.speed = new SpeedLimiter(Tank.SHOOTING_SPEED);
        this.turn = new ActionLimiter();
        this.active = this.controller.shared.active.get();
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.onmousedown = this.startShooting;
        canvas.onmousemove = this.continueShooting;
        window.onmouseup = this.stopShooting;
    }

    private startShooting = (e: MouseEvent) => {
        this.draw.last = new CartesianCoords(this.active.position.X, this.active.position.Y);

        // the player must start shooting from the tank
        const tank = this.player.tanks[this.active.id];
        if (TanksMath.point.collide_circle(this.draw.mouse, tank.position, Tank.WIDTH)) {
            this.draw.state = DrawState.DRAWING;
            if (this.line.in(this.active.position, this.draw.mouse)) {
                this.validRange();
            }
        }
    }

    private validRange(): void {
        this.draw.line(this.context, Tank.MOVEMENT_LINE_WIDTH);
    }

    private continueShooting = (e: MouseEvent) => {
        this.draw.updateMousePosition(e);
        // draw the movement line if the mouse button is currently being pressed
        this.controller.showUserWarning("");

        if (this.draw.state == DrawState.DRAWING) {
            // if the player is just moving about on the tank's space
            if (this.line.in(this.active.position, this.draw.mouse)) {
                console.log("Roaming in tank space");
                this.validRange();
            } else if (this.speed.enough(this.active.position, this.draw.mouse)) {
                console.log("Shooting!");
                // or if the player has shot far away
                this.validRange();
                if (!this.shot_line.add(this.active.position, this.draw.mouse)) {
                    console.log("Line too long!");
                    this.draw.state = DrawState.STOPPED;
                }
            } else {
                this.controller.showUserWarning("Shooting too slow!");
                console.log("Shooting too slow!");
                this.draw.state = DrawState.STOPPED;
            }
        }
    }
    private stopShooting = (e: MouseEvent) => {
        this.draw.state = DrawState.STOPPED;
        // redraw canvas with all current tanks
        this.redraw(this.player.tanks);

        this.controller.shared.next.set(GameState.TANK_SHOOTING);
        // go to tank selection state
        this.controller.changeGameState(GameState.TANK_SELECTION);
    }

    redraw(tanks: Array<IGameObject>) {
        this.controller.clearCanvas();
        for (const tank of tanks) {
            tank.draw(this.context, this.draw);
        }
    }
}