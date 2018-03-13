import { J2H } from "../json2html";
import { Viewport } from "../gameMap/viewport";
import { Player } from "../gameObjects/player";
import { CommonUi } from "./common";
import { UiSection } from "./uiSection";
import { Color } from "../drawing/color";

export class UiHeading {
    private readonly left: UiSection;
    readonly playerTurn: UiSection;
    readonly message: UiSection;
    readonly right: UiSection;

    private readonly htmlElement: HTMLDivElement;

    constructor(htmlElement: HTMLDivElement) {

        this.htmlElement = htmlElement;


        const leftDescription = {
            "div": {
                "className": "w3-col s1 m1 l1"
            }
        };
        const left = new UiSection(J2H.parse(leftDescription));

        const middleSections = {
            "div": {
                "className": "w3-col s5 m5 l5",
                "style": "text-align:center;"
            }
        };

        const playerTurn = new UiSection(J2H.parse(middleSections));
        const message = new UiSection(J2H.parse(middleSections));

        const rightDescription = {
            "div": {
                "className": "w3-col s1 m1 l1"
            }
        };
        const right = new UiSection(J2H.parse(rightDescription));

        this.left = left;
        this.playerTurn = playerTurn;
        this.message = message;
        this.right = right;
    }

    addTo(rowHeading: HTMLDivElement): void {
        rowHeading.appendChild(this.left.html());
        rowHeading.appendChild(this.playerTurn.html());
        rowHeading.appendChild(this.message.html());
        rowHeading.appendChild(this.right.html());
    }

    background(color: Color) {
        this.htmlElement.style.backgroundColor = color.toRGBA();
    }

    textColor(color: Color) {
        this.htmlElement.style.color = color.toRGBA();
    }

    addHome(viewport: Viewport, player: Player): any {
        const button_home = CommonUi.button_home();
        button_home.onclick = () => {
            viewport.goTo(player.viewportPosition);
        }
        this.left.add(button_home);
    }

    clear(): void {
        this.left.clear();
        this.playerTurn.clear();
        this.message.clear();
        this.right.clear();
    }
}