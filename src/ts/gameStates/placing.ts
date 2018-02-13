import { IActionState } from "./iActionState";
import { GameStateController, GameState } from "../gameStateController";
import { Tank } from "../gameObjects/tank";
import { Draw } from "../drawing/draw";
import * as Limit from "../limiters/index";
import { Player } from "../gameObjects/player";

export class PlacingState implements IActionState {
    context: CanvasRenderingContext2D;
    controller: GameStateController;
    draw: Draw;
    turn: Limit.Actions;
    player: Player;

    /**
     * 
     * @param controller The events controller, which is used to change the game state after this event is finished.
     * @param context Context on which the objects are drawn
     * @param player 
     */
    constructor(controller: GameStateController, context: CanvasRenderingContext2D, player: Player) {
        this.controller = controller;
        this.context = context;
        this.draw = new Draw();
        this.turn = new Limit.Actions();
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
            this.controller.shared.next.set(GameState.TANK_SELECTION);
            this.controller.changeGameState(GameState.TANK_PLACING);
        }
    }
}