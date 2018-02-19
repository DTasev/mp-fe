import { IActionState } from "./gameStates/iActionState";
import { MovingState } from "./gameStates/movement";
import { PlacingState } from "./gameStates/placement";
import { ShootingState } from "./gameStates/shooting";
import { SelectionState } from "./gameStates/selection";
import { MenuState } from "./gameStates/menu";
import { Player } from './gameObjects/player';
import { TanksSharedState } from "./gameStates/sharedState";
import * as Limit from './limiters/index'
import { Draw } from './drawing/draw';
import { Color } from './drawing/color';
import { Line } from './utility/line';
import { LineCache } from './utility/lineCache';
import { TanksMath } from './utility/tanksMath';
import { Tank, TankHealthState } from './gameObjects/tank';
import { Point } from './utility/point';
import { IGameObject } from './gameObjects/iGameObject';
import { Ui } from "./ui";
import * as Settings from './gameSettings';
import { Collision } from "./gameCollision";

export enum GameState {
    MENU,
    TANK_PLACEMENT,
    TANK_MOVEMENT,
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
export class GameController {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private ui: Ui;

    /** The current state of the game */
    private state: GameState;
    /** The current event that carries out the actions for the state */
    private action: IActionState;
    /** The position of the current player in the players array */
    private currentPlayer: number;
    /** All the players in the game */
    private readonly players: Player[] = [];

    /** Stores the all of the shot lines */
    private readonly lineCache = new LineCache();

    /** Flag to specify if the current player's turn is over */
    nextPlayer: boolean = false;
    /** Shared state among game states */
    readonly shared = new TanksSharedState();

    initialise(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, ui: Ui) {
        this.canvas = canvas;
        this.context = context;
        this.ui = ui;

        this.currentPlayer = 0;
        for (let i = 0; i < Settings.NUM_PLAYERS; i++) {
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
     * @param newState 
     */
    changeGameState(newState: GameState) {
        this.state = newState;
        // clears any old events that were added
        this.canvas.onmousedown = null;
        window.onmouseup = null;
        this.canvas.onmouseup = null;
        this.canvas.onmousemove = null;

        // if the state has marked the end of the player's turn, then we go to the next player
        if (this.nextPlayer) {
            if (this.isEveryone()) {
                console.log("Switching player");

                // this is used to escape from placing forever, when all players have placed their tanks
                // then the next state will be taken, which will be movement, afterwards this is used to 
                // keep switching between movement and shooting until the end of the game
                // this.state = this.shared.next.get();
            }
            this.nextPlayer = false;
        }
        const player = this.players[this.currentPlayer];
        console.log("This is", player.name, "playing.");

        switch (this.state) {
            case GameState.MENU:
                this.action = new MenuState(this, this.context);
                console.log("Initialising MENU");
                break;
            case GameState.TANK_PLACEMENT:
                this.action = new PlacingState(this, this.context, player);

                // force the next player after placing tanks
                this.nextPlayer = true;

                console.log("Initialising TANK PLACING");
                break;
            case GameState.TANK_SELECTION:
                console.log("Initialising TANK SELECTION");
                this.action = new SelectionState(this, this.context, player);
                break;
            case GameState.TANK_MOVEMENT:
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
        for (const line_path of this.lineCache.lines()) {
            for (let i = 1; i < line_path.points.length; i++) {
                // old lines are currently half-transparent
                draw.line(this.context, line_path.points[i - 1], line_path.points[i], 1, old_lines_color);
            }
        }
    }

    collide(line: Line) {
        console.log("-------------------- Starting Collision -------------------");
        const numPoints = line.points.length;
        // for every player who isnt the current player
        for (const player of this.players.filter((p) => p.id !== this.currentPlayer)) {
            Collision.collide(line, numPoints, player.tanks);
        }
    }

    cacheLine(path: Line) {
        this.lineCache.points.push(path);
    }

    showUserWarning(message: string) {
        document.getElementById("user-warning").innerHTML = message;
    }

    /** 
     * @returns false if there are still players to take their turn, true if all players have completed their turns for the state
    */
    isEveryone(): boolean {
        if (this.currentPlayer === Settings.NUM_PLAYERS - 1) {
            this.currentPlayer = 0;
            return true;
        }
        this.currentPlayer += 1;
        return false;
    }
}