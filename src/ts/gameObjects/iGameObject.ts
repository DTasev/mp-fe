import { Draw } from "../drawing/draw";
import { Point } from "../utility/point";
import { Player } from "./player";
import { TankHealthState, TankActState } from "./tank";

export interface IGameObject {
    id: number;
    position: Point;
    player: Player;
    healthState: TankHealthState;
    actionState: TankActState;

    draw(context: CanvasRenderingContext2D, draw: Draw);
    highlight(context: CanvasRenderingContext2D, draw: Draw);
}