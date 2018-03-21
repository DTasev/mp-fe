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

export class MenuState implements IActionState {
    static readonly CLASS_MENU_BUTTON = "w3-padding-32 w3-button tanks-ui-menu-button";
    static readonly CLASS_MENU_TITLE = "tanks-ui-menu-title";
    static readonly ID_SLIDER = "slider-players";
    static readonly ID_SLIDER_PLAYERS = "slider-players-value";
    static readonly ID_PLAYER_SETTINGS = "startgame-player-settings";


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
        button_quickStart.textContent = "Quick Start (2 Players)";
        button_quickStart.onclick = this.quickStart

        const button_options = <HTMLButtonElement>button_startGame.cloneNode();
        button_options.textContent = "Options";
        button_options.onclick = this.showOptions

        const button_account = <HTMLButtonElement>button_startGame.cloneNode();
        button_account.textContent = "Account";
        button_account.onclick = Controls.w3_open;
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
        let players: Player[] = this.createPlayers(Settings.NUM_PLAYERS);
        this.startGame(map, players, e);
    }

    private sliderPlayerChange = (e: Event) => {
        const numPlayers = parseInt((<HTMLInputElement>document.getElementById(MenuState.ID_SLIDER)).value);
        // update the visual for number of players

        document.getElementById(MenuState.ID_SLIDER_PLAYERS).innerHTML = "Players: " + numPlayers
        // add a new block of player options

        const playerSettingsElement = document.getElementById(MenuState.ID_PLAYER_SETTINGS);
        playerSettingsElement.innerHTML = "";
        const settings_description = {
            "div": {
                "className": "w3-col s3 m3 l3",
                "textContent": "Player stuff goes here"
            }
        }
        for (let i = 0; i < numPlayers; i++) {
            playerSettingsElement.appendChild(J2H.parse(settings_description));
        }
    }
    private showGameOptions = (e: MouseEvent) => {
        this.ui.body.clear();
        const [left, middle, right] = this.ui.body.addColumns();

        const sliderInput_description = {
            "input": {
                "type": "range",
                "min": 2,
                "max": 8,
                "value": "2",
                "className": "slider",
                "id": MenuState.ID_SLIDER,
                "oninput": this.sliderPlayerChange
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

        const slider_valueDescription = {
            "h1": {
                "id": MenuState.ID_SLIDER_PLAYERS,
                "textContent": "Players: 2"
            }
        }
        middle.appendChild(J2H.parse(slider_valueDescription));

        const playerSettingsDescription = {
            "div": {
                "className": "w3-row",
                "id": MenuState.ID_PLAYER_SETTINGS
            }
        };
        middle.appendChild(J2H.parse(playerSettingsDescription));
        debugger
        this.sliderPlayerChange(null);

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
        }

        middle.appendChild(J2H.parse(map_description));

        const button_startDescription = {
            "button": {
                "className": MenuState.CLASS_MENU_BUTTON,
                "onclick": this.prepareGame
            }
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

    private prepareGame = (e: MouseEvent) => {
        const numPlayers = parseInt((<HTMLInputElement>document.getElementById(MenuState.ID_SLIDER)).value);
        const map = new TanksMap("apples");
        this.startGame(map, this.createPlayers(numPlayers), e);
    }

    /**
     * Activates the selected menu option
     */
    private startGame = (map: TanksMap, players: Player[], e: MouseEvent) => {
        this.ui.showCanvas();
        this.controller.timeStart.set(new Date());
        // this should create the theme the map, the players, etc?
        this.controller.initialise(map, players);
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


    private createPlayers(numPlayers: number) {
        let players: Player[] = [];
        for (let i = 0; i < numPlayers; i++) {
            players.push(new Player(i, "Player " + (i + 1), this.controller.theme.nextPlayerColor()));
        }
        return players;
    }
}