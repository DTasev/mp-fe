import * as Settings from '../tanks/settings';

import { determineCanvasSize } from "../tanks/gameMap/mapSize";
import { Draw, DrawState } from "../tanks/drawing/draw";
import { Color } from '../tanks/drawing/color';
import { LineCache } from '../tanks/utility/lineCache';
import { Line } from '../tanks/utility/line';
import { Point } from '../tanks/utility/point';

let draw: Draw;

let context: CanvasRenderingContext2D;
let lineCache = new LineCache();
let line = new Line();
const lineColor = Color.black().rgba();

function startDrawingMap(e: MouseEvent) {
    draw.updatePosition(e);
    draw.state = DrawState.DRAWING;
}

function stopDrawingMap(e: MouseEvent) {
    draw.state = DrawState.STOPPED;
    Draw.line(context, line.points[line.points.length - 1], line.points[0], 3, lineColor);
    lineCache.lines.push(line.copy());
    line.points = [];
    draw.last = new Point();
    const d = { "terrain": [] };
    for (let i = 0; i < lineCache.lines.length - 1; i += 2) {
        const obstacle = {};
        const center = lineCache.lines[i + 1];
        obstacle["centerX"] = center.points[0].x;
        obstacle["centerY"] = center.points[0].y;
        obstacle["points"] = lineCache.lines[i];
        d.terrain.push(obstacle);
    }
    console.log(d);
}

function drawMap(e: MouseEvent) {
    if (draw.state == DrawState.DRAWING) {
        draw.updatePosition(e);
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