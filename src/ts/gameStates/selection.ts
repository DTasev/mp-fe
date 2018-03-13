import { IPlayState } from "./iActionState";
import { GameController, GameState } from "../controller";
import { Player } from "../gameObjects/player";
import { TanksMath } from "../utility/tanksMath";
import { Draw } from "../drawing/draw";
import { Tank, TankHealthState, TankTurnState } from "../gameObjects/tank";
import { Ui } from "../ui/ui";
import { IGameObject } from "../gameObjects/iGameObject";
import { Viewport } from "../gameMap/viewport";

export class SelectionState implements IPlayState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;
    draw: Draw;
    ui: Ui;

    currentActiveTank: IGameObject;

    constructor(controller: GameController, context: CanvasRenderingContext2D, ui: Ui, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.draw = new Draw();
        this.ui = ui;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        // keep the current active tank, then switch to the next state
        if (this.player.activeTank.available()) {
            this.currentActiveTank = this.player.activeTank.get();
            this.successfulSelection(this.currentActiveTank);
            // switch to the next state
            this.mouseUp();
        } else {
            canvas.onmousedown = this.mouseDown;
            // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
            window.onmouseup = this.mouseUp;
        }
    }

    view(viewport: Viewport) {
        viewport.goTo(this.player.viewportPosition);
    }

    setUpUi(ui: Ui, viewport: Viewport) {
        ui.heading.addHome(viewport, this.player);
    }

    mouseDown = (e: MouseEvent): void => {
        // if the button clicked is not the left button, do nothing
        if (e.button != 0) {
            return;
        }
        this.draw.updateMousePosition(e);

        // Check if the user has clicked any tank.
        for (const tank of this.player.tanks) {
            // tanks that must not be selected:
            // - dead tanks
            // - tanks that have acted
            // - tanks that the mouse click does not collide with
            if (tank.healthState !== TankHealthState.DEAD &&
                tank.active() &&
                TanksMath.point.collideCircle(this.draw.mouse, tank.position, Tank.WIDTH)) {
                // highlight the selected tank
                this.successfulSelection(tank);
                // only highlight the first tank, if there are multiple on top of each other
                break;
            }
        }
    }

    mouseUp = () => {
        // if the use has clicked a valid tank on mouseDown then go to the appropriate next state
        // based on the tanks' own state, i.e. tank that has moved will go into shooting
        if (this.player.activeTank.available()) {
            this.controller.changeGameState(this.currentActiveTank.nextState());
        }
    }

    private successfulSelection(tank: IGameObject) {
        tank.highlight(this.context, this.draw);
        // store the details of the active tank
        this.player.activeTank.set(tank);
        this.currentActiveTank = tank;
    }
}
