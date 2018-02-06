import { Canvas } from './canvas';
import { TanksGameEvent } from "./game-events/event";
import { MovingEvent } from "./game-events/tank-moving";

enum GameState {
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

        this.changeGameState(GameState.TANK_MOVING);
    }

    changeGameState(new_state: GameState) {
        this.state = new_state;
        // clears the old event
        // this.game_event.removeEventListeners(this.canvas);
        switch (new_state) {
            case GameState.MENU:
                // save the function that can clear the events for this state
                throw new Error("Not implemented");
                break;
            case GameState.TANK_PLACING:
                throw new Error("Not implemented");
                break;
            case GameState.TANK_MOVING:
                // save the function that can clear the events for this state
                this.game_event = new MovingEvent(this.context);
                this.game_event.addEventListeners(this.canvas);
                break;
            case GameState.TANK_SHOOTING:
                // save the function that can clear the events for this state
                throw new Error("Not implemented");
                break;
            default:
                throw new Error("The game should never be stateless, something has gone terribly wrong");
        }
    }

    addTankMovingEvents() {
        throw new Error("Not implemented");
    }
    removeTankMovingEvents() {
        throw new Error("Not implemented");
    }

    addTankShootingEvents() {
        throw new Error("Not implemented");
    }
    removeTankShootingEvents() {
        throw new Error("Not implemented");
    }

    /** 
     * Mouse events for the menus 
     */
    addMenuEvents() {
        throw new Error("Not implemented");
    }
    removeMenuEvents(): any {
        throw new Error("Method not implemented.");
    }
}