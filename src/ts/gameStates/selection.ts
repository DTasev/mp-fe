import { IActionState } from "./iActionState";
import { GameController, GameState } from "../gameController";
import { Player } from "../gameObjects/player";
import { TanksMath } from "../utility/tanksMath";
import { Draw } from "../drawing/draw";
import { Tank, TankHealthState } from "../gameObjects/tank";
import { ActiveTank } from "./sharedState";

export class SelectionState implements IActionState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;
    draw: Draw;

    constructor(controller: GameController, context: CanvasRenderingContext2D, player: Player) {
        this.controller = controller;
        this.context = context;
        this.player = player;
        this.draw = new Draw();
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.onmousedown = this.highlightTank;
        // NOTE: mouseup is on the whole window, so that even if the cursor exits the canvas, the event will trigger
        window.onmouseup = this.mouseUp;
    }

    highlightTank = (e: MouseEvent): void => {
        this.draw.updateMousePosition(e);

        // Check if the user has clicked any tank.
        for (const [id, tank] of this.player.tanks.entries()) {
            // dead tanks can't be selected
            if (TanksMath.point.collideCircle(this.draw.mouse, tank.position, Tank.WIDTH) && tank.healthState !== TankHealthState.DEAD) {
                // highlight the selected tank
                tank.highlight(this.context, this.draw);
                // store the details of the active tank
                this.controller.shared.active.set(new ActiveTank(id, tank.position, tank));
                // only highlight the first tank
                break;
            }
        }
    }

    mouseUp = (e: MouseEvent) => {
        // if the user has clicked on any of the objects, go into movement state
        if (this.controller.shared.active.available()) {
            this.controller.changeGameState(this.controller.shared.next.get());
        }
    }
}
