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

    constructor(id: number, type: string, center: Point, points: Point[]) {
        this.id = id;
        this.type = Obstacle.typeFromString(type)
        this.center = center.copy();
        this.points = points;

    }
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
        Draw.closedShape(context, this.points, 1, theme.map.solid().rgba(), fill, fillStyle);
        if (Settings.DEBUG) {
            context.fillStyle = theme.map.solid().rgba(0.5);
            context.font = "16px Calibri";
            context.fillText(this.id + "", this.center.x, this.center.y);
        }
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