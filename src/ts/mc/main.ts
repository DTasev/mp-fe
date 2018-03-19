import * as Settings from '../settings';

import { determineMapSize } from "../gameMap/mapSize";
import { Draw, DrawState } from "../drawing/draw";
import { Color } from '../drawing/color';
import { LineCache } from '../utility/lineCache';
import { Line } from '../utility/line';
import { Point } from '../utility/point';
let draw: Draw;

let context: CanvasRenderingContext2D;
let lineCache = new LineCache();
let line = new Line();
const lineColor = Color.black().toRGBA();

function startDrawingMap(e: MouseEvent) {
    draw.updateMousePosition(e);
    draw.state = DrawState.DRAWING;
}

function stopDrawingMap(e: MouseEvent) {
    draw.state = DrawState.STOPPED;
    Draw.line(context, line.points[line.points.length - 1], line.points[0], 3, lineColor);
    lineCache.lines.push(line.copy());
    line.points = [];
    draw.last = new Point();
    console.log(lineCache.lines);
}

function drawMap(e: MouseEvent) {
    if (draw.state == DrawState.DRAWING) {
        draw.updateMousePosition(e);
        draw.mouseLine(context, 3, lineColor);
        line.points.push(draw.mouse.copy());
    }
}

function init() {
    draw = new Draw();
    draw.state = DrawState.STOPPED;

    const canvasWidth = 2048;
    const canvasHeight = 1024;

    const canvas = <HTMLCanvasElement>document.getElementById(Settings.ID_GAME_CANVAS);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context = canvas.getContext("2d");

    canvas.onmousedown = startDrawingMap;
    canvas.onmouseup = stopDrawingMap;
    canvas.onmousemove = drawMap;
}

init();