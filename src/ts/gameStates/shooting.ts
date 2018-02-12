import { IActionState } from "./iActionState";
import { GameStateController, GameState } from "../gameStateController";
import { Player } from "../gameObjects/player";
import { Draw, DrawState } from "../draw";
import * as Limit from "../limiters/index";
import { ActiveTank } from "./sharedState";
import { Tank } from "../gameObjects/tank";
import { CartesianCoords } from "../cartesianCoords";
import { IGameObject } from "../gameObjects/iGameObject";
import { TanksMath } from "../tanksMath";

export class ShootingState implements IActionState {
    context: CanvasRenderingContext2D;
    controller: GameStateController;
    player: Player;

    draw: Draw;
    line: Limit.Length;
    shot_line: Limit.Length;
    speed: Limit.Speed;
    turn: Limit.Actions;
    active: ActiveTank;
    successful_shot: boolean = false;

    constructor(controller: GameStateController, context: CanvasRenderingContext2D, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;

        this.draw = new Draw();
        this.line = new Limit.Length(Tank.SHOOTING_DEADZONE);
        this.shot_line = new Limit.Length(Tank.SHOOTING_RANGE);
        this.speed = new Limit.Speed(Tank.SHOOTING_SPEED);
        if (!this.controller.shared.turn.available()) {
            this.turn = new Limit.Actions();
        } else {
            this.turn = this.controller.shared.turn.get();
        }
        this.active = this.controller.shared.active.get();
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.onmousedown = this.startShooting;
        canvas.onmousemove = this.continueShooting;
        window.onmouseup = this.stopShooting;
    }

    private startShooting = (e: MouseEvent) => {
        this.draw.updateMousePosition(e);
        this.draw.last = new CartesianCoords(this.active.position.X, this.active.position.Y);
        // resets the successful shot flag
        this.successful_shot = false;
        // the player must start shooting from the tank
        const tank = this.player.tanks[this.active.id];
        if (TanksMath.point.collide_circle(this.draw.mouse, tank.position, Tank.WIDTH)) {
            this.draw.state = DrawState.DRAWING;
            if (this.line.in(this.active.position, this.draw.mouse)) {
                this.validRange();
            }
        } else {
            console.log("Click did not collide with the active tank");
        }
    }

    private validRange(): void {
        this.draw.line(this.context, Tank.MOVEMENT_LINE_WIDTH);
    }

    private continueShooting = (e: MouseEvent) => {
        this.draw.updateMousePosition(e);

        // draw the movement line if the mouse button is currently being pressed
        if (this.draw.state == DrawState.DRAWING) {
            // if the player is just moving about on the tank's space
            if (this.line.in(this.active.position, this.draw.mouse)) {
                console.log("Roaming in tank space");
                this.controller.showUserWarning("");
                this.validRange();
            } // if the player has shot far away start drawing the line
            else if (this.speed.enough(this.active.position, this.draw.mouse)) {
                console.log("Shooting!");
                this.controller.showUserWarning("");
                this.validRange();

                // if the shot has reached the max allowed limit we stop the drawing
                if (!this.shot_line.add(this.active.position, this.draw.mouse)) {
                    console.log("Successful shot!");
                    this.successful_shot = true;
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
        //
        // here we will do collision detection along the line
        //

        if (this.successful_shot) {
            this.turn.take();
        }
        if (this.turn.over()) {
            this.controller.next_player = true;
            this.controller.shared.next.set(GameState.TANK_SELECTION);
        } else {
            this.controller.shared.turn.set(this.turn);
            this.controller.shared.next.set(GameState.TANK_SHOOTING);
        }

        this.draw.state = DrawState.STOPPED;
        // redraw canvas with all current tanks
        this.controller.redrawCanvas(this.draw);

        this.controller.changeGameState(GameState.TANK_SELECTION);
    }
}