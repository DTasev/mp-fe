import { J2H } from "../json2html";

import { IPlayState } from "./iActionState";
import { GameController, GameState } from "../controller";
import { Player } from "../gameObjects/player";
import { Draw, DrawState } from "../drawing/draw";
import { Tank, TankTurnState } from "../gameObjects/tank";
import { Point } from "../utility/point";
import { IGameObject } from "../gameObjects/iGameObject";
import { TanksMath } from "../utility/tanksMath";
import { Line } from "../utility/line";
import { Color } from "../drawing/color";
import { Ui } from "../ui/ui";
import { Viewport } from "../gameMap/viewport";
import { ShootingUi } from "../ui/shooting";

import * as Settings from '../settings';
import * as Limit from "../limiters/index";

export class ShootingState implements IPlayState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;
    ui: Ui;

    draw: Draw;

    /** The current active tank */
    active: IGameObject;

    /** The limiter for the deadzone for moving around inside the tank before a shot */
    tankRoamingLength: Limit.Length;
    /** The limiter for the total shot length */
    shotLength: Limit.Length;
    /** The limiter for the shot's speed */
    shotSpeed: Limit.Speed;
    /** Whether the shot was successfully fired, will be set to true if the shot is fast enough */
    successfulShot: boolean = false;
    /** The line of the last shot */
    shotPath: Line;

    constructor(controller: GameController, context: CanvasRenderingContext2D, ui: Ui, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.ui = ui;

        this.shotPath = new Line();

        this.draw = new Draw();
        this.tankRoamingLength = new Limit.Length(Tank.SHOOTING_DEADZONE);
        this.shotLength = new Limit.Length(Tank.SHOOTING_RANGE);
        this.shotSpeed = new Limit.Speed(Tank.SHOOTING_SPEED);

        if (!player.tanksShot.available()) {
            player.tanksShot.set(new Limit.Actions(player.activeTanks().length));
        }

        this.active = this.player.activeTank.get();
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.onmousedown = this.startShooting;
        canvas.onmousemove = this.continueShooting;
        window.onmouseup = this.stopShooting;
    }

    view(viewport: Viewport) { }

    setUpUi(ui: Ui, viewport: Viewport) {
        ui.heading.addHome(viewport, this.player);
        const button_skipTurn = ShootingUi.button_skipTurn();
        button_skipTurn.onmousedown = this.skipTurn;
        ui.heading.right.add(button_skipTurn);
    }

    private startShooting = (e: MouseEvent) => {
        // if the button clicked is not the left button, do nothing
        if (e.button != 0) {
            return;
        }
        this.draw.updateMousePosition(e);
        this.draw.last = new Point(this.active.position.x, this.active.position.y);
        // resets the successful shot flag
        this.successfulShot = false;
        // the player must start shooting from the tank
        const tank = this.player.tanks[this.active.id];
        if (TanksMath.point.collideCircle(this.draw.mouse, tank.position, Tank.WIDTH)) {
            // if the mouse is within the tank
            if (this.tankRoamingLength.in(this.active.position, this.draw.mouse)) {
                // shot collision starts from the centre of the tank
                this.shotPath.points.push(this.active.position.copy());
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
            if (this.tankRoamingLength.in(this.active.position, this.draw.mouse)) {
                console.log("Roaming in tank space");
                this.ui.warning("");
                this.validRange();
            } // if the player has shot far away start drawing the line
            else if (this.shotSpeed.enough(this.active.position, this.draw.mouse)) {
                console.log("Shooting!");
                this.ui.warning("");
                this.validRange();

                // only add to the shot path if the shot was successful
                this.shotPath.points.push(this.draw.mouse.copy());

                // if the shot has reached the max allowed limit we stop the drawing, this is an artificial
                // limitation to stop a shot that goes along the whole screen
                if (!this.shotLength.add(this.active.position, this.draw.mouse)) {
                    console.log("Successful shot!");
                    this.successfulShot = true;
                    this.draw.state = DrawState.STOPPED;
                }
            } else {
                this.ui.warning("Shooting too slow!");
                console.log("Shooting too slow!");
                this.draw.state = DrawState.STOPPED;
            }
        }
    }

    private stopShooting = (e: MouseEvent) => {
        // if the button clicked is not the left button, do nothing
        if (e.button != 0) {
            return;
        }
        const playerTanksShot = this.player.tanksShot.get();
        if (this.successfulShot) {
            this.controller.collide(this.shotPath);
            this.controller.cacheLine(this.shotPath);
            playerTanksShot.take();
            this.active.actionState = TankTurnState.SHOT;

            // when the shot was successful
            // set the player's viewport position to the last position they were looking at
            this.player.viewportPosition = Viewport.current();
        }

        // if all the player's tank have shot
        if (playerTanksShot.over()) {
            // reset the current player's tank act states
            this.player.resetTanksActStates();
            // change to the next player when the state is next changed
            this.controller.nextPlayer = true;
        } else {
            // if not all tanks have shot, then keep the state for the next shooting
            this.player.tanksShot.set(playerTanksShot);
        }

        this.draw.state = DrawState.STOPPED;
        // redraw canvas with all current tanks
        this.controller.redrawCanvas();
        this.controller.changeGameState(GameState.TANK_SELECTION);
    }
    private skipTurn = () => {
        // reset the current player's tank act states
        this.player.resetTanksActStates();
        // change to the next player when the state is next changed
        this.controller.nextPlayer = true;
        // if the player skips the turn, set the player's viewport position to the last position they were looking at
        this.player.viewportPosition = Viewport.current();

        this.draw.state = DrawState.STOPPED;
        // redraw canvas with all current tanks
        this.controller.redrawCanvas();
        this.controller.changeGameState(GameState.TANK_SELECTION);
    }
}