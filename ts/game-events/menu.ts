import { TanksGameEvent } from "./event";
import { EventController, GameState } from "../event-controller";

export class MenuEvent implements TanksGameEvent {
    context: CanvasRenderingContext2D;
    controller: EventController;

    constructor(controller: EventController, context: CanvasRenderingContext2D) {
        this.controller = controller;
        this.context = context;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.onmousedown = this.someFunc;
    }

    private someFunc = () => {
        console.log("Changing state from MENU EVENT to TANK PLACING");
        this.controller.changeGameState(GameState.TANK_PLACING);
    }
}