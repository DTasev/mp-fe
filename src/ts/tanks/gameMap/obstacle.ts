import { Color } from "../drawing/color";
import { Draw } from "../drawing/draw";
import { IEffect } from "../objects/effects/iEffect";
import { SlowEffect } from "../objects/effects/slow";
import { Tank } from "../objects/tank";
import { ITheme } from "../themes/iTheme";
import { Point } from "../utility/point";
import { IObstacleData } from "./dataInterfaces";

import { Settings } from '../settings';

export enum ObstacleType {
    SOLID = "solid", // cannot move through
    WATER = "water", // will slow the tank down to half speed for 1 movement
    WOOD = "wood" // will reduce the length of the shot
}

export class Obstacle {
    id: number;
    points: Point[];
    center: Point;
    type: ObstacleType;

    private scaledPoints: Point[][] = null;

    constructor(id: number, type: string, center: Point, points: Point[]) {
        this.id = id;
        this.type = Obstacle.typeFromString(type)
        this.center = center.copy();
        this.points = points;

    }

    /**
     * Create a new Obstacle object from JSON data. This is used to create a new obstacle
     * from remotely downloaded map data.
     * @param obstacleDescription Data for the obstacle
     */
    static fromData(obstacleDescription: IObstacleData): Obstacle {
        return new Obstacle(obstacleDescription.id,
            obstacleDescription.type,
            new Point(obstacleDescription.center.x, obstacleDescription.center.y),
            <Point[]>obstacleDescription.points
        )
    }

    draw(context: CanvasRenderingContext2D, theme: ITheme): void {
        const length = this.points.length;
        const [fill, fillStyle] = this.getFill(theme);

        if (!this.scaledPoints) {
            this.scaledPoints = [];
            for (let scale = 0.9; scale > 0.1; scale -= 0.05) {
                const newPoints: Point[] = [];
                for (const point of this.points) {
                    const np = new Point();
                    np.x = ((point.x - this.center.x) * scale) + this.center.x;
                    np.y = ((point.y - this.center.y) * scale) + this.center.y;
                    newPoints.push(np);
                }
                this.scaledPoints.push(newPoints);
            }
        }

        Draw.closedShapes(context, [this.points].concat(this.scaledPoints), 1, fillStyle, fill);
        // Draw.closedShape(context, this.points, 1, theme.map.solid().rgba(), fill, fillStyle);

        // if (Settings.DEBUG) {
        //     context.fillStyle = Color.black().rgba();
        //     context.font = "16px Calibri";
        //     context.fillText(this.id + "", this.center.x, this.center.y);
        // }
    }

    /**
     * 
     * @param theme The theme from which the colors will be taken
     * @returns `boolean` - whether the obstacle should be filled with the color
     *          `string` - the RGBA string of the color
     */
    private getFill(theme: ITheme): [boolean, string[]] {
        switch (this.type) {
            case ObstacleType.SOLID:
                return [true, theme.map.solid()];
            case ObstacleType.WATER:
                return [true, theme.map.water()];
            case ObstacleType.WOOD:
                return [true, theme.map.wood()];
            default:
                throw new Error("Obstacle type not supported. Error type: " + this.type);

        }
    }

    static typeFromString(obstacleType: string): ObstacleType {
        switch (obstacleType.toLowerCase()) {
            case "solid":
                return ObstacleType.SOLID;
            case "water":
                return ObstacleType.WATER;
            case "wood":
                return ObstacleType.WOOD;
            default:
                throw new Error("Obstacle type not supported. Error type: " + obstacleType);
        }
    }

    /**
     * @returns Whether a tank can go inside the obstacle
     */
    traversable(): boolean {
        switch (this.type) {
            case ObstacleType.SOLID:
                return false;
            case ObstacleType.WOOD:
                return false;
            case ObstacleType.WATER:
                return true;

            default:
                throw new Error("Obstacle type not supported. Error type: " + this.type);
        }
    }

    private effectFromType(): IEffect {
        return new SlowEffect();
    }
    /**
     * Affect a tank with an effect
     * @param tank Tank to be affected
     */
    affect(tank: Tank) {
        tank.effects.push(this.effectFromType());
    }
    static premadeObstacle(type = "solid"): Obstacle {
        return new Obstacle(1, type, new Point(15, 15), [new Point(0, 0), new Point(5, 5)]);
    }
}