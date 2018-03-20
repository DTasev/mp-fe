import { IActionState } from "./iActionState";
import { GameController, GameState } from "../controller";
import { IGameObject } from "../gameObjects/iGameObject";
import { Point } from "../utility/point";
import { Player } from "../gameObjects/player";
import { Draw } from "../drawing/draw";
import { S } from "../utility/stringFormat";
import { Viewport } from "../gameMap/viewport";
import { Ui } from "../ui/ui";
import { J2H } from "../json2html";
import { Color } from "../drawing/color";
import { ITheme } from "../gameThemes/iTheme";


export class GameEndState implements IActionState {

    private controller: GameController;

    private ui: Ui;
    private player: Player;

    constructor(controller: GameController, ui: Ui, player: Player) {
        this.controller = controller;
        this.ui = ui;
        this.player = player;
    }

    addEventListeners(canvas: HTMLCanvasElement) { }

    view(viewport: Viewport) { }

    setUpUi(ui: Ui, viewport: Viewport, theme: ITheme) {
        this.ui.hideCanvas();
        this.ui.background(theme.endGameBackground());
        this.ui.body.textColor(theme.endGameText());

        const numTanks = this.player.activeTanks().length;
        const tanksStr = numTanks === 1 ? " tank" : " tanks";

        const [left, middle, right] = this.ui.body.addColumns();
        // the elapsed time will be in total microseconds, divide by 1000 so we get seconds
        const elapsedTime = (Date.now() - <any>this.controller.timeStart) / 1000;
        const winnerNameDescription = {
            "div": {
                "className": "w3-padding-64 " + theme.endGameTitleClass(),
                "children": [{
                    "h1": {
                        "textContent": "Winner " + this.player.name + " with " + numTanks + " tanks."
                    }
                }, {
                    "h1": {
                        "textContent": "Time elapsed: " + elapsedTime + " seconds."

                    }
                }]
            }
        };

        middle.appendChild(J2H.parse(winnerNameDescription));
        this.ui.body.htmlElement.appendChild(left);
        this.ui.body.htmlElement.appendChild(middle);
        this.ui.body.htmlElement.appendChild(right);
    }
}