// Classes added to the `window` object are global, and visible inside the HTML code.
// Any classes not added to the `window` are invisible (not accessible) from the HTML.
// Global classes
import Controls from './siteControls';
window["Controls"] = Controls;
import { MainMenu, PublicMenuStartGame } from './states/menu';
window["PublicMenuStartGame"] = PublicMenuStartGame;


// Internal classes
import { Ui } from "./ui/ui";
import { GameController, GameState } from './controller';
import { Viewport } from './gameMap/viewport';
import { determineCanvasSize } from "./gameMap/mapSize";

import * as Settings from './settings';

// Scrollbar Width for browsers
// Source: https://www.textfixer.com/tutorials/browser-scrollbar-width.php
const SCROLLBAR_WIDTH = 17;

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    console.log(Settings.IS_MOBILE ? 'Running on mobile' : 'Running on PC');
    // subtracting the scrollbar width prevents unlimited X scrolling to the right
    const hasVerticalScroll = window.innerWidth > document.documentElement.clientWidth;
    console.log("Window vertical scroll:", hasVerticalScroll);
    // Don't subtract if there is no scrollbar
    const viewportWidth = hasVerticalScroll ? window.innerWidth - SCROLLBAR_WIDTH : window.innerWidth;
    const viewportHeight = hasVerticalScroll ? window.innerHeight - SCROLLBAR_WIDTH : window.innerHeight;

    const ui = new Ui(Ui.ID_GAME_UI, viewportWidth, viewportHeight);
    const canvas = <HTMLCanvasElement>document.getElementById(Settings.ID_GAME_CANVAS);
    const mainMenu = new MainMenu(ui, canvas);
    mainMenu.setUpUi();
}

init(); 