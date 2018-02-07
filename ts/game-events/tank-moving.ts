import { TanksGameEvent } from "./event";
import { Draw, DrawState } from "../draw";
import { LineLimiter } from "../line-limiter";
import { ActionLimiter } from "../action-limiter";
import { EventController, GameState } from "../event-controller";
import { Player } from "../game-objects/player";
import { TanksMath } from "../tanks-math";
import { CartesianCoords } from "../cartesian-coords";
import { Tank } from "../game-objects/tank";
import { IGameObject } from "../game-objects/igame-object";
import { ActiveTank } from "./shared-state";

export class MovingEvent implements TanksGameEvent {
    context: CanvasRenderingContext2D;
    controller: EventController;
    player: Player;

    draw: Draw;
    line: LineLimiter;
    turn: ActionLimiter;
    active: ActiveTank;

    constructor(controller: EventController, context: CanvasRenderingContext2D, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.draw = new Draw();
        this.line = new LineLimiter(Tank.DEFAULT_MOVEMENT_RANGE);
        this.turn = new ActionLimiter();
        this.active = this.controller.shared.active;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.onmousedown = this.startMovement;
        canvas.onmousemove = this.drawMoveLine;
        // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
        window.onmouseup = this.endMovement;

        // canvas.addEventListener('touchstart', this.touchMove, false);
        // canvas.addEventListener('touchend', this.mouseUp, false);
        // canvas.addEventListener('touchmove', this.touchMove, false);
    }

    showUserWarning(message: string) {
        document.getElementById("user-warning").innerHTML = message;
    }

    startMovement = (e: MouseEvent): void => {
        // limit the start of the line to be the tank
        this.draw.last = new CartesianCoords(this.active.position.X, this.active.position.Y);
        this.draw.state = DrawState.DRAWING;
        // limit the lenght of the line to the maximum allowed tank movement
        if (this.line.in(this.active.position, this.draw.mouse)) {
            this.draw.line(this.context, Tank.DEFAULT_MOVEMENT_LINE_WIDTH);
        }
    }

    endMovement = (e: MouseEvent) => {
        this.draw.state = DrawState.STOPPED;
        // reset the line limit as the user has let go of the button
        this.line.reset();

        // only draw if the position is valid
        if (this.active.valid_position) {
            // update the position of the tank in the player array
            this.player.tanks[this.active.id].position = this.draw.mouse.copy();
            this.showUserWarning("");
        }

        // delete the reference to the active tank
        // this.active = null;
        this.controller.shared.active = null;
        // redraw canvas with all current tanks
        this.redraw(this.player.tanks);

        // To add: if out of actions, then next state is TANK_SHOOTING
        // come back to moving after selection
        this.controller.shared.next = GameState.TANK_MOVING;
        // go to tank selection state
        this.controller.changeGameState(GameState.TANK_SELECTION);

    }

    redraw(tanks: Array<IGameObject>) {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        for (const tank of tanks) {
            tank.draw(this.context, this.draw);
        }
    }

    drawMoveLine = (e: MouseEvent) => {
        this.draw.updateMousePosition(e);
        // draw the movement line if the mouse button is currently being pressed
        if (this.draw.state == DrawState.DRAWING) {
            if (this.line.in(this.active.position, this.draw.mouse)) {
                this.active.valid_position = true;
                this.draw.line(this.context, Tank.DEFAULT_MOVEMENT_LINE_WIDTH);
            } else {
                this.active.valid_position = false;
            }
        }
    }

    touchMove = (e: TouchEvent) => {
        // Update the touch co-ordinates
        this.draw.updateTouchPosition(e);

        // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
        this.draw.line(this.context, Tank.DEFAULT_WIDTH);

        // Prevent a scrolling action as a result of this touchmove triggering.
        event.preventDefault();
    }

    penMove = (e: PointerEvent) => {
        this.draw.updateMousePosition(e);
        if (this.draw.state == DrawState.DRAWING) {
            this.draw.line(this.context, Tank.DEFAULT_WIDTH);
        }
        event.preventDefault();
    }
}