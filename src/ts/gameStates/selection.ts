import { IPlayState } from "./iActionState";
import { GameController, GameState } from "../gameController";
import { Player } from "../gameObjects/player";
import { TanksMath } from "../utility/tanksMath";
import { Draw } from "../drawing/draw";
import { Tank, TankHealthState, TankTurnState } from "../gameObjects/tank";
import { Ui } from "../ui";
import { IGameObject } from "../gameObjects/iGameObject";

export class SelectionState implements IPlayState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;
    draw: Draw;
    ui: Ui;

    active: IGameObject;

    constructor(controller: GameController, context: CanvasRenderingContext2D, ui: Ui, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.draw = new Draw();
        this.ui = ui;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        // cheat and keep the current active tank, while switching to the next state
        if (this.player.activeTank.available()) {
            this.active = this.player.activeTank.get();
            this.successfulSelection(this.active);
            this.mouseUp();
        } else {
            canvas.onmousedown = this.highlightTank;
            // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
            canvas.onmouseup = this.mouseUp;
        }
    }

    highlightTank = (e: MouseEvent): void => {
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
        // if the user has clicked on any of the objects, go into movement state
        if (this.player.activeTank.available()) {
            let nextState: GameState;
            switch (this.active.actionState) {
                case TankTurnState.NOT_ACTED:
                    nextState = GameState.TANK_MOVEMENT;
                    break;
                case TankTurnState.MOVED:
                    nextState = GameState.TANK_SHOOTING;
                    break;
                case TankTurnState.SHOT:
                    nextState = GameState.TANK_SELECTION;
                    break;
            }

            this.controller.changeGameState(nextState);
        }
    }

    private successfulSelection(tank: IGameObject) {
        tank.highlight(this.context, this.draw);
        // store the details of the active tank
        this.player.activeTank.set(tank);
        this.active = tank;
    }
}
