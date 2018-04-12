import { GameController } from "../controller";
import { Viewport } from "../gameMap/viewport";
import { J2H } from "../json2html";
import { Player } from "../objects/player";
import { ITheme } from "../themes/iTheme";
import { Ui } from "../ui/ui";
import { IActionState } from "./iActionState";
import { Color } from "../drawing/color";
import { MainMenu } from "./menu";
import { initialiseGame } from "../main";


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
    addKeyboardShortcuts(canvas: HTMLCanvasElement) { }
    view(viewport: Viewport) { }

    setUpUi(ui: Ui, viewport: Viewport, theme: ITheme) {
        this.ui.hideCanvas();
        this.ui.background(theme.end.background());
        this.ui.body.textColor(theme.end.text());

        const numTanks = this.player.aliveTanks().length;
        const tanksStr = numTanks === 1 ? " tank" : " tanks";

        const [left, middle, right] = this.ui.body.addColumns();
        // the elapsed time will be in total microseconds, divide by 1000 so we get seconds
        const elapsedTime = (Date.now() - this.controller.timeStart.get().getTime()) / 1000;
        const winnerNameDescription = {
            div: {
                children: [
                    {
                        div: {
                            style: "border:1px solid; border-radius:10px; background-color:" + theme.end.scoreScreen().rgba(),
                            className: "w3-padding-64 " + theme.end.titleClass(),
                            children: [{
                                h1: {
                                    textContent: "Map: " + this.controller.mapName()
                                }
                            }, {
                                h1: {
                                    textContent: "Winner " + this.player.name + " with " + numTanks + " tanks!"
                                }
                            }, {
                                h1: {
                                    textContent: "Time elapsed: " + elapsedTime + " seconds"
                                }
                            }, {
                                h1: {
                                    textContent: "Shots taken " + this.player.stats.shotsTaken
                                }
                            }, {
                                h1: {
                                    textContent: "Disabled " + this.player.stats.tanksDisabled + " tanks"
                                }
                            }, {
                                h1: {
                                    textContent: "Killed " + this.player.stats.tanksKilled + " tanks"
                                }
                            }]
                        }
                    }, {
                        div: {
                            children: {
                                button: {
                                    style: "background-color:" + theme.end.scoreScreen().rgba(),
                                    className: MainMenu.CLASS_MENU_BUTTON,
                                    textContent: "New Game",
                                    onclick: () => {
                                        window.location.reload();
                                    }
                                }
                            }
                        }
                    }
                ]
            }

        };

        middle.appendChild(J2H.parse(winnerNameDescription));
        this.ui.body.htmlElement.appendChild(left);
        this.ui.body.htmlElement.appendChild(middle);
        this.ui.body.htmlElement.appendChild(right);
    }
}