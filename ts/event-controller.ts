import { Canvas } from './canvas';
import { IGameActionState } from "./game-events/event";
import { MovingState } from "./game-events/tank-moving";
import { PlacingState } from "./game-events/tank-placing";
import { ShootingState } from "./game-events/tank-shooting";
import { SelectionState } from "./game-events/tank-selection";
import { MenuState } from "./game-events/menu";
import { Player } from './game-objects/player';
import { TanksSharedState } from "./game-events/shared-state";

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
export class EventController {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    /** The current state of the game */
    private state: GameState;
    /** The current event that carries out the actions for the state */
    private action: IGameActionState;
    private player: Player;

    /** Shared state among game states */
    shared: TanksSharedState;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;

        this.player = new Player();
        this.shared = new TanksSharedState();

        this.changeGameState(GameState.MENU);
    }

    changeGameState(new_state: GameState) {
        this.state = new_state;
        // clears any old events that were added
        this.canvas.onmousedown = null;
        window.onmouseup = null;
        this.canvas.onmousemove = null;

        switch (new_state) {
            case GameState.MENU:
                this.action = new MenuState(this, this.context);
                console.log("Initialising MENU");
                break;
            case GameState.TANK_PLACING:
                this.action = new PlacingState(this, this.context, this.player);
                console.log("Initialising TANK PLACING");
                break;
            case GameState.TANK_SELECTION:
                console.log("Initialising TANK SELECTION");
                this.action = new SelectionState(this, this.context, this.player);
                break;
            case GameState.TANK_MOVING:
                console.log("Initialising TANK MOVEMENT");
                this.action = new MovingState(this, this.context, this.player);
                break;
            case GameState.TANK_SHOOTING:
                throw new Error("Not implemented yet");
                this.action = new ShootingState(this, this.context);
                break;
            default:
                throw new Error("The game should never be stateless, something has gone terribly wrong");
        }

        // add the mouse events for the new state
        this.action.addEventListeners(this.canvas);
    }
    /** Clears everything from the canvas on the screen. To show anything afterwards it needs to be redrawn. */
    clearCanvas(): void {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
}