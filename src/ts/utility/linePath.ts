import { Point } from "./point";

export class LinePath {
    points: Point[];
    constructor() {
        this.points = [];
    }
    list() {
        console.log("Points for the shot: ", this.points.join(", "));
    }

}