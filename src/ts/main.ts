// Classes added to the `window` object are global, and visible inside the HTML code.
// Any classes not added to the `window` are invisible (not accessible) from the HTML.
// Global classes
import Controls from './siteControls';
window["Controls"] = Controls;

// Internal classes
import { Canvas } from "./canvas"
import { GameStateController } from './gameStateController';

var ID_GAME_CANVAS = "tanks-canvas";

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    let event_controller = new GameStateController();
    let canvas = new Canvas(ID_GAME_CANVAS, window.innerWidth - 32, window.innerHeight * 0.9, event_controller);
}

init(); 