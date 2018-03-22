import { Point } from "./point";

export class Line {
    points: Point[];
    constructor() {
        this.points = [];
    }
    list() {
        console.log("Points for the shot: ", this.points.join(", "));
    }
    copy(): Line {
        const newLine = new Line();
        for (const p of this.points) {
            newLine.points.push(p);
        }
        return newLine;
    }
}