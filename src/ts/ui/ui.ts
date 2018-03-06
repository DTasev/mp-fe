import { J2H } from "../json2html";
import { Viewport } from "../gameMap/viewport";
import { Player } from "../gameObjects/player";
import { CommonUi } from "./common";

interface IUiSection {
    add(elem: HTMLElement);
    clear();
}

class UiSection implements IUiSection {
    private readonly element: HTMLElement;

    constructor(elem: HTMLElement) {
        this.element = elem;
    }

    add(elem: HTMLElement) {
        if (this.element.innerHTML === "&nbsp;") {
            this.element.innerHTML = "";
        }
        this.element.appendChild(elem);
    }
    clear() {
        this.element.innerHTML = "&nbsp;";
    }
    html(): HTMLElement {
        return this.element;
    }
    innerHTML(content: string) {
        this.element.innerHTML = content;
    }
}

export class Ui {
    static readonly ID_BUTTON_SKIP_TURN = "tanks-ui-button-skipturn";
    private readonly container: HTMLDivElement;

    private readonly left: UiSection;
    readonly playerTurn: UiSection;
    readonly message: UiSection;
    readonly right: UiSection;

    constructor(id: string, width: number) {
        this.container = <HTMLDivElement>document.getElementById(id);
        if (!this.container) {
            throw new Error("The UI DOM element was not found!");
        }

        this.setWidth(width);

        const left = {
            "div": {
                "className": "w3-col s1 m1 l1"
            }
        };
        this.left = new UiSection(J2H.parse(left));

        const middleSections = {
            "div": {
                "className": "w3-col s5 m5 l5",
                "style": "text-align:center;"
            }
        };

        this.playerTurn = new UiSection(J2H.parse(middleSections));
        this.message = new UiSection(J2H.parse(middleSections));

        const right = {
            "div": {
                "className": "w3-col s1 m1 l1"
            }
        };
        this.right = new UiSection(J2H.parse(right));

        this.container.appendChild(this.left.html());
        this.container.appendChild(this.playerTurn.html());
        this.container.appendChild(this.message.html());
        this.container.appendChild(this.right.html());
    }
    setWidth(width: number) {
        this.container.style.width = width + "px";
    }

    clear() {
        this.left.clear();
        this.playerTurn.clear();
        this.message.clear();
        this.right.clear();
    }

    setPlayer(name) {
        this.playerTurn.add(J2H.parse({
            "b": {
                "textContent": name + "'s turn.",
                "className": "fa-2x"
            }
        }));
    }
    update(e: Event): void {
        this.container.style.left = window.pageXOffset + "px";
        this.container.style.top = window.pageYOffset + "px";
    }
    warning(msg: string) {
        console.log("Adding warning message", msg);
        this.message.add(J2H.parse({
            "b": {
                "textContent": msg,
                "className": "fa-2x"
            }
        }));
    }

    addHome(viewport: Viewport, player: Player): void {
        const button_home = CommonUi.button_home();
        button_home.onclick = () => {
            viewport.goTo(player.viewportPosition);
        }
        this.left.add(button_home);
    }
}