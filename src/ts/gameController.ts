import { IPlayState, IActionState } from "./gameStates/iActionState";
import { MovingState } from "./gameStates/movement";
import { PlacingState } from "./gameStates/placement";
import { ShootingState } from "./gameStates/shooting";
import { SelectionState } from "./gameStates/selection";
import { GameEndState } from "./gameStates/gameEnd";
import { MenuState } from "./gameStates/menu";
import { Player } from './gameObjects/player';
import { Draw } from './drawing/draw';
import { Color } from './drawing/color';
import { Line } from './utility/line';
import { LineCache } from './utility/lineCache';
import { TanksMath } from './utility/tanksMath';
import { Tank, TankHealthState } from './gameObjects/tank';
import { Point } from './utility/point';
import { IGameObject } from './gameObjects/iGameObject';
import { Ui } from "./ui";
import { Collision } from "./gameCollision";
import { Viewport } from "./gameMap/viewport";

import * as Limit from './limiters/index'
import * as Settings from './gameSettings';
import { J2H } from "./json2html";

export enum GameState {
    MENU,
    TANK_PLACEMENT,
    TANK_MOVEMENT,
    TANK_SELECTION,
    TANK_SHOOTING,
    GAME_END
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
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private readonly ui: Ui;
    private readonly viewport: Viewport;

    /** The current state of the game */
    private state: GameState;
    /** The current event that carries out the actions for the state */
    private action: IActionState;
    /** The position of the current player in the players array */
    private currentPlayer: number;
    /** All the players in the game */
    private readonly players: Player[] = [];

    /** Stores the all of the shot lines */
    private readonly lineCache: LineCache;

    /** Flag to specify if the current player's turn is over */
    nextPlayer: boolean = false;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, ui: Ui, viewport: Viewport) {
        this.canvas = canvas;
        this.context = context;
        this.ui = ui;
        this.viewport = viewport;

        this.lineCache = new LineCache();

        let playerPositions = [
            new Point(0, 0),
            new Point(4096, 4096)
        ];
        this.currentPlayer = 0;
        for (let i = 0; i < Settings.NUM_PLAYERS; i++) {
            this.players.push(new Player(i, "Player " + (i + 1), Color.next(), playerPositions[i]));
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
        this.ui.clear();
        this.state = newState;
        // clears any old events that were added
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
        window.onmouseup = null;
        this.canvas.onmousemove = null;

        // if the state has marked the end of the player's turn, then we go to the next player
        if (this.nextPlayer) {
            this.changePlayer();
            this.nextPlayer = false;
        }

        const player = this.players[this.currentPlayer];
        if (this.state !== GameState.MENU && this.state !== GameState.TANK_PLACEMENT && player.activeTanks().length === 0) {
            this.state = GameState.GAME_END;
        }

        console.log("This is", player.name, "playing.");
        this.ui.setPlayer(player.name);

        switch (this.state) {
            case GameState.MENU:
                this.action = new MenuState(this, this.context, this.viewport);
                console.log("Initialising MENU");
                break;
            case GameState.TANK_PLACEMENT:
                console.log("Initialising TANK PLACING");
                this.action = new PlacingState(this, this.context, this.ui, player, this.viewport);

                // force the next player after placing tanks
                this.nextPlayer = true;

                break;
            case GameState.TANK_SELECTION:
                console.log("Initialising TANK SELECTION");
                this.action = new SelectionState(this, this.context, this.ui, player, this.viewport);
                break;
            case GameState.TANK_MOVEMENT:
                console.log("Initialising TANK MOVEMENT");
                this.action = new MovingState(this, this.context, this.ui, player, this.viewport);
                break;
            case GameState.TANK_SHOOTING:
                console.log("Initialising TANK SHOOTING");
                this.action = new ShootingState(this, this.context, this.ui, player, this.viewport);
                break;
            case GameState.GAME_END:
                console.log("Initialising GAME END");
                this.action = new GameEndState(this, this.context, player, this.viewport);
                break
            default:
                throw new Error("The game should never be in an unknown state, something has gone terribly wrong!");
        }

        // add the mouse events for the new state
        this.action.addEventListeners(this.canvas);
    }
    /** Clears everything from the canvas on the screen. To show anything afterwards it needs to be redrawn. */
    clearCanvas(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    changePlayer(): boolean {
        if (this.currentPlayer === Settings.NUM_PLAYERS - 1) {
            this.currentPlayer = 0;
            return true;
        }
        this.currentPlayer += 1;
        return false;
    }
}