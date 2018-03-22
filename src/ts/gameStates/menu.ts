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
import Controls from "../siteControls";
import { ITheme } from "../gameThemes/iTheme";
import { IPlayer } from "../gameObjects/iPlayer";
import { TanksMap } from "../gameMap/tanksMap";
import { DarkTheme } from "../gameThemes/dark";
import { LightTheme } from "../gameThemes/light";
import { SepiaTheme } from "../gameThemes/sepia";
import * as Settings from '../settings';

function getSliderValue(id: string) {
    return parseInt((<HTMLInputElement>document.getElementById(id)).value);
}
class MenuStartGame {
    static playerColors: Color[];
    static addMapChoices(middle: HTMLDivElement) {
        const map_description = {
            "div": {
                "className": "w3-row",
                "children": (() => {
                    const e = {
                        "div": {
                            "className": "w3-col s3 m3 l3 w3-padding-64 w3-hover-gray",
                            "textContent": "Map choice"
                        }
                    };
                    const children = [];
                    for (let i = 0; i < 4; i++) {
                        children.push(e);
                    }
                    return children;
                })()
            }
        };
        middle.appendChild(J2H.parse(map_description));
    }

    static addPlayerSettings(middle: HTMLDivElement) {
        const playerSettingsDescription = {
            "div": {
                "className": "w3-row",
                "id": MenuState.ID_PLAYER_SETTINGS
            }
        };
        middle.appendChild(J2H.parse(playerSettingsDescription));
    }

    static addPlayerSlider(middle: HTMLDivElement) {
        const slider_valueDescription = {
            "h1": {
                "id": MenuState.ID_PLAYER_SLIDER_DISPLAY,
                "textContent": "Players: 2"
            }
        };
        middle.appendChild(J2H.parse(slider_valueDescription));
        const sliderInput_description = {
            "input": {
                "type": "range",
                "min": 2,
                "max": 8,
                "value": "2",
                "className": "slider",
                "id": MenuState.ID_PLAYER_SLIDER,
                "oninput": MenuStartGame.changeNumberOfPlayerSettings
            }
        };
        const sliderInput = J2H.parse<HTMLInputElement>(sliderInput_description);
        sliderInput.value = "2";
        const slider_description = {
            "div": {
                "className": "slidecontainer"
            }
        };
        const slider = J2H.parse(slider_description);
        slider.appendChild(sliderInput);
        middle.appendChild(slider);
    }

    static createPlayers(numPlayers: number, colors?: Color[]) {
        let players: Player[] = [];
        for (let i = 0; i < numPlayers; i++) {
            const playerColor = colors ? colors[i] : Color.fromHex((<HTMLInputElement>document.getElementById(MenuState.ID_PLAYER_COLOR + i)).value);
            const playerNameInput = <HTMLInputElement>document.getElementById(MenuState.ID_PLAYER_NAME + i);
            players.push(new Player(i, playerNameInput ? playerNameInput.value : "Player " + (i + 1), playerColor));
        }
        return players;
    }

