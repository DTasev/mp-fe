// Classes added to the `window` object are global, and visible inside the HTML code.
// Any classes not added to the `window` are invisible (not accessible) from the HTML.
// Global classes
import Controls from './build/site-controls';
window.Controls = Controls;

// Internal classes
import { Canvas } from "./build/canvas"

var ID_GAME_CANVAS = "tanks-canvas";

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    let canvas = new Canvas(ID_GAME_CANVAS);
    canvas.setDOMResolution(window.innerWidth - 32, window.innerHeight * 0.9);
    canvas.addGameEvents();
}

init(); 