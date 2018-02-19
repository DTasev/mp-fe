import { Point } from "./point";

export class Line {
    points: Point[];
    constructor() {
        this.points = [];
    }
    list() {
        console.log("Points for the shot: ", this.points.join(", "));
    }

}