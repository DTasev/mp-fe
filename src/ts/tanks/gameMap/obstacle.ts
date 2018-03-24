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
    WATER // will slow the tank down to half speed for 1 movement
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
        for (let i = 1; i < length; i++) {
            Draw.line(context, this.points[i - 1], this.points[i], 1, theme.mapObstacle(this.type).rgba());
        }
        // connect the last one to the first one
        Draw.line(context, this.points[length - 1], this.points[0], 1, theme.mapObstacle(this.type).rgba());
    }

    private typeFromString(obstacleType: string): ObstacleType {
        switch (obstacleType.toLowerCase()) {
            case "solid":
                return ObstacleType.SOLID;
            case "water":
                return ObstacleType.WATER;
            default:
                throw new Error("Obstacle type not supported. Error type: " + obstacleType);
        }
    }
    traversable(): boolean {
        switch (this.type) {
            case ObstacleType.SOLID:
                return false;
            case ObstacleType.WATER:
                return true;
            default:
                throw new Error("Obstacle type not supported. Error type: " + this.type);
        }
    }
    effectFromType(): IEffect {
        return new SlowEffect();
    }
    affect(tank: Tank) {
        tank.effects.push(this.effectFromType());
    }
}