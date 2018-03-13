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

    setUpUi(ui: Ui) {
        this.ui.hideCanvas();
        this.ui.background(Color.transparent());
        this.ui.body.textColor(Color.black());

        const numTanks = this.player.activeTanks().length;
        const tanksStr = numTanks === 1 ? " tank" : " tanks";

        const [left, middle, right] = this.ui.body.addColumns();
        const winnerNameDescription = {
            "h1": {
                "className": "w3-padding-64",
                "textContent": "Winner " + this.player.name + " with " + numTanks + " tanks."
            }
        };

        middle.appendChild(J2H.parse(winnerNameDescription));
        this.ui.body.htmlElement.appendChild(left);
        this.ui.body.htmlElement.appendChild(middle);
        this.ui.body.htmlElement.appendChild(right);
    }
}