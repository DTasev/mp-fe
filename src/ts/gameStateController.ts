import { Canvas } from './canvas';
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
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    /** The current state of the game */
    private state: GameState;
    /** The current event that carries out the actions for the state */
    private action: IActionState;
    private current_player: number;
    private num_players: number;
    private players: Player[];
    private turn: Limit.Actions;

    private line_cache: LinePath[];

    next_player: boolean;
    /** Shared state among game states */
    shared: TanksSharedState;

    initialise(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;
        this.line_cache = [];
        this.next_player = false;
        this.turn = new Limit.Actions(2);
        this.current_player = 0;
        this.players = [new Player("Player 1", Color.next()), new Player("Player 2", Color.next())];
        this.num_players = this.players.length;
        this.shared = new TanksSharedState();
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
                this.action = new MovingState(this, this.context, player);
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

        // draw the last N lines
        for (const line_path of this.line_cache) {
            for (let i = 1; i < line_path.points.length; i++) {
                draw.lineFromPoints(this.context, line_path.points[i - 1], line_path.points[i], 1);
            }
        }
    }

    cacheLine(path: LinePath) {
        this.line_cache.push(path);
    }

    showUserWarning(message: string) {
        document.getElementById("user-warning").innerHTML = message;
    }

    /** 
     * @returns false if there are still players to take their turn, true if all players have completed their turns for the state
    */
    isEveryone(): boolean {
        if (this.current_player === this.num_players - 1) {
            this.current_player = 0;
            return true;
        }
        this.current_player += 1;
        return false;
    }
}