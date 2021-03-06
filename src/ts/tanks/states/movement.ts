import { GameController, GameState } from "../controller";
import { Draw, DrawState } from "../drawing/draw";
import { Viewport } from "../gameMap/viewport";
import * as Limit from "../limiters/index";
import { Player } from "../objects/player";
import { Tank, TankActState, TankHealthState } from "../objects/tank";
import { Settings } from '../settings';
import { MovementUi } from "../tanksUi/movement";
import { ITheme } from "../themes/iTheme";
import { Ui } from "../ui/ui";
import { KeyboardKeys } from "../utility/keyboardKeys";
import { Point } from "../utility/point";
import { IPlayState } from "./iActionState";


export class MovementState implements IPlayState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;
    ui: Ui;

    line: Limit.Length;
    active: Tank;
    draw = new Draw();

    tankMovementInRange = false;

    constructor(controller: GameController, context: CanvasRenderingContext2D, ui: Ui, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.ui = ui;

        this.active = this.player.activeTank.get();
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        if (Settings.IS_MOBILE) {
            canvas.ontouchstart = this.startMovement;
            canvas.ontouchmove = this.drawMoveLine;
            // the mouseup is only on the canvas, otherwise none of the UI buttons can be clicked
            canvas.ontouchend = this.endMovement;
        } else {
            canvas.onmousedown = this.startMovement;
            canvas.onmousemove = this.drawMoveLine;
            // the mouseup is only on the canvas, otherwise none of the UI buttons can be clicked
            canvas.onmouseup = this.endMovement;
        }
    }
    addKeyboardShortcuts(canvas: HTMLCanvasElement) {
        if (!Settings.IS_MOBILE) {
            window.onkeyup = (e: KeyboardEvent) => {
                if (e.keyCode === KeyboardKeys.KEY_Q) {
                    this.goToShooting();
                }
            };
        }
    }
    view(viewport: Viewport) { }
    setUpUi(ui: Ui, viewport: Viewport, theme: ITheme) {
        ui.heading.addHome(viewport, this.player, theme);
        const button_goToShooting = MovementUi.button_goToShooting(theme);
        button_goToShooting.onclick = this.goToShooting;
        ui.heading.right.add(button_goToShooting);
    }

    startMovement = (e: MouseEvent | TouchEvent): void => {
        // if the button clicked is not the left button, do nothing
        if (e instanceof MouseEvent && e.button != 0) {
            return;
        }

        this.draw.updatePosition(e);
        this.line = new Limit.Length(this.active.movementRange);

        // limit the start of the line to be the tank
        this.draw.last = new Point(this.active.position.x, this.active.position.y);
        // limit the length of the line to the maximum allowed tank movement, and disabled tanks can't be moved
        if (this.line.in(this.active.position, this.draw.mouse) && this.active.healthState !== TankHealthState.DISABLED) {
            this.draw.state = DrawState.DRAWING;
            this.drawMovement(this.active.colors.movementLine);
        }
        if (e instanceof TouchEvent) {
            e.preventDefault();
        }
    }

    private drawMovement(color: string) {
        this.tankMovementInRange = true;
        this.draw.mouseLine(this.context, Tank.MOVEMENT_LINE_WIDTH, color);
    }

    endMovement = (e: MouseEvent | TouchEvent) => {
        // if the button clicked is not the left button, do nothing
        if (e instanceof MouseEvent && e.button != 0) {
            return;
        }
        // reset the line limit as the user has let go of the button
        this.line.reset();

        // only act if the position is valid
        if (this.tankMovementInRange) {
            const collisionObstacle = this.controller.collidingWithTerrain(this.draw.mouse, Tank.WIDTH);
            // update the position of the tank in the player array
            const tank = this.player.tanks[this.active.id];

            // the tank will be moved, provided: there is no obstacle
            // OR the obstacle is traversable, and the tank will get an effect
            // if it is NOT traversable, the tank will not move
            if (!collisionObstacle || collisionObstacle.traversable()) {
                // exhaust any previous effects on the tank, ONLY IF the movement is successful
                tank.afterTurnEffects();
                tank.position = this.draw.mouse.copy();
                tank.actionState = TankActState.MOVED;

                this.ui.message("", this.controller.theme);

                // if the obstacle is traversable, it might affect the tank, e.g. slow it down
                if (collisionObstacle) {
                    collisionObstacle.affect(tank);
                    this.ui.message("Tank slowed down!", this.controller.theme);
                }
            } else {
                // the tank collided with an obstacle, do NOT remove the highlight
                this.player.activeTank.set(this.player.tanks[this.active.id]);
                this.ui.message("Tank collides with obstacle!", this.controller.theme);
            }

            // set the player's viewport position to the last position they were looking at
            this.player.viewportPosition = Viewport.current();
        }
        this.endTurn();
        if (e instanceof TouchEvent) {
            e.preventDefault();
        }
    }

    goToShooting = () => {
        this.player.tanks[this.active.id].actionState = TankActState.MOVED;
        this.player.activeTank.set(this.player.tanks[this.active.id]);
        this.endTurn();
    }

    /** The action to be taken at the end of the turn */
    endTurn() {
        this.draw.state = DrawState.STOPPED;
        // redraw canvas with all current tanks
        this.controller.redrawCanvas();
        // go to tank selection state
        this.controller.changeGameState(GameState.TANK_SELECTION, false);
    }

    private drawMoveLine = (e: MouseEvent | TouchEvent) => {
        // draw the movement line if the mouse button is currently being pressed
        if (this.draw.state == DrawState.DRAWING) {
            this.draw.updatePosition(e);
            if (this.line.in(this.active.position, this.draw.mouse)) {
                this.drawMovement(this.active.colors.movementLine);
            } else {
                this.tankMovementInRange = false;
            }
            if (e instanceof TouchEvent) {
                e.preventDefault();
            }
        }
    }
}