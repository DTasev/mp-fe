import { Color } from '../tanks/drawing/color';
import { Draw, DrawState } from "../tanks/drawing/draw";
import { Line } from '../tanks/utility/line';
import { LineCache } from '../tanks/utility/lineCache';
import { Point } from '../tanks/utility/point';
import { Settings } from '../tanks/settings';
import { Ui } from '../tanks/ui/ui';
import { Obstacle, ObstacleType } from '../tanks/gameMap/obstacle';
import { MCObstacleTypes, MCPublicObstacleTypes } from "./ui/mcObstacleTypes";
import { MCTools, MCPublicTools, ToolTypes } from "./ui/mcTools";
import { MCOptions } from "./ui/mcOptions";
// Expose public function for controls
window["MCPublicObstacleTypes"] = MCPublicObstacleTypes;
window["MCPublicTools"] = MCPublicTools;

const obstacleLineWidth = 1;
const lineColor = Color.black().rgba();

let draw: Draw;

let context: CanvasRenderingContext2D;
let currentLine = new Line();
let rectangleStart: Point;

let obstacles: Obstacle[] = [];
function startDrawingMap(e: MouseEvent) {
    draw.updatePosition(e);
    draw.state = DrawState.DRAWING;
    console.log("Using tool");

    rectangleStart = draw.mouse.copy();
}

function stopDrawingMap(e: MouseEvent) {
    draw.state = DrawState.STOPPED;
    const tool = document.getElementById(MCTools.ID_SELECTED_TOOL);
    switch (tool.dataset.tool) {
        case ToolTypes.LINE:
            // close the obstacle by connecting the last to the first points. This is done automatically
            // during Tanks' map drawing.
            Draw.line(context, currentLine.points[currentLine.points.length - 1], currentLine.points[0], obstacleLineWidth, lineColor);
            break;
        case ToolTypes.RECT:
            // pretend the user drew a perfect rectangle, and add the 4 end points. This allows to re-use the rest of the logic
            currentLine.points.push(rectangleStart.copy(),
                new Point(rectangleStart.x, draw.mouse.y),
                new Point(draw.mouse.x, draw.mouse.y),
                new Point(draw.mouse.x, rectangleStart.y),
            );
            break;

        default:
            throw new Error("Internal error, unknown tool selected: " + tool.dataset.tool);
    }

    const length = currentLine.points.length;
    const centerOfMass = currentLine.points.reduce((a: Point, c: Point) => { a.x += c.x; a.y += c.y; return a; }, new Point(0, 0));
    centerOfMass.x = centerOfMass.x / length;
    centerOfMass.y = centerOfMass.y / length;

    Draw.circle(context, centerOfMass, 1, 2, Color.pink().rgba());
    console.log("Center X:", centerOfMass.x, "Center Y:", centerOfMass.y);
    // cache the current obstacle
    const type = document.getElementById(MCObstacleTypes.ID_SELECTED_OBSTACLE_TYPE).dataset.type;
    const newObstacle = new Obstacle(obstacles.length, type, centerOfMass, currentLine.copy().points);
    obstacles.push(newObstacle);
    context.font = "16px Calibri";
    context.fillText(newObstacle.id + " " + type, centerOfMass.x, centerOfMass.y + 20);

    // reset the current points so that new obstacles can start separated
    currentLine.points = [];
    // clear the last mouse position
    draw.last = new Point();

    printObstacleData();
}
export function redrawCanvas() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (const obstacle of obstacles) {
        const len = obstacle.points.length;
        for (let i = 0; i < len - 1; i++) {
            Draw.line(context, obstacle.points[i], obstacle.points[i + 1], obstacleLineWidth, Color.black().rgba())
        }

        // add the implicit last line
        Draw.line(context, obstacle.points[len - 1], obstacle.points[0], obstacleLineWidth, lineColor);

        Draw.circle(context, obstacle.center, 1, 2, Color.pink().rgba());
        context.font = "16px Calibri";
        context.fillText(obstacle.id + " " + obstacle.type, obstacle.center.x, obstacle.center.y + 20);
    }
}

function drawObstacle(e: MouseEvent) {
    if (draw.state == DrawState.DRAWING) {
        draw.updatePosition(e);
        const tool = document.getElementById(MCTools.ID_SELECTED_TOOL);
        switch (tool.dataset.tool) {
            case ToolTypes.LINE:
                draw.mouseLine(context, obstacleLineWidth, lineColor);
                currentLine.points.push(draw.mouse.copy());
                break;
            case ToolTypes.RECT:
                redrawCanvas();
                Draw.rect(context, rectangleStart, draw.mouse, lineColor);
                break;
            default:
                throw new Error("Internal error, unknown tool selected: " + tool.dataset.tool);

        }
    }
}

export function setCenter(e: MouseEvent, id: number) {
    draw.updatePosition(e);
    e.preventDefault();
    Draw.circle(context, draw.mouse, 1, 1, Color.red().rgba());
    // if there is equal amount of obstacles, then set the center for the last one
    obstacles[id].center = draw.mouse.copy();

    printObstacleData();
    const canvas = <HTMLCanvasElement>document.getElementById(Settings.ID_GAME_CANVAS);
    canvas.onmousedown = (e: MouseEvent) => mouseForward(e, startDrawingMap);
}

function printObstacleData() {
    console.log(obstacles);
    console.log(JSON.stringify(obstacles));
    console.log('Object `obstacles` globally accessible.');
    window["obstacles"] = obstacles;
}

export function mouseForward(e: MouseEvent, action_LMB: Function, action_MMB?: Function, action_RMB?: Function) {
    switch (e.button) {
        case 0: // LMB
            if (action_LMB) {
                action_LMB(e);
            }
            break;
        case 1: // MMB
            if (action_MMB) {
                action_MMB(e);
            }
            break;
        case 2: // RMB
            if (action_RMB) {
                action_RMB(e);
            }
            break;
        default:
            throw new Error("Button does nothing");
    }
}

function init() {
    draw = new Draw();

    const canvasWidth = 2048;
    const canvasHeight = 1024;

    const canvas = <HTMLCanvasElement>document.getElementById(Settings.ID_GAME_CANVAS);
    canvas.style.border = "1px solid";
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context = canvas.getContext("2d");
    console.log("Canvas globally accessible as `canvas`.");
    window["canvas"] = canvas;

    const viewportWidth = Settings.IS_MOBILE ? window.innerWidth : window.innerWidth - Settings.SCROLLBAR_WIDTH;
    const viewportHeight = Settings.IS_MOBILE ? window.innerHeight : window.innerHeight - Settings.SCROLLBAR_WIDTH;

    const ui = new Ui(Ui.ID_GAME_UI, viewportWidth, viewportHeight);

    ui.startFollowingViewport();

    const obstacleTypes = new MCObstacleTypes(obstacles, ui);
    const tools = new MCTools(ui);
    const options = new MCOptions(obstacles, ui);
    canvas.onmousedown = (e: MouseEvent) => mouseForward(e, startDrawingMap);
    canvas.onmouseup = (e: MouseEvent) => mouseForward(e, stopDrawingMap);
    canvas.onmousemove = (e: MouseEvent) => mouseForward(e, drawObstacle);
}

init();