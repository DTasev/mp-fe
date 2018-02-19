import { Draw } from "../drawing/draw";
import { Point } from "../utility/point";
import { Player } from "./player";
import { TankHealthState } from "./tank";

export interface IGameObject {
    id: number;
    position: Point;
    player: Player;
    health_state: TankHealthState;

    draw(context: CanvasRenderingContext2D, draw: Draw);
    highlight(context: CanvasRenderingContext2D, draw: Draw);
}