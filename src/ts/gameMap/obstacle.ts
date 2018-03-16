// Imports module-only classes
/// <reference path="dataInterfaces.ts" />

import { Point } from "../utility/point";
import { Color } from "../drawing/color";
import { ITheme } from "../gameThemes/iTheme";
import { Draw } from "../drawing/draw";

export enum ObstacleType {
    SOLID,
    WATER
}
export class Obstacle {
    points: Point[];
    center: Point;
    type: ObstacleType;

    constructor(obstacleDescription: IObstacleData) {
        this.type = this.typeFromString(obstacleDescription.type)
        this.center = new Point(obstacleDescription.centerX, obstacleDescription.centerY);
        this.points = []

        const obstacleData = obstacleDescription.data;
        const length = obstacleData.length;
        // traverse two at a time
        for (let i = 0; i < length - 1; i += 2) {
            this.points.push(new Point(obstacleData[i], obstacleData[i + 1]));
        }
    }

    draw(context: CanvasRenderingContext2D, theme: ITheme): void {
        const length = this.points.length;
        for (let i = 1; i < length; i++) {
            Draw.line(context, this.points[i - 1], this.points[i], 1, theme.mapObstacle(this.type).toRGBA());
        }
    }

    typeFromString(obstacleType: string): ObstacleType {
        switch (obstacleType.toLowerCase()) {
            case "solid":
                return ObstacleType.SOLID;
            case "water":
                return ObstacleType.WATER;
            default:
                throw new Error("Obstacle type not supported. Error type: " + obstacleType);
        }
    }
}