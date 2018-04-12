import { GameController, GameState } from "../controller";
import { Draw, DrawState } from "../drawing/draw";
import { ObstacleType } from "../gameMap/obstacle";
import { Viewport } from "../gameMap/viewport";
import * as Limit from "../limiters/index";
import { Player } from "../objects/player";
import { Tank, TankColor, TankActState } from "../objects/tank";
import { Settings } from '../settings';
import { ITheme } from "../themes/iTheme";
import { ShootingUi } from "../tanksUi/shooting";
import { Ui } from "../ui/ui";
import { Line } from "../utility/line";
import { Point } from "../utility/point";
import { TanksMath } from "../utility/tanksMath";
import { IPlayState } from "./iActionState";
import { KeyboardKeys } from "../utility/keyboardKeys";
import { Particles } from "../utility/particles";



export class ShootingState implements IPlayState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;
    ui: Ui;

    draw: Draw;

    /** The current active tank */
    active: Tank;

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
            player.tanksShot.set(new Limit.Actions(player.aliveTanks().length));
        }

        this.active = this.player.activeTank.get();
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        if (Settings.IS_MOBILE) {
            canvas.ontouchstart = this.startShooting;
            canvas.ontouchmove = this.continueShooting;
            // the mouseup is only on the canvas, otherwise none of the UI buttons can be clicked
            canvas.ontouchend = this.stopShooting;
        } else {
            canvas.onmousedown = this.startShooting;
            canvas.onmousemove = this.continueShooting;
            window.onmouseup = this.stopShooting;
        }
    }
    addKeyboardShortcuts(canvas: HTMLCanvasElement) {
        if (!Settings.IS_MOBILE) {
            window.onkeyup = (e: KeyboardEvent) => {
                if (e.keyCode === KeyboardKeys.KEY_Q) {
                    this.skipTurn();
                }
            };
        }
    }

    view(viewport: Viewport) { }

    setUpUi(ui: Ui, viewport: Viewport, theme: ITheme) {
        ui.heading.addHome(viewport, this.player, theme);
        const button_skipTurn = ShootingUi.button_skipTurn(theme);
        button_skipTurn.onmousedown = this.skipTurn;
        ui.heading.right.add(button_skipTurn);
    }

    private startShooting = (e: MouseEvent | TouchEvent) => {
        console.log('Starting shooting');
        // if the button clicked is not the left button, do nothing
        if (e instanceof MouseEvent && e.button != 0) {
            return;
        }
        this.draw.updatePosition(e);
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
                this.validRange(this.active.color);
            }
        }
    }

    private validRange(tankColors: TankColor): void {
        this.draw.mouseLine(this.context, Tank.MOVEMENT_LINE_WIDTH, tankColors.shootingLine);
    }

    private continueShooting = (e: MouseEvent | TouchEvent) => {
        this.draw.updatePosition(e);

        // draw the movement line if the mouse button is currently being pressed
        if (this.draw.state == DrawState.DRAWING) {
            // if the player is just moving about on the tank's space
            if (this.tankRoamingLength.in(this.active.position, this.draw.mouse)) {
                this.validRange(this.active.color);
            } // if the player has shot far away start drawing the line
            else if (this.shotSpeed.enough(this.active.position, this.draw.mouse)) {
                this.validRange(this.active.color);

                // only add to the shot path if the shot was successful
                this.shotPath.points.push(this.draw.mouse.copy());

                // if the shot has reached the max allowed limit we stop the drawing, this is an artificial
                // limitation to stop a shot that goes along the whole screen
                if (!this.shotLength.add(this.active.position, this.draw.mouse)) {
                    this.ui.message("Successful shot!", this.controller.theme);

                    this.successfulShot = true;
                    this.draw.state = DrawState.STOPPED;
                }
            } else {
                this.ui.message("Shooting too slow!", this.controller.theme);
                this.draw.state = DrawState.STOPPED;
            }
        }
        if (e instanceof TouchEvent) {
            e.preventDefault();
        }
    }

    private stopShooting = (e: MouseEvent | TouchEvent) => {
        // if the button clicked is not the left button, do nothing
        if (e instanceof MouseEvent && e.button != 0) {
            return;
        }

        // set the player's viewport position to the last position they were looking at
        this.player.viewportPosition = Viewport.current();

        const playerTanksShot = this.player.tanksShot.get();
        // for the shot to be sucessful - it must be fast enough, and not collide with any terrain
        if (this.successfulShot) {
            this.shoot(playerTanksShot);
        }

        // if all the player's tank have shot
        const remainingTanks = this.player.activeTanks().length;
        console.log("Player ", this.player.name, "remaining tanks", remainingTanks);
        if (remainingTanks === 0) {
            console.log("Player shooting turn over!");
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

    private shoot(playerTanksShot: Limit.Actions) {
        playerTanksShot.take();
        this.player.stats.shotsTaken += 1;
        console.log("Player has taken a successful shot, limit:", playerTanksShot.limit, "left:", playerTanksShot.left());
        this.active.actionState = TankActState.SHOT;
        Particles.smoke(this.active);

        // for each segment of the path, perform collision
        const shotPathLength = this.shotPath.points.length;
        // this variable is used after the for loop in order to trim segments of the shot that are
        // inside obstacles, or removed due to shooting through wood
        let i: number;
        let trimIncrement = 2;
        for (i = 0; i < shotPathLength - 1; i++) {
            const start = this.shotPath.points[i];
            const end = this.shotPath.points[i + 1];

            let [shotTerrainCollisionPoint, obstacle] = this.controller.lineCollidingWithTerrain(start, end);
            // if there is a collision point, use it as the END OF THE SHOT, this means if there is a tank in
            // that space it will still be hit, furthermore no more collision is done as the rest of the shot
            // is inside the obstacle
            if (shotTerrainCollisionPoint) {
                // if it's wood the intersection point IS NOT the one we collide against, as the shot will
                // penetrate the wood obstacle for 1 more length
                if (obstacle.type === ObstacleType.WOOD) {
                    // i + 2 here gives us the end of the NEXT shot segment, thus making the shot earlier than usual 
                    // handle the case where the last part of the shot has penetrated
                    const nextShot = i + 2 >= shotPathLength ? shotPathLength - 1 : i + 2;
                    shotTerrainCollisionPoint = this.shotPath.points[nextShot];
                    // the trimIncrement needs to be incremented, so that the part that penetrated is visible
                    // if this is not done, then the penetrating part of the shot is NOT rendered on the canvas
                    trimIncrement = 3;
                }
                // the NEW END is the collision point of the shot with the obstacle
                this.controller.collide(start, shotTerrainCollisionPoint);
                // this is also the last collision, any further shot segments will be INSIDE the obstacle
                break;
            } else {
                // the shot DOES NOT collide with an obstacle
                this.controller.collide(start, end);
            }
        }
        // trim the path if it collided with an obstacle, two is added because the lines must be
        // trimmed after the end point (i + 1), and slice trims in range [start, end)
        if (trimIncrement < shotPathLength) {
            this.shotPath.points = this.shotPath.points.slice(0, i + trimIncrement);
        }
        this.controller.cacheLine(this.shotPath);
    }
    private skipTurn = () => {
        console.log('skip turn');
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