    static changeNumberOfPlayerSettings(e: Event) {
        const newNumberOfPlayers = getSliderValue(MenuState.ID_PLAYER_SLIDER);

        // update the visual for number of players
        document.getElementById(MenuState.ID_PLAYER_SLIDER_DISPLAY).innerHTML = "Players: " + newNumberOfPlayers

        // add a new block of player options
        const playerSettingsElement = document.getElementById(MenuState.ID_PLAYER_SETTINGS);
        const currentNumberOfPlayers = playerSettingsElement.children.length;
        const playerDifference = newNumberOfPlayers - currentNumberOfPlayers;

        // if players have been removed, then drop the children
        if (playerDifference < 0) {
            playerSettingsElement.removeChild(playerSettingsElement.lastChild);
        } else {
            // players have been added
            const generateSettingsDescription = (id: number) => {
                return {
                    "div": {
                        "className": "w3-col s3 m3 l3",
                        "children": [{
                            "div": {
                                "className": "w3-row w3-padding-32",
                                "children": [{
                                    "div": {
                                        "className": "w3-row",
                                        "children": [{
                                            "label": {
                                                "className": "w3-col s3 m3 l3",
                                                "for": MenuState.ID_PLAYER_NAME + id,
                                                "textContent": "Name: "
                                            }
                                        }, {
                                            "input": {
                                                "className": "w3-col s9 m9 l9",
                                                "value": "Player " + (id + 1),
                                                "style": "width:65%",
                                                "id": MenuState.ID_PLAYER_NAME + id
                                            }
                                        }]
                                    }
                                }, {
                                    "div": {
                                        "className": "w3-row w3-padding-16",
                                        "children": [{
                                            "label": {
                                                "className": "w3-col s3 m3 l3",
                                                "textContent": "Color:",
                                                "for": MenuState.ID_PLAYER_COLOR + id
                                            }
                                        }, {
                                            "input": {
                                                "className": "w3-col s9 m9 l9 player-color",
                                                "type": "color",
                                                "style": "width:65%",
                                                "value": MenuStartGame.playerColors[id].hex(),
                                                "id": MenuState.ID_PLAYER_COLOR + id
                                            }
                                        }]

                                    }
                                }]
                            }
                        }]
                    }
                };
            }

            // subtract the number of already present players
            for (let i = 0; i < playerDifference; i++) {
                playerSettingsElement.appendChild(J2H.parse(generateSettingsDescription(i + currentNumberOfPlayers)));
            }
        }

    }

    static addTanksSlider(middle: HTMLDivElement): any {
        const slider_valueDescription = {
            "h1": {
                "id": MenuState.ID_TANKS_SLIDER_DISPLAY,
                "textContent": "Tanks: 2"
            }
        };
        middle.appendChild(J2H.parse(slider_valueDescription));
        const sliderInput_description = {
            "input": {
                "type": "range",
                "min": 2,
                "max": 8,
                "value": "2",
                "className": "slider",
                "id": MenuState.ID_TANKS_SLIDER,
                "oninput": MenuStartGame.changeNumberOfTanks
            }
        };
        const sliderInput = J2H.parse<HTMLInputElement>(sliderInput_description);
        sliderInput.value = "1";
        const slider_description = {
            "div": {
                "className": "slidecontainer"
            }
        };
        const slider = J2H.parse(slider_description);
        slider.appendChild(sliderInput);
        middle.appendChild(slider);
    }
    static changeNumberOfTanks(e: Event) {
        document.getElementById(MenuState.ID_TANKS_SLIDER_DISPLAY).innerHTML = "Tanks: " + getSliderValue(MenuState.ID_TANKS_SLIDER);
    }
}
export class MenuState implements IActionState {
    static readonly CLASS_MENU_BUTTON = "w3-padding-32 w3-button tanks-ui-menu-button";
    static readonly CLASS_MENU_TITLE = "tanks-ui-menu-title";
    static readonly ID_PLAYER_SLIDER = "slider-players";
    static readonly ID_PLAYER_SLIDER_DISPLAY = "slider-players-value";
    static readonly ID_PLAYER_SETTINGS = "player-settings";
    static readonly ID_PLAYER_NAME = "player-settings-name-";
    static readonly ID_PLAYER_COLOR = "player-settings-color-";

    static readonly ID_TANKS_SLIDER = "slider-tanks";
    static readonly ID_TANKS_SLIDER_DISPLAY = "slider-tanks-value";


    private controller: GameController;
    private ui: Ui;

    constructor(controller: GameController, ui: Ui) {
        this.controller = controller;
        this.ui = ui;
    }

    addEventListeners(canvas: HTMLCanvasElement) { }
    view(viewport: Viewport) { }

