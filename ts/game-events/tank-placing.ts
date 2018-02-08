import { IGameActionState } from "./event";
import { EventController, GameState } from "../event-controller";
import { Tank } from "../game-objects/tank";
import { Draw } from "../draw";
import { ActionLimiter } from "../action-limiter";
import { Player } from "../game-objects/player";

export class PlacingState implements IGameActionState {
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
        this.controller = controller;
        this.context = context;
        this.draw = new Draw();
        this.turn = new ActionLimiter();
        this.player = player;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.onmousedown = this.addTank;
    }

    private addTank = (e) => {
        this.draw.updateMousePosition(e);
        const tank = new Tank(this.draw.mouse.X, this.draw.mouse.Y);
        tank.player = this.player;
        this.player.tanks.push(tank);
        tank.draw(this.context, this.draw);
        // if we've placed as many objects as allowed, then go to next state
        if (this.turn.end()) {
            this.controller.shared.next.set(GameState.TANK_MOVING);
            this.controller.changeGameState(GameState.TANK_SELECTION);
        }
    }
}