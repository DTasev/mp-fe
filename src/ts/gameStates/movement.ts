import { IActionState, IPlayState } from "./iActionState";
import { Draw, DrawState } from "../drawing/draw";
import * as Limit from "../limiters/index";
import { GameController, GameState } from "../controller";
import { Player } from "../gameObjects/player";
import { TanksMath } from "../utility/tanksMath";
import { Point } from "../utility/point";
import { Tank, TankHealthState, TankTurnState, TankColor } from "../gameObjects/tank";
import { IGameObject } from "../gameObjects/iGameObject";
import { Color } from "../drawing/color";
import { Ui } from "../ui/ui";
import { J2H } from "../json2html";
import { Viewport } from "../gameMap/viewport";
import { MovementUi } from "../ui/movement";
import { ITheme } from "../gameThemes/iTheme";

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

    view(viewport: Viewport) { }

    setUpUi(ui: Ui, viewport: Viewport, theme: ITheme) {
        ui.heading.addHome(viewport, this.player, theme);
        const button_goToShooting = MovementUi.button_goToShooting(theme);
        button_goToShooting.onclick = this.goToShooting;
        ui.heading.right.add(button_goToShooting);
    }

    startMovement = (e: MouseEvent): void => {
        // if the button clicked is not the left button, do nothing
        if (e.button != 0) {
            return;
        }
        // limit the start of the line to be the tank
        this.draw.last = new Point(this.active.position.x, this.active.position.y);
        // limit the length of the line to the maximum allowed tank movement, and disabled tanks can't be moved
        if (this.line.in(this.active.position, this.draw.mouse) && this.active.healthState !== TankHealthState.DISABLED) {
            this.draw.state = DrawState.DRAWING;
            this.validMove(this.active.color);
        }
    }

    private validMove(tankColors: TankColor) {
        this.tankValidPosition = true;
        this.draw.mouseLine(this.context, Tank.MOVEMENT_LINE_WIDTH, tankColors.movementLine);
    }

    endMovement = (e: MouseEvent) => {
        // if the button clicked is not the left button, do nothing
        if (e.button != 0) {
            return;
        }
        // reset the line limit as the user has let go of the button
        this.line.reset();

        // only act if the position is valid
        if (this.tankValidPosition && !this.controller.collidingWithTerrain(this.draw.mouse, Tank.WIDTH)) {
            // update the position of the tank in the player array
            const tank = this.player.tanks[this.active.id]
            tank.position = this.draw.mouse.copy();
            tank.actionState = TankTurnState.MOVED;

            this.ui.message("");

            // set the player's viewport position to the last position they were looking at
            this.player.viewportPosition = Viewport.current();
        }
        this.endTurn();
    }

    private goToShooting = () => {
        this.player.tanks[this.active.id].actionState = TankTurnState.MOVED;
        this.player.activeTank.set(this.player.tanks[this.active.id]);
        this.draw.state = DrawState.STOPPED;
        // redraw canvas with all current tanks
        this.controller.redrawCanvas();
        // go to tank selection state
        this.controller.changeGameState(GameState.TANK_SELECTION);
    }

    /** The action to be taken at the end of the turn */
    private endTurn() {
        this.draw.state = DrawState.STOPPED;
        // redraw canvas with all current tanks
        this.controller.redrawCanvas();
        // go to tank selection state
        this.controller.changeGameState(GameState.TANK_SELECTION);
    }

    private drawMoveLine = (e: MouseEvent) => {
        this.draw.updateMousePosition(e);
        // draw the movement line if the mouse button is currently being pressed
        if (this.draw.state == DrawState.DRAWING) {
            if (this.line.in(this.active.position, this.draw.mouse)) {
                this.validMove(this.active.color);
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