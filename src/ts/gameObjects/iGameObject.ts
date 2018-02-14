import { Draw } from "../drawing/draw";
import { CartesianCoords } from "../cartesianCoords";
import { Player } from "./player";
import { TankState } from "./tank";

export interface IGameObject {
    position: CartesianCoords;
    player: Player;
    state: TankState;

    draw(context: CanvasRenderingContext2D, draw: Draw);
    highlight(context: CanvasRenderingContext2D, draw: Draw);
}