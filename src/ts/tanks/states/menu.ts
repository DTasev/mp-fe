import { GameController, GameState } from "../controller";
import { Color } from "../drawing/color";
import { TanksMap } from "../gameMap/tanksMap";
import { Viewport } from "../gameMap/viewport";
import { J2H } from "../json2html";
import { Player } from "../objects/player";
import { Settings } from '../settings';
import Controls from "../siteControls";
import { ITheme } from "../themes/iTheme";
import { ThemeFactory } from "../themes/themeFactory";
import { Ui } from "../ui/ui";
import { TanksCache } from "../utility/tanksCache";
import { IActionState } from "./iActionState";
import { IMapListData } from "../gameMap/dataInterfaces";
import { Remote } from "../utility/remote";

function getSliderValue(id: string) {
    return parseInt((<HTMLInputElement>document.getElementById(id)).value);
}

export class PublicMenuStartGame {
    static toggleTheme(elem: HTMLDivElement, klass: string) {
        for (const child of elem.parentElement.children) {
            child.classList.remove(klass);
            child.id = "";
        }
        elem.classList.add(klass);
        elem.id = MainMenu.ID_THEME;
    }

    static previousMap() {
        const previousMap = document.getElementById(MainMenu.ID_MAP_CHOICE);
        const nextId = parseInt(previousMap.dataset.mapid) - 1;
        MenuStartGame.setMap(nextId);
    }
    static nextMap() {
        const previousMap = document.getElementById(MainMenu.ID_MAP_CHOICE);
        const nextId = parseInt(previousMap.dataset.mapid) + 1;
        MenuStartGame.setMap(nextId);
    }
    static setMap(id: number) {
        MenuStartGame.setMap(id);
    }
    static toggleFriendlyFire(elem: HTMLLabelElement) {
        const checkbox = <HTMLInputElement>document.getElementById(MainMenu.ID_FRIENDLY_FIRE);
        if (!checkbox.checked) {
            elem.parentElement.classList.add("w3-border", "w3-border-red");
        } else {
            elem.parentElement.classList.remove("w3-border", "w3-border-red");
        }
    }
}
class MenuStartGame {
    static addFriendlyFire(middle: HTMLDivElement) {
        const d = {
            div: {
                className: "w3-row w3-margin",
                children: [
                    {
                        label: {
                            for: MainMenu.ID_FRIENDLY_FIRE,
                            onclick: "PublicMenuStartGame.toggleFriendlyFire(this)",
                            style: "display:inline-block; padding:0 16px;",
                            children: {
                                h2: {
                                    textContent: "Friendly Fire (can kill your own tanks)",
                                }
                            }
                        }
                    }, {
                        input: {
                            className: "w3-check",
                            type: "checkbox",
                            id: MainMenu.ID_FRIENDLY_FIRE
                        }
                    }

                ]
            }
        }
        middle.appendChild(J2H.parse(d));
    }
    static playerColors: Color[];
    static addThemeChoices(middle: HTMLDivElement) {
        const commonClasses = "w3-col s4 m4 l4 w3-padding-16 w3-hover-gray ";
        const activeClass = "w3-red";
        const d_themes = {
            div: {
                className: "w3-row w3-margin",
                children: [{
                    div: {
                        className: commonClasses,
                        textContent: "Sepia",
                        onclick: 'PublicMenuStartGame.toggleTheme(this, "' + activeClass + '")'
                    }
                }, {
                    div: {
                        className: commonClasses,
                        textContent: "Dark",
                        onclick: 'PublicMenuStartGame.toggleTheme(this, "' + activeClass + '")'
                    }
                }, {
                    div: {
                        className: commonClasses,
                        textContent: "Light",
                        onclick: 'PublicMenuStartGame.toggleTheme(this, "' + activeClass + '")'
                    }
                }]
            }
        };
        for (const child of d_themes.div.children) {
            if (child.div.textContent.toLowerCase() === TanksCache.theme) {
                child.div.className += activeClass;
                child.div["id"] = MainMenu.ID_THEME;
                break;
            }
        }
        middle.appendChild(J2H.parse(d_themes));
    }

