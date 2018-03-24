import { Point } from "../utility/point";
import { Color } from "../drawing/color";
import { ITheme } from "../themes/iTheme";
import { Draw } from "../drawing/draw";
import { IObstacleData } from "./dataInterfaces";
import { IEffect } from "../objects/effects/iEffect";
import { SlowEffect } from "../objects/effects/slow";
import { Tank } from "../objects/tank";

export enum ObstacleType {
    SOLID, // cannot move through
    WATER, // will slow the tank down to half speed for 1 movement
    WOOD // will reduce the length of the shot
}
export class Obstacle {
    points: Point[];
    center: Point;
    type: ObstacleType;

    constructor(obstacleDescription: IObstacleData) {
        this.type = this.typeFromString(obstacleDescription.type)
        this.center = new Point(obstacleDescription.centerX, obstacleDescription.centerY);
        this.points = []

        const obstacleData = obstacleDescription.points;
        const length = obstacleData.length;
        for (const obstacle of obstacleData) {
            this.points.push(new Point(obstacle.x, obstacle.y));
        }
    }

    draw(context: CanvasRenderingContext2D, theme: ITheme): void {
        const length = this.points.length;
        const [fill, fillStyle] = this.getFill(theme);
        Draw.closedShape(context, this.points, 1, theme.map.solid().rgba(), fill, fillStyle);
    }
    private getFill(theme: ITheme): [boolean, string] {
        switch (this.type) {
            case ObstacleType.SOLID:
                return [false, null];
            case ObstacleType.WATER:
                return [true, theme.map.water().rgba()];
            case ObstacleType.WOOD:
                return [true, Color.woodbrown().rgba()];
            default:
                throw new Error("Obstacle type not supported. Error type: " + this.type);

        }
    }

    private typeFromString(obstacleType: string): ObstacleType {
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
    affect(tank: Tank) {
        tank.effects.push(this.effectFromType());
    }
}