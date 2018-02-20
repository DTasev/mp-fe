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

    /** How to draw the game object on the canvas */
    draw(context: CanvasRenderingContext2D, draw: Draw): void;

    /** How to highlight the game object on the canvas, when selected */
    highlight(context: CanvasRenderingContext2D, draw: Draw): void;

    /** Check if the game object can still act this turn
     * @returns true if the object can act, false if the object cannot act this turn
     */
    active(): boolean;
}