    static mapsList: IMapListData[];

    static setMapData(mapsList: IMapListData[]) {
        this.mapsList = mapsList;
    }

    static addMapChoices(middle: HTMLDivElement) {
        const map_description = {
            div: {
                className: "w3-row w3-border w3-margin-top",
                children: [{
                    // Displays the current map
                    div: {
                        className: "w3-padding w3-display-container",
                        id: MainMenu.ID_MAP_CHOICE
                    }
                }, {
                    // Displays the arrows underneath
                    div: {
                        className: "w3-container w3-dark-grey w3-padding w3-xlarge",
                        children: [{
                            div: {
                                className: "w3-left",
                                onclick: "PublicMenuStartGame.previousMap()",
                                children: {
                                    i: {
                                        className: "fa fa-arrow-circle-left w3-hover-text-teal"
                                    }
                                }
                            }
                        }, {
                            div: {
                                className: "w3-right",
                                onclick: "PublicMenuStartGame.nextMap()",
                                children: {
                                    i: {
                                        className: "fa fa-arrow-circle-right w3-hover-text-teal"
                                    }
                                }
                            }
                        }, {
                            div: {
                                id: MainMenu.ID_MAP_DOT_CHOICE,
                                className: "w3-center",
                                children: (function () {
                                    const childList = [];
                                    for (let i = 0; i < MenuStartGame.mapsList.length; ++i) {
                                        const span = {
                                            span: {
                                                className: "w3-tag w3-border w3-transparent w3-hover-white tanks-map-dot",
                                                onclick: "PublicMenuStartGame.setMap(" + i + ")"
                                            }
                                        };
                                        childList.push(span);
                                    }
                                    return childList;
                                })()
                            }
                        }]
                    }
                }]
            }
        };
        middle.appendChild(J2H.parse(map_description));
    }

    /**
     * Set the current chosen map on the start game screen
     * @param id The position of the map in the mapsList array, not the ID in the database!
     */
    static setMap(id: number) {
        if (id < 0) {
            // if below 0, go to the last element, this happens if on the first map the user clicks to go to the
            // previous map
            id = this.mapsList.length - 1;
        } else if (id >= this.mapsList.length) {
            // if above/equal to the length of available maps, then wrap back to the first, happens when the user
            // click next on the last map choice
            id = 0;
        }

        const elem = document.getElementById(MainMenu.ID_MAP_DOT_CHOICE);
        for (const child of elem.children) {
            child.classList.remove(MainMenu.CLASS_MAP_DOT_CHOSEN);
        }
        elem.children[id].classList.add(MainMenu.CLASS_MAP_DOT_CHOSEN);

        const map = document.getElementById(MainMenu.ID_MAP_CHOICE);
        // delete the old map
        map.innerHTML = "";
        map.dataset["mapid"] = "" + id;
        const selectedMap = this.mapsList[id];
        map.appendChild(J2H.parse({ h3: { textContent: selectedMap.name, className: "w3-display-top w3-border-bottom", style: "padding-bottom:16px;" } }))
        map.appendChild(J2H.parse({ img: { src: selectedMap.thumbnail_url, style: "height: 300px" } }));
    }

    static addPlayerSettings(middle: HTMLDivElement) {
        const playerSettingsDescription = {
            div: {
                className: "w3-row",
                id: MainMenu.ID_PLAYER_SETTINGS
            }
        };
        middle.appendChild(J2H.parse(playerSettingsDescription));
    }

