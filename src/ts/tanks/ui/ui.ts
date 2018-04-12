import { GameController } from "../controller";
import { Color } from "../drawing/color";
import { J2H } from "../json2html";
import { ITheme } from "../themes/iTheme";
import { UiBody } from "./uiBody";
import { UiHeading } from "./uiHeading";
import { Settings } from "../settings";


interface IVisualViewport {
    offsetLeft: number;
    offsetTop: number;
}
export class Ui {
    static readonly ID_GAME_UI = "tanks-ui";

    readonly ID_HEADING = "tanks-ui-heading";
    readonly ID_BODY = "tanks-ui-body";

    readonly CLASS_TEXT_SIZE = Settings.IS_MOBILE ? "tanks-ui-heading-mobile-size" : "fa-2x";

    private readonly container: HTMLDivElement;
    private readonly canvasWidth: number;
    private readonly canvasHeight: number;

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
                "id": this.ID_HEADING
            }
        });

        const rowBody = J2H.parse<HTMLDivElement>({
            "div": {
                "className": "w3-row",
                "id": this.ID_BODY
            }
        });

        this.heading = new UiHeading(rowHeading);
        this.body = new UiBody(rowBody);

        this.container.appendChild(rowHeading);
        this.container.appendChild(rowBody);
    }

    private setWidth(width: number) {
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
        // fixed makes the UI fit the viewport and follow it when scrolling
        this.container.style.position = "fixed";
    }

    /**
     * Hides the canvas with the Ui element
     */
    hideCanvas() {
        this.container.style.position = "";
        this.setHeight(this.canvasHeight);
    }

    setPlayer(name: string, theme: ITheme) {
        this.heading.playerTurn.add(J2H.parse({
            "b": {
                "textContent": name + "'s turn.",
                "className": `${this.CLASS_TEXT_SIZE} ` + theme.ui.playerTurnTextClass()
            }
        }));
    }

    message(msg: string, theme: ITheme) {
        const b = document.createElement('b');
        b.classList.add(this.CLASS_TEXT_SIZE, theme.ui.playerMessageClass());
        b.innerHTML = msg === "" ? "&nbsp;" : msg;
        this.heading.message.innerHTML = b.outerHTML;
    }

    background(color: Color) {
        this.container.style.backgroundColor = color.rgba();
    }
    textColor(color: Color) {
        this.container.style.color = color.rgba();
    }

    /**
     * UI scrolling logic is different for mobile - the scrolling is only done during selection.
     */
    mobileMoveToFitView(e: Event): void {
        const visualViewport: IVisualViewport = (<any>window).visualViewport;
        this.container.style.left = visualViewport.offsetLeft + "px";
        this.container.style.top = visualViewport.offsetTop + "px";
    }
}