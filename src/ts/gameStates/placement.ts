import { IPlayState } from "./iActionState";
import { GameController, GameState } from "../gameController";
import { Tank } from "../gameObjects/tank";
import { Draw } from "../drawing/draw";
import { Player } from "../gameObjects/player";
import { Ui } from "../ui";

import * as Settings from '../gameSettings';
import * as Limit from "../limiters/index";

export class PlacingState implements IPlayState {
    // keeps track of how many players have placed their tanks IN TOTAL
    private static playersTankPlacement = new Limit.Actions(Settings.NUM_PLAYERS);

    context: CanvasRenderingContext2D;
    controller: GameController;
    draw: Draw;
    player: Player;
    ui: Ui;

    tanksPlaced: Limit.Actions;

    /**
     * 
     * @param controller The events controller, which is used to change the game state after this event is finished.
     * @param context Context on which the objects are drawn
     * @param player 
     */
    constructor(controller: GameController, context: CanvasRenderingContext2D, ui: Ui, player: Player) {
        this.controller = controller;
        this.context = context;
        this.draw = new Draw();
        this.tanksPlaced = new Limit.Actions(Settings.NUM_TANKS);
        this.player = player;
        this.ui = ui;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.onmousedown = this.addTank;
    }

    private addTank = (e) => {
        this.draw.updateMousePosition(e);
        // if the future will check if it collides with another tank or terrain
        const tank = new Tank(this.player.tanks.length, this.player, this.draw.mouse.x, this.draw.mouse.y);
        this.player.tanks.push(tank);
        tank.draw(this.context, this.draw);
        // player has placed a tank
        this.tanksPlaced.take();
        // if we've placed as many objects as allowed, then go to next state
        // next_player is not changed here, as it's set in the controller
        if (this.tanksPlaced.over()) {
            PlacingState.playersTankPlacement.take();
            // all of the players have placed their tanks, go to moving state
            if (PlacingState.playersTankPlacement.over()) {
                this.controller.changeGameState(GameState.TANK_SELECTION);
            } else {
                this.controller.changeGameState(GameState.TANK_PLACEMENT);
            }
        }
    }
}