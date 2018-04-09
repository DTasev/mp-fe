import { Point } from "./point";

export class Line {
    points: Point[];

    public get length(): number {
        return this.points.length;
    }

    constructor(points: Point[] = []) {
        this.points = points;
    }
    copy(): Line {
        const newLine = new Line();
        for (const p of this.points) {
            newLine.points.push(p);
        }
        return newLine;
    }
}