    setUpUi = (ui: Ui, viewport: Viewport, theme: ITheme) => {
        this.ui.hideCanvas();
        this.ui.body.clear();
        this.ui.background(theme.menuBackground());
        this.ui.body.textColor(theme.menuText());
        this.ui.body.textAlign("center");

        const [left, middle, right] = this.ui.body.addColumns();

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
                "onclick": this.showGameOptions
            }
        };

        const button_startGame = J2H.parse(button_startGameDescription);
        const button_quickStart = <HTMLButtonElement>button_startGame.cloneNode();
        button_quickStart.textContent = "Start 2P";
        button_quickStart.onclick = this.quickStart

        const button_options = <HTMLButtonElement>button_startGame.cloneNode();
        button_options.textContent = "Options";
        button_options.onclick = this.showOptions

        const button_account = <HTMLButtonElement>button_startGame.cloneNode();
        button_account.textContent = "Account";
        button_account.onclick = Controls.w3_open;

        const button_mapCreator = <HTMLButtonElement>button_startGame.cloneNode();
        button_account.textContent = "Map Creator";
        button_account.onclick = () => { window.location.assign("mc.html"); }


        middle.appendChild(button_startGame);
        middle.appendChild(button_quickStart);
        middle.appendChild(button_options);
        middle.appendChild(button_account);

        this.ui.body.htmlElement.appendChild(left);
        this.ui.body.htmlElement.appendChild(middle);
        this.ui.body.htmlElement.appendChild(right);
    }

    private quickStart = (e: MouseEvent) => {
        let map = new TanksMap("apples");
        let players: Player[] = MenuStartGame.createPlayers(Settings.DEFAULT_NUMBER_PLAYERS, this.controller.theme.playerColors());
        this.startGame(map, players, Settings.DEFAULT_NUMBER_TANKS, e);
    }

    private showGameOptions = (e: MouseEvent) => {
        this.ui.body.clear();
        const [left, middle, right] = this.ui.body.addColumns();

        MenuStartGame.addPlayerSlider(middle);
        MenuStartGame.addPlayerSettings(middle);
        MenuStartGame.addMapChoices(middle);
        MenuStartGame.addTanksSlider(middle);

        const button_startDescription = {
            "button": {
                "className": MenuState.CLASS_MENU_BUTTON,
                "textContent": "Start Game",
                "onclick": this.prepareGame
            }
        };

        const button_start = J2H.parse(button_startDescription);
        middle.appendChild(button_start);

        const button_backDescription = {
            "button": {
                "className": MenuState.CLASS_MENU_BUTTON,
                "textContent": "Back",
                "onclick": () => this.setUpUi(null, null, this.controller.theme)
            }
        };
        const button_back = J2H.parse(button_backDescription);
        middle.appendChild(button_back);

        this.ui.body.htmlElement.appendChild(left);
        this.ui.body.htmlElement.appendChild(middle);
        this.ui.body.htmlElement.appendChild(right);

        MenuStartGame.playerColors = this.controller.theme.playerColors();
        MenuStartGame.changeNumberOfPlayerSettings(null);
    }

    private prepareGame = (e: MouseEvent) => {
        const numPlayers = getSliderValue(MenuState.ID_PLAYER_SLIDER);
        const map = new TanksMap("apples");

        this.startGame(map, MenuStartGame.createPlayers(numPlayers), getSliderValue(MenuState.ID_TANKS_SLIDER), e);
    }

    /**
     * Activates the selected menu option
     */
    private startGame = (map: TanksMap, players: Player[], numTanks: number, e: MouseEvent) => {
        this.ui.showCanvas();
        this.controller.timeStart.set(new Date());
        this.controller.initialise(map, players, numTanks);
        this.controller.changeGameState(GameState.TANK_PLACEMENT);
    }
    private showOptions = (e: MouseEvent) => {
        this.ui.body.clear();
        const [left, middle, right] = this.ui.body.addColumns();

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
                "onclick": () => this.setUpUi(null, null, this.controller.theme)
            }
        };
        const button_back = J2H.parse(button_backDescription);
        middle.appendChild(button_back);

        this.ui.body.htmlElement.appendChild(left);
        this.ui.body.htmlElement.appendChild(middle);
        this.ui.body.htmlElement.appendChild(right);
    }

}