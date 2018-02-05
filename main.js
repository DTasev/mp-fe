import { Canvas } from "./build/canvas"
import Controls from './build/site-controls';
window.Controls = Controls;

var ID_GAME_CANVAS = "tanks-canvas";

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
    let canvas = new Canvas(ID_GAME_CANVAS);
    canvas.setDOMResolution(window.innerWidth - 32, window.innerHeight * 0.9);
}

init(); 