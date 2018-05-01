// Classes added to the `window` object are global, and accessible through the DOM's window variable.
// Any classes not added to the `window` are invisible (not accessible) from the HTML.
// Global classes
import Controls from './siteControls';
import { MainMenu, PublicMenuStartGame } from './states/menu';
window["Controls"] = Controls;
window["PublicMenuStartGame"] = PublicMenuStartGame;

// Internal classes
import { Ui } from "./ui/ui";
import { Settings } from './settings';

// Scrollbar Width for browsers
// Source: https://www.textfixer.com/tutorials/browser-scrollbar-width.php

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    if (Settings.DEBUG) {
        console.log("Running with DEBUG output.");
        console.log(Settings.IS_MOBILE ? 'Running on mobile' : 'Running on PC');
    }

    // declare an empty TouchEvent so that Firefox and Edge don't fail when it's needed for an instanceof check
    if (typeof TouchEvent === 'undefined') {
        window["TouchEvent"] = function TouchEvent() { }
    }

    // subtracting the scrollbar width prevents unlimited X scrolling to the right
    // Don't subtract scrollbar from mobile
    const viewportWidth = Settings.IS_MOBILE ? window.innerWidth : window.innerWidth - Settings.SCROLLBAR_WIDTH;
    const viewportHeight = Settings.IS_MOBILE ? window.innerHeight : window.innerHeight - Settings.SCROLLBAR_WIDTH;
    const ui = new Ui(Ui.ID_GAME_UI, viewportWidth, viewportHeight);

    initialiseGame(ui);
}

init();

export function initialiseGame(ui: Ui) {
    ui.clear();
    ui.hideCanvas();
    const canvas = <HTMLCanvasElement>document.getElementById(Settings.ID_GAME_CANVAS);
    const mainMenu = new MainMenu(ui, canvas);
    mainMenu.setUpUi();
}
