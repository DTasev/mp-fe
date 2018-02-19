import { IActionState } from "./gameStates/iActionState";
import { MovingState } from "./gameStates/moving";
import { PlacingState } from "./gameStates/placing";
import { ShootingState } from "./gameStates/shooting";
import { SelectionState } from "./gameStates/selection";
import { MenuState } from "./gameStates/menu";
import { Player } from './gameObjects/player';
import { TanksSharedState } from "./gameStates/sharedState";
import * as Limit from './limiters/index'
import { Draw } from './drawing/draw';
import { Color } from './drawing/color';
import { LinePath } from './linePath';
import { LineCache } from './lineCache';
import { TanksMath } from './tanksMath';
import { Tank, TankHealthState } from './gameObjects/tank';
import { CartesianCoords } from './cartesianCoords';
import { IGameObject } from './gameObjects/iGameObject';
import { Ui } from "./ui";

export enum GameState {
    MENU,
    TANK_PLACING,
    TANK_MOVING,
    TANK_SELECTION,
    TANK_SHOOTING
}


/**
 * Implementation for the actions that will be executed according to player actions.
 * 
 * Functions are wrapped to keep `this` context. This is the (e:MouseEvent) => {...} syntax.
 * 
 * In short, because the methods are added as event listeners (and are not called directly), the `this` reference starts pointing
 * towards the `window` object. The closure keeps the `this` to point towards the proper instance of the object.
 * 
 * For more details: https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#red-flags-for-this
 */
export class GameStateController {
    private readonly NUM_PLAYERS: number = 2;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private ui: Ui;

    /** The current state of the game */
    private state: GameState;
    /** The current event that carries out the actions for the state */
    private action: IActionState;
    /** The position of the current player in the players array */
    private current_player: number;
    /** All the players in the game */
    private readonly players: Player[] = [];

    /** Stores the all of the shot lines */
    private readonly line_cache = new LineCache();

    /** Flag to specify if the current player's turn is over */
    next_player: boolean = false;
    /** Shared state among game states */
    readonly shared = new TanksSharedState();

    initialise(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, ui: Ui) {
        this.canvas = canvas;
        this.context = context;
        this.ui = ui;

        this.current_player = 0;
        for (let i = 0; i < this.NUM_PLAYERS; i++) {
            this.players.push(new Player(i, "Player " + (i + 1), Color.next()));
        }
    }

    /**
     * The game events should be in this order:
     * Menu
     * Placing for each player
     * Repeat until game over
     *  Moving, Shooting for P1
     *  Moving, Shooting for P2
     * @param new_state 
     */
    changeGameState(new_state: GameState) {
        this.state = new_state;
        // clears any old events that were added
        this.canvas.onmousedown = null;
        window.onmouseup = null;
        this.canvas.onmousemove = null;

        // if the state has marked the end of the player's turn, then we go to the next player
        if (this.next_player) {
            if (this.isEveryone()) {
                console.log("Switching player");

                // this is used to escape from placing forever, when all players have placed their tanks
                // then the next state will be taken, which will be movement, afterwards this is used to 
                // keep switching between movement and shooting until the end of the game
                this.state = this.shared.next.get();
            }
            this.next_player = false;
        }
        const player = this.players[this.current_player];
        console.log("This is ", player.name, " playing.");

        switch (this.state) {
            case GameState.MENU:
                this.action = new MenuState(this, this.context);
                console.log("Initialising MENU");
                break;
            case GameState.TANK_PLACING:
                this.action = new PlacingState(this, this.context, player);
                this.next_player = true;
                console.log("Initialising TANK PLACING");
                break;
            case GameState.TANK_SELECTION:
                console.log("Initialising TANK SELECTION");
                this.action = new SelectionState(this, this.context, player);
                break;
            case GameState.TANK_MOVING:
                console.log("Initialising TANK MOVEMENT");
                this.action = new MovingState(this, this.context, this.ui, player);
                break;
            case GameState.TANK_SHOOTING:
                console.log("Initialising TANK SHOOTING");
                this.action = new ShootingState(this, this.context, player);
                break;
            default:
                throw new Error("The game should never be in an unknown state, something has gone terribly wrong!");
        }

        // add the mouse events for the new state
        this.action.addEventListeners(this.canvas);
    }
    /** Clears everything from the canvas on the screen. To show anything afterwards it needs to be redrawn. */
    clearCanvas(): void {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    redrawCanvas(draw: Draw): void {
        this.clearCanvas();

        // draw every player for every tank
        for (const player of this.players) {
            for (const tank of player.tanks) {
                tank.draw(this.context, draw);
            }
        }

        const old_lines_color = Color.gray(0.5).toRGBA();
        // draw the last N lines
        for (const line_path of this.line_cache.lines()) {
            for (let i = 1; i < line_path.points.length; i++) {
                // old lines are currently half-transparent
                draw.line(this.context, line_path.points[i - 1], line_path.points[i], 1, old_lines_color);
            }
        }
    }

    debugShot(line_path: LinePath, start: CartesianCoords, end: CartesianCoords, tank: IGameObject, distance: number) {
        console.log("Starting collision debug...");
        for (const line of line_path.points) {
            console.log("(", line.X, ",", -line.Y, ")");
        }
        console.log("Collided with line: (" + start.X + "," + -start.Y + ") (" + end.X + "," + -end.Y + ")");
        console.log("Tank ID: ", tank.id, " (", tank.position.X, ",", -tank.position.Y, ")");
        console.log("Distance: ", distance);
    }

    collide(line_path: LinePath) {
        console.log("-------------------- Starting Collision -------------------");
        const num_points_in_line = line_path.points.length;
        // for every player who isnt the current player
        for (const player of this.players.filter((p) => p.id !== this.current_player)) {
            // loop over all their tanks
            for (const tank of player.tanks) {
                // only do collision detection versus tanks that have not been already killed
                if (tank.health_state !== TankHealthState.DEAD) {
                    // check each line for collision with the tank
                    for (let p = 1; p < num_points_in_line; p++) {
                        const dist = TanksMath.line.circle_center_dist(line_path.points[p - 1], line_path.points[p], tank.position);
                        this.debugShot(line_path, line_path.points[p - 1], line_path.points[p], tank, dist);
                        if (!dist) {
                            continue;
                        }
                        // TODO move out of controller
                        // if the line glances the tank, mark as disabled 
                        if (Tank.WIDTH - Tank.DISABLED_ZONE <= dist && dist <= Tank.WIDTH + Tank.DISABLED_ZONE) {
                            tank.health_state = TankHealthState.DISABLED;
                            console.log("Tank ", tank.id, " disabled!");
                            break;
                        } // if the line passes through the tank, mark dead
                        else if (dist < Tank.WIDTH) {
                            tank.health_state = TankHealthState.DEAD;
                            console.log("Tank ", tank.id, " dead!");
                            break;
                            // the tank has already been processed, we can go to the next one
                        }
                    }
                }
            }
        }
    }

    cacheLine(path: LinePath) {
        this.line_cache.points.push(path);
    }

    showUserWarning(message: string) {
        document.getElementById("user-warning").innerHTML = message;
    }

    /** 
     * @returns false if there are still players to take their turn, true if all players have completed their turns for the state
    */
    isEveryone(): boolean {
        if (this.current_player === this.NUM_PLAYERS - 1) {
            this.current_player = 0;
            return true;
        }
        this.current_player += 1;
        return false;
    }
}