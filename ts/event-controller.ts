import { Canvas } from './canvas';
import { TanksGameEvent } from "./game-events/event";
import { MovingEvent } from "./game-events/tank-moving";
import { PlacingEvent } from "./game-events/tank-placing";
import { ShootingEvent } from "./game-events/tank-shooting";
import { MenuEvent } from "./game-events/menu";

export enum GameState {
    MENU,
    TANK_PLACING,
    TANK_MOVING,
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

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    state: GameState;
    game_event: TanksGameEvent;


    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;

        this.game_event = new MenuEvent(this, this.context);
        this.game_event.addEventListeners(this.canvas);
    }

    changeGameState(new_state: GameState) {
        this.state = new_state;
        // clears the old event
        this.game_event.removeEventListeners(this.canvas);
        switch (new_state) {
            case GameState.MENU:
                // save the function that can clear the events for this state
                this.game_event = new MenuEvent(this, this.context);
                this.game_event.addEventListeners(this.canvas);
                break;
            case GameState.TANK_PLACING:
                this.game_event = new PlacingEvent(this, this.context);
                this.game_event.addEventListeners(this.canvas);
                break;
            case GameState.TANK_MOVING:
                // save the function that can clear the events for this state
                this.game_event = new MovingEvent(this, this.context);
                this.game_event.addEventListeners(this.canvas);
                break;
            case GameState.TANK_SHOOTING:
                this.game_event = new ShootingEvent(this, this.context);
                this.game_event.addEventListeners(this.canvas);
                break;
            default:
                throw new Error("The game should never be stateless, something has gone terribly wrong");
        }
    }
}