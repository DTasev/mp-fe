// Classes added to the `window` object are global, and visible inside the HTML code.
// Any classes not added to the `window` are invisible (not accessible) from the HTML.
// Global classes
import Controls from './siteControls';
window["Controls"] = Controls;

// Internal classes
import { Ui } from "./ui/ui";
import { GameController, GameState } from './controller';
import { Viewport } from './gameMap/viewport';

const ID_GAME_CANVAS = "tanks-canvas";
const ID_GAME_UI = "tanks-ui";
// Scrollbar Width for browsers
// Source: https://www.textfixer.com/tutorials/browser-scrollbar-width.php
const SCROLLBAR_WIDTH = 17;

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    const height = window.innerHeight * 0.995;
    // const height = 2048;
    // take 90% of the window, leave a bit of gap on the right
    const width = window.innerWidth;
    // const width = 2048;
    // const viewportWidth = window.visualViewport.width;

    // subtracting the scrollbar width prevents unlimited X scrolling to the right

    const hasVerticalScroll = window.innerWidth > document.documentElement.clientWidth;
    // Don't subtract if there is no scrollbar
    const viewportWidth = hasVerticalScroll ? window.innerWidth - SCROLLBAR_WIDTH : window.innerWidth;

    const viewportHeight = window.innerHeight;
    const ui = new Ui(ID_GAME_UI, viewportWidth, viewportHeight);

    const canvas = <HTMLCanvasElement>document.getElementById(ID_GAME_CANVAS);
    canvas.width = width;
    canvas.height = height;
    window.onscroll = (e: Event) => {
        ui.moveToFitView(e);
    };

    const viewport = new Viewport(canvas.width, canvas.height);
    viewport.middle();
    const controller = new GameController(canvas, canvas.getContext("2d"), ui, viewport);

    // start the game in Menu state
    controller.changeGameState(GameState.MENU);
    canvas.scrollIntoView();
}

init(); 