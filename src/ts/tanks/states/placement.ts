import { GameController, GameState } from "../controller";
import { Draw } from "../drawing/draw";
import { Viewport } from "../gameMap/viewport";
import * as Limit from "../limiters/index";
import { Player } from "../objects/player";
import { Tank } from "../objects/tank";
import { Settings } from '../settings';
import { ITheme } from "../themes/iTheme";
import { Ui } from "../ui/ui";
import { IPlayState } from "./iActionState";


export class PlacingState implements IPlayState {
    private DBL_CLICK_TIMEOUT = 300;

    /* Limit the number of players that can place tanks */
    static playersTankPlacement: Limit.Actions;
    private lastTouch: boolean;

    context: CanvasRenderingContext2D;
    controller: GameController;
    draw: Draw;
    player: Player;
    ui: Ui;

    /* Limit the number of tanks for the current player */
    tanksPlaced: Limit.Actions;

    /**
     * 
     * @param controller The events controller, which is used to change the game state after this event is finished.
     * @param context Context on which the objects are drawn
     * @param player 
     */
    constructor(controller: GameController, context: CanvasRenderingContext2D, player: Player) {
        this.controller = controller;
        this.context = context;
        this.draw = new Draw();
        this.tanksPlaced = new Limit.Actions(controller.numTanks);

        if (!PlacingState.playersTankPlacement) {
            PlacingState.playersTankPlacement = new Limit.Actions(controller.numPlayers);
        }

        this.player = player;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        if (Settings.IS_MOBILE) {
            canvas.ontouchstart = this.addTank;
        } else {
            canvas.onmousedown = this.addTank;
        }
    }

    addKeyboardShortcuts(canvas: HTMLCanvasElement) { }

    view(viewport: Viewport) {
        viewport.goTo(this.player.viewportPosition);
    }

    setUpUi(ui: Ui, viewport: Viewport, theme: ITheme) {
        ui.heading.addHome(viewport, this.player, theme);
    }

    addTank = (e: MouseEvent | TouchEvent) => {
        // if the button clicked is not the left button, do nothing
        if (e instanceof MouseEvent && e.button != 0) {
            return;
        }

        // check for double tap ONLY ON touch screens. TouchEvent will NOT 
        // be fired when using a mouse.
        if (e instanceof TouchEvent && !this.doubleTap(e)) {
            return;
        }

        this.draw.updatePosition(e);

        // if the position of the tank does not collide with existing terrain, then the tank can be placed
        if (!this.controller.collidingWithTerrain(this.draw.mouse, Tank.WIDTH)) {
            const tank = new Tank(this.player.tanks.length, this.player, this.draw.mouse.x, this.draw.mouse.y, this.controller.theme);
            this.player.tanks.push(tank);
            this.player.viewportPosition = Viewport.current();
            tank.draw(this.context);
            // player has placed a tank
            this.tanksPlaced.take();
            // if we've placed as many objects as allowed, then go to next state
            if (this.tanksPlaced.over()) {
                PlacingState.playersTankPlacement.take();
                this.controller.nextPlayer = true;
                // all of the players have placed their tanks, go to moving state
                if (PlacingState.playersTankPlacement.over()) {
                    this.controller.changeGameState(GameState.TANK_SELECTION);
                    // clear the variable, this will allow it to be garbage collected
                    PlacingState.playersTankPlacement = null;
                } else {
                    this.controller.changeGameState(GameState.TANK_PLACEMENT);
                }
            }
        }
    }

    /**
     * Checks if the user performs a double tap. This allows scrolling on mobile
     * before placing the tank, and then double tapping to place the tank.
     * 
     * @param e Touch event triggered by the user tapping on a touch screen
     */
    doubleTap(e: TouchEvent): boolean {
        if (!this.lastTouch) {
            this.lastTouch = true;
            setTimeout(() => { this.lastTouch = null }, this.DBL_CLICK_TIMEOUT);
            return false;
        } else {
            this.lastTouch = null;
            // prevent user scrolling with the second tap
            e.preventDefault();
            return true;
        }
    }
}