import { GameController, GameState } from "../controller";
import { Draw, DrawState } from "../drawing/draw";
import { Viewport } from "../gameMap/viewport";
import * as Limit from "../limiters/index";
import { Player } from "../objects/player";
import { Tank, TankColor, TankHealthState, TankActState } from "../objects/tank";
import { Settings } from '../settings';
import { ITheme } from "../themes/iTheme";
import { MovementUi } from "../tanksUi/movement";
import { Ui } from "../ui/ui";
import { Point } from "../utility/point";
import { IPlayState } from "./iActionState";
import { KeyboardKeys } from "../utility/keyboardKeys";


export class MovingState implements IPlayState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;
    ui: Ui;

    draw: Draw;
    line: Limit.Length;
    active: Tank;
    tankMovementInRange: boolean;

    constructor(controller: GameController, context: CanvasRenderingContext2D, ui: Ui, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.ui = ui;

        this.draw = new Draw();
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
            this.validMove(this.active.color);
        }
        if (e instanceof TouchEvent) {
            e.preventDefault();
        }
    }

    private validMove(tankColors: TankColor) {
        this.tankMovementInRange = true;
        this.draw.mouseLine(this.context, Tank.MOVEMENT_LINE_WIDTH, tankColors.movementLine);
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

            // the tank will be moved provided: there is no obstacle
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

    private goToShooting = () => {
        this.player.tanks[this.active.id].actionState = TankActState.MOVED;
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

    private drawMoveLine = (e: MouseEvent | TouchEvent) => {
        this.draw.updatePosition(e);
        // draw the movement line if the mouse button is currently being pressed
        if (this.draw.state == DrawState.DRAWING) {
            if (this.line.in(this.active.position, this.draw.mouse)) {
                this.validMove(this.active.color);
            } else {
                this.tankMovementInRange = false;
            }
        }
        if (e instanceof TouchEvent) {
            e.preventDefault();
        }
    }
}