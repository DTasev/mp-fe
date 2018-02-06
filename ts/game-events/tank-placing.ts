import { TanksGameEvent } from "./event";
import { EventController, GameState } from "../event-controller";
import { Tank } from "../game-objects/tank";
import { Draw } from "../draw";
import { ActionLimiter } from "../action-limiter";
import { Player } from "../game-objects/player";

export class PlacingEvent implements TanksGameEvent {
    context: CanvasRenderingContext2D;
    controller: EventController;
    draw: Draw;
    turn: ActionLimiter;
    player: Player;

    /**
     * 
     * @param controller The events controller, which is used to change the game state after this event is finished.
     * @param context Context on which the objects are drawn
     * @param player 
     */
    constructor(controller: EventController, context: CanvasRenderingContext2D, player: Player) {
        const tank_width = 12;
        console.log("Initialising TANK PLACING");
        this.controller = controller;
        this.context = context;
        this.draw = new Draw(tank_width);
        this.turn = new ActionLimiter();
        this.player = player;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.addEventListener("mousedown", this.addTank, false);
    }
    removeEventListeners(canvas: HTMLCanvasElement) {
        canvas.removeEventListener("mousedown", this.addTank, false);
    }

    private addTank = (e) => {
        this.draw.updateMousePosition(e);
        this.player.tanks.push(new Tank(this.draw.mouse.X, this.draw.mouse.Y, Tank.DEFAULT_WIDTH));
        this.draw.dot(this.context, this.draw.mouse, Tank.DEFAULT_WIDTH);
        if (!this.turn.action()) {
            this.controller.changeGameState(GameState.TANK_MOVING);
        }
    }
}