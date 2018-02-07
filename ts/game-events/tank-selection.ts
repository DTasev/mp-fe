import { TanksGameEvent } from "./event";
import { EventController, GameState } from "../event-controller";
import { Player } from "../game-objects/player";
import { TanksMath } from "../tanks-math";
import { Draw } from "../draw";
import { Tank } from "../game-objects/tank";
import { ActiveTank } from "./shared-state";

export class SelectionEvent implements TanksGameEvent {
    context: CanvasRenderingContext2D;
    controller: EventController;
    player: Player;
    draw: Draw;

    constructor(controller: EventController, context: CanvasRenderingContext2D, player: Player) {
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
            if (TanksMath.point.collide_circle(this.draw.mouse, tank.position, Tank.DEFAULT_WIDTH)) {
                // highlight the selected tank
                tank.highlight(this.context, this.draw);
                // store the details of the active tank
                this.controller.shared.active = new ActiveTank(id, tank.position);
                // only highlight the first tank
                break;
            }
        }
    }

    mouseUp = (e: MouseEvent) => {
        // if the user has clicked on any of the objects, go into movement state
        if (this.controller.shared.active) {
            this.controller.changeGameState(this.controller.shared.next);
        }
    }
}
