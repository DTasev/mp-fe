import { IActionState } from "./iActionState";
import { GameController, GameState } from "../controller";
import { IGameObject } from "../objects/iGameObject";
import { Point } from "../utility/point";
import { Player } from "../objects/player";
import { Draw } from "../drawing/draw";
import { Viewport } from "../gameMap/viewport";
import { Ui } from "../ui/ui";
import { Color } from "../drawing/color";
import { J2H } from "../json2html";
import Controls from "../siteControls";
import { ITheme } from "../themes/iTheme";
import { IPlayer } from "../objects/iPlayer";
import { TanksMap } from "../gameMap/tanksMap";
import { ThemeFactory } from "../themes/themeFactory";
import { TanksCache } from "../utility/tanksCache";
import * as Settings from '../settings';

function getSliderValue(id: string) {
    return parseInt((<HTMLInputElement>document.getElementById(id)).value);
}
export class PublicMenuStartGame {
    static toggle(elem: HTMLDivElement, klass: string) {
        for (const child of elem.parentElement.children) {
            child.classList.remove(klass);
            child.id = "";
        }
        elem.classList.add(klass);
        elem.id = MainMenu.ID_THEME;
    }
}
class MenuStartGame {
    static playerColors: Color[];
    static addThemeChoices(middle: HTMLDivElement) {
        const commonClasses = "w3-col s4 m4 l4 w3-padding-16 w3-hover-gray ";
        const activeClass = "w3-red";
        const d_themes = {
            "div": {
                "className": "w3-row w3-margin",
                "children": [{
                    "div": {
                        "className": commonClasses,
                        "textContent": "Sepia",
                        "onclick": 'PublicMenuStartGame.toggle(this, "' + activeClass + '")',
                        "id": MainMenu.ID_THEME
                    }
                }, {
                    "div": {
                        "className": commonClasses,
                        "textContent": "Dark",
                        "onclick": 'PublicMenuStartGame.toggle(this, "' + activeClass + '")'
                    }
                }, {
                    "div": {
                        "className": commonClasses,
                        "textContent": "Light",
                        "onclick": 'PublicMenuStartGame.toggle(this, "' + activeClass + '")'
                    }
                }]
            }
        };
        for (const child of d_themes.div.children) {
            if (child.div.textContent.toLowerCase() === TanksCache.theme) {
                child.div.className += activeClass;
                child.div.id = MainMenu.ID_THEME;
                break;
            }
        }
        middle.appendChild(J2H.parse(d_themes));
    }

