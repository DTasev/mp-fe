import { Point } from "../utility/point";
import { Color } from "../drawing/color";
import { ITheme } from "../gameThemes/iTheme";
import { Draw } from "../drawing/draw";
import { IObstacleData } from "./dataInterfaces";

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

        const obstacleData = obstacleDescription.points;
        const length = obstacleData.length;
        // traverse two at a time
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