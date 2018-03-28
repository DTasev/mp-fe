import { J2H } from "../json2html";
import { Viewport } from "../gameMap/viewport";
import { Player } from "../objects/player";
import { CommonUi } from "./common";
import { UiSection } from "./uiSection";
import { Color } from "../drawing/color";
import { ITheme } from "../themes/iTheme";

export class UiHeading {
    private readonly left: UiSection;
    readonly playerTurn: UiSection;
    readonly message: UiSection;
    readonly right: UiSection;

    private readonly htmlElement: HTMLDivElement;

    constructor(htmlElement: HTMLDivElement) {

        this.htmlElement = htmlElement;

        const sideDescription = {
            "div": {
                "className": "w3-col s2 m2 l1"
            }
        };

        this.left = new UiSection(J2H.parse(sideDescription));
        this.right = new UiSection(J2H.parse(sideDescription));

        const middleSections = {
            "div": {
                "className": "w3-col s4 m4 l5",
                "style": "text-align:center;"
            }
        };

        this.playerTurn = new UiSection(J2H.parse(middleSections));
        this.message = new UiSection(J2H.parse(middleSections));
    }

    addTo(rowHeading: HTMLDivElement): void {
        rowHeading.appendChild(this.left.html());
        rowHeading.appendChild(this.playerTurn.html());
        rowHeading.appendChild(this.message.html());
        rowHeading.appendChild(this.right.html());
    }

    background(color: Color) {
        this.htmlElement.style.backgroundColor = color.rgba();
    }

    textColor(color: Color) {
        this.htmlElement.style.color = color.rgba();
    }

    addHome(viewport: Viewport, player: Player, theme: ITheme): any {
        const button_home = CommonUi.button_home(theme);
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