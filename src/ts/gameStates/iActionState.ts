import { GameController } from "../gameController";
import { Player } from "../gameObjects/player";
import { Ui } from "../ui";
import { Draw } from "../drawing/draw";

/** Interface for a playable state of the game. */
export interface IActionState {
    addEventListeners(canvas: HTMLCanvasElement);
}

export interface IPlayState extends IActionState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;
    ui: Ui;

    draw: Draw;
}