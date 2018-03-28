import { Color } from '../tanks/drawing/color';
import { Draw, DrawState } from "../tanks/drawing/draw";
import * as Settings from '../tanks/settings';
import { Line } from '../tanks/utility/line';
import { LineCache } from '../tanks/utility/lineCache';
import { Point } from '../tanks/utility/point';


let draw: Draw;

let context: CanvasRenderingContext2D;
let lineCache = new LineCache();
let centers: Point[] = [];
let line = new Line();
const lineColor = Color.black().rgba();

let obstacles = { "terrain": [] };

function startDrawingMap(e: MouseEvent) {
    draw.updatePosition(e);
    draw.state = DrawState.DRAWING;
}

function stopDrawingMap(e: MouseEvent) {
    draw.state = DrawState.STOPPED;
    // close the obstacle by connecting the last to the first points. This is done automatically
    // during Tanks' map drawing.
    Draw.line(context, line.points[line.points.length - 1], line.points[0], 3, lineColor);
    // cache the current obstacle
    lineCache.lines.push(line.copy());
    // reset the current points so that new obstacles can start separated
    line.points = [];
    // clear the last mouse position
    draw.last = new Point();
}

function drawMap(e: MouseEvent) {
    if (draw.state == DrawState.DRAWING) {
        draw.updatePosition(e);
        draw.mouseLine(context, 3, lineColor);
        line.points.push(draw.mouse.copy());
    }
}

function setCenter(e: MouseEvent) {
    draw.updatePosition(e);
    e.preventDefault();
    Draw.circle(context, draw.mouse, 1, 1, Color.red().rgba());
    // if there is equal amount of obstacles, then set the center for the last one
    if (centers.length == lineCache.lines.length) {
        centers[centers.length - 1] = draw.mouse.copy();
    } else {
        centers.push(draw.mouse.copy());
    }

    obstacles = { "terrain": [] };
    for (let i = 0; i < lineCache.lines.length; ++i) {
        const obstacle = {};
        obstacle["centerX"] = centers[i].x;
        obstacle["centerY"] = centers[i].y;
        obstacle["points"] = lineCache.lines[i].points;
        obstacles.terrain.push(obstacle);
    }
    console.log(obstacles);
    console.log(JSON.stringify(obstacles));
    console.log('Object `obstacles` globally accessible.');
    window["obstacles"] = obstacles;
}

function mouseForward(e: MouseEvent, action_LMB: Function, action_MMB?: Function, action_RMB?: Function) {
    switch (e.button) {
        case 0: // LMB
            if (action_LMB)
                action_LMB(e);
            break;
        case 1: // MMB
            if (action_MMB)
                action_MMB(e);
            break;
        case 2: // RMB
            if (action_RMB)
                action_RMB(e);
        default:
            throw new Error("Button does nothing");
    }
}

function init() {
    draw = new Draw();
    draw.state = DrawState.STOPPED;

    const canvasWidth = 2048;
    const canvasHeight = 1024;

    const canvas = <HTMLCanvasElement>document.getElementById(Settings.ID_GAME_CANVAS);
    canvas.style.border = "1px solid";
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context = canvas.getContext("2d");

    canvas.onmousedown = (e: MouseEvent) => mouseForward(e, startDrawingMap, setCenter);
    canvas.onmouseup = (e: MouseEvent) => mouseForward(e, stopDrawingMap);
    canvas.onmousemove = (e: MouseEvent) => mouseForward(e, drawMap);
}

init();