import { Color } from "../drawing/color";
import { Viewport } from "../gameMap/viewport";
import { J2H } from "../json2html";
import { Player } from "../objects/player";
import { ITheme } from "../themes/iTheme";
import { CommonUi } from "../tanksUi/common";
import { UiSection } from "./uiSection";
import { Settings } from "../settings";

/**
 * The UiHeading is the top row on the canvas.
 */
export class UiHeading {
    readonly left: UiSection;
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
                "style": "text-align:center; z-index:-1",
                "children": [{
                    "b": {
                        "innerHTML": "&nbsp;"
                    }
                }]
            }
        };

        this.playerTurn = new UiSection(J2H.parse(middleSections));
        this.message = new UiSection(J2H.parse(middleSections));

        htmlElement.appendChild(this.left.htmlElement());
        htmlElement.appendChild(this.playerTurn.htmlElement());
        htmlElement.appendChild(this.message.htmlElement());
        htmlElement.appendChild(this.right.htmlElement());
    }

    background(color: Color) {
        this.htmlElement.style.backgroundColor = color.rgba();
    }

    textColor(color: Color) {
        this.htmlElement.style.color = color.rgba();
    }

    addHome(viewport: Viewport, player: Player, theme: ITheme) {
        if (!Settings.IS_MOBILE) {
            const button_home = CommonUi.button_home(theme);
            button_home.onclick = () => {
                viewport.goTo(player.viewportPosition);
            }
            this.left.add(button_home);
        }
    }

    clear(): void {
        this.left.clear();
        this.playerTurn.clear();
        this.right.clear();
    }
}