import { CartesianCoords } from "./cartesianCoords";

export class LinePath {
    points: CartesianCoords[];
    constructor() {
        this.points = [];
    }
    list() {
        console.log("Points for the shot: ", this.points.join(", "));
    }

}