import { Draw } from "../drawing/draw";
import { CartesianCoords } from "../cartesianCoords";
import { Player } from "./player";

export interface IGameObject {
    position: CartesianCoords;
    player: Player;
    draw(context: CanvasRenderingContext2D, draw: Draw);
    highlight(context: CanvasRenderingContext2D, draw: Draw);
}