import { IActionState } from "./iActionState";
import { GameStateController, GameState } from "../gameStateController";
import { Tank } from "../gameObjects/tank";
import { Draw } from "../drawing/draw";
import * as Limit from "../limiters/index";
import { Player } from "../gameObjects/player";
import * as Settings from '../gameSettings';

export class PlacingState implements IActionState {
    private static playerTankPlacement = new Limit.Actions(Settings.NUM_PLAYERS);

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
        this.turn = new Limit.Actions(Settings.NUM_TANKS);
        this.player = player;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.onmousedown = this.addTank;
    }

    private addTank = (e) => {
        this.draw.updateMousePosition(e);
        const tank = new Tank(this.player.tanks.length + 1, this.player, this.draw.mouse.X, this.draw.mouse.Y);
        this.player.tanks.push(tank);
        tank.draw(this.context, this.draw);
        this.turn.take();
        // if we've placed as many objects as allowed, then go to next state
        // next_player is not changed here, as it's set in the controller
        if (this.turn.over()) {
            PlacingState.playerTankPlacement.take();
            // all of the players have placed their tanks, go to moving state
            if (PlacingState.playerTankPlacement.over()) {
                this.controller.shared.next.set(GameState.TANK_MOVEMENT);
                this.controller.changeGameState(GameState.TANK_SELECTION);
            } else {
                this.controller.shared.next.set(GameState.TANK_SELECTION);
                this.controller.changeGameState(GameState.TANK_PLACEMENT);
            }
        }
    }
}