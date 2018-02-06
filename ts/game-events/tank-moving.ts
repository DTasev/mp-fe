import { TanksGameEvent } from "./event";
import { Draw, DrawState } from "../draw";
import { LineLimiter } from "../line-limiter";
import { ActionLimiter } from "../action-limiter";
import { EventController } from "../event-controller";
import { Player } from "../game-objects/player";
import { TanksMath } from "../tanks-math";
import { CartesianCoords } from "../cartesian-coords";
import { Tank } from "../game-objects/tank";

class ActiveTank {
    id: number;
    position: CartesianCoords;
    valid_position: boolean = true;

    constructor(id: number, position: CartesianCoords) {
        this.id = id;
        this.position = position;
    }
}
enum MovingEventStates {
    // selecting which tank will be moved
    TANK_SELECTION,
    // drawing the movement line, which always starts from the selected tank
    TANK_MOVEMENT
}
export class MovingEvent implements TanksGameEvent {
    draw: Draw;
    line: LineLimiter;
    turn: ActionLimiter;
    context: CanvasRenderingContext2D;
    controller: EventController;
    player: Player;
    state: MovingEventStates;
    active: ActiveTank;

    constructor(controller: EventController, context: CanvasRenderingContext2D, player: Player) {
        this.controller = controller;
        this.context = context;
        this.draw = new Draw();
        this.line = new LineLimiter();
        this.turn = new ActionLimiter();
        this.player = player;
        this.state = MovingEventStates.TANK_SELECTION;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousedown', this.mouseDown, false);
        canvas.addEventListener('mousemove', this.mouseMove, false);
        // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
        window.addEventListener('mouseup', this.mouseUp, false);

        // canvas.addEventListener('touchstart', this.touchMove, false);
        // canvas.addEventListener('touchend', this.mouseUp, false);
        // canvas.addEventListener('touchmove', this.touchMove, false);
    }
    removeEventListeners(canvas: HTMLCanvasElement) {
        canvas.removeEventListener('mousedown', this.mouseDown, false);
        canvas.removeEventListener('mousemove', this.mouseMove, false);
        // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
        window.removeEventListener('mouseup', this.mouseUp, false);

        // canvas.removeEventListener('touchstart', this.touchMove, false);
        // canvas.removeEventListener('touchend', this.mouseUp, false);
        // canvas.removeEventListener('touchmove', this.touchMove, false);
    }

    mouseDown = (e: MouseEvent) => {
        switch (this.state) {
            case MovingEventStates.TANK_SELECTION:
                this.highlightTank(e);
                break;
            case MovingEventStates.TANK_MOVEMENT:
                this.moveTank(e);
                break;
        }
    }

    highlightTank(e: MouseEvent): void {
        this.draw.updateMousePosition(e);

        // Check if the user has clicked any tank.
        for (const [id, tank] of this.player.tanks.entries()) {
            if (TanksMath.point.collide_circle(this.draw.mouse, tank.position, tank.width)) {
                this.draw.dot(this.context, tank.position, tank.width + 5, true, 5);
                this.active = new ActiveTank(id, tank.position);
                // only highlight the first tank
                break;
            }
        }
    }

    moveTank(e: MouseEvent): void {
        // limit the start of the line to be the tank
        this.draw.last = new CartesianCoords(this.active.position.X, this.active.position.Y);
        // limit the lenght of the line to the maximum allowed movement
        // after movement has been made, draw over the original tank
        // and draw the tank in the new position
        this.draw.state = DrawState.DRAWING;
        if (this.line.in(this.active.position, this.draw.mouse)) {
            this.draw.line(this.context);
        } else {
            // show user warning that they are trying to move too far
            document.getElementById("user-warning").innerHTML = "Trying to move too far!"
        }
    }


    mouseUp = (e: MouseEvent) => {
        this.draw.state = DrawState.STOPPED;

        this.line.reset();

        switch (this.state) {
            case MovingEventStates.TANK_SELECTION:
                // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
                this.draw.last.X = -1;
                this.draw.last.Y = -1;
                if (this.active) {
                    this.state = MovingEventStates.TANK_MOVEMENT;
                }
                break;
            case MovingEventStates.TANK_MOVEMENT:
                // if (!this.turn.action()) {
                //     this.draw.color.next();
                //     this.turn.next();
                //     console.log("DEBUG: Out of actions fort this turn");
                // } else {
                // }

                this.state = MovingEventStates.TANK_SELECTION;
                // only draw if the position is valid
                if (this.active.valid_position) {
                    // draw the dot for the new tank
                    this.draw.dot(this.context, this.draw.mouse, Tank.DEFAULT_WIDTH);

                    // update the position of the tank in the player array
                    this.player.tanks[this.active.id].position = this.draw.mouse.copy();
                }
                // delete the reference to the active tank
                this.active = null;
                break;
        }
        // should probably redraw canvas with all current tanks
    }

    mouseMove = (e: MouseEvent) => {
        this.draw.updateMousePosition(e);
        // Draw a dot if the mouse button is currently being pressed
        if (this.draw.state == DrawState.DRAWING) {
            if (this.line.in(this.active.position, this.draw.mouse)) {
                this.active.valid_position = true;
                this.draw.line(this.context);
            } else {
                this.active.valid_position = false;
            }
        }
    }

    touchMove = (e: TouchEvent) => {
        // Update the touch co-ordinates
        this.draw.updateTouchPosition(e);

        // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
        this.draw.line(this.context);

        // Prevent a scrolling action as a result of this touchmove triggering.
        event.preventDefault();
    }

    penMove = (e: PointerEvent) => {
        this.draw.updateMousePosition(e);
        if (this.draw.state == DrawState.DRAWING) {
            this.draw.line(this.context);
        }
        event.preventDefault();
    }
}