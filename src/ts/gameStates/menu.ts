import { IActionState } from "./iActionState";
import { GameController, GameState } from "../controller";
import { IGameObject } from "../gameObjects/iGameObject";
import { Point } from "../utility/point";
import { Player } from "../gameObjects/player";
import { Draw } from "../drawing/draw";
import { Viewport } from "../gameMap/viewport";
import { Ui } from "../ui/ui";
import { Color } from "../drawing/color";
import { J2H } from "../json2html";

class MenuUi {
    constructor(htmlElement: HTMLDivElement) {

    }
}
export class MenuState implements IActionState {
    static readonly CLASS_MENU_BUTTON = "w3-padding-32 w3-button tanks-ui-menu-button";
    static readonly CLASS_MENU_TITLE = "tanks-ui-menu-title";


    private controller: GameController;
    private ui: Ui;

    constructor(controller: GameController, ui: Ui) {
        this.controller = controller;
        this.ui = ui;
    }

    // IActionsState interface methods
    addEventListeners(canvas: HTMLCanvasElement) {
    }

    view(viewport: Viewport) { }
    setUpUi = (ui: Ui, viewport: Viewport) => {
        this.ui.body.clear();
        this.ui.background(Color.black());
        this.ui.body.textColor(Color.white());
        this.ui.body.textAlign("center");

        const { left, middle, right } = this.addColumns();

        const titleDescription = {
            "h1": {
                "className": MenuState.CLASS_MENU_TITLE,
                "textContent": "Tanks"
            }
        };

        middle.appendChild(J2H.parse(titleDescription));

        const button_startGameDescription = {
            "button": {
                "className": MenuState.CLASS_MENU_BUTTON,
                "textContent": "Start Game",
                "onclick": this.actionStartGame
            }
        };

        const button_startGame = J2H.parse(button_startGameDescription);
        const button_options = <HTMLButtonElement>button_startGame.cloneNode();
        button_options.textContent = "Options";
        button_options.onclick = this.showOptions;
        middle.appendChild(button_startGame);
        middle.appendChild(button_options);

        this.ui.body.htmlElement.appendChild(left);
        this.ui.body.htmlElement.appendChild(middle);
        this.ui.body.htmlElement.appendChild(right);
    }

    private addColumns() {
        // these are on the side of the menu buttons, to pad it out so that it can be in the middle
        const sideDescription = {
            "div": {
                "className": "w3-col s1 m2 l2",
                // tells the browser to render a whitespace and respect the CSS styling classes
                "innerHTML": "&nbsp;"
            }
        };
        const middleDescription = {
            "div": {
                "className": "w3-col s10 m8 l8"
            }
        };
        const left = J2H.parse<HTMLDivElement>(sideDescription);
        const right = J2H.parse<HTMLDivElement>(sideDescription);
        const middle = J2H.parse<HTMLDivElement>(middleDescription);
        return { left, middle, right };
    }

    /**
     * Activates the selected menu option
     */
    private actionStartGame = (e: MouseEvent) => {
        this.ui.showCanvas();
        this.controller.changeGameState(GameState.TANK_PLACEMENT);
    }
    private showOptions = (e: MouseEvent) => {
        this.ui.body.clear();
        const { left, middle, right } = this.addColumns();

        const button_emptyOptionDescription = {
            "button": {
                "className": MenuState.CLASS_MENU_BUTTON,
                "textContent": "Option",
                "onclick": () => { throw new Error("Menu option not implemented"); }
            }
        };

        for (let i = 0; i < 5; i++) {
            const button_emptyOption = J2H.parse(button_emptyOptionDescription);
            button_emptyOption.textContent += " " + i;
            middle.appendChild(button_emptyOption);
        }

        const button_backDescription = {
            "button": {
                "className": MenuState.CLASS_MENU_BUTTON,
                "textContent": "Back",
                "onclick": this.setUpUi
            }
        };
        const button_back = J2H.parse(button_backDescription);
        middle.appendChild(button_back);

        this.ui.body.htmlElement.appendChild(left);
        this.ui.body.htmlElement.appendChild(middle);
        this.ui.body.htmlElement.appendChild(right);
    }

}