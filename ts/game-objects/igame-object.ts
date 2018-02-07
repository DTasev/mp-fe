import { Draw } from "../draw";
import { CartesianCoords } from "../cartesian-coords";
import { Player } from "./player";

export interface IGameObject {
    position: CartesianCoords;
    player: Player;
    draw(context: CanvasRenderingContext2D, draw: Draw);
    highlight(context: CanvasRenderingContext2D, draw: Draw);
}