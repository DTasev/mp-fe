import { IActionState, IPlayState } from "./iActionState";
import { Draw, DrawState } from "../drawing/draw";
import * as Limit from "../limiters/index";
import { GameController, GameState } from "../gameController";
import { Player } from "../gameObjects/player";
import { TanksMath } from "../utility/tanksMath";
import { Point } from "../utility/point";
import { Tank, TankHealthState, TankTurnState } from "../gameObjects/tank";
import { IGameObject } from "../gameObjects/iGameObject";
import { Color } from "../drawing/color";
import { Ui } from "../ui";
import { J2H } from "../json2html";

class MovingUi {
    static button_skipTurn(): HTMLButtonElement {
        return J2H.parse<HTMLButtonElement>({
            "button": {
                "style": "width:100%",
                "textContent": "Skip Turn"
            }
        })
    }

    static button_goToShooting(): HTMLButtonElement {
        return J2H.parse<HTMLButtonElement>({
            "button": {
                "style": "width:100%",
                "children": {
                    "i": {
                        "className": "fas fa-rocket"
                    }
                }
            }
        });
    }
}

export class MovingState implements IPlayState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;
    ui: Ui;

    draw: Draw;
    line: Limit.Length;
    active: IGameObject;
    tankValidPosition: boolean;

    constructor(controller: GameController, context: CanvasRenderingContext2D, ui: Ui, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.ui = ui;

        this.draw = new Draw();
        this.line = new Limit.Length(Tank.MOVEMENT_RANGE);
        this.active = this.player.activeTank.get();

        const button_goToShooting = MovingUi.button_goToShooting();
        button_goToShooting.onclick = this.goToShooting;
        this.ui.addLeft(button_goToShooting);
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.onmousedown = this.startMovement;
        canvas.onmousemove = this.drawMoveLine;
        // the mouseup is only on the canvas, otherwise none of the UI buttons can be clicked
        canvas.onmouseup = this.endMovement;

        // canvas.addEventListener('touchstart', this.touchMove, false);
        // canvas.addEventListener('touchend', this.mouseUp, false);
        // canvas.addEventListener('touchmove', this.touchMove, false);
    }

    startMovement = (e: MouseEvent): void => {
        // limit the start of the line to be the tank
        this.draw.last = new Point(this.active.position.x, this.active.position.y);
        // limit the length of the line to the maximum allowed tank movement, and disabled tanks can't be moved
        if (this.line.in(this.active.position, this.draw.mouse) && this.active.healthState !== TankHealthState.DISABLED) {
            this.draw.state = DrawState.DRAWING;
            this.validMove();
        }
    }

    private validMove() {
        this.tankValidPosition = true;
        this.draw.mouseLine(this.context, Tank.MOVEMENT_LINE_WIDTH, Tank.MOVEMENT_LINE_COLOR);
    }

    endMovement = (e: MouseEvent) => {
        // reset the line limit as the user has let go of the button
        this.line.reset();

        // only act if the position is valid
        if (this.tankValidPosition) {
            // update the position of the tank in the player array
            const tank = this.player.tanks[this.active.id]
            tank.position = this.draw.mouse.copy();
            tank.actionState = TankTurnState.MOVED;

            this.controller.showUserWarning("");
        }
        this.endTurn();
    }

    private endTurnEarly = () => {
        console.log("Ending turn early");
        // set the active tank to be the one that was originally selected
        // this will tell the selection state to go to shooting without a new selection
        this.player.activeTank.set(this.active);
        // run the end of turn action
        this.endTurn();
    }

    private goToShooting = () => {
        this.player.tanks[this.active.id].actionState = TankTurnState.MOVED;
        this.player.activeTank.set(this.player.tanks[this.active.id]);
        this.draw.state = DrawState.STOPPED;
        // redraw canvas with all current tanks
        this.controller.redrawCanvas(this.draw);
        this.ui.clear();
        // go to tank selection state
        this.controller.changeGameState(GameState.TANK_SELECTION);
    }

    /** The action to be taken at the end of the turn */
    private endTurn() {
        this.draw.state = DrawState.STOPPED;
        // redraw canvas with all current tanks
        this.controller.redrawCanvas(this.draw);
        // go to tank selection state
        this.ui.clear();
        this.controller.changeGameState(GameState.TANK_SELECTION);
    }

    private drawMoveLine = (e: MouseEvent) => {
        this.draw.updateMousePosition(e);
        // draw the movement line if the mouse button is currently being pressed
        if (this.draw.state == DrawState.DRAWING) {
            if (this.line.in(this.active.position, this.draw.mouse)) {
                this.validMove();
            } else {
                this.tankValidPosition = false;
            }
        }
    }

    // touchMove = (e: TouchEvent) => {
    //     // Update the touch co-ordinates
    //     this.draw.updateTouchPosition(e);

    //     // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
    //     this.draw.line(this.context, Tank.DEFAULT_WIDTH);

    //     // Prevent a scrolling action as a result of this touchmove triggering.
    //     event.preventDefault();
    // }

    // penMove = (e: PointerEvent) => {
    //     this.draw.updateMousePosition(e);
    //     if (this.draw.state == DrawState.DRAWING) {
    //         this.draw.line(this.context, Tank.DEFAULT_WIDTH);
    //     }
    //     event.preventDefault();
    // }
}