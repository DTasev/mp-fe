import { Draw } from "../drawing/draw";
import { Point } from "../utility/point";
import { Player } from "./player";
import { TankHealthState, TankTurnState, TankColor } from "./tank";
import { GameState } from "../controller";

export interface IGameObject {
    id: number;
    position: Point;
    player: Player;
    healthState: TankHealthState;
    actionState: TankTurnState;
    color: TankColor;
    /**
     * How to draw the game object on the canvas. 
     * Used in the redraw loop to draw every object 
     */
    draw(context: CanvasRenderingContext2D): void;

    /** How to highlight the game object on the canvas, when selected */
    highlight(context: CanvasRenderingContext2D, draw: Draw): void;

    /** Check if the game object can still act this turn
     * @returns true if the object can act, false if the object cannot act this turn
     */
    active(): boolean;
    nextState(): GameState;
}