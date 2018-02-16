import { Draw } from "../drawing/draw";
import { CartesianCoords } from "../cartesianCoords";
import { Player } from "./player";
import { TankHealthState } from "./tank";

export interface IGameObject {
    id: number;
    position: CartesianCoords;
    player: Player;
    health_state: TankHealthState;

    draw(context: CanvasRenderingContext2D, draw: Draw);
    highlight(context: CanvasRenderingContext2D, draw: Draw);
}