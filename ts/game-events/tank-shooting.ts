import { IGameActionState } from "./event";
import { EventController, GameState } from "../event-controller";

export class ShootingState implements IGameActionState {
    context: CanvasRenderingContext2D;
    controller: EventController;

    constructor(controller: EventController, context: CanvasRenderingContext2D) {
        console.log("Initialising TANK SHOOTING");
        this.controller = controller;
        this.context = context;
    }

    addEventListeners(canvas: HTMLCanvasElement) {
        canvas.addEventListener("mousedown", this.someFunc, false);
    }
    removeEventListeners(canvas: HTMLCanvasElement) {
        canvas.removeEventListener("mousedown", this.someFunc, false);
    }
    private someFunc = () => {
        console.log("Changing state from TANK SHOOTING to MENU");
        this.controller.changeGameState(GameState.MENU);
    }
}