// Classes added to the `window` object are global, and visible inside the HTML code.
// Any classes not added to the `window` are invisible (not accessible) from the HTML.
// Global classes
import Controls from './siteControls';
window["Controls"] = Controls;

// Internal classes
import { Ui } from "./ui";
import { GameStateController, GameState } from './gameStateController';

const ID_GAME_CANVAS = "tanks-canvas";
const ID_GAME_UI = "tanks-ui";

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    const controller = new GameStateController();
    const width = window.innerWidth - 32;
    // take 90% of the window, leave a bit of gap on the right
    const height = window.innerHeight * 0.9;
    const ui = new Ui(ID_GAME_UI, width);
    const canvas = <HTMLCanvasElement>document.getElementById(ID_GAME_CANVAS);
    canvas.width = width;
    canvas.height = height;

    controller.initialise(canvas, canvas.getContext("2d"), ui);

    // start the game in Menu state
    controller.changeGameState(GameState.MENU);
}

init(); 