    static addPlayerSlider(middle: HTMLDivElement) {
        const slider_valueDescription = {
            h1: {
                id: MainMenu.ID_PLAYER_SLIDER_DISPLAY,
                textContent: "Players: 2"
            }
        };
        middle.appendChild(J2H.parse(slider_valueDescription));
        const sliderInput_description = {
            input: {
                type: "range",
                min: 2,
                max: 8,
                value: "2",
                className: "slider",
                id: MainMenu.ID_PLAYER_SLIDER,
                oninput: MenuStartGame.changeNumberOfPlayerSettings
            }
        };
        const sliderInput = J2H.parse<HTMLInputElement>(sliderInput_description);
        sliderInput.value = "2";
        const slider_description = {
            div: {
                className: "w3-row"
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

    static changeNumberOfPlayerSettings() {
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
                    div: {
                        className: "w3-col s3 m3 l3",
                        children: [{
                            div: {
                                className: "w3-row" + MainMenu.ELEMENT_PADDING,
                                children: [{
                                    div: {
                                        className: "w3-row",
                                        children: [{
                                            "label": {
                                                className: "w3-col s3 m3 l3",
                                                "for": MainMenu.ID_PLAYER_NAME + id,
                                                textContent: "Name: "
                                            }
                                        }, {
                                            "input": {
                                                className: "w3-col s9 m9 l9",
                                                "value": "Player " + (id + 1),
                                                "style": "width:65%",
                                                "id": MainMenu.ID_PLAYER_NAME + id
                                            }
                                        }]
                                    }
                                }, {
                                    div: {
                                        className: "w3-row w3-padding-16",
                                        children: [{
                                            "label": {
                                                className: "w3-col s3 m3 l3",
                                                textContent: "Color:",
                                                "for": MainMenu.ID_PLAYER_COLOR + id
                                            }
                                        }, {
                                            "input": {
                                                className: "w3-col s9 m9 l9 player-color",
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

    static addTankSlider(middle: HTMLDivElement): any {
        const slider_valueDescription = {
            h1: {
                id: MainMenu.ID_TANKS_SLIDER_DISPLAY,
                textContent: "Tanks: 1"
            }
        };
        middle.appendChild(J2H.parse(slider_valueDescription));
        const sliderInput_description = {
            input: {
                type: "range",
                min: 1,
                max: Settings.MAX_TANKS,
                value: "1",
                className: "slider",
                id: MainMenu.ID_TANKS_SLIDER,
                oninput: MenuStartGame.changeNumberOfTanks
            }
        };
        const sliderInput = J2H.parse<HTMLInputElement>(sliderInput_description);
        sliderInput.value = "1";
        const slider_description = {
            div: {
                className: "w3-row",
                style: "padding-bottom:32px"
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
    static readonly ELEMENT_PADDING = Settings.IS_MOBILE ? "" : " w3-padding-32";
    static readonly CLASS_MENU_BUTTON = "w3-button tanks-ui-menu-button" + MainMenu.ELEMENT_PADDING;
    static readonly CLASS_MENU_TITLE = "tanks-ui-menu-title" + MainMenu.ELEMENT_PADDING;


    static readonly ID_PLAYER_SLIDER = "slider-players";
    static readonly ID_PLAYER_SLIDER_DISPLAY = "slider-players-value";
    static readonly ID_PLAYER_SETTINGS = "player-settings";
    static readonly ID_PLAYER_NAME = "player-settings-name-";
    static readonly ID_PLAYER_COLOR = "player-settings-color-";

    static readonly ID_FRIENDLY_FIRE = "tanks-friendly-fire";

    static readonly ID_TANKS_SLIDER = "slider-tanks";
    static readonly ID_TANKS_SLIDER_DISPLAY = "slider-tanks-value";

    static readonly ID_THEME = "tanks-theme";
    static readonly ID_MAP_CHOICE = "tanks-map-choice";
    static readonly ID_MAP_DOT_CHOICE = "tanks-map-dot-choice";
    static readonly CLASS_MAP_DOT_CHOSEN = "w3-white";

    static readonly ID_START_GAME_BUTTON = "tanks-ui-start-game";
    static readonly ID_QUICK_START_BUTTON = "tanks-ui-quick-start";

    private readonly ui: Ui;
    private readonly theme: ITheme;
    private readonly canvas: HTMLCanvasElement;

    private mapsList: IMapListData[] = [];
    private mapsListRequest: Promise<XMLHttpRequest>;

    constructor(ui: Ui, canvas: HTMLCanvasElement) {
        this.mapsListRequest = Remote.mapList(
            // success callback - remote was reached, load the remote data
            (remoteMapData: IMapListData[]) => {
                this.mapsList = remoteMapData;
            });
        this.ui = ui;
        this.canvas = canvas;
        this.theme = ThemeFactory.create(TanksCache.theme);

        // set the background color of the page so that it is the same as the theme
        document.body.style.backgroundColor = this.theme.game.canvasBackground().rgba();
    }

    addEventListeners(canvas: HTMLCanvasElement) { }
    addKeyboardShortcuts(canvas: HTMLCanvasElement) { }
    view(viewport: Viewport) { }

    setUpUi = () => {
        this.ui.hideCanvas();
        this.ui.body.clear();
        this.ui.background(this.theme.menu.background());
        this.ui.body.textColor(this.theme.menu.text());
        this.ui.body.textAlign("center");

        const [left, middle, right] = this.ui.body.addColumns();

        const titleDescription = {
            "h1": {
                className: MainMenu.CLASS_MENU_TITLE,
                textContent: "Tanks"
            }
        };

        middle.appendChild(J2H.parse(titleDescription));

        const button_startGameDescription = {
            "button": {
                id: MainMenu.ID_START_GAME_BUTTON,
                className: MainMenu.CLASS_MENU_BUTTON,
                textContent: "Start Game",
                onclick: this.startGameOptions
            }
        };

        const button_startGame = J2H.parse(button_startGameDescription);
        const button_quickStart = <HTMLButtonElement>button_startGame.cloneNode();
        button_quickStart.id = MainMenu.ID_QUICK_START_BUTTON;
        button_quickStart.textContent = "Start 2P";
        button_quickStart.onclick = this.quickStart

        // const button_options = <HTMLButtonElement>button_startGame.cloneNode();
        // button_options.textContent = "Options";
        // button_options.onclick = this.showOptions

        const button_account = <HTMLButtonElement>button_startGame.cloneNode();
        button_account.textContent = "Account";
        button_account.onclick = Controls.w3_open;

        const button_mapCreator = <HTMLButtonElement>button_startGame.cloneNode();
        button_account.textContent = "Map Creator";
        button_account.onclick = () => { window.location.assign("mc.html"); }

        middle.appendChild(button_startGame);
        middle.appendChild(button_quickStart);
        // middle.appendChild(button_options);
        middle.appendChild(button_account);

        this.ui.body.htmlElement.appendChild(left);
        this.ui.body.htmlElement.appendChild(middle);
        this.ui.body.htmlElement.appendChild(right);
    }

    /**
     * Make sure the maps are loaded! Show a loading icon and
     * set an interval to repeatedly check if the maps are loaded
     * @param e Mouse event that triggered the wait
     * @param elementId Id of the element that will show the loading text
     * @param callback Callback function to go back to after the loading is complete
     */
    private waitMapLoad(e: MouseEvent, elementId: string) {
        // Make sure the maps are loaded! Show a loading icon and
        // set an interval to repeatedly check if the maps are loaded
        this.showStartGameLoadingIcon(elementId);
        this.mapsListRequest.then(() => this.removeStartGameLoadingIcon(elementId));
    }
    private quickStart = (e: MouseEvent) => {
        this.waitMapLoad(e, MainMenu.ID_QUICK_START_BUTTON)
        let map = new TanksMap(this.mapsList[0].id);
        let players: Player[] = MenuStartGame.createPlayers(Settings.DEFAULT_NUMBER_PLAYERS, this.theme.game.playerColors());
        this.startGame(map, players, Settings.DEFAULT_NUMBER_TANKS, false, e);
    }

    private showStartGameLoadingIcon(elementId: string) {
        const button = document.getElementById(elementId);
        // the hard-coded width fixes the spinner rotation to be around the center of the icon
        // otherwise it wobbles around
        button.innerHTML = ' Loading maps... <i class="fas fa-circle-notch fa-spin" style="width:38px"></i>';
    }
    private removeStartGameLoadingIcon(elementId: string) {
        const button = document.getElementById(elementId);
        // check if the menu is still present, if the map has loaded during this callback
        // the element will have been removed at this point, and nothing has to be done
        if (button) {
            button.innerHTML = "Finished";
        }
    }
    private startGameOptions = (e: MouseEvent) => {
        this.waitMapLoad(e, MainMenu.ID_START_GAME_BUTTON)

        this.ui.body.clear();
        const [left, middle, right] = this.ui.body.addColumns();

        MenuStartGame.addPlayerSlider(middle);
        MenuStartGame.addPlayerSettings(middle);
        MenuStartGame.addTankSlider(middle);
        MenuStartGame.addFriendlyFire(middle);
        MenuStartGame.setMapData(this.mapsList);
        MenuStartGame.addMapChoices(middle);
        MenuStartGame.addThemeChoices(middle);

        const button_startDescription = {
            "button": {
                className: MainMenu.CLASS_MENU_BUTTON,
                textContent: "Start Game",
                onclick: this.prepareGame
            }
        };

        const button_start = J2H.parse(button_startDescription);
        middle.appendChild(button_start);

        const button_backDescription = {
            "button": {
                className: MainMenu.CLASS_MENU_BUTTON,
                textContent: "Back",
                onclick: this.setUpUi
            }
        };
        const button_back = J2H.parse(button_backDescription);
        middle.appendChild(button_back);

        this.ui.body.htmlElement.appendChild(left);
        this.ui.body.htmlElement.appendChild(middle);
        this.ui.body.htmlElement.appendChild(right);

        // set the defaults that are displayed to the user before anything is changed
        MenuStartGame.playerColors = this.theme.game.playerColors();
        MenuStartGame.changeNumberOfPlayerSettings();
        MenuStartGame.setMap(0);
    }

    private prepareGame = (e: MouseEvent) => {
        const numPlayers = getSliderValue(MainMenu.ID_PLAYER_SLIDER);
        const selectedMap = document.getElementById(MainMenu.ID_MAP_CHOICE);
        const mapdata = this.mapsList[selectedMap.dataset.mapid];
        const map = new TanksMap(mapdata.id);
        const friendlyFire = (<HTMLInputElement>document.getElementById(MainMenu.ID_FRIENDLY_FIRE)).checked;

        this.startGame(map, MenuStartGame.createPlayers(numPlayers), getSliderValue(MainMenu.ID_TANKS_SLIDER), friendlyFire, e);
    }

    /**
     * Activates the selected menu option
     */
    private startGame = (map: TanksMap, players: Player[], numTanks: number, friendlyFire: boolean, e: MouseEvent) => {
        map.ready.then(() => {
            // set up the canvas and the rest of the game
            this.ui.showCanvas();

            // retrieve the selected theme from the start game screen
            const themeInput = document.getElementById(MainMenu.ID_THEME);
            // if not present (when quick start is pressed) or the theme is the same, use the current theme
            const gameTheme = themeInput ? ThemeFactory.create(themeInput.textContent) : this.theme;
            // cache the theme, so that next time the player runs the game it will be that theme
            TanksCache.theme = gameTheme.name;

            document.body.style.backgroundColor = gameTheme.game.canvasBackground().rgba();

            const controller = new GameController(this.canvas, this.canvas.getContext("2d"), this.ui, gameTheme, map, players, numTanks, friendlyFire);
            controller.changeGameState(GameState.TANK_PLACEMENT);
        });
    }
}