    static addMapChoices(middle: HTMLDivElement) {
        const map_description = {
            "div": {
                "className": "w3-row w3-margin",
                "children": (() => {
                    const activeClass = "w3-red";
                    const children = [];
                    for (let i = 0; i < 4; i++) {
                        const e = {
                            "div": {
                                "className": "w3-col s3 m3 l3 w3-padding-64 w3-hover-gray",
                                "textContent": "Map choice",
                                "onclick": 'PublicMenuStartGame.toggle(this, "' + activeClass + '")',
                            }
                        };
                        children.push(e);
                    }
                    children[0]["div"]["id"] = MainMenu.ID_MAP;
                    children[0]["div"]["className"] += " " + activeClass;
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
                "id": MainMenu.ID_PLAYER_SETTINGS
            }
        };
        middle.appendChild(J2H.parse(playerSettingsDescription));
    }

    static addPlayerSlider(middle: HTMLDivElement) {
        const slider_valueDescription = {
            "h1": {
                "id": MainMenu.ID_PLAYER_SLIDER_DISPLAY,
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
                "id": MainMenu.ID_PLAYER_SLIDER,
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
            const playerColor = colors ? colors[i] : Color.fromHex((<HTMLInputElement>document.getElementById(MainMenu.ID_PLAYER_COLOR + i)).value);
            const playerNameInput = <HTMLInputElement>document.getElementById(MainMenu.ID_PLAYER_NAME + i);
            players.push(new Player(i, playerNameInput ? playerNameInput.value : "Player " + (i + 1), playerColor));
        }
        return players;
    }

    static changeNumberOfPlayerSettings(e: Event) {
        const newNumberOfPlayers = getSliderValue(MainMenu.ID_PLAYER_SLIDER);

        // update the visual for number of players
        document.getElementById(MainMenu.ID_PLAYER_SLIDER_DISPLAY).innerHTML = "Players: " + newNumberOfPlayers

        // add a new block of player options
        const playerSettingsElement = document.getElementById(MainMenu.ID_PLAYER_SETTINGS);
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
                                                "for": MainMenu.ID_PLAYER_NAME + id,
                                                "textContent": "Name: "
                                            }
                                        }, {
                                            "input": {
                                                "className": "w3-col s9 m9 l9",
                                                "value": "Player " + (id + 1),
                                                "style": "width:65%",
                                                "id": MainMenu.ID_PLAYER_NAME + id
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
                                                "for": MainMenu.ID_PLAYER_COLOR + id
                                            }
                                        }, {
                                            "input": {
                                                "className": "w3-col s9 m9 l9 player-color",
                                                "type": "color",
                                                "style": "width:65%",
                                                "value": MenuStartGame.playerColors[id].hex(),
                                                "id": MainMenu.ID_PLAYER_COLOR + id
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
                "id": MainMenu.ID_TANKS_SLIDER_DISPLAY,
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
                "id": MainMenu.ID_TANKS_SLIDER,
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
        document.getElementById(MainMenu.ID_TANKS_SLIDER_DISPLAY).innerHTML = "Tanks: " + getSliderValue(MainMenu.ID_TANKS_SLIDER);
    }
}
export class MainMenu implements IActionState {
    static readonly CLASS_MENU_BUTTON = "w3-padding-32 w3-button tanks-ui-menu-button";
    static readonly CLASS_MENU_TITLE = "tanks-ui-menu-title";
    static readonly ID_PLAYER_SLIDER = "slider-players";
    static readonly ID_PLAYER_SLIDER_DISPLAY = "slider-players-value";
    static readonly ID_PLAYER_SETTINGS = "player-settings";
    static readonly ID_PLAYER_NAME = "player-settings-name-";
    static readonly ID_PLAYER_COLOR = "player-settings-color-";

    static readonly ID_TANKS_SLIDER = "slider-tanks";
    static readonly ID_TANKS_SLIDER_DISPLAY = "slider-tanks-value";

    static readonly ID_THEME = "tanks-theme";
    static readonly ID_MAP = "tanks-map";

    private readonly ui: Ui;
    private readonly theme: ITheme;
    private readonly canvas: HTMLCanvasElement;

    constructor(ui: Ui, canvas: HTMLCanvasElement) {
        this.ui = ui;
        this.canvas = canvas;
        this.theme = ThemeFactory.create(TanksCache.theme);
    }

    addEventListeners(canvas: HTMLCanvasElement) { }
    view(viewport: Viewport) { }

    setUpUi = () => {
        this.ui.hideCanvas();
        this.ui.body.clear();
        this.ui.background(this.theme.menuBackground());
        this.ui.body.textColor(this.theme.menuText());
        this.ui.body.textAlign("center");

        const [left, middle, right] = this.ui.body.addColumns();

        const titleDescription = {
            "h1": {
                "className": MainMenu.CLASS_MENU_TITLE,
                "textContent": "Tanks"
            }
        };

        middle.appendChild(J2H.parse(titleDescription));

        const button_startGameDescription = {
            "button": {
                "className": MainMenu.CLASS_MENU_BUTTON,
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
        let players: Player[] = MenuStartGame.createPlayers(Settings.DEFAULT_NUMBER_PLAYERS, this.theme.playerColors());
        this.startGame(map, players, Settings.DEFAULT_NUMBER_TANKS, e);
    }

    private showGameOptions = (e: MouseEvent) => {
        this.ui.body.clear();
        const [left, middle, right] = this.ui.body.addColumns();

        MenuStartGame.addPlayerSlider(middle);
        MenuStartGame.addPlayerSettings(middle);
        MenuStartGame.addTanksSlider(middle);
        MenuStartGame.addMapChoices(middle);
        MenuStartGame.addThemeChoices(middle);

        const button_startDescription = {
            "button": {
                "className": MainMenu.CLASS_MENU_BUTTON,
                "textContent": "Start Game",
                "onclick": this.prepareGame
            }
        };

        const button_start = J2H.parse(button_startDescription);
        middle.appendChild(button_start);

        const button_backDescription = {
            "button": {
                "className": MainMenu.CLASS_MENU_BUTTON,
                "textContent": "Back",
                "onclick": this.setUpUi
            }
        };
        const button_back = J2H.parse(button_backDescription);
        middle.appendChild(button_back);

        this.ui.body.htmlElement.appendChild(left);
        this.ui.body.htmlElement.appendChild(middle);
        this.ui.body.htmlElement.appendChild(right);

        MenuStartGame.playerColors = this.theme.playerColors();
        MenuStartGame.changeNumberOfPlayerSettings(null);
    }

    private prepareGame = (e: MouseEvent) => {
        const numPlayers = getSliderValue(MainMenu.ID_PLAYER_SLIDER);
        const map = new TanksMap("apples");

        this.startGame(map, MenuStartGame.createPlayers(numPlayers), getSliderValue(MainMenu.ID_TANKS_SLIDER), e);
    }

    /**
     * Activates the selected menu option
     */
    private startGame = (map: TanksMap, players: Player[], numTanks: number, e: MouseEvent) => {
        this.ui.showCanvas();

        // retrieve the selected theme from the start game screen
        const themeInput = document.getElementById(MainMenu.ID_THEME);
        // if not present (when quick start is pressed) or the theme is the same, use the current theme
        const gameTheme = themeInput && themeInput.textContent !== this.theme.name ? ThemeFactory.create(themeInput.textContent) : this.theme;
        // cache the theme, so that next time the player runs the game it will be that theme
        TanksCache.theme = gameTheme.name;

        const controller = new GameController(this.canvas, this.canvas.getContext("2d"), this.ui, gameTheme, map, players, numTanks);
        controller.changeGameState(GameState.TANK_PLACEMENT);
    }
    private showOptions = (e: MouseEvent) => {
        this.ui.body.clear();
        const [left, middle, right] = this.ui.body.addColumns();

        const button_emptyOptionDescription = {
            "button": {
                "className": MainMenu.CLASS_MENU_BUTTON,
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
                "className": MainMenu.CLASS_MENU_BUTTON,
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