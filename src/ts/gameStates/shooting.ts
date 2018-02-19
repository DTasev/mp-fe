import { IActionState } from "./iActionState";
import { GameController, GameState } from "../gameController";
import { Player } from "../gameObjects/player";
import { Draw, DrawState } from "../drawing/draw";
import * as Limit from "../limiters/index";
import { ActiveTank } from "./sharedState";
import { Tank } from "../gameObjects/tank";
import { Point } from "../utility/point";
import { IGameObject } from "../gameObjects/iGameObject";
import { TanksMath } from "../utility/tanksMath";
import { LinePath } from "../utility/linePath";
import { Color } from "../drawing/color";

export class ShootingState implements IActionState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;

    draw: Draw;
    turn: Limit.Actions;
    active: ActiveTank;

    /** The limiter for the deadzone for moving around inside the tank before a shot */
    tank_roaming_length: Limit.Length;
    /** The limiter for the total shot length */
    shot_length: Limit.Length;
    /** The limiter for the shot's speed */
    shot_speed: Limit.Speed;
    /** Whether the shot was successfully fired, will be set to true if the shot is fast enough */
    successful_shot: boolean = false;

    shot_path: LinePath;

    constructor(controller: GameController, context: CanvasRenderingContext2D, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;

        this.shot_path = new LinePath();

        this.draw = new Draw();
        this.tank_roaming_length = new Limit.Length(Tank.SHOOTING_DEADZONE);
        this.shot_length = new Limit.Length(Tank.SHOOTING_RANGE);
        this.shot_speed = new Limit.Speed(Tank.SHOOTING_SPEED);

        if (!this.controller.shared.turn.available()) {
            // limit the number of actions to how many tanks the player has
            this.turn = new Limit.Actions(this.player.activeTanks());
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
        this.draw.last = new Point(this.active.position.X, this.active.position.Y);
        // resets the successful shot flag
        this.successful_shot = false;
        // the player must start shooting from the tank
        const tank = this.player.tanks[this.active.id];
        if (TanksMath.point.collide_circle(this.draw.mouse, tank.position, Tank.WIDTH)) {
            // if the mouse is within the tank
            if (this.tank_roaming_length.in(this.active.position, this.draw.mouse)) {
                // shot collision starts from the centre of the tank
                this.shot_path.points.push(this.active.position.copy());
                this.draw.state = DrawState.DRAWING;
                this.validRange();
            }
        } else {
            console.log("Click did not collide with the active tank");
        }
    }

    private validRange(): void {
        this.draw.mouseLine(this.context, Tank.MOVEMENT_LINE_WIDTH, Tank.MOVEMENT_LINE_COLOR);
    }

    private continueShooting = (e: MouseEvent) => {
        this.draw.updateMousePosition(e);

        // draw the movement line if the mouse button is currently being pressed
        if (this.draw.state == DrawState.DRAWING) {
            // if the player is just moving about on the tank's space
            if (this.tank_roaming_length.in(this.active.position, this.draw.mouse)) {
                console.log("Roaming in tank space");
                this.controller.showUserWarning("");
                this.validRange();
            } // if the player has shot far away start drawing the line
            else if (this.shot_speed.enough(this.active.position, this.draw.mouse)) {
                console.log("Shooting!");
                this.controller.showUserWarning("");
                this.validRange();

                // only add to the shot path if the shot was successful
                this.shot_path.points.push(this.draw.mouse.copy());

                // if the shot has reached the max allowed limit we stop the drawing, this is an artificial
                // limitation to stop a shot that goes along the whole screen
                if (!this.shot_length.add(this.active.position, this.draw.mouse)) {
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
        if (this.successful_shot) {
            this.shot_path.list();
            this.controller.collide(this.shot_path);
            this.controller.cacheLine(this.shot_path);
            //
            // here we will do collision detection along the line
            //
            this.turn.take();
        }
        if (this.turn.over()) {
            this.controller.next_player = true;
            this.controller.shared.next.set(GameState.TANK_MOVEMENT);
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