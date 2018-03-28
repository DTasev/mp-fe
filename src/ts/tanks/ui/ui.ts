import { GameController } from "../controller";
import { Color } from "../drawing/color";
import { J2H } from "../json2html";
import { ITheme } from "../themes/iTheme";
import { UiBody } from "./uiBody";
import { UiHeading } from "./uiHeading";


interface IVisualViewport {
    offsetLeft: number;
    offsetTop: number;
}
export class Ui {
    static readonly ID_GAME_UI = "tanks-ui";

    static readonly ID_BUTTON_SKIP_TURN = "tanks-ui-button-skipturn";
    static readonly ID_HEADING = "tanks-ui-heading";
    static readonly ID_BODY = "tanks-ui-body";

    private readonly container: HTMLDivElement;
    private readonly canvasWidth: number;
    private readonly canvasHeight: number;
    private controller: GameController;

    readonly heading: UiHeading;
    readonly body: UiBody;

    constructor(id: string, width: number, height: number) {
        this.container = <HTMLDivElement>document.getElementById(id);
        if (!this.container) {
            throw new Error("The UI DOM element was not found!");
        }

        this.canvasWidth = width;
        this.canvasHeight = height;

        this.setWidth(width);

        const rowHeading = J2H.parse<HTMLDivElement>({
            "div": {
                "className": "w3-row",
                "id": Ui.ID_HEADING
            }
        });

        const rowBody = J2H.parse<HTMLDivElement>({
            "div": {
                "className": "w3-row",
                "id": Ui.ID_BODY
            }
        });

        this.heading = new UiHeading(rowHeading);
        this.heading.addTo(rowHeading);
        this.body = new UiBody(rowBody);

        this.container.appendChild(rowHeading);
        this.container.appendChild(rowBody);
    }
    setWidth(width: number) {
        this.container.style.width = width + "px";
    }

    private setHeight(height: number): void {
        this.container.style.height = height + "px";
    }

    clear() {
        this.heading.clear();
        this.body.clear();
    }

    showCanvas() {
        this.setHeight(0);
    }

    /**
     * Hides the canvas with the Ui element
     */
    hideCanvas() {
        this.setHeight(this.canvasHeight);
    }

    setPlayer(name: string, theme: ITheme) {
        this.heading.playerTurn.add(J2H.parse({
            "b": {
                "textContent": name + "'s turn.",
                "className": "fa-2x " + theme.ui.playerTurnTextClass()
            }
        }));
    }
    /**
     * Adjusts the Ui container to fit the currently viewed part of the page.
     * @param e The window event that is triggered
     */
    moveToFitView(e: Event): void {
        this.container.style.left = window.pageXOffset + "px";
        this.container.style.top = window.pageYOffset + "px";
    }
    mobileMoveToFitView(e: Event): void {
        const visualViewport: IVisualViewport = (<any>window).visualViewport;
        this.container.style.left = visualViewport.offsetLeft + "px";
        this.container.style.top = visualViewport.offsetTop + "px";

    }
    message(msg: string, theme: ITheme) {
        const b = document.createElement('b');
        b.className = "fa-2x " + theme.ui.playerMessageClass();
        b.textContent = msg;
        this.heading.message.innerHTML(b.outerHTML);
    }

    background(color: Color) {
        this.container.style.backgroundColor = color.rgba();
    }
    textColor(color: Color) {
        this.container.style.color = color.rgba();
    }
    setController(controller: GameController): void {
        this.controller = controller;
    }
}