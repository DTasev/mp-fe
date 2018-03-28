import { GameController } from "../controller";
import { Draw } from "../drawing/draw";
import { Viewport } from "../gameMap/viewport";
import { Player } from "../objects/player";
import { ITheme } from "../themes/iTheme";
import { Ui } from "../ui/ui";

/** Interface for a playable state of the game. */
export interface IActionState {
    addEventListeners(canvas: HTMLCanvasElement);
    view(viewport: Viewport);
    setUpUi(ui: Ui, viewport: Viewport, theme: ITheme);
}

export interface IPlayState extends IActionState {
    context: CanvasRenderingContext2D;
    controller: GameController;
    player: Player;
    ui: Ui;

    draw: Draw;
}